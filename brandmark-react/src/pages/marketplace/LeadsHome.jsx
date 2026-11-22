import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Search, Lock, UserCheck } from 'lucide-react';
import { SEO } from '../../components/SEO';
import { Shell, Card } from './ui';

export const LeadsHome = () => (
  <>
    <SEO
      title="Find Trusted Local Businesses | BrandMark Connect"
      description="Tell us what service you need in Bihar. BrandMark shares your request, with your consent, with up to 4 verified local businesses who can help."
      canonicalUrl="https://www.brandmarksolutions.site/leads"
    />
    <Shell>
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 bg-brand-orange/10 text-brand-orange rounded-full text-sm font-bold uppercase tracking-wider mb-4 border border-brand-orange/20">
          BrandMark Connect
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-navy tracking-tight mb-4">
          The bridge between customers and local businesses
        </h1>
        <p className="text-lg text-brand-text-muted max-w-2xl mx-auto">
          Customers post what they need. Verified businesses in that category and city reach out.
          Every lead is shared only with the customer&apos;s permission.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card className="flex flex-col">
          <h2 className="text-2xl font-bold text-brand-navy mb-2">Need a service?</h2>
          <p className="text-brand-text-muted mb-6 flex-1">
            Describe your requirement once. Up to 4 verified businesses who offer it in your city can contact you.
            Free for customers. You can withdraw or delete your request at any time.
          </p>
          <Link to="/leads/post" className="self-start rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold px-6 py-3">
            Post your requirement
          </Link>
        </Card>
        <Card className="flex flex-col">
          <h2 className="text-2xl font-bold text-brand-navy mb-2">Run a business?</h2>
          <p className="text-brand-text-muted mb-6 flex-1">
            Register, choose your categories and cities, and browse real customer requests.
            Contact details unlock with credits once BrandMark verifies your business.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/business/signup" className="rounded-xl bg-brand-navy hover:bg-brand-navy-dark text-white font-semibold px-6 py-3">Register your business</Link>
            <Link to="/business/login" className="rounded-xl border border-brand-border-light bg-white text-brand-navy font-semibold px-6 py-3 hover:border-brand-orange">Log in</Link>
          </div>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ShieldCheck, t: 'Consent first', d: 'Customers tick a clear consent box. We record what they agreed to and when.' },
          { icon: UserCheck, t: 'Verified on both sides', d: 'Customer phones are verified by OTP. Businesses are checked by BrandMark.' },
          { icon: Lock, t: 'Masked until unlock', d: 'Businesses see the need, not the number, until they unlock the lead.' },
          { icon: Search, t: 'Limited sharing', d: 'Each request goes to at most 4 businesses, so customers are not flooded with calls.' }
        ].map(({ icon: Icon, t, d }) => (
          <Card key={t}>
            <Icon className="w-6 h-6 text-brand-orange mb-3" aria-hidden="true" />
            <h3 className="font-bold text-brand-navy mb-1">{t}</h3>
            <p className="text-sm text-brand-text-muted">{d}</p>
          </Card>
        ))}
      </div>
    </Shell>
  </>
);

export default LeadsHome;
