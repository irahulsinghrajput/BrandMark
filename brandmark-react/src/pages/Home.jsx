import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { Hero } from '../components/Hero';
import { ServicesList } from '../components/ServicesList';
import { Testimonials } from '../components/Testimonials';
import { SEOAuditForm } from '../components/SEOAuditForm';
import { ContactForm } from '../components/ContactForm';
import { useLenis } from 'lenis/react';
import { SEO } from '../components/SEO';

export const Home = () => {
  const location = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get('scrollTo');
    
    if (scrollTo === 'contact') {
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection && lenis) {
          lenis.scrollTo(contactSection, { offset: -100, duration: 1.5 });
          // Auto focus the name input
          const nameInput = contactSection.querySelector('input[name="name"]');
          if (nameInput) nameInput.focus();
        } else if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          const nameInput = contactSection.querySelector('input[name="name"]');
          if (nameInput) nameInput.focus();
        }
      }, 500); // slight delay to allow rendering
    }
  }, [location, lenis]);

  return (
    <PageTransition>
      <SEO 
        title="BrandMark Solutions | Creative & Digital Marketing Agency Patna"
        description="Top-rated digital marketing, website design, and SEO company in Patna, Bihar. We help businesses across North India scale with AI and branding."
        canonicalUrl="https://www.brandmarksolutions.site"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "BrandMark Solutions",
          "url": "https://www.brandmarksolutions.site",
          "description": "Top-rated digital marketing, website design, and SEO company in Patna, Bihar."
        }}
      />
      <div className="bg-brand-bg-light">
        <Hero />
        <ServicesList />
        <SEOAuditForm />
        <Testimonials />
        <ContactForm />
      </div>
    </PageTransition>
  );
};
