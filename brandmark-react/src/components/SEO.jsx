import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEO = ({ 
  title, 
  description, 
  keywords,
  canonicalUrl, 
  ogImage = "https://www.brandmarksolutions.site/brandmark-logo-new.png.webp",
  schema,
  type = "website" 
}) => {
  const defaultKeywords = "BrandMark Solutions Private Limited, BrandMark Media Solutions Private Limited, BrandMark Solutions, BrandMark Media Solutions, Brandmark Media Solutions Pvt Ltd, BrandMark Solutions Pvt Ltd, BrandMark Patna, digital marketing agency in patna, website development in bihar, commercial photography patna, cinematic videography bihar, influencer marketing agency patna, local seo patna";
  const finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  const baseSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "BrandMark Solutions",
      "alternateName": [
        "BrandMark Media Solutions Private Limited",
        "BrandMark Solutions Private Limited",
        "BrandMark Media Solutions",
        "Brandmark Media Solutions Pvt Ltd"
      ],
      "url": "https://www.brandmarksolutions.site",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.brandmarksolutions.site/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
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
        "BrandMark Solutions Private Limited",
        "BrandMark Media Solutions Private Limited",
        "Best Digital Marketing Company in Patna",
        "Website Development in Bihar",
        "Commercial Photography in Patna",
        "Cinematic Videography & Reels in Bihar",
        "Influencer Marketing Agency in Patna",
        "Local SEO & Google Maps Ranking Patna"
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "400 pat, Gangotri Sadan, Buddha Colony, Patna G.P.O., Phulwari",
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
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "BrandMark Solutions Navigation & Featured Case Studies",
      "itemListElement": [
        {
          "@type": "SiteNavigationElement",
          "position": 1,
          "name": "Services",
          "url": "https://www.brandmarksolutions.site/services"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 2,
          "name": "About Us",
          "url": "https://www.brandmarksolutions.site/about"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 3,
          "name": "Portfolio & Case Studies",
          "url": "https://www.brandmarksolutions.site/portfolio"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 4,
          "name": "Blog & Insights",
          "url": "https://www.brandmarksolutions.site/blog"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 5,
          "name": "GovTech Bihar Portals Case Study",
          "url": "https://www.brandmarksolutions.site/blog/digital-transformation-bihar-government-portals"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 6,
          "name": "School Admission Marketing Bihar (GIS Patna)",
          "url": "https://www.brandmarksolutions.site/blog/school-admission-marketing-bihar"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 7,
          "name": "Hospital Marketing Patna",
          "url": "https://www.brandmarksolutions.site/blog/healthcare-digital-marketing-hospitals-patna-bihar"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 8,
          "name": "Hotel & Banquet Marketing Bihar",
          "url": "https://www.brandmarksolutions.site/blog/hotel-banquet-marketing-patna-bihar"
        }
      ]
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
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="BrandMark Media Solutions Private Limited" />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={type || "website"} />
      <meta property="og:site_name" content="BrandMark Media Solutions Private Limited" />
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
