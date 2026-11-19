import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageTransition } from '../components/PageTransition';
import { SEO } from '../components/SEO';
import { useModal } from '../contexts/ModalContext';

gsap.registerPlugin(ScrollTrigger);

const PAGE_URL = 'https://www.brandmarksolutions.site/services/performance-marketing';
const WHATSAPP_URL = 'https://wa.me/917091863003?text=' + encodeURIComponent('Hi BrandMark, I would like a free ad account audit.');

const channels = [
  { icon: '📘', title: 'Meta Ads', desc: 'Facebook & Instagram lead ads, click-to-WhatsApp campaigns, Reels ads and catalogue sales with Pixel + Conversions API tracking.' },
  { icon: '🔍', title: 'Google Search Ads', desc: 'High-intent keyword campaigns that put you in front of people searching for your service in Patna, Bihar and across India.' },
  { icon: '⚡', title: 'Performance Max & Shopping', desc: 'Feed-optimised e-commerce campaigns for D2C and retail brands, built around ROAS targets instead of clicks.' },
  { icon: '▶️', title: 'YouTube Ads', desc: 'Video campaigns for awareness and remarketing, using creatives shot and edited by our in-house video team.' },
  { icon: '🎯', title: 'Retargeting', desc: 'Bring back website visitors, video viewers and Instagram engagers with sequenced offers and social proof.' },
  { icon: '🧲', title: 'Landing Pages & CRO', desc: 'Fast, mobile-first landing pages with A/B testing, so your ad budget converts instead of bouncing.' }
];

const process = [
  { step: '01', title: 'Audit', desc: 'We review your current ads, tracking, landing pages and competitors, then share a clear list of what is wasting budget.' },
  { step: '02', title: 'Set up', desc: 'Pixel, Conversions API, GA4, Google Ads conversions and WhatsApp/call tracking, so every lead is measured.' },
  { step: '03', title: 'Test', desc: 'Multiple audiences, offers and creatives run side by side. Losers are paused quickly, winners get the budget.' },
  { step: '04', title: 'Scale', desc: 'We increase spend on what works, expand to new audiences and channels, and keep cost per lead under control.' }
];

const industries = [
  'Hospitals & Clinics', 'Coaching & Schools', 'Real Estate', 'D2C & E-commerce',
  'Jewellery & Retail', 'Restaurants & Cafes', 'Hotels & Banquets', 'B2B & Manufacturing'
];

const deliverables = [
  'Dedicated ads manager and WhatsApp group for quick updates',
  'Weekly performance report: spend, leads, cost per lead, ROAS',
  'Monthly strategy call with next-month plan',
  'Ad creatives: static, carousel and Reels (with our studio team)',
  'Full conversion tracking setup and audit',
  'Ad accounts stay in your name — you own all data'
];

const faqs = [
  {
    q: 'What is performance marketing?',
    a: 'Performance marketing is paid advertising where success is measured by results such as leads, calls, sales and return on ad spend (ROAS), rather than just impressions or likes. Every rupee is tracked back to an outcome.'
  },
  {
    q: 'What is the minimum ad budget to start?',
    a: 'For most local businesses in Patna and Bihar, we recommend starting with ₹15,000–₹30,000 per month in ad spend so there is enough data to test and optimise. The exact figure depends on your industry and goals, and we will suggest one in your free audit.'
  },
  {
    q: 'Is the ad budget included in your fee?',
    a: 'No. Ad spend is paid directly to Meta or Google from your own ad account. Our management fee is separate, so you always see exactly what was spent on ads.'
  },
  {
    q: 'How soon will I see results?',
    a: 'Campaigns usually start generating leads within the first 1–2 weeks. The first 30 days are a testing phase; most accounts stabilise and improve cost per lead over months 2 and 3.'
  },
  {
    q: 'Do you work with businesses outside Patna?',
    a: 'Yes. We are based in Patna and serve clients across Bihar, North India and internationally. All campaign management and reporting is done online.'
  },
  {
    q: 'Who owns the ad accounts?',
    a: 'You do. We work inside ad accounts created in your business name, so you keep full ownership of your data, audiences and history even if you stop working with us.'
  }
];

