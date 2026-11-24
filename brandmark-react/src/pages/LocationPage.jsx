import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SEO } from '../components/SEO';
import { ContactForm } from '../components/ContactForm';
import { RelatedLinks } from '../components/RelatedLinks';
import locationData from '../data/locations.json';
import { locationGuides } from '../data/locationGuides';
import { 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  Camera, 
  Video, 
  Users, 
  Globe, 
  TrendingUp, 
  ShieldCheck
} from 'lucide-react';

export const LocationPage = () => {
  const { city } = useParams();
  const normalizedCity = city ? city.toLowerCase() : 'patna';
  const base = locationData[normalizedCity] || {
    name: city ? city.charAt(0).toUpperCase() + city.slice(1) : 'Patna',
    state: 'Bihar',
    description: `Digital marketing, website development, branding and video services for businesses in ${city || 'Patna'}.`
  };
  const guide = locationGuides[normalizedCity];
  const data = { ...base, ...(guide ? { description: guide.description } : {}), faqs: guide ? guide.faqs : (base.faqs || []) };
  const isHome = normalizedCity === 'patna' || normalizedCity === 'bihar';
  const placeLabel = data.state === 'India' ? data.name : `${data.name}, ${data.state}`;

  // BrandMark has one office (Patna). Other pages describe a service area, never a local address.
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `Digital marketing and website development in ${data.name}`,
    "description": data.description,
    "url": `https://www.brandmarksolutions.site/locations/${normalizedCity}`,
    "provider": { "@id": "https://www.brandmarksolutions.site" },
    "areaServed": { "@type": normalizedCity === 'bihar' ? "State" : "City", "name": data.name }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faqs.map(faq => ({
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
        "name": placeLabel,
        "item": `https://www.brandmarksolutions.site/locations/${normalizedCity}`
      }
    ]
  };

  return (
    <PageTransition>
      <SEO 
        title={guide ? guide.seoTitle : `Digital Marketing & Website Development in ${data.name} | BrandMark`}
        description={guide ? guide.seoDescription : `${data.description} BrandMark works with clients in ${placeLabel} from its office in Patna.`}
        canonicalUrl={`https://www.brandmarksolutions.site/locations/${normalizedCity}`}
        schema={[serviceSchema, ...(data.faqs.length ? [faqSchema] : []), breadcrumbSchema]}
      />

      <div className="pt-28 pb-20 bg-[#F8FAFC] min-h-screen font-outfit">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-sm font-semibold uppercase tracking-wider mb-6">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>{isHome ? 'Based in Buddha Colony, Patna • Serving all of Bihar' : `Based in Patna • Working with businesses in ${data.name}`}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0B2C4D] leading-tight mb-6">
              {guide ? guide.h1 : (
                <>Digital Marketing & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Website Development in {data.name}</span></>
              )}
            </h1>

            <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed mb-8">
              {data.description} From search and social media to websites, photography and video, you work with one team and one plan.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-slate-700">
              <span className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-green-600" /> SEO, ads, social and web in one team
              </span>
              <span className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-green-600" /> Photography and video production
              </span>
              <span className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-green-600" /> Your accounts stay in your name
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
              Choose one service or combine them. Each page explains what is included and how we work.
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

        {guide && (
          <div className="max-w-7xl mx-auto px-6 mb-20">
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm">
              <h2 className="text-2xl md:text-4xl font-extrabold text-[#0B2C4D] mb-4">{guide.guideTitle}</h2>
              <p className="text-slate-600 max-w-3xl mb-10 leading-relaxed">{guide.guideIntro}</p>
              <ol className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                {guide.checks.map((c, i) => (
                  <li key={c.title} className="flex gap-4">
                    <span className="text-2xl font-extrabold text-orange-600 w-7 flex-shrink-0" aria-hidden="true">{i + 1}</span>
                    <div>
                      <h3 className="text-lg font-bold text-[#0B2C4D] mb-1">{c.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{c.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-10 text-slate-600">
                More to read: <Link className="text-orange-600 font-semibold hover:underline" to="/blog/digital-marketing-patna-guide">guide to digital marketing in Patna</Link>,{' '}
                <Link className="text-orange-600 font-semibold hover:underline" to="/services/social-media">social media marketing</Link>,{' '}
                <Link className="text-orange-600 font-semibold hover:underline" to="/services/web-development">website development</Link> and{' '}
                <Link className="text-orange-600 font-semibold hover:underline" to="/portfolio">our work</Link>.
              </p>
            </div>
          </div>
        )}

        {/* Local FAQs & Contact Section */}
        <div className="max-w-7xl mx-auto px-6 mb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* FAQ Column */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm">
            {data.faqs.length > 0 && (
              <>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B2C4D] mb-6">Frequently asked questions</h2>
                <div className="space-y-4">
                  {data.faqs.map((faq) => (
                    <details key={faq.q} className="group border border-slate-200 rounded-2xl p-5">
                      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-bold text-[#0B2C4D]">
                        {faq.q}
                        <span className="text-orange-600 text-2xl transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                      </summary>
                      <p className="mt-3 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </>
            )}

            <div className={data.faqs.length > 0 ? 'mt-8 pt-8 border-t border-slate-200' : ''}>
              <RelatedLinks currentId={normalizedCity} />
            </div>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-5 bg-[#0B2C4D] text-white p-8 md:p-10 rounded-3xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold mb-4 border border-orange-500/30">
                <MapPin className="w-3.5 h-3.5" />
                <span>Patna office</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold mb-3">
                Talk to us about {data.name}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Tell us about your business and we will reply with clear next steps.
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
