import React, { useState } from 'react';
import { API_URL } from '../config';

export const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-brand-bg-card relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-brand-navy">Let's Build Your Brand</h2>
          <p className="text-xl text-brand-text-muted font-light">
            Planning to grow in the US, Europe, or Middle East? Tell us your goals and we'll send a focused action plan.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-brand-border-light">
          {submitted ? (
             <div className="text-center py-12">
               <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                 <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
               </div>
               <h3 className="text-3xl font-bold text-brand-navy mb-4">Message Sent!</h3>
               <p className="text-brand-text-muted">We'll get back to you shortly.</p>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm mb-6 border border-red-100">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-navy mb-2">Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-5 py-4 rounded-xl border border-brand-border-light focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all bg-brand-bg-light" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-navy mb-2">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-5 py-4 rounded-xl border border-brand-border-light focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all bg-brand-bg-light" placeholder="john@example.com" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-brand-navy mb-2">Phone (Optional)</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-5 py-4 rounded-xl border border-brand-border-light focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all bg-brand-bg-light" placeholder="+91 1234567890" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-brand-navy mb-2">Subject (Optional)</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-5 py-4 rounded-xl border border-brand-border-light focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all bg-brand-bg-light" placeholder="What is this regarding?" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-navy mb-2">Message *</label>
                <textarea rows="4" name="message" value={formData.message} onChange={handleChange} required className="w-full px-5 py-4 rounded-xl border border-brand-border-light focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all bg-brand-bg-light resize-none" placeholder="Tell us about your project..."></textarea>
              </div>

              <button type="submit" disabled={loading} className="w-full py-5 bg-brand-orange text-white font-bold uppercase tracking-widest rounded-xl hover:bg-brand-orange-dark transition-colors duration-300 shadow-md flex justify-center items-center">
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
