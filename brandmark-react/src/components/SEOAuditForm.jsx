import React, { useState } from 'react';

export const SEOAuditForm = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <section className="py-24 bg-white border-y border-brand-border-light relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] bg-brand-orange rounded-full filter blur-3xl animate-pulse"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="max-w-lg">
            <span className="inline-block px-4 py-2 bg-brand-orange/10 text-brand-orange text-sm font-bold uppercase tracking-widest rounded-full mb-6">
              Free SEO Audit
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-navy mb-6 leading-tight">
              Get a Free SEO Audit for Your Global Website
            </h2>
            <p className="text-xl text-brand-text-muted font-light mb-8">
              We review your site and share a concise action plan to improve rankings and leads in your target regions.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-brand-text-body font-medium">
                <div className="w-8 h-8 rounded-full bg-brand-bg-light text-brand-orange flex items-center justify-center mr-4">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                Technical SEO check
              </li>
              <li className="flex items-center text-brand-text-body font-medium">
                <div className="w-8 h-8 rounded-full bg-brand-bg-light text-brand-orange flex items-center justify-center mr-4">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                Speed and Core Web Vitals
              </li>
              <li className="flex items-center text-brand-text-body font-medium">
                <div className="w-8 h-8 rounded-full bg-brand-bg-light text-brand-orange flex items-center justify-center mr-4">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                Indexing and metadata review
              </li>
            </ul>
            <p className="text-sm text-brand-text-muted italic">We respond within 24 business hours.</p>
          </div>

          <div className="bg-brand-bg-card p-8 md:p-12 rounded-3xl border border-brand-border-light shadow-xl">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-3xl font-bold text-brand-navy mb-4">Request Received!</h3>
                <p className="text-brand-text-muted">Our team will analyze your site and get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} action="mailto:kumarrahul85181@gmail.com" method="post" encType="text/plain" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-2">Full Name *</label>
                    <input type="text" required className="w-full px-5 py-4 rounded-xl border border-brand-border-light focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-2">Email *</label>
                    <input type="email" required className="w-full px-5 py-4 rounded-xl border border-brand-border-light focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all" placeholder="john@company.com" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-2">Phone</label>
                    <input type="tel" className="w-full px-5 py-4 rounded-xl border border-brand-border-light focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all" placeholder="+1 234 567 8900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-2">Website URL *</label>
                    <input type="url" required className="w-full px-5 py-4 rounded-xl border border-brand-border-light focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all" placeholder="https://yourwebsite.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-navy mb-2">Business Goals or Notes</label>
                  <textarea rows="4" className="w-full px-5 py-4 rounded-xl border border-brand-border-light focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all resize-none" placeholder="Tell us what you want to improve..."></textarea>
                </div>

                <button type="submit" disabled={loading} className="w-full py-5 bg-brand-navy text-white font-bold uppercase tracking-widest rounded-xl hover:bg-brand-orange transition-colors duration-300 shadow-md flex justify-center items-center">
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    "Request Free Audit"
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
