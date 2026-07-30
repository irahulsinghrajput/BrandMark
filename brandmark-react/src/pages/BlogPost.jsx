import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { PageTransition } from '../components/PageTransition';
import blogsData from '../data/blogs.json';
import { ArrowLeft } from 'lucide-react';

export const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    // In a real app, this would be a fetch call to an API/Database.
    // For our static JSON db, we just find the matching ID.
    const foundBlog = blogsData.find((b) => b.id === id);
    setBlog(foundBlog);
    window.scrollTo(0, 0);
  }, [id]);

  if (!blog) {
    return (
      <PageTransition>
        <div className="pt-32 pb-20 bg-brand-bg-light min-h-screen flex items-center justify-center">
          <h1 className="text-3xl font-bold text-brand-navy">Article not found</h1>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <article className="pt-32 pb-20 bg-brand-bg-light min-h-screen font-outfit">
        <div className="max-w-3xl mx-auto px-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-brand-text-muted hover:text-brand-orange transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" />
            Back to Insights
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 py-1.5 bg-brand-orange/10 text-brand-orange rounded-full text-sm font-bold uppercase tracking-wider border border-brand-orange/20">
                {blog.category}
              </span>
              <span className="text-brand-text-muted font-medium">{blog.date}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-brand-navy leading-tight mb-6">
              {blog.title}
            </h1>
            <p className="text-xl md:text-2xl text-brand-text-muted font-light leading-relaxed border-l-4 border-brand-orange pl-6 italic">
              {blog.excerpt}
            </p>
          </header>

          <div className="prose lg:prose-xl mx-auto mt-12 text-brand-navy">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>
        </div>
      </article>
    </PageTransition>
  );
};
