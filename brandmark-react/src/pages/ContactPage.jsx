import React from 'react';
import { PageTransition } from '../components/PageTransition';
import { ContactForm } from '../components/ContactForm';
import { SEO } from '../components/SEO';

export const ContactPage = () => {
  return (
    <PageTransition>
      <SEO 
        title="Contact Us | BrandMark Solutions | Patna & North India"
        description="Get in touch with BrandMark Solutions. We help businesses across Patna, Bihar, and North India scale with digital marketing, web development, and branding."
        canonicalUrl="https://www.brandmarksolutions.site/contact"
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "BrandMark Solutions Private Ltd.",
          "url": "https://www.brandmarksolutions.site",
          "logo": "https://www.brandmarksolutions.site/brandmark-logo-new.png.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+917091863003",
            "contactType": "customer service",
            "areaServed": ["IN", "US", "AE", "EU"],
            "availableLanguage": ["English", "Hindi"]
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Gangotri, Buddha colony",
            "addressLocality": "Patna",
            "addressRegion": "Bihar",
            "postalCode": "800001",
            "addressCountry": "IN"
          }
        }}
      />
      <div className="pt-20">
        <ContactForm />
      </div>
    </PageTransition>
  );
};
