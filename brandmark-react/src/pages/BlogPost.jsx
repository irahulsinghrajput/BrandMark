import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, Calendar, User, Tag, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { SEO } from '../components/SEO';
import { PageTransition } from '../components/PageTransition';
import localBlogs from '../data/blogs.json';

export const BlogPost = () => {
  const { slug } = useParams();
  
  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const localMatch = localBlogs.find(b => b.slug === slug || b.id === slug);
      if (localMatch) return localMatch;

      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .single();
        
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase fetch failed', err);
        return null;
      }
    }
  });

  const { data: relatedPostsData = [] } = useQuery({
    queryKey: ['relatedPosts', blog?.category],
    queryFn: async () => {
      if (!blog?.category) return [];
      
      let dbRelated = [];
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('category', blog.category)
          .neq('slug', blog.slug)
          .eq('status', 'published')
          .limit(3);
        
        if (!error && data) dbRelated = data;
      } catch (err) {
        console.warn('Supabase related fetch failed', err);
      }

      const localRelated = localBlogs.filter(b => b.category === blog.category && b.slug !== blog.slug);
      
      const merged = [...dbRelated];
      for (const local of localRelated) {
        if (!merged.some(b => b.slug === local.slug)) {
          merged.push(local);
        }
      }
      return merged.slice(0, 3);
    },
    enabled: !!blog?.category
  });

  const readingTime = useMemo(() => {
    if (!blog?.content) return 1;
    const words = blog.content.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  }, [blog?.content]);

  const relatedPosts = useMemo(() => relatedPostsData, [relatedPostsData]);

  // Strip frontmatter from content if it's there
  const markdownContent = useMemo(() => {
    if (!blog?.content) return '';
    return blog.content.replace(/^---[\s\S]*?---/, '').trim();
  }, [blog?.content]);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-orange"></div>
        </div>
      </PageTransition>
    );
  }

  if (!blog) {
    return <Navigate to="/blog" replace />;
  }

  // Generate Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": blog.schema_type || "Article",
    "headline": blog.title,
    "image": [
      `https://www.brandmarksolutions.site/content/images/${blog.slug || blog.id}.avif`
    ],
    "datePublished": blog.date_published || blog.date || new Date().toISOString(),
    "dateModified": blog.date_modified || blog.date_published || blog.date || new Date().toISOString(),
    "author": [{
      "@type": "Person",
      "name": blog.author || "BrandMark Team",
      "url": "https://www.brandmarksolutions.site/about"
    }]
  };

  return (
    <PageTransition>
      <div className="bg-white min-h-screen pt-24 pb-20">
        <SEO 
          title={`${blog.title} | BrandMark Solutions`} 
          description={blog.description || blog.excerpt || `Read ${blog.title} by ${blog.author || 'BrandMark Team'}`}
          type="article"
        />
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(articleSchema)}
          </script>
        </Helmet>

        <article className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <header className="mb-10 text-center">
            <Link to="/blog" className="inline-flex items-center text-brand-orange hover:underline mb-8 font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Link>
            
            {blog.category && (
              <div className="mb-4">
                <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-brand-orange/10 text-brand-orange">
                  {blog.category}
                </span>
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-navy mb-6 tracking-tight leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <Link to={`/authors/${(blog.author || 'team').toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center hover:text-brand-orange transition-colors">
                <User className="w-4 h-4 mr-2 text-brand-orange" />
                <span className="font-medium text-gray-700">{blog.author || 'BrandMark Team'}</span>
              </Link>
              {(blog.date_published || blog.date) && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-brand-orange" />
                  {new Date(blog.date_published || blog.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              )}
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-brand-orange" />
                {readingTime} min read
              </div>
            </div>
          </header>

          {/* Markdown Content */}
          <div className="prose prose-lg prose-orange max-w-none prose-headings:text-brand-navy prose-a:text-brand-orange hover:prose-a:text-orange-700 prose-img:rounded-2xl prose-img:shadow-lg">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-10 mb-6 text-brand-navy border-b pb-2" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-4 text-brand-navy" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-6 mb-3 text-brand-navy" {...props} />,
                a: ({node, ...props}) => {
                  const isInternal = props.href?.startsWith('/');
                  return isInternal ? (
                    <Link to={props.href} className="text-brand-orange no-underline hover:underline font-semibold" {...props} />
                  ) : (
                    <a target="_blank" rel="noopener noreferrer" className="text-brand-orange no-underline hover:underline font-semibold" {...props} />
                  );
                },
                img: ({node, ...props}) => (
                  <div className="my-8">
                    <picture>
                      <source srcSet={props.src.replace(/\.(png|jpeg|jpg)$/i, '.avif')} type="image/avif" />
                      <source srcSet={props.src.replace(/\.(png|jpeg|jpg)$/i, '.webp')} type="image/webp" />
                      <img className="w-full rounded-2xl shadow-lg border border-gray-100 object-cover max-h-[500px]" loading="lazy" {...props} />
                    </picture>
                    {props.alt && <p className="text-center text-sm text-gray-500 mt-2">{props.alt}</p>}
                  </div>
                ),
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-brand-orange bg-orange-50/50 pl-6 py-4 pr-4 rounded-r-lg text-gray-700 italic my-8 shadow-sm" {...props} />
                )
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-brand-navy rounded-3xl p-10 text-center shadow-xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-brand-orange opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">Ready to Accelerate Your Growth?</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto relative z-10">Implement the strategies from this article with the help of our expert team at BrandMark Solutions.</p>
            <Link 
              to="/contact" 
              className="inline-block bg-brand-orange text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-all transform hover:-translate-y-1 shadow-lg shadow-brand-orange/30 relative z-10"
            >
              Get Your Free Strategy Audit
            </Link>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-20 pt-10 border-t border-gray-100">
              <h3 className="text-2xl font-bold text-brand-navy mb-8">Related Articles</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((post, idx) => (
                  <Link 
                    key={idx} 
                    to={`/blog/${post.slug || post.id}`}
                    className="group block"
                  >
                    <div className="aspect-video bg-gray-100 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center">
                      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-200">BrandMark</span>
                      <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/10 transition-colors" />
                    </div>
                    <h4 className="font-bold text-brand-navy group-hover:text-brand-orange transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </PageTransition>
  );
};

export default BlogPost;
