import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { SEO } from '../components/SEO';

export const PrivacyPolicy = () => {
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
        "name": "Privacy Policy",
        "item": "https://www.brandmarksolutions.site/privacy-policy"
      }
    ]
  };

  return (
    <PageTransition>
      <SEO
        title="Privacy Policy | BrandMark Media Solutions Private Limited"
        description="Official Privacy Policy of BrandMark Media Solutions Private Limited (BrandMark Solutions). Learn how we collect, protect, and manage your personal information."
        keywords="BrandMark Solutions Private Limited Privacy Policy, BrandMark Media Solutions Private Limited data protection, BrandMark privacy policy"
        canonicalUrl="https://www.brandmarksolutions.site/privacy-policy"
        schema={breadcrumbSchema}
      />

      <div className="bg-brand-bg-light min-h-screen pt-28 pb-24 font-outfit">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-brand-border-light">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-brand-orange" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
                Legal &amp; Compliance
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-500 mb-8 pb-6 border-b border-slate-100">
              Effective Date: November 13, 2026 • <strong className="text-brand-navy">BrandMark Media Solutions Private Limited</strong>
            </p>

            <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
              <section>
                <h2 className="text-xl font-bold text-brand-navy mb-3">1. Introduction</h2>
                <p>
                  <strong>BrandMark Media Solutions Private Limited</strong> (&ldquo;BrandMark Solutions&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to safeguarding the privacy of visitors, clients, and students using <strong>https://www.brandmarksolutions.site</strong>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-navy mb-3">2. Information We Collect</h2>
                <p className="mb-3">We may collect and process the following categories of information when you interact with our website, forms, or client/student portals:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Contact &amp; Inquiry Details:</strong> Name, business name, email address, phone number, website URL, and project requirements submitted via contact, SEO audit, or consultation forms.</li>
                  <li><strong>Enrollment &amp; Account Information:</strong> Student or client portal login details, course progress, and billing records for paid services or courses.</li>
                  <li><strong>Technical &amp; Usage Data:</strong> Browser type, device information, IP address, referring URLs, and interaction metrics collected via essential cookies and analytics tools.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-navy mb-3">3. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To respond to service inquiries, deliver proposals, and execute digital marketing, web development, media production, and consulting contracts.</li>
                  <li>To manage student course enrollments, issue verified completion certificates, and provide customer support.</li>
                  <li>To improve website performance, security, and user experience.</li>
                  <li>To comply with applicable Indian statutory and regulatory obligations under the Information Technology Act, 2000 and the Digital Personal Data Protection (DPDP) Act, 2023.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-navy mb-3">4. Data Sharing &amp; Security</h2>
                <p>
                  We do not sell, rent, or trade your personal information. Data is shared strictly on a need-to-know basis with trusted infrastructure providers (such as cloud hosting, payment gateways like Razorpay/Stripe, and communication services) bound by confidentiality obligations, or when required by law. We implement SSL encryption, role-based access controls, and secure storage to protect your data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-navy mb-3">5. Your Rights</h2>
                <p>
                  You have the right to request access to, correction of, or deletion of your personal data held by BrandMark Media Solutions Private Limited, and to withdraw consent for marketing communications at any time by contacting us.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-brand-bg-light border border-slate-200/80">
                <h2 className="text-lg font-bold text-brand-navy mb-2">6. Grievance Officer &amp; Corporate Contact</h2>
                <p className="text-sm text-slate-600 mb-3">
                  For any privacy inquiries, data correction requests, or grievances, please contact:
                </p>
                <p className="text-sm font-semibold text-brand-navy">
                  BrandMark Media Solutions Private Limited<br />
                  Patna, Bihar - 800001, India<br />
                  Email: <a href="mailto:contact@brandmarksolutions.site" className="text-brand-orange hover:underline">contact@brandmarksolutions.site</a><br />
                  Phone: <a href="tel:+917091863003" className="text-brand-orange hover:underline">+91 70918 63003</a>
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200 flex gap-4 text-xs font-semibold">
                  <Link to="/terms-of-service" className="text-brand-navy hover:text-brand-orange underline">Terms of Service</Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

