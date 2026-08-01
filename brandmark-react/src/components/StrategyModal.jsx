import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../contexts/ModalContext';
import { API_URL } from '../config';

export const StrategyModal = () => {
  const { isStrategyModalOpen, closeStrategyModal } = useModal();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    goal: 'lead-gen'
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
      const response = await fetch(`${API_URL}/quotes`, {
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

  const handleClose = () => {
    closeStrategyModal();
    setTimeout(() => {
      setSubmitted(false);
      setError(null);
      setFormData({ name: '', email: '', company: '', goal: 'lead-gen' });
    }, 500); // Reset after animation
  };

  return (
    <AnimatePresence>
      {isStrategyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-brand-navy/60 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
          >
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 w-10 h-10 bg-brand-bg-light rounded-full flex items-center justify-center text-brand-navy hover:bg-brand-orange hover:text-white transition-colors z-10"
            >
              &times;
            </button>

            <div className="grid grid-cols-1 md:grid-cols-5">
              
              {/* Left Side: Branding / Info */}
              <div className="bg-brand-navy p-8 md:col-span-2 text-white flex flex-col justify-between hidden md:flex relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange rounded-full filter blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 leading-tight">Scale Your Growth</h3>
                  <p className="text-gray-300 font-light text-sm mb-8">
                    Book a free 30-minute discovery call to map out your digital infrastructure and marketing funnel.
                  </p>
                  <ul className="space-y-4 text-sm font-light text-gray-300">
                    <li className="flex gap-2"><span className="text-brand-orange">✓</span> Website Audit</li>
                    <li className="flex gap-2"><span className="text-brand-orange">✓</span> SEO Strategy</li>
                    <li className="flex gap-2"><span className="text-brand-orange">✓</span> Actionable Roadmap</li>
                  </ul>
                </div>
                <div className="relative z-10">
                  <p className="text-xs text-gray-400">BrandMark Solutions Private Ltd.</p>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="p-8 md:p-10 md:col-span-3 bg-white relative">
                {submitted ? (
                   <div className="text-center py-16">
                     <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                       <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                     </div>
                     <h3 className="text-3xl font-bold text-brand-navy mb-2">Confirmed!</h3>
                     <p className="text-brand-text-muted">We will email you the meeting link shortly.</p>
                   </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-brand-navy mb-6 md:hidden">Book a Strategy Call</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-xs border border-red-100">
                          {error}
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-2">Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-brand-border-light focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all bg-brand-bg-light text-sm" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-2">Email *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-brand-border-light focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all bg-brand-bg-light text-sm" placeholder="john@example.com" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-2">Company / Website</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-brand-border-light focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all bg-brand-bg-light text-sm" placeholder="https://yourwebsite.com" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-2">Primary Goal</label>
                        <select name="goal" value={formData.goal} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-brand-border-light focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all bg-brand-bg-light text-sm text-brand-navy">
                          <option value="lead-gen">Lead Generation (PPC/Ads)</option>
                          <option value="web-dev">Web Development / Redesign</option>
                          <option value="seo">SEO & Organic Growth</option>
                          <option value="brand">Brand Identity</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <button type="submit" disabled={loading} className="w-full py-4 mt-2 bg-brand-orange text-white font-bold uppercase tracking-widest rounded-xl hover:bg-brand-orange-dark transition-colors duration-300 shadow-md flex justify-center items-center text-sm">
                        {loading ? (
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          "Book My Call"
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
