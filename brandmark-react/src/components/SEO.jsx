import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEO = ({ 
  title, 
  description, 
  canonicalUrl, 
  ogImage = "https://www.brandmarksolutions.site/brandmark-logo-new.png.webp",
  schema,
  type = "website" 
}) => {

  const baseSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "BrandMark Media Solutions Pvt Ltd",
      "alternateName": [
        "BrandMark Media Solutions Private Limited",
        "BrandMark Solutions Private Limited",
        "BrandMark Media Solutions",
        "Brandmark Media Solutions Pvt Ltd",
        "BrandMark Solutions"
      ],
      "url": "https://www.brandmarksolutions.site"
    },
    {
      "@context": "https://schema.org",
      "@type": ["Organization", "Corporation"],
      "name": "BrandMark Solutions",
      "legalName": "BrandMark Media Solutions Private Limited",
      "alternateName": [
        "BrandMark Media Solutions Private Limited",
        "BrandMark Solutions Private Limited",
        "BrandMark Media Solutions Pvt Ltd",
        "BrandMark Solutions Pvt Ltd",
        "BrandMark Media Solutions",
        "BrandMark"
      ],
      "url": "https://www.brandmarksolutions.site",
      "logo": "https://www.brandmarksolutions.site/brandmark-logo-new.png.webp",
      "sameAs": [
        "https://www.linkedin.com/company/brandmarksolutions/",
        "https://www.instagram.com/brandmarksolutions/",
        "https://www.facebook.com/brandmarksolutions",
        "https://www.youtube.com/@BrandMarkSolutions"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+917091863003",
        "contactType": "customer service",
        "email": "contact@brandmarksolutions.site",
        "areaServed": ["IN", "Worldwide"],
        "availableLanguage": ["English", "Hindi"]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "BrandMark Solutions",
      "legalName": "BrandMark Media Solutions Private Limited",
      "alternateName": [
        "BrandMark Solutions Private Limited",
        "BrandMark Media Solutions Private Limited",
        "Brandmark Media Solutions Pvt Ltd",
        "BrandMark Media Solutions"
      ],
      "image": "https://www.brandmarksolutions.site/brandmark-logo-new.png.webp",
      "@id": "https://www.brandmarksolutions.site",
      "url": "https://www.brandmarksolutions.site",
      "telephone": "+917091863003",
      "email": "contact@brandmarksolutions.site",
      "priceRange": "$$",
      "areaServed": [
        "Patna",
        "Bihar",
        "India"
      ],
      "knowsAbout": [
        "Search engine optimisation",
        "Local SEO",
        "Google Ads",
        "Meta Ads",
        "Social media marketing",
        "Website development",
        "Brand identity design",
        "Photography",
        "Video production",
        "Influencer marketing"
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Gangotri, Buddha Colony",
        "addressLocality": "Patna",
        "addressRegion": "Bihar",
        "postalCode": "800001",
        "addressCountry": "IN"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }
    }
  ];

  let finalSchema = baseSchema;
  if (schema) {
    if (Array.isArray(schema)) {
      finalSchema = [...baseSchema, ...schema];
    } else {
      finalSchema = [...baseSchema, schema];
    }
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content="BrandMark Media Solutions Private Limited" />
      
      {/* Universal Search Engine Crawler Directives */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={type || "website"} />
      <meta property="og:site_name" content="BrandMark Media Solutions Pvt Ltd" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
};
