import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SEO } from '../components/SEO';
import { ContactForm } from '../components/ContactForm';
import { RelatedLinks } from '../components/RelatedLinks';

const locationData = {
  patna: { name: 'Patna', state: 'Bihar', description: 'The capital city driving digital transformation in Bihar.', services: ['Digital Marketing', 'Website Design', 'SEO Services', 'Branding'] },
  bihar: { name: 'Bihar', state: 'India', description: 'Empowering businesses across the state with scalable tech solutions.', services: ['Web Development', 'Digital Marketing', 'Business Automation', 'UI/UX Design'] },
  ranchi: { name: 'Ranchi', state: 'Jharkhand', description: 'Innovative web design and SEO strategies for Ranchi businesses.', services: ['Web Development', 'SEO', 'Lead Generation'] },
  gaya: { name: 'Gaya', state: 'Bihar', description: 'Boosting local visibility for Gaya tourism and commerce.', services: ['Local SEO', 'Web Design', 'Social Media'] },
  muzaffarpur: { name: 'Muzaffarpur', state: 'Bihar', description: 'Digital marketing tailored for Muzaffarpur enterprises.', services: ['Digital Strategy', 'Meta Ads', 'Branding'] },
  bhagalpur: { name: 'Bhagalpur', state: 'Bihar', description: 'Scaling Bhagalpur businesses with modern web development.', services: ['Website Design', 'SEO', 'Content Creation'] },
  delhi: { name: 'Delhi', state: 'Delhi', description: 'Aggressive digital marketing strategies for the competitive Delhi market.', services: ['Performance Marketing', 'SEO', 'Web App Development'] },
  noida: { name: 'Noida', state: 'Uttar Pradesh', description: 'SaaS and tech-focused marketing for Noida startups.', services: ['B2B Marketing', 'UI/UX', 'SEO'] },
  gurgaon: { name: 'Gurgaon', state: 'Haryana', description: 'Corporate digital branding and enterprise SEO for Gurgaon.', services: ['Corporate Branding', 'Enterprise SEO', 'Lead Gen'] },
  lucknow: { name: 'Lucknow', state: 'Uttar Pradesh', description: 'Culturally resonant marketing and modern web design for Lucknow.', services: ['Social Media', 'Web Design', 'SEO'] },
  varanasi: { name: 'Varanasi', state: 'Uttar Pradesh', description: 'Hospitality and tourism SEO specialists for Varanasi.', services: ['Hotel SEO', 'Website Design', 'Branding'] },
  chandigarh: { name: 'Chandigarh', state: 'Punjab', description: 'High-end branding and web development for Chandigarh businesses.', services: ['Branding', 'Web Development', 'Meta Ads'] },
  jaipur: { name: 'Jaipur', state: 'Rajasthan', description: 'E-commerce and boutique marketing strategies in Jaipur.', services: ['E-commerce Web Design', 'SEO', 'Social Media'] },
  default: { name: 'North India', state: 'India', description: 'Delivering premium digital marketing and web development.', services: ['Digital Strategy', 'Web Design', 'SEO', 'Lead Generation'] }
};

export const LocationPage = () => {
  const { city } = useParams();
  const normalizedCity = city ? city.toLowerCase() : 'default';
  const data = locationData[normalizedCity] || {
    name: city.charAt(0).toUpperCase() + city.slice(1),
    state: 'India',
    description: `Leading digital marketing and web development services in ${city}.`,
    services: ['Digital Marketing', 'Website Design', 'SEO', 'Branding'],
  };

  return (
    <PageTransition>
      <SEO 
        title={`Digital Marketing & Website Design Agency in ${data.name} | BrandMark`}
        description={`BrandMark Solutions is the top-rated digital marketing, SEO, and web development company serving ${data.name}, ${data.state}. Let's scale your business.`}
        canonicalUrl={`https://www.brandmarksolutions.site/locations/${normalizedCity}`}
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": `BrandMark Solutions ${data.name}`,
            "description": data.description,
            "url": `https://www.brandmarksolutions.site/locations/${normalizedCity}`,
            "areaServed": data.name,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": data.name,
              "addressRegion": data.state,
              "addressCountry": "IN"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `What digital services do you offer in ${data.name}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `We offer a full suite of services in ${data.name} including ${data.services.join(', ')}.`
                }
              }
            ]
          }
        ]}
      />
      <div className="pt-32 pb-20 bg-brand-bg-light min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-brand-navy">
              Digital Marketing & Web Design in <span className="text-brand-orange">{data.name}</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-brand-text-muted font-light mb-10">
              {data.description} Partner with BrandMark Solutions to dominate your local market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-brand-border-light">
              <h2 className="text-3xl font-bold text-brand-navy mb-6">Our Services in {data.name}</h2>
              <ul className="space-y-4">
                {data.services.map((service, i) => (
                  <li key={i} className="flex items-center text-lg text-brand-text-body">
                    <span className="w-2 h-2 bg-brand-orange rounded-full mr-3"></span>
                    <Link to="/services" className="hover:text-brand-orange transition-colors">{service}</Link>
                  </li>
                ))}
              </ul>
              <div className="mt-10 pt-10 border-t border-brand-border-light">
                 <h3 className="text-xl font-bold text-brand-navy mb-4">FAQ</h3>
                 <div className="mb-4">
                   <h4 className="font-bold text-brand-navy">What digital services do you offer in {data.name}?</h4>
                   <p className="text-brand-text-muted text-sm mt-1">We offer a full suite of services including {data.services.join(', ')}.</p>
                 </div>
              </div>
              <RelatedLinks currentType="location" currentId={normalizedCity} />
            </div>
            
            <div className="bg-brand-navy p-10 rounded-3xl shadow-xl text-white flex flex-col justify-center">
              <h3 className="text-3xl font-bold mb-4">Ready to grow your {data.name} business?</h3>
              <p className="text-gray-300 mb-8">We combine local market understanding with global tech standards.</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
