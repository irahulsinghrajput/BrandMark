import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SEO } from '../components/SEO';
import { ContactForm } from '../components/ContactForm';
import { RelatedLinks } from '../components/RelatedLinks';
import industryData from '../data/industries.json';

export const IndustryPage = () => {
  const { industryId } = useParams();
  const normalizedId = industryId ? industryId.toLowerCase() : 'default';
  const data = industryData[normalizedId] || {
    name: industryId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: `Targeted digital growth strategies for the ${industryId.replace('-', ' ')} industry.`,
    services: ['Digital Marketing', 'Web Design', 'SEO Automation'],
  };

  return (
    <PageTransition>
      <SEO 
        title={`Digital Marketing for ${data.name} | BrandMark Solutions`}
        description={data.description}
        canonicalUrl={`https://www.brandmarksolutions.site/industries/${normalizedId}`}
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": `Digital Marketing for ${data.name}`,
            "description": data.description,
            "provider": {
              "@type": "LocalBusiness",
              "name": "BrandMark Solutions Private Ltd.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Patna",
                "addressRegion": "Bihar",
                "addressCountry": "IN"
              }
            }
          }
        ]}
      />
      <div className="pt-32 pb-20 bg-brand-bg-light min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-brand-navy">
              Digital Marketing for <span className="text-brand-orange">{data.name}</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-brand-text-muted font-light mb-10">
              {data.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-brand-border-light">
              <h2 className="text-3xl font-bold text-brand-navy mb-6">Vertical Solutions</h2>
              <ul className="space-y-4">
                {data.services.map((service, i) => (
                  <li key={i} className="flex items-center text-lg text-brand-text-body">
                    <span className="w-2 h-2 bg-brand-orange rounded-full mr-3"></span>
                    {service}
                  </li>
                ))}
              </ul>
              
              <RelatedLinks currentType="industry" currentId={normalizedId} />
            </div>
            
            <div className="bg-brand-navy p-10 rounded-3xl shadow-xl text-white flex flex-col justify-center">
              <h3 className="text-3xl font-bold mb-4">Dominate the {data.name} market</h3>
              <p className="text-gray-300 mb-8">Get a customized strategy blueprint tailored to your specific industry constraints and opportunities.</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
