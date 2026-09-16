import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageTransition } from '../components/PageTransition';
import { SEO } from '../components/SEO';

gsap.registerPlugin(ScrollTrigger);

export const Portfolio = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    gsap.fromTo('.portfolio-header', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );

    const items = gsap.utils.toArray('.portfolio-item');
    items.forEach((item) => {
      gsap.fromTo(item, 
        { y: 60, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.7, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
          }
        }
      );
    });
  }, [selectedFilter]);

  const filters = ['All', 'Web Development', 'Digital Marketing', 'Brand Identity', 'Content Strategy'];

  const projects = [
    { 
      title: 'Govinda International School', 
      category: 'Web Development & Institutional Branding', 
      filterCategory: 'Web Development',
      image: '/images/gis-patna.jpg',
      logo: '/images/govinda-school-logo.jpeg',
      link: 'https://www.gispatna.in/',
      location: 'Patna, Bihar',
      badge: 'Live Website',
      description: 'Complete institutional web development, dynamic admissions portal integration, real-time student notice board, and digital presence strategy for Patna’s premier CBSE international school.'
    },
    { 
      title: 'Hotel Republic', 
      category: 'Digital Presence & Luxury Branding', 
      filterCategory: 'Brand Identity',
      image: '/images/hotel-republic.jpg',
      link: 'https://www.republichotel.in/',
      location: 'Patna, Bihar',
      badge: '600% ROI Delivered',
      description: 'Comprehensive digital presence management including Social Media, Digital Marketing, Profile Branding, BrandKit, Photography, and Videography. Delivered a 600% ROI.'
    },
    { 
      title: 'Global Tech Rebrand', 
      category: 'Brand Identity', 
      filterCategory: 'Brand Identity',
      image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800',
      badge: 'Enterprise Identity',
      description: 'Modernized visual identity, multi-platform design systems, and cohesive brand guidelines for an international enterprise technology partner.'
    },
    { 
      title: 'Fintech App Launch', 
      category: 'Digital Marketing', 
      filterCategory: 'Digital Marketing',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      badge: '150k+ Downloads',
      description: 'Targeted multi-channel acquisition campaigns, high-converting funnel optimization, and automated lifecycle marketing driving 150k+ app downloads.'
    },
    { 
      title: 'E-commerce Redesign', 
      category: 'Web Development', 
      filterCategory: 'Web Development',
      image: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&q=80&w=800',
      badge: '+42% Conversion Lift',
      description: 'Next-gen headless storefront architecture with frictionless checkout, dynamic search indexing, and a 42% lift in checkout conversion rates.'
    },
    { 
      title: 'B2B SaaS Growth', 
      category: 'Content Strategy', 
      filterCategory: 'Content Strategy',
      image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800',
      badge: 'Pipeline Acceleration',
      description: 'High-intent inbound content engine, programmatic SEO architecture, and pipeline acceleration for hyper-growth enterprise software.'
    },
  ];

  const filteredProjects = selectedFilter === 'All' 
    ? projects 
    : projects.filter(p => p.filterCategory === selectedFilter || p.category.includes(selectedFilter));

  return (
    <PageTransition>
      <SEO 
        title="Our Portfolio & Selected Works | BrandMark Solutions"
        description="Explore our selected client work, web design, branding, and digital marketing projects delivering measurable growth for businesses and institutions in Patna and worldwide."
        canonicalUrl="https://www.brandmarksolutions.site/portfolio"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.brandmarksolutions.site/" },
              { "@type": "ListItem", "position": 2, "name": "Portfolio", "item": "https://www.brandmarksolutions.site/portfolio" }
            ]
          }
        ]}
      />
      <div className="pt-32 pb-24 bg-brand-bg-light min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-12 portfolio-header">
            <span className="px-4 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-xs md:text-sm font-bold tracking-wider uppercase inline-block mb-4">
              Proven Track Record
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-brand-navy">
              Selected <span className="text-brand-orange">Works</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-brand-text-muted font-light">
              A curated showcase of our best web development, institutional branding, and digital growth projects.
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-10">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${
                    selectedFilter === filter
                      ? 'bg-brand-navy text-white shadow-md shadow-brand-navy/20 scale-105'
                      : 'bg-white text-brand-text-muted hover:text-brand-navy hover:bg-brand-border-light/40 border border-brand-border-light'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {filteredProjects.map((p, i) => {
              const CardElement = p.link ? 'a' : 'div';
              const cardProps = p.link ? {
                href: p.link,
                target: '_blank',
                rel: 'noopener noreferrer'
              } : {};

              return (
                <CardElement 
                  key={p.title + i} 
                  {...cardProps}
                  className="portfolio-item group relative overflow-hidden rounded-3xl aspect-[4/3] cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 block border border-brand-border-light/50 bg-brand-navy/5"
                >
                  {/* Subtle Dark Ambient Tint */}
                  <div className="absolute inset-0 bg-brand-navy/15 group-hover:bg-brand-navy/5 transition-colors duration-500 z-10" />

                  {/* Main Background Image */}
                  <img 
                    src={p.image} 
                    alt={p.title} 
                    loading="lazy"
                    className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  />
                  
                  {/* Top Bar Badges */}
                  <div className="absolute top-5 left-5 right-5 z-20 flex items-center justify-between pointer-events-none">
                    {p.logo ? (
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/95 p-1.5 shadow-xl backdrop-blur-md flex items-center justify-center border border-white/60 group-hover:scale-105 transition-transform duration-300">
                        <img 
                          src={p.logo} 
                          alt={`${p.title} emblem`} 
                          className="w-full h-full object-contain rounded-xl"
                        />
                      </div>
                    ) : (
                      <div />
                    )}

                    {p.badge && (
                      <div className="px-3.5 py-1.5 rounded-full bg-brand-navy/85 backdrop-blur-md text-white text-xs font-semibold tracking-wide border border-white/20 shadow-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{p.badge}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Overlay Content */}
                  <div className="absolute inset-0 z-20 p-6 md:p-8 flex flex-col justify-end bg-gradient-to-t from-brand-navy/95 via-brand-navy/65 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-brand-orange font-bold uppercase tracking-wider text-xs md:text-sm">
                        {p.category}
                      </span>
                      {p.location && (
                        <span className="text-white/60 text-xs font-medium">
                          • {p.location}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                      <span>{p.title}</span>
                      {p.link && (
                        <svg className="w-5 h-5 text-brand-orange opacity-80 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </h3>

                    {p.description && (
                      <p className="text-white/85 text-xs md:text-sm mt-2.5 opacity-90 group-hover:opacity-100 transition-opacity duration-500 line-clamp-3 leading-relaxed">
                        {p.description}
                      </p>
                    )}

                    {p.link && (
                      <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        <span className="text-xs text-white/70 font-medium">
                          Click to explore live website
                        </span>
                        <span className="text-xs font-bold text-brand-orange flex items-center gap-1">
                          Visit {p.link.replace(/^https?:\/\//, '').replace(/\/$/, '')} →
                        </span>
                      </div>
                    )}
                  </div>
                </CardElement>
              );
            })}
          </div>

          {/* Call to Action Banner */}
          <div className="mt-20 p-8 md:p-12 rounded-3xl bg-brand-navy text-white text-center relative overflow-hidden shadow-2xl border border-brand-orange/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-brand-orange text-xs uppercase font-extrabold tracking-widest mb-2 block">
                Have a project in mind?
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
                Let's Build Something Remarkable Together
              </h2>
              <p className="text-white/75 text-sm md:text-base mb-8">
                From high-performing web platforms to full-scale digital growth engines, we help institutions and brands lead their industry.
              </p>
              <a 
                href="/?scrollTo=contact" 
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-brand-orange/30 hover:scale-105 transition-all duration-300"
              >
                <span>Start Your Project</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
