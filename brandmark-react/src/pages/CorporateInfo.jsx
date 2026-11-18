import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  Building2,
  MapPin,
  Users,
  FileCheck2,
  ExternalLink,
  ChevronDown,
  Mail,
  Phone,
  Copy,
  Check,
  Award,
  Landmark,
  CalendarCheck,
  Scale,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Globe2
} from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { SEO } from '../components/SEO';
import { useModal } from '../contexts/ModalContext';
import './CorporateInfo.css';

const CIN_NUMBER = 'U62011BR2026PTC089491';
const REGISTERED_ADDRESS = '400 pat, Gangotri Sadan, Buddha Colony, Patna G.P.O., Phulwari, Patna, Bihar - 800001, India';

const CIN_SEGMENTS = [
  {
    code: 'U',
    title: 'Listing Status',
    meaning: 'Unlisted Company',
    detail: 'Privately held entity not traded on public stock exchanges.'
  },
  {
    code: '62011',
    title: 'Industry NIC Code',
    meaning: 'IT, Software & Digital Services',
    detail: 'Computer programming, web engineering, digital & consultancy activities.'
  },
  {
    code: 'BR',
    title: 'State Code',
    meaning: 'Bihar, India',
    detail: 'Registered under the jurisdiction of the State of Bihar (ROC Patna).'
  },
  {
    code: '2026',
    title: 'Incorporation Year',
    meaning: 'Incorporated in 2026',
    detail: 'Certificate of Incorporation issued on 13 November 2026.'
  },
  {
    code: 'PTC',
    title: 'Company Ownership',
    meaning: 'Private Limited Company',
    detail: 'Officially designates a Private Company limited by shares under Companies Act, 2013.'
  },
  {
    code: '089491',
    title: 'ROC Registration No.',
    meaning: 'Unique Registrar Number',
    detail: 'Official registration sequence allotted by Registrar of Companies, Patna.'
  }
];

const CORPORATE_FAQS = [
  {
    question: 'Is BrandMark Solutions a registered Private Limited company?',
    answer:
      'Yes. BrandMark Solutions is officially incorporated as BrandMark Media Solutions Private Limited under the Companies Act, 2013 (Ministry of Corporate Affairs, Government of India), classified as a Private Limited company limited by shares.'
  },
  {
    question: 'What is the CIN of BrandMark Media Solutions Private Limited?',
    answer:
      'The Corporate Identity Number (CIN) of BrandMark Media Solutions Private Limited is U62011BR2026PTC089491, registered with the Registrar of Companies (ROC Patna) on 13 November 2026.'
  },
  {
    question: 'Who are the Directors of BrandMark Media Solutions Private Limited?',
    answer:
      'The Board of Directors and Promoters of BrandMark Media Solutions Private Limited are Rajeshree Shekhar and Rahul Kumar.'
  },
  {
    question: 'Where is the registered office of BrandMark Solutions Private Limited located?',
    answer:
      'The registered office is located at 400 pat, Gangotri Sadan, Buddha Colony, Patna G.P.O., Phulwari, Patna, Bihar - 800001, India.'
  },
  {
    question: "How can I verify BrandMark Media Solutions Private Limited's MCA registration?",
    answer:
      'Anyone can independently verify our active corporate status on the official Ministry of Corporate Affairs portal (mca.gov.in) under MCA Services > Company Master Data by searching CIN U62011BR2026PTC089491 or company name BRANDMARK MEDIA SOLUTIONS PRIVATE LIMITED.'
  }
];

const DIRECTORS = [
  {
    name: 'Rajeshree Shekhar',
    designation: 'Director & Promoter',
    executiveRole: 'Chief UI/UX Specialist',
    appointed: '13 November 2026',
    signatory: 'Authorized Signatory',
    image: '/images/team/Rajeshree_new.jpg',
    bio: 'Leads brand architecture, design systems, and executive governance for BrandMark Media Solutions Private Limited.'
  },
  {
    name: 'Rahul Kumar',
    designation: 'Director & Promoter',
    executiveRole: 'Chief Operational Officer',
    appointed: '13 November 2026',
    signatory: 'Authorized Signatory',
    image: '/images/team/Rahul picture.jpeg',
    bio: 'Oversees enterprise operations, digital growth engineering, statutory compliance, and strategic client partnerships.'
  }
];

