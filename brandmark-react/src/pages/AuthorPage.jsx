import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Mail, BookOpen, Star, ChevronRight } from 'lucide-react';
import authors from '../data/authors.json';
import blogs from '../data/blogs.json';
import { SEO } from '../components/SEO';
import { PageTransition } from '../components/PageTransition';

// Basic SVG components for social icons
const LinkedinIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);

const TwitterIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
);

export const AuthorPage = () => {
  const { slug } = useParams();
  const author = authors.find(a => a.id === slug);

  const authorArticles = useMemo(() => {
    if (!author) return [];
    return blogs.filter(b => 
      b.author && b.author.toLowerCase().includes(author.name.toLowerCase().split(' ')[0])
    );
  }, [author]);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author?.name || 'BrandMark Team',
    "jobTitle": author?.role || 'Team Member',
    "image": author ? `https://www.brandmarksolutions.site${author.image.replace(/\.(jpeg|jpg|png)$/i, '.webp')}` : 'https://www.brandmarksolutions.site/brandmark-logo-new.png.png',
    "url": author ? `https://www.brandmarksolutions.site/authors/${author.id}` : 'https://www.brandmarksolutions.site/about',
    "sameAs": [
      author?.social?.linkedin,
      author?.social?.twitter
    ].filter(Boolean),
    "worksFor": {
      "@type": "Organization",
      "name": "BrandMark Solutions Private Ltd."
    }
  };

  if (!author) {
    return <Navigate to="/about" replace />;
  }

  return (
    <PageTransition>
      <div className="bg-brand-bg-light min-h-screen pt-24 pb-20">
        <SEO 
          title={`${author.name} - ${author.role} | BrandMark Solutions`} 
          description={author.bio.substring(0, 150) + '...'}
        />
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(personSchema)}
          </script>
        </Helmet>

        <div className="max-w-5xl mx-auto px-6">
          <Link to="/about" className="inline-flex items-center text-brand-orange hover:underline mb-10 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Team
          </Link>

          {/* Author Profile Header */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10 items-center md:items-start mb-16">
            <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0 border-4 border-brand-orange/20 shadow-lg relative">
              <picture>
                <source srcSet={author.image.replace(/\.(png|jpeg|jpg|Jpeg)$/i, '.avif')} type="image/avif" />
                <source srcSet={author.image.replace(/\.(png|jpeg|jpg|Jpeg)$/i, '.webp')} type="image/webp" />
                <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
              </picture>
            </div>
            
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-4xl font-extrabold text-brand-navy mb-2 tracking-tight">{author.name}</h1>
              <p className="text-xl text-brand-orange font-medium mb-6">{author.role}</p>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl">
                {author.bio}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                {author.social?.linkedin && (
                  <a href={author.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 text-brand-navy hover:text-brand-orange hover:bg-orange-50 rounded-full transition-colors">
                    <LinkedinIcon className="w-5 h-5" />
                  </a>
                )}
                {author.social?.twitter && (
                  <a href={author.social.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 text-brand-navy hover:text-brand-orange hover:bg-orange-50 rounded-full transition-colors">
                    <TwitterIcon className="w-5 h-5" />
                  </a>
                )}
                {author.social?.email && (
                  <a href={`mailto:${author.social.email}`} className="p-3 bg-gray-50 text-brand-navy hover:text-brand-orange hover:bg-orange-50 rounded-full transition-colors">
                    <Mail className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Grid Layout for Expertise & Articles */}
          <div className="grid md:grid-cols-3 gap-10">
            {/* Sidebar */}
            <div className="md:col-span-1 space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-brand-navy mb-6 flex items-center">
                  <Star className="w-5 h-5 text-brand-orange mr-2" />
                  Areas of Expertise
                </h3>
                <ul className="space-y-3">
                  {author.expertise.map((skill, idx) => (
                    <li key={idx} className="flex items-center text-gray-700 bg-gray-50 px-4 py-2 rounded-lg font-medium">
                      <div className="w-2 h-2 bg-brand-orange rounded-full mr-3"></div>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Articles Feed */}
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold text-brand-navy mb-8 flex items-center">
                <BookOpen className="w-8 h-8 text-brand-orange mr-3" />
                Published Articles ({authorArticles.length})
              </h3>
              
              {authorArticles.length > 0 ? (
                <div className="space-y-6">
                  {authorArticles.map((article, idx) => (
                    <Link 
                      key={idx} 
                      to={`/blog/${article.slug || article.id}`}
                      className="group flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all transform hover:-translate-y-1"
                    >
                      <div className="w-full sm:w-48 h-48 sm:h-auto bg-gray-100 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-300">BrandMark</span>
                        <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/5 transition-colors duration-300" />
                      </div>
                      <div className="p-6 flex-grow flex flex-col justify-center">
                        <div className="text-xs font-semibold text-brand-orange uppercase tracking-wider mb-2">
                          {article.category}
                        </div>
                        <h4 className="text-xl font-bold text-brand-navy group-hover:text-brand-orange transition-colors mb-3">
                          {article.title}
                        </h4>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {article.content ? article.content.replace(/#+/g, '').substring(0, 100) + '...' : ''}
                        </p>
                        <div className="text-brand-orange font-medium flex items-center text-sm mt-auto">
                          Read Article <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-3xl text-center border border-gray-100">
                  <p className="text-gray-500 text-lg">No published articles yet.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default AuthorPage;
