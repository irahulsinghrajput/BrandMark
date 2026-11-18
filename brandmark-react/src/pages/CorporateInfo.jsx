import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Building2, MapPin, Users, FileCheck2, ExternalLink, ChevronDown, Mail, Phone } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { SEO } from '../components/SEO';

const CORPORATE_FAQS = [
  {
    question: "Is BrandMark Solutions a registered Private Limited company?",
    answer: "Yes. BrandMark Solutions is officially incorporated as BrandMark Media Solutions Private Limited under the Companies Act, 2013 (Ministry of Corporate Affairs, Government of India), classified as a Private Limited company limited by shares."
  },
  {
    question: "What is the CIN of BrandMark Media Solutions Private Limited?",
    answer: "The Corporate Identity Number (CIN) of BrandMark Media Solutions Private Limited is U62011BR2026PTC089491, registered with the Registrar of Companies (ROC Patna) on 13 November 2026."
  },
  {
    question: "Who are the Directors of BrandMark Media Solutions Private Limited?",
    answer: "The Board of Directors and Promoters of BrandMark Media Solutions Private Limited are Rajeshree Shekhar (DIN: 12047793) and Rahul Kumar (DIN: 12047794)."
  },
  {
    question: "Where is the registered office of BrandMark Solutions Private Limited located?",
    answer: "The registered office is located at 400 pat, Gangotri Sadan, Buddha Colony, Patna G.P.O., Phulwari, Patna, Bihar - 800001, India."
  },
  {
    question: "How can I verify BrandMark Media Solutions Private Limited's MCA registration?",
    answer: "Anyone can independently verify our active corporate status on the official Ministry of Corporate Affairs portal (mca.gov.in) under MCA Services > Company Master Data by searching CIN U62011BR2026PTC089491 or company name BRANDMARK MEDIA SOLUTIONS PRIVATE LIMITED."
  }
];

