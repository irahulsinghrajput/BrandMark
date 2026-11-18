import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { Hero } from '../components/Hero';
import { ServicesList } from '../components/ServicesList';
import { Testimonials } from '../components/Testimonials';
import { SEOAuditForm } from '../components/SEOAuditForm';
import { ContactForm } from '../components/ContactForm';
import { useLenis } from 'lenis/react';
import { SEO } from '../components/SEO';

const HOME_FAQS = [
  {
    question: "Is BrandMark Solutions a registered Private Limited company?",
    answer: "Yes. BrandMark Solutions is officially incorporated as BrandMark Media Solutions Private Limited under the Companies Act, 2013 (Ministry of Corporate Affairs, Government of India) with CIN U62011BR2026PTC089491."
  },
  {
    question: "What services does BrandMark Media Solutions Private Limited offer?",
    answer: "We specialize in custom website development, ROI-driven digital marketing, Local SEO, commercial photography, 4K videography, influencer marketing, brand identity, and AI automation for businesses in Patna, Bihar, India, and global markets."
  },
  {
    question: "Where is BrandMark Media Solutions Private Limited located?",
    answer: "Our registered corporate headquarters is located at 400 pat, Gangotri Sadan, Buddha Colony, Patna G.P.O., Phulwari, Patna, Bihar - 800001, India."
  }
];

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
        title="BrandMark Solutions | BrandMark Media Solutions Private Limited"
        description="Official site of BrandMark Media Solutions Private Limited (BrandMark Solutions). We engineer high-converting websites, ROI-driven digital marketing campaigns, and AI automation systems in Patna, Bihar & worldwide."
        keywords="BrandMark Solutions Private Limited, BrandMark Media Solutions Private Limited, BrandMark Solutions, BrandMark Media Solutions, Brandmark Media Solutions Pvt Ltd, BrandMark Solutions Pvt Ltd, BrandMark Patna, best digital marketing company in patna, website development in bihar, Patna branding agency"
        canonicalUrl="https://www.brandmarksolutions.site"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "BrandMark Solutions",
            "alternateName": [
              "BrandMark Media Solutions Private Limited",
              "BrandMark Solutions Private Limited"
            ],
            "url": "https://www.brandmarksolutions.site"
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": HOME_FAQS.map((faq) => ({
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
            }]
          }
        ]}
      />
      <div className="bg-brand-bg-light">
        <Hero />
        <ServicesList />
        <SEOAuditForm />
        <Testimonials />

        {/* Verified Private Limited Company Trust & FAQ Section */}
        <section className="py-20 px-6 bg-white border-y border-brand-border-light font-outfit">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  MCA Registered Private Limited Company
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                  About BrandMark Media Solutions Private Limited
                </h2>
              </div>
              <Link
                to="/corporate-info"
                className="text-sm font-bold text-brand-orange hover:text-brand-navy transition-colors whitespace-nowrap"
              >
                Verify MCA &amp; CIN Details →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {HOME_FAQS.map((faq, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-brand-bg-light border border-slate-200/70">
                  <h3 className="text-base font-bold text-brand-navy mb-2">{faq.question}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ContactForm />
      </div>
    </PageTransition>
  );
};
