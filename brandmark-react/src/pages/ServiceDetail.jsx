import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageTransition } from '../components/PageTransition';
import { SEO } from '../components/SEO';

gsap.registerPlugin(ScrollTrigger);

const serviceData = {
  'brand-identity': {
    title: 'Brand Identity Design',
    subtitle: 'From positioning to visual systems, we build brand identities that create trust across cultures.',
    features: [
      { title: 'Visual Systems', desc: 'Logos, typography, and color palettes that make an impact.' },
      { title: 'Brand Guidelines', desc: 'Comprehensive rules to keep your brand consistent globally.' },
      { title: 'Tone of Voice', desc: 'Messaging frameworks that speak directly to your ICP.' },
      { title: 'Rebranding Strategy', desc: 'Smooth transitions that retain equity while modernizing.' }
    ]
  },
  'web-development': {
    title: 'Web Design & Development',
    subtitle: 'Complete MERN applications with custom dashboards, optimized for performance and conversions.',
    features: [
      { title: 'MERN Stack', desc: 'Full-stack applications using MongoDB, Express, React, and Node.js.' },
      { title: 'Admin Dashboards', desc: 'Custom CMS panels with real-time data visualization and CRUD operations.' },
      { title: 'SEO & Performance', desc: 'Lighthouse score optimization, Core Web Vitals, and Meta tags.' },
      { title: 'Security & Auth', desc: 'JWT implementation, data encryption, and robust API design.' },
      { title: 'DevOps', desc: 'Vercel/Render deployment with CI/CD automation.' }
    ]
  },
  'digital-marketing': {
    title: 'Digital Marketing',
    subtitle: 'ROI-focused campaigns across Google, Meta, and search channels to generate qualified leads.',
    features: [
      { title: 'PPC Campaigns', desc: 'Google Ads & Meta with advanced AI bidding strategies.' },
      { title: 'Conversion Rate', desc: 'A/B testing landing pages to maximize ROI.' },
      { title: 'Analytics', desc: 'Comprehensive tracking with GTM and GA4.' },
      { title: 'Lead Generation', desc: 'Steady pipeline growth tailored for B2B and SaaS.' }
    ]
  },
  'social-media': {
    title: 'Social Media Management',
    subtitle: 'Build authority with platform-native content for LinkedIn, Instagram, and TikTok.',
    features: [
      { title: 'Content Creation', desc: 'High-quality videos, carousels, and copy that engages.' },
      { title: 'Community Growth', desc: 'Active engagement to build a loyal follower base.' },
      { title: 'Influencer Marketing', desc: 'Strategic partnerships to amplify your reach.' },
      { title: 'Platform Strategy', desc: 'Tailored approaches for B2B (LinkedIn) vs B2C (Instagram).' }
    ]
  }
};

export const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const service = serviceData[serviceId] || {
    title: 'Service Not Found',
    subtitle: 'The requested service could not be found.',
    features: []
  };

  useEffect(() => {
    // Header animation
    gsap.fromTo('.service-header', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );

    // Bento box staggered animation
    const boxes = gsap.utils.toArray('.bento-box');
    if (boxes.length > 0) {
      gsap.fromTo(boxes, 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.bento-grid',
            start: 'top 80%',
          }
        }
      );
    }
  }, [serviceId]);

  const handleStartProject = () => {
    navigate('/contact');
  };

  return (
    <PageTransition>
      <SEO 
        title={`${service.title} Agency in Patna | BrandMark Solutions`}
        description={service.subtitle}
        canonicalUrl={`https://www.brandmarksolutions.site/services/${serviceId}`}
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": service.title,
            "description": service.subtitle,
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
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.brandmarksolutions.site/" },
              { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.brandmarksolutions.site/services" },
              { "@type": "ListItem", "position": 3, "name": service.title, "item": `https://www.brandmarksolutions.site/services/${serviceId}` }
            ]
          }
        ]}
      />
      <div className="pt-32 pb-20 bg-brand-bg-light min-h-screen relative overflow-hidden">
        
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-brand-orange rounded-full filter blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <button 
            onClick={() => navigate('/services')}
            className="inline-flex items-center text-brand-orange hover:text-brand-orange-dark font-medium transition-colors mb-12 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform mr-2">&larr;</span> Back to Services
          </button>
          
          <div className="service-header max-w-4xl mb-24">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-brand-navy leading-tight">
              {service.title}
            </h1>
            <div className="w-20 h-2 bg-brand-orange mb-10 rounded-full"></div>
            <p className="text-2xl md:text-3xl text-brand-text-body font-light leading-relaxed">
              {service.subtitle}
            </p>
          </div>

          {service.features.length > 0 && (
            <div className="mb-24">
              <h3 className="text-3xl font-bold text-brand-navy mb-10">What's Included</h3>
              
              {/* Bento Box Grid */}
              <div className="bento-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.features.map((feature, i) => (
                  <div 
                    key={i} 
                    className={`bento-box bg-white p-10 rounded-3xl border border-brand-border-light shadow-sm hover:shadow-xl hover:border-brand-orange transition-all duration-300 ${
                      i === 0 || i === 3 ? 'md:col-span-2 lg:col-span-2 bg-gradient-to-br from-white to-brand-bg-light' : ''
                    }`}
                  >
                    <div className="w-14 h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-6 text-brand-orange text-2xl font-bold">
                      {i + 1}
                    </div>
                    <h4 className="text-2xl font-bold text-brand-navy mb-4">{feature.title}</h4>
                    <p className="text-brand-text-muted font-light leading-relaxed text-lg">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* CTA Section */}
          <div className="bg-brand-navy rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <div className="relative z-10">
               <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to scale?</h2>
               <p className="text-xl text-gray-300 font-light mb-10 max-w-2xl mx-auto">
                 Partner with us to build out your {service.title.toLowerCase()} strategy today.
               </p>
               <button 
                 onClick={handleStartProject}
                 className="inline-block px-10 py-5 bg-brand-orange text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:text-brand-orange transition-all duration-300 shadow-xl hover:-translate-y-1"
               >
                 Start a Project
               </button>
             </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};
