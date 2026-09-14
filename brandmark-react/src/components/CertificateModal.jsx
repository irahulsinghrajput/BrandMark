import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CertificateModal = ({ isOpen, onClose, userName, courseTitle }) => {
  if (!isOpen) return null;

  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const certificateId = `BM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-10 shadow-2xl relative border-4 border-double border-brand-orange/30 print:border-none print:shadow-none print:p-0"
        >
          {/* Close button (hidden on print) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-xl font-bold print:hidden"
          >
            &times;
          </button>

          {/* Certificate Frame */}
          <div className="border-8 border-brand-navy p-6 md:p-12 text-center rounded-2xl relative bg-gradient-to-b from-amber-50/20 via-white to-amber-50/10">
            
            {/* Top Emblem */}
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-brand-navy to-brand-orange rounded-full flex items-center justify-center text-white text-3xl shadow-lg border-2 border-white">
              🎓
            </div>

            <span className="text-xs uppercase tracking-[0.3em] font-extrabold text-brand-orange block mb-2">
              BrandMark Academy of Advanced Technology
            </span>

            <h1 className="text-2xl md:text-4xl font-black text-brand-navy tracking-tight mb-2 uppercase">
              Certificate of Mastery
            </h1>

            <p className="text-xs text-brand-text-muted italic mb-6">
              This is to officially certify that
            </p>

            {/* Student Name */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-orange border-b-2 border-brand-orange/40 inline-block px-8 pb-1 mb-6 font-serif">
              {userName || "Valued Student"}
            </h2>

            <p className="text-xs md:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed mb-8">
              has successfully completed all coursework, interactive labs, and practical examinations for the advanced professional masterclass:
            </p>

            {/* Course Title */}
            <div className="bg-brand-navy text-white py-3 px-6 rounded-xl inline-block font-extrabold text-sm md:text-base tracking-wide mb-8 shadow-md">
              {courseTitle || "Digital Marketing & AI Engineering"}
            </div>

            {/* Signatures & Metadata */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200 text-left">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Issue Date</span>
                <span className="text-xs font-bold text-brand-navy">{issueDate}</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold block mt-3">Verification ID</span>
                <span className="text-[11px] font-mono font-bold text-brand-orange">{certificateId}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Accreditation</span>
                <span className="text-xs font-bold text-brand-navy">BrandMark Global Standards</span>
                <div className="mt-2 text-[10px] text-green-600 font-bold flex items-center justify-end gap-1">
                  <span>✓</span> Cryptographically Verified
                </div>
              </div>
            </div>

          </div>

          {/* Action Buttons (hidden on print) */}
          <div className="mt-6 flex justify-end gap-3 print:hidden">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-brand-navy text-xs font-bold rounded-xl transition-all"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2.5 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              🖨️ Print / Download Certificate
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
