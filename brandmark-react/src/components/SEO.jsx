import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEO = ({ 
  title, 
  description, 
  canonicalUrl, 
  ogImage = "https://www.brandmarksolutions.site/brandmark-logo-new.png.webp",
  schema 
}) => {
  const baseSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "BrandMark Solutions",
      "url": "https://www.brandmarksolutions.site",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.brandmarksolutions.site/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "BrandMark Solutions",
      "image": "https://www.brandmarksolutions.site/brandmark-logo-new.png.webp",
      "@id": "https://www.brandmarksolutions.site",
      "url": "https://www.brandmarksolutions.site",
      "telephone": "+917091863003",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Gangotri, Buddha colony",
        "addressLocality": "Patna",
        "addressRegion": "Bihar",
        "postalCode": "800001",
        "addressCountry": "IN"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "89"
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
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* OpenGraph / Facebook */}
      <meta property="og:type" content="website" />
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
