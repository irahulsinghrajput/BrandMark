import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageTransition } from '../components/PageTransition';
import { Link } from 'react-router-dom';
import blogsData from '../data/blogs.json';

gsap.registerPlugin(ScrollTrigger);

export const Blog = () => {
  useEffect(() => {
    gsap.fromTo('.blog-header', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );

    const posts = gsap.utils.toArray('.blog-post');
    posts.forEach((post, i) => {
      gsap.fromTo(post, 
        { y: 100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: post,
            start: 'top 85%',
          }
        }
      );
    });
  }, []);

  return (
    <PageTransition>
      <div className="pt-32 pb-20 bg-brand-bg-light min-h-screen font-outfit">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20 blog-header">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-brand-navy">
              Latest <span className="text-brand-orange">Insights</span>
            </h1>
            <p className="text-xl text-brand-text-muted font-light">
              Strategies, insights, and perspectives on modern growth.
            </p>
          </div>

          <div className="space-y-8">
            {blogsData.map((article, i) => (
              <Link to={`/blog/${article.id}`} key={article.id} className="blog-post group block p-8 rounded-3xl bg-white border border-brand-border-light hover:border-brand-orange transition-colors duration-500 cursor-pointer shadow-sm hover:shadow-lg">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-brand-orange text-sm font-bold uppercase tracking-wider">{article.category}</span>
                      <span className="text-brand-text-muted text-sm">{article.date}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-brand-navy group-hover:text-brand-orange transition-colors duration-300">
                      {article.title}
                    </h2>
                    <p className="text-brand-text-muted mt-2 font-light line-clamp-2 max-w-2xl">{article.excerpt}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-brand-border-light flex items-center justify-center group-hover:bg-brand-orange group-hover:border-brand-orange transition-colors duration-300 flex-shrink-0">
                    <svg className="w-5 h-5 text-brand-navy group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
