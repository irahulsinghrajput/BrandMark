import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, ChevronRight, Calendar, User, Tag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

const BlogDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('date_published', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const categories = ['All', ...new Set(blogs.map(blog => blog.category).filter(Boolean))];

  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesSearch = 
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        blog.content?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, blogs]);

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <Helmet>
        <title>Digital Marketing Blog & Insights | BrandMark Solutions</title>
        <meta name="description" content="Read our latest insights, case studies, and strategies on digital marketing, SEO, and web development for businesses in North India." />
      </Helmet>

      <section className="bg-brand-navy text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Our Latest <span className="text-brand-orange">Insights</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Actionable strategies and case studies to help you dominate your local market.
          </p>

          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              placeholder="Search articles, topics, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category 
                  ? 'bg-brand-orange text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {isLoading ? (
            <div className="w-full text-center py-20 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-orange mx-auto mb-4"></div>
              Loading insights...
            </div>
          ) : filteredBlogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map(blog => (
              <Link 
                to={`/blog/${blog.slug}`} 
                key={blog.id || blog.slug}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                <div className="aspect-video bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-200">BrandMark</span>
                  <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/10 transition-colors duration-300" />
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  {blog.category && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-orange/10 text-brand-orange">
                        <Tag className="w-3 h-3 mr-1" />
                        {blog.category}
                      </span>
                    </div>
                  )}
                  
                  <h2 className="text-xl font-bold text-brand-navy mb-3 line-clamp-2 group-hover:text-brand-orange transition-colors">
                    {blog.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3 text-sm">
                    {blog.content ? blog.content.replace(/#+/g, '').substring(0, 150) + '...' : ''}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-2" />
                      {blog.author || 'BrandMark Team'}
                    </div>
                    <ChevronRight className="w-5 h-5 text-brand-orange transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No articles found matching your criteria.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="mt-4 text-brand-orange hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogDirectory;
