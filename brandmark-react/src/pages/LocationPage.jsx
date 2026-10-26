import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SEO } from '../components/SEO';
import { ContactForm } from '../components/ContactForm';
import { RelatedLinks } from '../components/RelatedLinks';
import locationData from '../data/locations.json';
import localKeywordsData from '../data/localKeywords.json';
import { 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  Search, 
  Camera, 
  Video, 
  Users, 
  Globe, 
  TrendingUp, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export const LocationPage = () => {
  const { city } = useParams();
  const normalizedCity = city ? city.toLowerCase() : 'patna';
  const data = locationData[normalizedCity] || {
    name: city ? city.charAt(0).toUpperCase() + city.slice(1) : 'Patna',
    state: 'Bihar',
    description: `Leading digital marketing, website development, photography, videography, and influencer marketing agency in ${city || 'Patna'}.`,
    services: [
      'Digital Marketing & SEO',
      'Website Development & E-Commerce',
      'Commercial Photography',
      'Cinematic Videography & Reels',
      'Influencer Marketing & Creator Campaigns',
      'Local SEO & Google Maps Ranking'
    ],
    keywords: `best digital marketing company in ${city || 'patna'}, website development in ${city || 'patna'}, photography in ${city || 'patna'}, videography in ${city || 'patna'}`,
    faqs: [
      {
        q: `Which is the best digital marketing company in ${city || 'Patna'}?`,
        a: `BrandMark Solutions is recognized as the leading digital growth agency in ${city || 'Patna'}, delivering performance-driven Meta ads, Google PPC, local SEO, website development, and influencer marketing with verified ROI.`
      },
      {
        q: `How much does website development cost in ${city || 'Patna'}?`,
        a: `Custom business websites and high-performance React/Vite web apps in ${city || 'Patna'} typically range from ₹25,000 to ₹1,50,000 depending on features, custom UI/UX design, payment gateway integration, and SEO optimization.`
      },
      {
        q: `Do you provide commercial photography and videography shoots in ${city || 'Patna'}?`,
        a: `Yes, we deploy cinema cameras, professional studio lighting, and licensed drone setups for commercial ad films, Instagram Reels, jewellery & food shoots, and corporate event coverage.`
      },
      {
        q: `How does influencer marketing work for local businesses in Bihar?`,
        a: `We connect local brands with vetted regional creators, Instagram influencers, and YouTubers across Bihar to execute viral localized promotions and footfall-driving store campaigns.`
      }
    ]
  };

  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const isPatnaOrBihar = normalizedCity === 'patna' || normalizedCity === 'bihar';

  // Gather all keywords from localKeywordsData
  const allKeywordsList = localKeywordsData.categories.flatMap(cat => cat.keywords);

  // Generate Service Route Mapping
  const getServiceLink = (serviceName) => {
    const s = serviceName.toLowerCase();
    if (s.includes('photo')) return '/services/photography';
    if (s.includes('video') || s.includes('reel')) return '/services/videography';
    if (s.includes('influencer')) return '/services/influencer-marketing';
    if (s.includes('web') || s.includes('e-commerce')) return '/services/web-development';
    if (s.includes('marketing') || s.includes('seo')) return '/services/digital-marketing';
    return '/services';
  };

  // Structured Schema Definition
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": `BrandMark Solutions - Best Digital Marketing & Web Development Company in ${data.name}`,
    "image": "https://www.brandmarksolutions.site/brandmark-logo-new.png.webp",
    "@id": `https://www.brandmarksolutions.site/locations/${normalizedCity}`,
    "url": `https://www.brandmarksolutions.site/locations/${normalizedCity}`,
    "telephone": "+917091863003",
    "priceRange": "$$",
    "description": data.description,
    "areaServed": [
      data.name,
      "Patna",
      "Bihar",
      "India"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Gangotri, Buddha colony",
      "addressLocality": data.name,
      "addressRegion": data.state,
      "postalCode": "800001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "25.6190",
      "longitude": "85.1328"
    },
    "sameAs": [
      "https://www.instagram.com/brandmarksolutions/",
      "https://www.linkedin.com/company/brandmarksolutions/",
      "https://www.facebook.com/brandmarksolutions",
      "https://www.youtube.com/@BrandMarkSolutions"
    ],
    "knowsAbout": allKeywordsList.slice(0, 30),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `Digital Growth & Creative Services in ${data.name}`,
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": `Digital Marketing & Performance Ads in ${data.name}`,
            "description": `Meta Ads, Google PPC, Lead Generation, and Local SEO in ${data.name}, Bihar.`
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": `Website Development & E-Commerce in ${data.name}`,
            "description": `Custom React, Next.js, WordPress, and E-Commerce website development in ${data.name}, Bihar.`
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": `Commercial Photography in ${data.name}`,
            "description": `Product photography, studio shoots, jewellery, and corporate photography in ${data.name}, Bihar.`
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": `Cinematic Videography & Reels Production in ${data.name}`,
            "description": `4K commercial ad films, viral Instagram Reels, and licensed drone shoots in ${data.name}, Bihar.`
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": `Influencer Marketing & Creator Campaigns in ${data.name}`,
            "description": `Regional Bihar influencers, creator collaborations, and viral brand endorsements in ${data.name}.`
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": `Local SEO & Google Maps Ranking in ${data.name}`,
            "description": `Google Business Profile optimization, local search dominance, and 3-pack rankings in ${data.name}.`
          }
        }
      ]
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (data.faqs || []).map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.brandmarksolutions.site"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Locations",
        "item": "https://www.brandmarksolutions.site/locations/patna"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${data.name}, ${data.state}`,
        "item": `https://www.brandmarksolutions.site/locations/${normalizedCity}`
      }
    ]
  };

  return (
    <PageTransition>
      <SEO 
        title={`Best Digital Marketing & Web Development Company in ${data.name}, ${data.state} | BrandMark Solutions`}
        description={`Top-rated digital marketing, website development, commercial photography, cinematic videography, and influencer marketing agency in ${data.name}, ${data.state}. Grow with proven ROI.`}
        canonicalUrl={`https://www.brandmarksolutions.site/locations/${normalizedCity}`}
        schema={[localBusinessSchema, faqSchema, breadcrumbSchema]}
      />

      <div className="pt-28 pb-20 bg-[#F8FAFC] min-h-screen font-outfit">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-sm font-semibold uppercase tracking-wider mb-6">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>Headquartered in Buddha Colony, Patna • Serving All Bihar</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0B2C4D] leading-tight mb-6">
              Best Digital Marketing & <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                Website Development in {data.name}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed mb-8">
              {data.description} From high-converting websites and local SEO to 4K photography, viral videography reels, and regional influencer marketing—we engineer sustainable digital dominance for businesses in {data.name} and across Bihar.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-slate-700">
              <span className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-green-600" /> Top Ranked in Patna & Bihar
              </span>
              <span className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-green-600" /> Full Studio Photography & 4K Drone Video
              </span>
              <span className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-green-600" /> Verified Local ROI
              </span>
            </div>
          </div>
        </div>

        {/* 6 Core Pillars Service Grid */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B2C4D] mb-3">
              Comprehensive Growth Services in {data.name}
            </h2>
            <p className="text-slate-500 text-base max-w-2xl mx-auto">
              Everything your brand needs to capture local market share and scale across Bihar and India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1: Digital Marketing */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[#0B2C4D] mb-3">Digital Marketing & SEO</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  ROI-focused Meta Ads, Google Ads PPC, Local SEO 3-pack optimization, and high-converting lead funnels for Patna & Bihar businesses.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">Local SEO</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">Meta Ads</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">Google Ads</span>
                </div>
              </div>
              <Link to="/services/digital-marketing" className="inline-flex items-center text-orange-600 font-bold text-sm hover:translate-x-1 transition-transform">
                Explore Digital Marketing <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Service 2: Website Development */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[#0B2C4D] mb-3">Website Development & E-Commerce</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Ultra-fast custom React/Vite websites, Next.js web applications, WordPress CMS, and Shopify e-commerce stores with instant UPI payment gateways.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">React / Next.js</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">E-Commerce</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">High Speed</span>
                </div>
              </div>
              <Link to="/services/web-development" className="inline-flex items-center text-orange-600 font-bold text-sm hover:translate-x-1 transition-transform">
                Explore Web Development <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Service 3: Commercial Photography */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-600 mb-6 group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[#0B2C4D] mb-3">Commercial Photography & Shoots</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  High-definition studio product shoots, jewellery macro photography, corporate portraits, architectural hotel showcases, and Amazon cataloging.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">Product Shoots</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">Jewellery</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">Corporate</span>
                </div>
              </div>
              <Link to="/services/photography" className="inline-flex items-center text-orange-600 font-bold text-sm hover:translate-x-1 transition-transform">
                Explore Photography <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Service 4: Cinematic Videography */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                  <Video className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[#0B2C4D] mb-3">Cinematic Videography & Reels</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Viral short-form Instagram Reels, 4K commercial ad films, licensed drone aerial cinematography, and high-impact corporate documentaries.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">Instagram Reels</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">4K Ad Films</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">Drone Shoots</span>
                </div>
              </div>
              <Link to="/services/videography" className="inline-flex items-center text-orange-600 font-bold text-sm hover:translate-x-1 transition-transform">
                Explore Videography <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Service 5: Influencer Marketing */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[#0B2C4D] mb-3">Influencer Marketing & Creators</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Partner your business with Bihar and India’s most influential regional creators and YouTubers. Drive immediate showroom footfall and viral brand buzz.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">Bihar Creators</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">Store Footfall</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">Viral UGC</span>
                </div>
              </div>
              <Link to="/services/influencer-marketing" className="inline-flex items-center text-orange-600 font-bold text-sm hover:translate-x-1 transition-transform">
                Explore Influencer Marketing <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Service 6: Brand Identity & Graphic Design */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[#0B2C4D] mb-3">Brand Identity & Rebranding</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Complete brand positioning, corporate logo architecture, visual identity guidelines, premium brochures, and product packaging design that commands authority.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">Logo Architecture</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">Brand Guidelines</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">Packaging Design</span>
                </div>
              </div>
              <Link to="/services/brand-identity" className="inline-flex items-center text-orange-600 font-bold text-sm hover:translate-x-1 transition-transform">
                Explore Brand Identity <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* TOP 100 LOCAL SEO KEYWORDS DIRECTORY */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-200">
              <div>
                <div className="inline-flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-widest mb-2">
                  <Search className="w-3.5 h-3.5" />
                  <span>Google Local Search Index (100 Keywords)</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B2C4D]">
                  Top Local Services & Search Keywords in {data.name} & Bihar
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  BrandMark Solutions is actively indexed and optimized for all primary search queries across North India.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeCategory === 'all' 
                      ? 'bg-[#0B2C4D] text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All (100)
                </button>
                {localKeywordsData.categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      activeCategory === cat.id 
                        ? 'bg-orange-600 text-white shadow-sm' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.id.split('-')[0].charAt(0).toUpperCase() + cat.id.split('-')[0].slice(1)} ({cat.keywords.length})
                  </button>
                ))}
              </div>
            </div>

            {/* Keyword Pills Display */}
            <div className="space-y-8">
              {localKeywordsData.categories
                .filter(cat => activeCategory === 'all' || activeCategory === cat.id)
                .map((cat) => (
                  <div key={cat.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-200/70">
                    <h3 className="text-base font-bold text-[#0B2C4D] mb-1 flex items-center justify-between">
                      <span>{cat.categoryName}</span>
                      <span className="text-xs text-orange-600 font-semibold bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                        {cat.keywords.length} Verified Queries
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">{cat.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {cat.keywords.map((kw, idx) => (
                        <span 
                          key={idx}
                          className="inline-flex items-center text-xs bg-white text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs hover:border-orange-400 hover:text-orange-600 transition-colors"
                        >
                          <Search className="w-3 h-3 text-slate-400 mr-1.5 flex-shrink-0" />
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Local FAQs & Contact Section */}
        <div className="max-w-7xl mx-auto px-6 mb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* FAQ Column */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B2C4D] mb-6">
              Frequently Asked Questions in {data.name}
            </h2>

            <div className="space-y-4">
              {(data.faqs || []).map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div 
                    key={index} 
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-[#0B2C4D] hover:text-orange-600 transition-colors"
                    >
                      <span className="text-base">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 flex-shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-600' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200">
              <RelatedLinks currentType="location" currentId={normalizedCity} />
            </div>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-5 bg-[#0B2C4D] text-white p-8 md:p-10 rounded-3xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold mb-4 border border-orange-500/30">
                <MapPin className="w-3.5 h-3.5" />
                <span>Patna Headquarters</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold mb-3">
                Ready to dominate the {data.name} market?
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Get a customized local growth audit. We combine local market intelligence with global performance marketing standards.
              </p>

              <div className="space-y-3 mb-8 text-sm">
                <div className="flex items-center gap-3 text-slate-300">
                  <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <a href="tel:+917091863003" className="hover:text-white transition-colors">+91 70918 63003</a>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <a href="mailto:contact@brandmarksolutions.site" className="hover:text-white transition-colors">contact@brandmarksolutions.site</a>
                </div>
                <div className="flex items-start gap-3 text-slate-300">
                  <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span>Gangotri, Buddha Colony, Patna - 800001</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
