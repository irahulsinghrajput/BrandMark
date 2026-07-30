import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../contexts/ModalContext';

export const TalkToMark = () => {
  const { isTalkToMarkOpen, closeTalkToMark } = useModal();

  return (
    <AnimatePresence>
      {isTalkToMarkOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTalkToMark}
            className="absolute inset-0 bg-brand-navy/40 backdrop-blur-sm cursor-pointer"
          ></motion.div>

          {/* Slide-out Panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-md bg-white h-full shadow-2xl relative z-10 flex flex-col"
          >
            <div className="p-6 border-b border-brand-border-light flex justify-between items-center bg-brand-bg-light">
              <h2 className="text-xl font-bold text-brand-navy">Talk to Mark</h2>
              <button 
                onClick={closeTalkToMark}
                className="w-8 h-8 rounded-full bg-white border border-brand-border-light flex items-center justify-center hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-brand-navy mx-auto mb-4 overflow-hidden border-4 border-brand-orange/20">
                  <img src="/Rahul picture.jpeg" alt="Mark" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-bold text-brand-navy mb-1">Rahul "Mark" Rajput</h3>
                <p className="text-brand-text-muted text-sm">Founder & Lead Strategist</p>
              </div>

              <p className="text-brand-text-body text-center mb-10 font-light">
                Ready to scale your brand globally? Connect with me directly to discuss your digital infrastructure and growth goals.
              </p>

              <div className="space-y-4">
                <a 
                  href="https://wa.me/917091863003?text=Hi%20Mark,%20I%20would%20like%20to%20discuss%20my%20brand's%20growth." 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1EBE5D] transition-colors flex items-center justify-center gap-3 shadow-md"
                >
                  <i className="fa-brands fa-whatsapp text-xl"></i>
                  Chat on WhatsApp
                </a>

                <a 
                  href="mailto:kumarrahul85181@gmail.com"
                  className="w-full py-4 bg-brand-navy text-white font-bold rounded-xl hover:bg-brand-navy-dark transition-colors flex items-center justify-center gap-3 shadow-md"
                >
                  <i className="fa-regular fa-envelope text-xl"></i>
                  Email Directly
                </a>

                <button 
                  className="w-full py-4 bg-white border-2 border-brand-orange text-brand-orange font-bold rounded-xl hover:bg-brand-orange hover:text-white transition-colors flex items-center justify-center gap-3 shadow-sm group"
                  onClick={() => alert("Calendly widget would open here.")}
                >
                  <i className="fa-regular fa-calendar group-hover:text-white text-xl"></i>
                  Schedule 1-on-1 Call
                </button>
              </div>

              <div className="mt-12 p-6 bg-brand-bg-light rounded-2xl border border-brand-border-light">
                <h4 className="font-bold text-brand-navy mb-2 text-sm">Response Times:</h4>
                <ul className="text-sm text-brand-text-muted space-y-2">
                  <li className="flex justify-between"><span>WhatsApp:</span> <span className="font-medium">Within 2 hours</span></li>
                  <li className="flex justify-between"><span>Email:</span> <span className="font-medium">Same business day</span></li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
