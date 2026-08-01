import React from 'react';
import { PageTransition } from '../components/PageTransition';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';

export const CaseStudies = () => {
  return (
    <PageTransition>
      <SEO 
        title="SEO & Digital Marketing Case Studies | BrandMark Solutions"
        description="Read our case studies to see how we've helped businesses in Patna and North India scale their organic traffic and revenue."
        canonicalUrl="https://www.brandmarksolutions.site/case-studies"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.brandmarksolutions.site/" },
              { "@type": "ListItem", "position": 2, "name": "Case Studies", "item": "https://www.brandmarksolutions.site/case-studies" }
            ]
          }
        ]}
      />
      <div className="pt-32 pb-20 bg-brand-bg-light min-h-screen">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-brand-navy">
            Case <span className="text-brand-orange">Studies</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-brand-text-muted font-light mb-16">
            Real results. Real revenue. See how we drive growth.
          </p>
          
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-brand-border-light text-center">
            <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-orange">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-brand-navy mb-4">Case Studies Coming Soon</h3>
            <p className="text-brand-text-muted mb-8">We are currently compiling our latest success stories and ROI metrics.</p>
            <Link to="/portfolio" className="inline-block px-8 py-4 bg-brand-navy text-white font-bold uppercase tracking-widest rounded-xl hover:bg-brand-orange transition-colors">
              View Portfolio Meanwhile
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