const VERIFICATION_STEPS = [
  {
    step: '01',
    title: 'Copy Our Official CIN',
    desc: 'Click the one-click copy button to copy U62011BR2026PTC089491 to your clipboard.'
  },
  {
    step: '02',
    title: 'Visit MCA Master Data Portal',
    desc: 'Open mca.gov.in and navigate to MCA Services → Master Data → View Company / LLP Master Data.'
  },
  {
    step: '03',
    title: 'Confirm Active Status',
    desc: 'Paste the CIN or search "BRANDMARK MEDIA SOLUTIONS PRIVATE LIMITED" to inspect our live government record.'
  }
];

const COMPLIANCE_PILLARS = [
  {
    icon: Scale,
    title: 'Companies Act, 2013 Governance',
    desc: 'Incorporated with full legal standing as a separate corporate entity under the Ministry of Corporate Affairs, Government of India.'
  },
  {
    icon: FileCheck2,
    title: 'Enterprise & Tender Ready',
    desc: 'Structured for formal corporate agreements, B2B vendor onboarding, transparent statutory invoicing, and public-sector engagements.'
  },
  {
    icon: Landmark,
    title: 'Verified Physical Headquarters',
    desc: 'Registered corporate office at Gangotri Sadan, Buddha Colony, Patna — verifiable across MCA records and local statutory registries.'
  },
  {
    icon: ShieldCheck,
    title: 'Data & Contractual Accountability',
    desc: 'Backed by published Privacy Policy, Terms of Service, and clear Indian judicial governance under Patna, Bihar jurisdiction.'
  }
];

const TABS = [
  { id: 'master-data', label: 'MCA Master Data', icon: Building2 },
  { id: 'leadership', label: 'Board of Directors', icon: Users },
  { id: 'verify', label: 'Verify on MCA.gov.in', icon: ShieldCheck }
];

