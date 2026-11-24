import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageTransition } from '../components/PageTransition';
import { ServicesList } from '../components/ServicesList';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { serviceNames } from '../data/serviceContent';

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
        title="Digital Marketing, Web & Creative Services in Patna | BrandMark"
        description="Digital marketing, SEO, social media, website development, branding, photography, video and influencer services in Patna and across Bihar."
        canonicalUrl="https://www.brandmarksolutions.site/services"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Digital Marketing and Web Development",
            "provider": {
              "@type": "Organization",
              "name": "BrandMark Media Solutions Private Limited",
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
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.brandmarksolutions.site"
            }, {
              "@type": "ListItem",
              "position": 2,
              "name": "Services",
              "item": "https://www.brandmarksolutions.site/services"
            }]
          }
        ]}
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
              Digital marketing, websites, branding and creative production for businesses in Patna, across Bihar and beyond.
            </p>
          </div>
        </section>

        {/* Reusing the Services component which has the cards and GSAP logic */}
        <ServicesList />

        <section className="bg-brand-bg-light py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-brand-navy mb-8">Explore each service</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(serviceNames).map(([id, name]) => (
                <li key={id}>
                  <Link to={`/services/${id}`} className="block h-full bg-white border border-brand-border-light rounded-2xl p-5 font-semibold text-brand-navy hover:border-brand-orange hover:text-brand-orange transition-colors">{name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
        
      </div>
    </PageTransition>
  );
};
