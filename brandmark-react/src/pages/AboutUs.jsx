import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageTransition } from '../components/PageTransition';
import { SEO } from '../components/SEO';

gsap.registerPlugin(ScrollTrigger);

const ABOUT_CORPORATE_FAQS = [
  {
    question: "Is BrandMark Solutions a registered Private Limited company?",
    answer: "Yes. BrandMark Solutions is legally incorporated as BrandMark Media Solutions Private Limited under the Companies Act, 2013 (Ministry of Corporate Affairs, Government of India)."
  },
  {
    question: "What is the Corporate Identity Number (CIN) of BrandMark Media Solutions Private Limited?",
    answer: "The official CIN is U62011BR2026PTC089491, registered under ROC Patna on 13 November 2026."
  },
  {
    question: "Where is BrandMark Media Solutions Private Limited registered?",
    answer: "Our registered headquarters is at 400 pat, Gangotri Sadan, Buddha Colony, Patna G.P.O., Phulwari, Patna, Bihar - 800001, India."
  }
];

export const AboutUs = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const sections = gsap.utils.toArray('.fade-in-section');
    
    sections.forEach(section => {
      gsap.fromTo(section, 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
          }
        }
      );
    });
  }, []);

  return (
    <PageTransition>
      <SEO 
        title="About Us | BrandMark Media Solutions Private Limited"
        description="Learn about BrandMark Media Solutions Private Limited (BrandMark Solutions). Meet our leadership team and discover our mission in Patna, Bihar."
        keywords="BrandMark Solutions Private Limited, BrandMark Media Solutions Private Limited, BrandMark Solutions, BrandMark leadership, Rahul Kumar BrandMark, Rajeshree Shekhar BrandMark, BrandMark Patna"
        canonicalUrl="https://www.brandmarksolutions.site/about"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "mainEntity": {
              "@type": "Corporation",
              "name": "BrandMark Media Solutions Private Limited",
              "legalName": "BrandMark Media Solutions Private Limited",
              "alternateName": [
                "BrandMark Solutions Private Limited",
                "BrandMark Solutions",
                "BrandMark Media Solutions"
              ],
              "identifier": "U62011BR2026PTC089491",
              "taxID": "AAPCB3379M",
              "founder": [
                {
                  "@type": "Person",
                  "name": "Rahul Kumar",
                  "jobTitle": "Director & Promoter"
                },
                {
                  "@type": "Person",
                  "name": "Rajeshree Shekhar",
                  "jobTitle": "Director & Promoter"
                }
              ]
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": ABOUT_CORPORATE_FAQS.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.brandmarksolutions.site"
            }, {
              "@type": "ListItem",
              "position": 2,
              "name": "About Us",
              "item": "https://www.brandmarksolutions.site/about"
            }]
          }
        ]}
      />
      <div ref={containerRef} className="pt-20">
        
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-brand-bg-light">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-navy rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 text-center z-10 py-20 fade-in-section">
            <Link
              to="/corporate-info"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 hover:bg-emerald-100 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              MCA Registered Pvt. Ltd. • CIN: U62011BR2026PTC089491
            </Link>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-brand-navy">
              Brand Mark Solutions
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-brand-text-muted font-light">
              Building brands and growth systems for global markets — officially incorporated as <strong className="text-brand-navy font-semibold">BrandMark Media Solutions Private Limited</strong>.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-32 px-6 bg-white border-y border-brand-border-light">
          <div className="max-w-4xl mx-auto text-center fade-in-section">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 uppercase tracking-wide text-brand-navy">
              Our Mission
            </h2>
            <div className="w-16 h-1 bg-brand-orange mx-auto mb-12"></div>
            
            <p className="text-xl md:text-2xl mb-8 leading-relaxed font-light text-brand-text-body">
              At Brand Mark Solutions, we help ambitious businesses align brand, website, and marketing into one clear growth engine. Many companies struggle with fragmented execution; we solve this with integrated strategy and delivery.
            </p>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed font-light text-brand-text-muted">
              We partner with SMEs serving customers in the US, Europe, and Middle East to build market-ready brands, conversion-focused websites, and measurable demand generation systems. Our focus is practical execution that delivers sustainable business outcomes.
            </p>
            <div className="p-6 bg-brand-bg-light rounded-2xl border border-brand-orange/20 max-w-2xl mx-auto text-left sm:text-center">
              <span className="text-xs uppercase tracking-widest text-brand-orange font-bold block mb-1">Registered Entity Details</span>
              <p className="text-sm text-brand-navy font-semibold mb-3">
                BrandMark Solutions operates officially under <span className="font-extrabold text-brand-navy">BrandMark Media Solutions Private Limited</span> (CIN: <span className="font-mono">U62011BR2026PTC089491</span>), incorporated under the Companies Act, 2013, Ministry of Corporate Affairs, Government of India.
              </p>
              <Link to="/corporate-info" className="text-xs font-bold text-brand-orange hover:underline">
                View Full MCA Registration &amp; Verification Details →
              </Link>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-32 px-6 bg-brand-bg-card border-b border-brand-border-light font-outfit">
          <div className="max-w-7xl mx-auto fade-in-section">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B0F19] text-center mb-4 uppercase tracking-wide">
              Leadership & Team
            </h2>
            <div className="w-16 h-1 bg-[#F97316] mx-auto mb-20"></div>
            
            <div className="flex flex-wrap justify-center gap-10">
              {[
                { name: 'Rahul Singh Rajput', role: 'Chief Operational Officer', image: '/images/team/Rahul picture.jpeg' },
                { name: 'Rajeshree Shekhar', role: 'Chief UI/UX Specialist', image: '/images/team/Rajeshree_new.jpg' },
                { name: 'Lakshya', role: 'Director of Client Services', image: '/images/team/lakshya.png.png' },
                { name: 'Amisha Singh', role: 'Graphic Designer Specialist', image: '/images/team/amisha.jpg.png' },
                { name: 'Rishi Thakur', role: 'Production & Videography Specialist', image: '/images/team/Rishi.png' }
              ].map((member, i) => (
                <div key={i} className="group flex flex-col items-center text-center w-full sm:w-[calc(50%-1.25rem)] lg:w-[calc(25%-1.875rem)] max-w-sm">
                  <div className="w-full aspect-[4/5] mb-6 overflow-hidden rounded-2xl shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/400x500/0B0F19/FFFFFF?text=' + member.name.charAt(0)} 
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B0F19] mb-1">
                    {member.name}
                  </h3>
                  <span className="text-[#F97316] text-xs font-semibold uppercase tracking-widest">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Experience Section */}
        <section className="py-32 px-6 bg-brand-navy text-white">
          <div className="max-w-4xl mx-auto text-center fade-in-section">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-12 uppercase tracking-wide">
              Client Experience
            </h2>
            <div className="w-16 h-1 bg-brand-orange mx-auto mb-12"></div>
            
            <p className="text-2xl md:text-4xl font-light mb-12 leading-relaxed text-gray-200">
              "Our goal is simple: deliver work clients are proud to share and results they can clearly measure."
            </p>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed font-light">
              We prioritize clear communication, dependable delivery, and long-term partnerships built on trust and performance.
            </p>
            <p className="text-lg md:text-xl text-gray-500 italic font-light">
              Every project is handled with strategic thinking, creative precision, and accountability from start to finish.
            </p>
          </div>
        </section>

        {/* Corporate Verification FAQs */}
        <section className="py-24 px-6 bg-white border-t border-brand-border-light font-outfit">
          <div className="max-w-4xl mx-auto fade-in-section">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy text-center mb-4">
              Company Registration FAQs
            </h2>
            <p className="text-center text-brand-text-muted mb-12 text-sm sm:text-base">
              Verified corporate details for BrandMark Media Solutions Private Limited.
            </p>
            <div className="space-y-4">
              {ABOUT_CORPORATE_FAQS.map((faq, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-brand-bg-light border border-slate-200/80">
                  <h3 className="text-base sm:text-lg font-bold text-brand-navy mb-2">{faq.question}</h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/corporate-info"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-navy text-white text-sm font-bold hover:bg-brand-orange transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                View Official MCA Master Data &amp; Directors
              </Link>
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};
