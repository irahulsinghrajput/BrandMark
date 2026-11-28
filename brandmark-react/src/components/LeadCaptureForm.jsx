import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '../config';

// Keep in sync with CONSENT_TEXT in backend/routes/leads.js
const CONSENT_TEXT = 'I agree that BrandMark Solutions may store these details and contact me by email, phone or WhatsApp about my enquiry.';

export const LeadCaptureForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    contact_name: '',
    email: '',
    phone: '',
    company_name: '',
    website: '',
    city: '',
    budget: '',
    services: [],
    consent: false,
    source: 'Website contact page'
  });

  const servicesList = [
    'Website Development',
    'SEO / Local SEO',
    'Performance Marketing (Ads)',
    'UI/UX Design',
    'Branding & Logo',
    'Social Media Management',
    'AI Automation (BM-OS)'
  ];

  const handleServiceToggle = (service) => {
    setFormData(prev => {
      if (prev.services.includes(service)) {
        return { ...prev, services: prev.services.filter(s => s !== service) };
      }
      return { ...prev, services: [...prev.services, service] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Saved on our own server first; the server hands it to the n8n automation.
      const response = await apiFetch('/leads/strategy', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      let data = {};
      try { data = await response.json(); } catch { /* non-JSON error page */ }

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Sorry, we could not send your request. Please try again or call +91 709 186 3003.');
      }

      setIsSuccess(true);
      toast.success('Thank you! A strategist will contact you within one working day.');
    } catch (error) {
      console.error(error);
      toast.error(error.message && !/fetch/i.test(error.message)
        ? error.message
        : 'Could not reach our server. Please try again or call +91 709 186 3003.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-xl max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-3xl font-extrabold text-brand-navy mb-4">Request Received!</h3>
        <p className="text-gray-600 text-lg mb-8">
          We have your details. A strategist will contact you within one working day with a tailored approach.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="text-brand-orange font-bold hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-xl max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-brand-navy mb-4">Accelerate Your Growth</h2>
        <p className="text-gray-600">Provide a few details below, and our autonomous systems will prepare a tailored strategy for your business.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Full Name *</label>
            <input 
              required
              type="text" 
              value={formData.contact_name}
              onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-brand-navy placeholder:text-gray-400"
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Work Email *</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-brand-navy placeholder:text-gray-400"
              placeholder="john@company.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="lead-phone" className="text-sm font-bold text-gray-700">Phone / WhatsApp</label>
            <input
              id="lead-phone"
              type="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-brand-navy placeholder:text-gray-400"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        {/* Company Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Company Name *</label>
            <input 
              required
              type="text" 
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-brand-navy placeholder:text-gray-400"
              placeholder="Your Business Ltd."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Website URL</label>
            <input 
              type="url" 
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-brand-navy placeholder:text-gray-400"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        {/* Location & Budget */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Target City / Region *</label>
            <input 
              required
              type="text" 
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-brand-navy placeholder:text-gray-400"
              placeholder="e.g. Patna, Bihar"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Monthly Budget (INR) *</label>
            <select 
              required
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-brand-navy"
            >
              <option value="">Select a budget range</option>
              <option value="< 20,000">Less than ₹20,000</option>
              <option value="20,000 - 50,000">₹20,000 - ₹50,000</option>
              <option value="50,000 - 1,00,000">₹50,000 - ₹1,00,000</option>
              <option value="1,00,000+">₹1,00,000+</option>
            </select>
          </div>
        </div>

        {/* Services Needed */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 block">Services Interested In *</label>
          <div className="flex flex-wrap gap-3">
            {servicesList.map(service => (
              <button
                type="button"
                key={service}
                onClick={() => handleServiceToggle(service)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                  formData.services.includes(service)
                    ? 'bg-brand-orange border-brand-orange text-white shadow-md shadow-brand-orange/20'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-brand-orange/50 hover:bg-orange-50'
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        {/* Consent (required) */}
        <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={formData.consent}
            onChange={(e) => setFormData({...formData, consent: e.target.checked})}
            className="mt-1 h-5 w-5 rounded border-gray-300 accent-brand-orange"
          />
          <span>{CONSENT_TEXT} <a href="/privacy-policy" className="text-brand-orange font-semibold hover:underline">Privacy policy</a></span>
        </label>

        {/* Submit */}
        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || formData.services.length === 0 || !formData.consent}
            className={`inline-flex items-center justify-center px-10 py-5 rounded-full font-bold text-lg transition-all ${
              isSubmitting || formData.services.length === 0 || !formData.consent
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-brand-navy text-white hover:bg-brand-orange hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-orange/30'
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Request Strategy Outline'}
            {!isSubmitting && <Send className="w-5 h-5 ml-3" />}
          </button>
        </div>
      </form>
    </div>
  );
};