export const PerformanceMarketing = () => {
  const { openStrategyModal } = useModal();

  useEffect(() => {
    gsap.fromTo('.pm-hero', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.1 });
    gsap.utils.toArray('.pm-reveal').forEach((el) => {
      gsap.fromTo(el, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
  }, []);

  return (
    <PageTransition>
      <SEO
        title="Performance Marketing Agency in Patna | Meta & Google Ads | BrandMark"
        description="ROI-focused performance marketing in Patna & Bihar. Meta Ads, Google Ads, lead generation and e-commerce ROAS campaigns with full tracking and weekly reports. Get a free ad audit."
        canonicalUrl={PAGE_URL}
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Performance Marketing",
            "serviceType": "Performance Marketing, PPC & Paid Social Advertising",
            "description": "Meta Ads, Google Ads, Performance Max, YouTube and retargeting campaigns focused on leads, sales and ROAS.",
            "url": PAGE_URL,
            "provider": {
              "@type": "LocalBusiness",
              "name": "BrandMark Media Solutions Private Limited",
              "url": "https://www.brandmarksolutions.site",
              "telephone": "+91-7091863003",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Patna",
                "addressRegion": "Bihar",
                "addressCountry": "IN"
              }
            },
            "areaServed": ["Patna", "Bihar", "North India", "India"]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((f) => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }))
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.brandmarksolutions.site/" },
              { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.brandmarksolutions.site/services" },
              { "@type": "ListItem", "position": 3, "name": "Performance Marketing", "item": PAGE_URL }
            ]
          }
        ]}
      />

      <div className="pt-32 pb-20 bg-brand-bg-light min-h-screen relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-brand-orange rounded-full filter blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link to="/services" className="inline-flex items-center text-brand-orange hover:text-brand-orange-dark font-medium transition-colors mb-12 group">
            <span className="transform group-hover:-translate-x-1 transition-transform mr-2">&larr;</span> Back to Services
          </Link>

          {/* Hero */}
          <section className="max-w-4xl mb-24">
            <p className="pm-hero text-brand-orange uppercase tracking-widest font-bold text-sm mb-6">Performance Marketing · Patna &amp; Bihar</p>
            <h1 className="pm-hero text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-brand-navy leading-tight">
              Ads that bring <span className="text-brand-orange">leads and sales</span>, not just likes.
            </h1>
            <div className="pm-hero w-20 h-2 bg-brand-orange mb-10 rounded-full"></div>
            <p className="pm-hero text-xl md:text-2xl text-brand-text-body font-light leading-relaxed mb-10">
              We plan, run and optimise Meta and Google Ads campaigns measured on what matters to your business: cost per lead, calls, WhatsApp enquiries and return on ad spend.
            </p>
            <div className="pm-hero flex flex-col sm:flex-row gap-4">
              <button
                onClick={openStrategyModal}
                className="px-8 py-4 bg-brand-orange text-white font-bold uppercase tracking-widest rounded-xl hover:bg-brand-navy transition-all duration-300 shadow-xl hover:-translate-y-1"
              >
                Get a Free Ad Audit
              </button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-brand-navy border border-brand-border-light font-bold uppercase tracking-widest rounded-xl hover:border-brand-orange hover:text-brand-orange transition-all duration-300 text-center"
              >
                Chat on WhatsApp
              </a>
            </div>
          </section>

          {/* Channels */}
          <section className="mb-24">
            <h2 className="pm-reveal text-3xl md:text-4xl font-bold text-brand-navy mb-10">Channels we manage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {channels.map((c) => (
                <div key={c.title} className="pm-reveal bg-white p-8 rounded-3xl border border-brand-border-light shadow-sm hover:shadow-xl hover:border-brand-orange transition-all duration-300">
                  <div className="w-14 h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-6 text-2xl" aria-hidden="true">{c.icon}</div>
                  <h3 className="text-xl font-bold text-brand-navy mb-3">{c.title}</h3>
                  <p className="text-brand-text-muted font-light leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Process */}
          <section className="mb-24">
            <h2 className="pm-reveal text-3xl md:text-4xl font-bold text-brand-navy mb-10">How we run your campaigns</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((p) => (
                <div key={p.step} className="pm-reveal bg-gradient-to-br from-white to-brand-bg-light p-8 rounded-3xl border border-brand-border-light">
                  <span className="text-4xl font-extrabold text-brand-orange">{p.step}</span>
                  <h3 className="text-xl font-bold text-brand-navy mt-4 mb-3">{p.title}</h3>
                  <p className="text-brand-text-muted font-light leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Deliverables + Industries */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
            <div className="pm-reveal bg-white p-10 rounded-3xl border border-brand-border-light shadow-sm">
              <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-8">What you get every month</h2>
              <ul className="flex flex-col gap-4">
                {deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-brand-text-body">
                    <span className="mt-1 w-5 h-5 shrink-0 rounded-full bg-brand-orange text-white text-xs flex items-center justify-center" aria-hidden="true">✓</span>
                    <span className="font-light leading-relaxed">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pm-reveal bg-brand-navy p-10 rounded-3xl shadow-sm">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Industries we grow</h2>
              <p className="text-gray-300 font-light mb-8">Campaign playbooks built for how customers in Bihar and North India actually search and buy.</p>
              <div className="flex flex-wrap gap-3">
                {industries.map((i) => (
                  <span key={i} className="px-4 py-2 rounded-full border border-white/20 text-white text-sm font-semibold">{i}</span>
                ))}
              </div>
              <Link to="/industries" className="inline-flex items-center mt-8 text-brand-orange font-bold hover:translate-x-1 transition-transform">
                Explore industries &rarr;
              </Link>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-24 max-w-4xl">
            <h2 className="pm-reveal text-3xl md:text-4xl font-bold text-brand-navy mb-10">Frequently asked questions</h2>
            <div className="flex flex-col gap-4">
              {faqs.map((f) => (
                <details key={f.q} className="pm-reveal group bg-white rounded-2xl border border-brand-border-light p-6 open:border-brand-orange transition-colors">
                  <summary className="cursor-pointer list-none flex justify-between items-center gap-4 text-lg font-bold text-brand-navy">
                    {f.q}
                    <span className="text-brand-orange text-2xl transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-4 text-brand-text-muted font-light leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
            <p className="mt-8 text-brand-text-muted">
              Want to learn more first? Read our guide on{' '}
              <Link to="/blog/maximizing-roi-meta-ads" className="text-brand-orange font-semibold hover:underline">maximizing ROI with Meta Ads</Link>.
            </p>
          </section>

          {/* CTA */}
          <div className="bg-brand-navy rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Find out where your ad budget is leaking.</h2>
              <p className="text-xl text-gray-300 font-light mb-10 max-w-2xl mx-auto">
                Get a free audit of your Meta or Google Ads account with clear, practical fixes. No obligation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={openStrategyModal}
                  className="px-10 py-5 bg-brand-orange text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:text-brand-orange transition-all duration-300 shadow-xl hover:-translate-y-1"
                >
                  Claim Free Audit
                </button>
                <Link
                  to="/contact"
                  className="px-10 py-5 border border-white/30 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:text-brand-navy transition-all duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