export const CorporateInfo = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": CORPORATE_FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
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
        "name": "Corporate Information",
        "item": "https://www.brandmarksolutions.site/corporate-info"
      }
    ]
  };

  const companyDetails = [
    { label: "Registered Legal Name", value: "BRANDMARK MEDIA SOLUTIONS PRIVATE LIMITED" },
    { label: "Brand / Trading Name", value: "BrandMark Solutions" },
    { label: "Corporate Identity Number (CIN)", value: "U62011BR2026PTC089491", mono: true },
    { label: "Registration Number", value: "089491", mono: true },
    { label: "Date of Incorporation", value: "13 November 2026" },
    { label: "Company Status", value: "Active", badge: true },
    { label: "Class & Category", value: "Private Limited Company (Limited by Shares, Non-Government)" },
    { label: "Registrar of Companies (ROC)", value: "ROC Patna (Eastern Region Directorate, RD Kolkata)" },
    { label: "Registered Office Address", value: "400 pat, Gangotri Sadan, Buddha Colony, Patna G.P.O., Phulwari, Patna, Bihar - 800001, India" }
  ];

  const directors = [
    {
      name: "Rajeshree Shekhar",
      designation: "Director & Promoter",
      din: "12047793",
      appointed: "13/11/2026"
    },
    {
      name: "Rahul Kumar",
      designation: "Director & Promoter",
      din: "12047794",
      appointed: "13/11/2026"
    }
  ];

  return (
    <PageTransition>
      <SEO
        title="Corporate Information & MCA Registration | BrandMark Media Solutions Private Limited"
        description="Official MCA registration details, CIN U62011BR2026PTC089491, Board of Directors, and registered office of BrandMark Media Solutions Private Limited (BrandMark Solutions), ROC Patna."
        keywords="BrandMark Media Solutions Private Limited CIN, BrandMark Solutions Private Limited registration, U62011BR2026PTC089491, BrandMark MCA details, BrandMark ROC Patna, Rajeshree Shekhar Director, Rahul Kumar Director"
        canonicalUrl="https://www.brandmarksolutions.site/corporate-info"
        schema={[faqSchema, breadcrumbSchema]}
      />

      <div className="bg-brand-bg-light min-h-screen pt-28 pb-24 font-outfit">
        <div className="max-w-5xl mx-auto px-6">

          {/* Hero Badge & Title */}
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              MCA Registered Private Limited Company
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy tracking-tight mb-4">
              Corporate Information &amp; Verification
            </h1>
            <p className="text-base sm:text-lg text-brand-text-muted max-w-3xl mx-auto leading-relaxed">
              Official statutory details for <strong className="text-brand-navy">BrandMark Media Solutions Private Limited</strong> (trading as <strong className="text-brand-navy">BrandMark Solutions</strong>), incorporated under the Companies Act, 2013, Ministry of Corporate Affairs, Government of India.
            </p>
          </div>

          {/* Primary Registration Table Card */}
          <section className="bg-white rounded-3xl shadow-sm border border-brand-border-light overflow-hidden mb-10">
            <div className="bg-brand-navy text-white px-6 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-brand-orange" />
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">MCA Master Data Summary</h2>
                  <p className="text-xs text-slate-300">Ministry of Corporate Affairs — Central Registration Centre &amp; ROC Patna</p>
                </div>
              </div>
              <a
                href="https://www.mca.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-brand-orange text-white px-3.5 py-2 rounded-xl transition-colors"
              >
                Verify on MCA.gov.in
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="divide-y divide-slate-100">
              {companyDetails.map((item, idx) => (
                <div key={idx} className="px-6 sm:px-8 py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-semibold text-slate-500">{item.label}</div>
                  <div className="sm:col-span-2 text-sm sm:text-base font-bold text-brand-navy flex items-center gap-2 flex-wrap">
                    {item.badge ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        {item.value}
                      </span>
                    ) : (
                      <span className={item.mono ? "font-mono tracking-wide text-brand-orange" : ""}>
                        {item.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Board of Directors & Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
            {/* Directors */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-brand-border-light">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-brand-orange" />
                </div>
                <h2 className="text-xl font-bold text-brand-navy">Board of Directors</h2>
              </div>
              <div className="space-y-4">
                {directors.map((dir, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-brand-bg-light border border-slate-200/70">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="text-base font-bold text-brand-navy">{dir.name}</h3>
                      <span className="text-xs font-mono font-semibold text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded-md">
                        DIN: {dir.din}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{dir.designation}</p>
                    <p className="text-xs text-slate-400 mt-1">Date of Appointment: {dir.appointed}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Official Communication & Compliance */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-brand-border-light flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-navy/10 flex items-center justify-center">
                    <FileCheck2 className="w-5 h-5 text-brand-navy" />
                  </div>
                  <h2 className="text-xl font-bold text-brand-navy">Official Communication</h2>
                </div>
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-brand-orange mt-1 flex-shrink-0" />
                    <span>400 pat, Gangotri Sadan, Buddha Colony, Patna G.P.O., Phulwari, Patna, Bihar - 800001, India</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-brand-orange flex-shrink-0" />
                    <a href="mailto:contact@brandmarksolutions.site" className="font-semibold text-brand-navy hover:text-brand-orange transition-colors">
                      contact@brandmarksolutions.site
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-brand-orange flex-shrink-0" />
                    <a href="tel:+917091863003" className="font-semibold text-brand-navy hover:text-brand-orange transition-colors">
                      +91 70918 63003
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap gap-3">
                <Link to="/privacy-policy" className="text-xs font-semibold text-brand-navy hover:text-brand-orange underline">
                  Privacy Policy
                </Link>
                <span className="text-slate-300">•</span>
                <Link to="/terms-of-service" className="text-xs font-semibold text-brand-navy hover:text-brand-orange underline">
                  Terms of Service
                </Link>
                <span className="text-slate-300">•</span>
                <Link to="/contact" className="text-xs font-semibold text-brand-orange hover:underline">
                  Contact Office →
                </Link>
              </div>
            </section>
          </div>

          {/* Corporate Verification FAQs (Visible + FAQPage Schema) */}
          <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-brand-border-light">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-brand-text-muted mb-8">
              Quick answers about BrandMark Media Solutions Private Limited&apos;s registration, directors, and legal verification.
            </p>
            <div className="space-y-3">
              {CORPORATE_FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span className="font-bold text-brand-navy text-sm sm:text-base">{faq.question}</span>
                      <ChevronDown className={`w-5 h-5 text-brand-orange flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 py-4 text-sm sm:text-base text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </div>
    </PageTransition>
  );
};

