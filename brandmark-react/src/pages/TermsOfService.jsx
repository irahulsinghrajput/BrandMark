import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { SEO } from '../components/SEO';

export const TermsOfService = () => {
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
        "name": "Terms of Service",
        "item": "https://www.brandmarksolutions.site/terms-of-service"
      }
    ]
  };

  return (
    <PageTransition>
      <SEO
        title="Terms of Service | BrandMark Media Solutions Private Limited"
        description="Official Terms of Service governing website usage, agency services, web development, digital marketing, and courses provided by BrandMark Media Solutions Private Limited (CIN: U62011BR2026PTC089491)."
        keywords="BrandMark Solutions Private Limited Terms of Service, BrandMark Media Solutions Private Limited terms, agency contract terms Patna"
        canonicalUrl="https://www.brandmarksolutions.site/terms-of-service"
        schema={breadcrumbSchema}
      />

      <div className="bg-brand-bg-light min-h-screen pt-28 pb-24 font-outfit">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-brand-border-light">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-navy/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-brand-navy" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
                Legal Agreement
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mb-3">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-500 mb-8 pb-6 border-b border-slate-100">
              Effective Date: November 13, 2026 • Contracting Entity: <strong className="text-brand-navy">BrandMark Media Solutions Private Limited</strong> (CIN: U62011BR2026PTC089491)
            </p>

            <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
              <section>
                <h2 className="text-xl font-bold text-brand-navy mb-3">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using <strong>https://www.brandmarksolutions.site</strong> or engaging the services of <strong>BrandMark Media Solutions Private Limited</strong> (trading as <strong>BrandMark Solutions</strong>), you agree to be bound by these Terms of Service and all applicable laws of India.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-navy mb-3">2. Scope of Services</h2>
                <p>
                  BrandMark Media Solutions Private Limited provides digital marketing, SEO, custom website &amp; software development, brand identity design, commercial photography, videography, influencer campaigns, AI automation, and professional training courses. Specific deliverables, timelines, and pricing for client projects are governed by individual Statements of Work (SOW) or formal service proposals issued by the company.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-navy mb-3">3. Intellectual Property Rights</h2>
                <p>
                  All content on this website—including text, graphics, logos, code, case studies, and course materials—is the intellectual property of BrandMark Media Solutions Private Limited unless otherwise stated. Upon full payment of project invoices, ownership of final approved client deliverables transfers as specified in the respective client agreement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-navy mb-3">4. Payments, Invoices &amp; Taxes</h2>
                <p>
                  All fees quoted for agency engagements or educational enrollments are subject to applicable Indian taxes (including GST where applicable). Invoices are issued officially under BrandMark Media Solutions Private Limited and must be settled within the payment schedule outlined in the proposal or checkout terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-navy mb-3">5. Limitation of Liability</h2>
                <p>
                  While we apply industry-leading strategy and engineering standards, digital platforms (such as Google Search, Meta Ads, and third-party APIs) operate under independent algorithms and policies. BrandMark Media Solutions Private Limited shall not be liable for indirect, incidental, or consequential damages arising from third-party platform changes or outages.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-navy mb-3">6. Governing Law &amp; Jurisdiction</h2>
                <p>
                  These Terms of Service are governed by and construed in accordance with the laws of the Republic of India. Any disputes arising in connection with these terms or our services shall be subject to the exclusive jurisdiction of the competent courts in <strong>Patna, Bihar, India</strong>.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-brand-bg-light border border-slate-200/80">
                <h2 className="text-lg font-bold text-brand-navy mb-2">7. Company Details</h2>
                <p className="text-sm font-semibold text-brand-navy">
                  BrandMark Media Solutions Private Limited (CIN: U62011BR2026PTC089491)<br />
                  400 pat, Gangotri Sadan, Buddha Colony, Patna G.P.O., Phulwari, Patna, Bihar - 800001, India<br />
                  Email: <a href="mailto:contact@brandmarksolutions.site" className="text-brand-orange hover:underline">contact@brandmarksolutions.site</a> | Phone: <a href="tel:+917091863003" className="text-brand-orange hover:underline">+91 70918 63003</a>
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200 flex gap-4 text-xs font-semibold">
                  <Link to="/corporate-info" className="text-brand-navy hover:text-brand-orange underline">View MCA Corporate Details</Link>
                  <Link to="/privacy-policy" className="text-brand-navy hover:text-brand-orange underline">Privacy Policy</Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

