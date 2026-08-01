import React from 'react';
import { PageTransition } from '../components/PageTransition';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';

export const Industries = () => {
  return (
    <PageTransition>
      <SEO 
        title="Industries We Serve | BrandMark Solutions"
        description="BrandMark Solutions provides specialized digital marketing, web design, and branding services for Real Estate, Hotels, Restaurants, B2B, and SaaS businesses."
        canonicalUrl="https://www.brandmarksolutions.site/industries"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.brandmarksolutions.site/" },
              { "@type": "ListItem", "position": 2, "name": "Industries", "item": "https://www.brandmarksolutions.site/industries" }
            ]
          }
        ]}
      />
      <div className="pt-32 pb-20 bg-brand-bg-light min-h-screen">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-brand-navy">
            Industries We <span className="text-brand-orange">Serve</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-brand-text-muted font-light mb-16">
            We build tailored digital growth engines for specific verticals.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Real Estate', 'Hotels & Hospitality', 'Restaurants & Cafes', 'SaaS & Tech', 'Healthcare', 'E-Commerce'].map((industry, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-brand-border-light hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-brand-navy mb-4">{industry}</h3>
                <p className="text-brand-text-muted font-light mb-6">Customized marketing and web development strategies designed specifically for {industry.toLowerCase()} businesses.</p>
                <Link to="/contact" className="text-brand-orange font-bold uppercase tracking-wider text-sm hover:text-brand-navy transition-colors">
                  Discuss Strategy &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
