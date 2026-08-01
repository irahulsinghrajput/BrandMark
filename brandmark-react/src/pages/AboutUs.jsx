import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageTransition } from '../components/PageTransition';
import { SEO } from '../components/SEO';

gsap.registerPlugin(ScrollTrigger);

export const AboutUs = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const sections = gsap.utils.toArray('.fade-in-section');
    
    sections.forEach(section => {
      gsap.fromTo(section, 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
          }
        }
      );
    });
  }, []);

  return (
    <PageTransition>
      <SEO 
        title="About BrandMark Solutions | Digital Agency North India"
        description="Meet the leadership team at BrandMark Solutions. We help ambitious businesses across Patna, Bihar, and North India build stronger brands and predictable growth."
        canonicalUrl="https://www.brandmarksolutions.site/about"
        schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "mainEntity": {
            "@type": "Organization",
            "name": "BrandMark Solutions Private Ltd.",
            "founder": [
              {
                "@type": "Person",
                "name": "Rahul Singh Rajput",
                "jobTitle": "Chief Operational Officer"
              },
              {
                "@type": "Person",
                "name": "Rajeshree Shekhar",
                "jobTitle": "Chief UI/UX Specialist"
              }
            ]
          }
        }}
      />
      <div ref={containerRef} className="pt-20">
        
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-brand-bg-light">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-navy rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 text-center z-10 py-20 fade-in-section">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-brand-navy">
              Brand Mark Solutions
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-brand-text-muted font-light">
              Building brands and growth systems for global markets.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-32 px-6 bg-white border-y border-brand-border-light">
          <div className="max-w-4xl mx-auto text-center fade-in-section">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 uppercase tracking-wide text-brand-navy">
              Our Mission
            </h2>
            <div className="w-16 h-1 bg-brand-orange mx-auto mb-12"></div>
            
            <p className="text-xl md:text-2xl mb-8 leading-relaxed font-light text-brand-text-body">
              At Brand Mark Solutions, we help ambitious businesses align brand, website, and marketing into one clear growth engine. Many companies struggle with fragmented execution; we solve this with integrated strategy and delivery.
            </p>
            <p className="text-xl md:text-2xl leading-relaxed font-light text-brand-text-muted">
              We partner with SMEs serving customers in the US, Europe, and Middle East to build market-ready brands, conversion-focused websites, and measurable demand generation systems. Our focus is practical execution that delivers sustainable business outcomes.
            </p>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-32 px-6 bg-brand-bg-card border-b border-brand-border-light font-outfit">
          <div className="max-w-7xl mx-auto fade-in-section">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B0F19] text-center mb-4 uppercase tracking-wide">
              Leadership & Team
            </h2>
            <div className="w-16 h-1 bg-[#F97316] mx-auto mb-20"></div>
            
            <div className="flex flex-wrap justify-center gap-10">
              {[
                { name: 'Rahul Singh Rajput', role: 'Chief Operational Officer', image: '/Rahul picture.jpeg' },
                { name: 'Rajeshree Shekhar', role: 'Chief UI/UX Specialist', image: '/Rajeshree.Jpeg' },
                { name: 'Lakshya', role: 'Director of Client Services', image: '/assets/lakshya.png' },
                { name: 'Amisha Singh', role: 'Graphic Designer Specialist', image: '/assets/amisha.jpg' },
                { name: 'Rishi Thakur', role: 'Production & Videography Specialist', image: '/assets/Rishi.jpg' }
              ].map((member, i) => (
                <div key={i} className="group flex flex-col items-center text-center w-full sm:w-[calc(50%-1.25rem)] lg:w-[calc(25%-1.875rem)] max-w-sm">
                  <div className="w-full aspect-[4/5] mb-6 overflow-hidden rounded-2xl shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                    <picture>
                      <source srcSet={member.image.replace(/\.(png|jpeg|jpg|Jpeg)$/i, '.avif')} type="image/avif" />
                      <source srcSet={member.image.replace(/\.(png|jpeg|jpg|Jpeg)$/i, '.webp')} type="image/webp" />
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/400x500/0B0F19/FFFFFF?text=' + member.name.charAt(0)} 
                      />
                    </picture>
                  </div>
                  <h3 className="text-xl font-bold text-[#0B0F19] mb-1">
                    {member.name}
                  </h3>
                  <span className="text-[#F97316] text-xs font-semibold uppercase tracking-widest">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Experience Section */}
        <section className="py-32 px-6 bg-brand-navy text-white">
          <div className="max-w-4xl mx-auto text-center fade-in-section">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-12 uppercase tracking-wide">
              Client Experience
            </h2>
            <div className="w-16 h-1 bg-brand-orange mx-auto mb-12"></div>
            
            <p className="text-2xl md:text-4xl font-light mb-12 leading-relaxed text-gray-200">
              "Our goal is simple: deliver work clients are proud to share and results they can clearly measure."
            </p>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed font-light">
              We prioritize clear communication, dependable delivery, and long-term partnerships built on trust and performance.
            </p>
            <p className="text-lg md:text-xl text-gray-500 italic font-light">
              Every project is handled with strategic thinking, creative precision, and accountability from start to finish.
            </p>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};