export const CorporateInfo = () => {
  const { openStrategyModal } = useModal();
  const [activeTab, setActiveTab] = useState('master-data');
  const [activeCinIndex, setActiveCinIndex] = useState(4); // Default highlight "PTC" (Private Limited)
  const [openFaq, setOpenFaq] = useState(0);
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (value, key, label) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(value);
      setCopiedField(key);
      toast.success(`${label} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2200);
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CORPORATE_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.brandmarksolutions.site'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Corporate Information',
        item: 'https://www.brandmarksolutions.site/corporate-info'
      }
    ]
  };

  const selectedSegment = CIN_SEGMENTS[activeCinIndex];

  return (
    <PageTransition>
      <SEO
        title="Corporate Information & MCA Registration | BrandMark Media Solutions Private Limited"
        description="Official MCA registration details, CIN U62011BR2026PTC089491, Board of Directors, and registered office of BrandMark Media Solutions Private Limited (BrandMark Solutions), ROC Patna."
        keywords="BrandMark Media Solutions Private Limited CIN, BrandMark Solutions Private Limited registration, U62011BR2026PTC089491, BrandMark MCA details, BrandMark ROC Patna, Rajeshree Shekhar Director, Rahul Kumar Director"
        canonicalUrl="https://www.brandmarksolutions.site/corporate-info"
        schema={[faqSchema, breadcrumbSchema]}
      />

      <div className="bg-brand-bg-light min-h-screen font-outfit">
        {/* ======================== 1. EXECUTIVE DARK NAVY HERO ======================== */}
        <section className="corp-hero pt-32 pb-28 sm:pt-36 sm:pb-32 px-6 text-white">
          <div className="corp-blueprint-grid" />

          <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Editorial Headline & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-emerald-300 mb-6">
                <span className="corp-beacon">
                  <span className="corp-beacon-ring" />
                  <span className="corp-beacon-dot" />
                </span>
                Ministry of Corporate Affairs • Active Entity
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-5">
                BrandMark Media Solutions{' '}
                <span className="corp-gradient-text block sm:inline">Private Limited.</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8 font-light">
                Official Corporate Governance &amp; MCA Verification Hub for{' '}
                <strong className="text-white font-semibold">BrandMark Solutions</strong>. Incorporated under the
                Companies Act, 2013 (Registrar of Companies, Patna) as a Private Limited Company limited by shares.
              </p>

              {/* Interactive Action Bar */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleCopy(CIN_NUMBER, 'hero-cin', 'CIN Number')}
                  className="inline-flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all cursor-pointer group"
                >
                  <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">CIN</span>
                  <span className="font-mono text-sm sm:text-base font-bold tracking-wider text-white">
                    {CIN_NUMBER}
                  </span>
                  {copiedField === 'hero-cin' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-brand-orange group-hover:scale-110 transition-transform" />
                  )}
                </button>

                <a
                  href="https://www.mca.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white text-sm font-bold tracking-wide shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5"
                >
                  Verify on MCA.gov.in
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Right Column: Glassmorphic 3D Corporate Credential Card */}
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              <div className="corp-credential-card rounded-3xl p-6 sm:p-8 text-white">
                {/* Card Header */}
                <div className="flex items-center justify-between gap-4 pb-6 mb-6 border-b border-white/15">
                  <div className="flex items-center gap-3">
                    <img
                      src="/brandmark-logo-new.png.webp"
                      alt="BrandMark Media Solutions Private Limited Logo"
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-orange/60"
                    />
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-slate-300 font-semibold">
                        Certificate of Incorporation
                      </p>
                      <p className="text-sm font-extrabold tracking-tight text-white">
                        Companies Act, 2013
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active
                  </span>
                </div>

                {/* Card Body Details */}
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">
                      Registered Legal Name
                    </p>
                    <p className="text-base sm:text-lg font-extrabold tracking-tight text-white leading-snug">
                      BRANDMARK MEDIA SOLUTIONS PRIVATE LIMITED
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">
                        Incorporated
                      </p>
                      <p className="text-sm font-bold text-white">13 Nov 2026</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">
                        Registrar (ROC)
                      </p>
                      <p className="text-sm font-bold text-white">ROC Patna</p>
                    </div>
                  </div>
                </div>

                {/* Monospace CIN Footer Plate */}
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400">
                      Corporate Identity Number
                    </p>
                    <p className="font-mono text-sm sm:text-base font-bold text-brand-orange tracking-wider">
                      {CIN_NUMBER}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(CIN_NUMBER, 'card-cin', 'CIN Number')}
                    title="Copy CIN"
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-brand-orange text-white transition-colors cursor-pointer"
                  >
                    {copiedField === 'card-cin' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ======================== 2. OVERLAPPING TRUST KPI STRIP ======================== */}
        <section className="relative z-20 max-w-7xl mx-auto px-6 -mt-12 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: ShieldCheck,
                label: 'Company Status',
                value: 'Active & Compliant',
                sub: 'Verified on MCA Portal',
                accent: 'text-emerald-600 bg-emerald-50'
              },
              {
                icon: CalendarCheck,
                label: 'Date of Incorporation',
                value: '13 November 2026',
                sub: 'Central Registration Centre',
                accent: 'text-brand-orange bg-brand-orange/10'
              },
              {
                icon: Landmark,
                label: 'Jurisdiction',
                value: 'ROC Patna',
                sub: 'RD Kolkata • Eastern Region',
                accent: 'text-brand-navy bg-brand-navy/10'
              },
              {
                icon: Award,
                label: 'Company Class',
                value: 'Private Limited',
                sub: 'Company Limited by Shares',
                accent: 'text-indigo-600 bg-indigo-50'
              }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + idx * 0.07 }}
                  className="corp-kpi-card rounded-2xl p-5 flex items-start gap-4"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                      {stat.label}
                    </p>
                    <p className="text-lg font-extrabold text-brand-navy leading-tight">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ======================== 3. INTERACTIVE TABBED GOVERNANCE HUB ======================== */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          {/* Animated Tab Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm max-w-2xl mx-auto mb-10">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                    isActive ? 'text-white' : 'text-slate-600 hover:text-brand-navy'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="corporateActiveTab"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 bg-brand-navy rounded-xl shadow-md"
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Animated Tab Content Panels */}
          <AnimatePresence mode="wait">
            {activeTab === 'master-data' && (
              <motion.div
                key="master-data"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Bento Grid: Identity + Jurisdiction */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Statutory Identity Card */}
                  <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
                    <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-navy text-white flex items-center justify-center">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-extrabold text-brand-navy">Statutory Entity Profile</h2>
                          <p className="text-xs text-slate-500">Official Registrar of Companies Master Record</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                        MCA Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: 'Registered Legal Name', value: 'BRANDMARK MEDIA SOLUTIONS PRIVATE LIMITED', full: true },
                        { label: 'Brand / Trading Name', value: 'BrandMark Solutions' },
                        { label: 'Registration Number', value: '089491', mono: true },
                        { label: 'Category of Company', value: 'Company Limited by Shares' },
                        { label: 'Sub-Category', value: 'Non-Government Company' },
                        { label: 'Class of Company', value: 'Private Limited' },
                        { label: 'Listed Status', value: 'Unlisted' }
                      ].map((row, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl bg-brand-bg-light/80 border border-slate-200/60 ${
                            row.full ? 'sm:col-span-2' : ''
                          }`}
                        >
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            {row.label}
                          </p>
                          <p
                            className={`text-sm sm:text-base font-extrabold text-brand-navy ${
                              row.mono ? 'font-mono text-brand-orange' : ''
                            }`}
                          >
                            {row.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Registered Headquarters & Direct Channels */}
                  <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                        <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-extrabold text-brand-navy">Registered Office</h2>
                          <p className="text-xs text-slate-500">ROC Patna • Eastern Region Directorate</p>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-navy to-[#0d3861] text-white mb-6">
                        <p className="text-[11px] uppercase tracking-widest text-slate-300 font-semibold mb-2">
                          Official Mailing &amp; Statutory Address
                        </p>
                        <p className="text-sm sm:text-base font-semibold leading-relaxed mb-4">
                          {REGISTERED_ADDRESS}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleCopy(REGISTERED_ADDRESS, 'address', 'Registered Address')}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-brand-orange text-xs font-bold transition-colors cursor-pointer"
                        >
                          {copiedField === 'address' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              Address Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy Registered Address
                            </>
                          )}
                        </button>
                      </div>

                      <div className="space-y-3">
                        <a
                          href="mailto:contact@brandmarksolutions.site"
                          className="flex items-center justify-between p-3.5 rounded-xl bg-brand-bg-light hover:bg-brand-orange/5 border border-slate-200/60 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-brand-orange" />
                            <span className="text-sm font-bold text-brand-navy">contact@brandmarksolutions.site</span>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-orange" />
                        </a>

                        <a
                          href="tel:+917091863003"
                          className="flex items-center justify-between p-3.5 rounded-xl bg-brand-bg-light hover:bg-brand-orange/5 border border-slate-200/60 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-brand-orange" />
                            <span className="text-sm font-bold text-brand-navy">+91 70918 63003</span>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-orange" />
                        </a>

                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-bg-light border border-slate-200/60">
                          <Globe2 className="w-4 h-4 text-brand-navy" />
                          <span className="text-sm font-bold text-brand-navy">www.brandmarksolutions.site</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                      <Link to="/privacy-policy" className="text-brand-navy hover:text-brand-orange transition-colors">
                        Privacy Policy
                      </Link>
                      <span className="text-slate-300">•</span>
                      <Link to="/terms-of-service" className="text-brand-navy hover:text-brand-orange transition-colors">
                        Terms of Service
                      </Link>
                      <span className="text-slate-300">•</span>
                      <Link to="/contact" className="text-brand-orange hover:underline">
                        Contact Office →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Interactive CIN Code Decoder Widget */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-orange mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Interactive Statutory Transparency
                      </span>
                      <h3 className="text-2xl font-extrabold text-brand-navy">
                        Decode Our 21-Digit Corporate Identity Number (CIN)
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Select any segment below to see how India&apos;s Ministry of Corporate Affairs certifies our Private Limited status.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(CIN_NUMBER, 'decoder-cin', 'CIN Number')}
                      className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-bg-light hover:bg-brand-navy hover:text-white text-brand-navy text-xs font-bold transition-colors cursor-pointer"
                    >
                      {copiedField === 'decoder-cin' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      Copy Full CIN
                    </button>
                  </div>

                  {/* Interactive Segment Pills */}
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
                    {CIN_SEGMENTS.map((seg, idx) => {
                      const isSelected = activeCinIndex === idx;
                      return (
                        <button
                          key={seg.code}
                          type="button"
                          onClick={() => setActiveCinIndex(idx)}
                          className={`corp-cin-segment px-4 sm:px-6 py-3.5 rounded-2xl font-mono text-lg sm:text-2xl font-black tracking-wider cursor-pointer ${
                            isSelected ? 'active' : 'bg-brand-bg-light text-brand-navy'
                          }`}
                        >
                          {seg.code}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Segment Explanation Box */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedSegment.code}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 rounded-2xl bg-gradient-to-r from-brand-bg-light to-white border border-brand-orange/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="px-4 py-2 rounded-xl bg-brand-navy text-brand-orange font-mono text-xl font-black">
                          {selectedSegment.code}
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                            {selectedSegment.title}
                          </p>
                          <p className="text-lg font-extrabold text-brand-navy">{selectedSegment.meaning}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 sm:max-w-md sm:text-right">{selectedSegment.detail}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {activeTab === 'leadership' && (
              <motion.div
                key="leadership"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
              >
                {DIRECTORS.map((dir, i) => (
                  <div key={i} className="corp-director-card rounded-3xl overflow-hidden flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-64 sm:h-auto overflow-hidden bg-brand-navy flex-shrink-0">
                      <img
                        src={dir.image}
                        alt={`${dir.name} — ${dir.designation} at BrandMark Media Solutions Private Limited`}
                        className="corp-director-photo w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-lg bg-brand-orange/10 text-brand-orange text-[11px] font-bold uppercase tracking-wider">
                            {dir.designation}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                            {dir.signatory}
                          </span>
                        </div>
                        <h3 className="text-2xl font-extrabold text-brand-navy mb-1">{dir.name}</h3>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                          {dir.executiveRole}
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed mb-5">{dir.bio}</p>
                      </div>
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Appointed</span>
                        <span className="font-bold text-brand-navy">{dir.appointed}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'verify' && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 max-w-5xl mx-auto"
              >
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
                    Independent Due Diligence
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-2 mb-3">
                    Verify Our Registration Directly on MCA.gov.in
                  </h2>
                  <p className="text-sm text-slate-500">
                    Clients, banks, and enterprise procurement teams can confirm our active status in under 30 seconds.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {VERIFICATION_STEPS.map((item) => (
                    <div key={item.step} className="p-6 rounded-2xl bg-brand-bg-light border border-slate-200/70">
                      <span className="inline-block font-mono text-2xl font-black text-brand-orange mb-3">
                        {item.step}
                      </span>
                      <h3 className="text-base font-extrabold text-brand-navy mb-2">{item.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleCopy(CIN_NUMBER, 'guide-cin', 'CIN Number')}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-bg-light hover:bg-slate-200 text-brand-navy text-sm font-bold transition-colors cursor-pointer"
                  >
                    {copiedField === 'guide-cin' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-brand-orange" />
                    )}
                    Copy CIN: {CIN_NUMBER}
                  </button>
                  <a
                    href="https://www.mca.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-navy hover:bg-brand-orange text-white text-sm font-bold transition-colors shadow-md"
                  >
                    Open Official MCA Portal
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ======================== 4. COMPLIANCE & GOVERNANCE PILLARS ======================== */}
        <section className="bg-white py-20 px-6 border-y border-slate-200/80 mb-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
                Why Corporate Status Matters
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mt-2 mb-3">
                Built for Enterprise Trust &amp; Accountability
              </h2>
              <p className="text-sm sm:text-base text-slate-500">
                Partnering with a registered Private Limited company ensures legal clarity, continuity, and institutional reliability.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {COMPLIANCE_PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-brand-bg-light/70 border border-slate-200/70 hover:border-brand-orange/40 transition-all hover:-translate-y-1"
                  >
                    <div className="w-11 h-11 rounded-xl bg-brand-navy text-white flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5 text-brand-orange" />
                    </div>
                    <h3 className="text-base font-extrabold text-brand-navy mb-2">{pillar.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ======================== 5. SMOOTH ACCORDION FAQ & EXECUTIVE CTA ======================== */}
        <section className="max-w-4xl mx-auto px-6 mb-20">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
              Verification FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mt-2 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Clear answers about BrandMark Media Solutions Private Limited&apos;s incorporation, directors, and legal verification.
            </p>
          </div>

          <div className="space-y-3">
            {CORPORATE_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-colors overflow-hidden bg-white ${
                    isOpen ? 'border-brand-orange/40 shadow-md shadow-brand-navy/5' : 'border-slate-200/80'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-bold text-brand-navy text-sm sm:text-base">{faq.question}</span>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        isOpen ? 'bg-brand-orange text-white' : 'bg-brand-bg-light text-brand-navy'
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Executive Vendor Onboarding CTA Banner */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="corp-hero rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="corp-blueprint-grid" />
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-2">
                  Enterprise Procurement &amp; Partnerships
                </p>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
                  Need Vendor Onboarding Documents or a Formal Proposal?
                </h2>
                <p className="text-slate-300 text-sm sm:text-base font-light">
                  Connect directly with our corporate desk at BrandMark Media Solutions Private Limited for NDA execution,
                  vendor registration packs, or enterprise growth retainers.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={openStrategyModal}
                  className="px-6 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white text-sm font-bold shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
                >
                  Book a Strategy Call
                </button>
                <Link
                  to="/contact"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold transition-colors"
                >
                  Contact Headquarters
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};
