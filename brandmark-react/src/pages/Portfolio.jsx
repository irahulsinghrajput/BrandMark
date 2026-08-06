import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageTransition } from '../components/PageTransition';

gsap.registerPlugin(ScrollTrigger);

export const Portfolio = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo('.portfolio-header', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );

    const items = gsap.utils.toArray('.portfolio-item');
    items.forEach((item, i) => {
      gsap.fromTo(item, 
        { y: 100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          }
        }
      );
    });
  }, []);

  const projects = [
    { 
      title: 'Hotel Republic', 
      category: 'Digital Presence & Branding', 
      image: '/images/hotel-republic.jpg',
      description: 'Comprehensive digital presence management including Social Media, Digital Marketing, Profile Branding, BrandKit, Photography, and Videography. Delivered a 600% ROI.'
    },
    { title: 'Global Tech Rebrand', category: 'Brand Identity', image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800' },
    { title: 'Fintech App Launch', category: 'Digital Marketing', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
    { title: 'E-commerce Redesign', category: 'Web Development', image: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&q=80&w=800' },
    { title: 'B2B SaaS Growth', category: 'Content Strategy', image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <PageTransition>
      <div className="pt-32 pb-20 bg-brand-bg-light min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 portfolio-header">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-brand-navy">
              Selected <span className="text-brand-orange">Works</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-brand-text-muted font-light">
              A collection of our best projects driving growth for SMEs worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.map((p, i) => (
              <div key={i} className="portfolio-item group relative overflow-hidden rounded-3xl aspect-[4/3] cursor-pointer shadow-md hover:shadow-2xl transition-shadow duration-500">
                <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-brand-navy/0 transition-colors duration-500 z-10" />
                <img 
                  src={p.image} 
                  alt={p.title} 
                  loading="lazy"
                  className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end bg-gradient-to-t from-brand-navy/90 via-brand-navy/40 to-transparent translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-brand-orange font-medium uppercase tracking-wider text-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {p.category}
                  </span>
                  <h3 className="text-3xl font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    {p.title}
                  </h3>
                  {p.description && (
                    <p className="text-white/80 text-sm mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300 line-clamp-3">
                      {p.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
