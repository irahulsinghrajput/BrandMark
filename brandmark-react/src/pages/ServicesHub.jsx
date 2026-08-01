import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageTransition } from '../components/PageTransition';
import { ServicesList } from '../components/ServicesList';
import { SEO } from '../components/SEO';

gsap.registerPlugin(ScrollTrigger);

export const ServicesHub = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    gsap.fromTo('.services-hub-title', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );
  }, []);

  return (
    <PageTransition>
      <SEO 
        title="Our Services | Website Development & SEO Agency Patna | BrandMark"
        description="From UI/UX design to Performance Marketing and Local SEO. BrandMark Solutions delivers comprehensive digital growth for businesses in Bihar and North India."
        canonicalUrl="https://www.brandmarksolutions.site/services"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Digital Marketing and Web Development",
          "provider": {
            "@type": "LocalBusiness",
            "name": "BrandMark Solutions Private Ltd.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Patna",
              "addressRegion": "Bihar",
              "addressCountry": "IN"
            }
          },
          "areaServed": [
            "Patna",
            "Bihar",
            "North India",
            "India"
          ]
        }}
      />
      <div className="pt-20">
        
        {/* Hub Hero */}
        <section ref={heroRef} className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-brand-bg-light border-b border-brand-border-light">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 text-center z-10 py-20">
            <h1 className="services-hub-title text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-brand-navy">
              Our <span className="text-brand-orange">Services</span>
            </h1>
            <p className="services-hub-title mt-4 max-w-2xl mx-auto text-xl text-brand-text-muted font-light delay-100">
              Comprehensive growth solutions tailored for local market dominance across Bihar and North India.
            </p>
          </div>
        </section>

        {/* Reusing the Services component which has the cards and GSAP logic */}
        <ServicesList />
        
      </div>
    </PageTransition>
  );
};
