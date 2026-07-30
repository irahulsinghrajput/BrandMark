import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';

export const Certificate = ({ studentName, courseName, date }) => {
  const certificateRef = useRef(null);

  const downloadPDF = () => {
    const input = certificateRef.current;
    if (!input) return;

    html2canvas(input, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${studentName.replace(/\s+/g, '_')}_Certificate.pdf`);
    });
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        className="mb-8 w-full overflow-hidden rounded-lg shadow-2xl border border-brand-border-light"
      >
        <div 
          ref={certificateRef} 
          className="w-[800px] h-[565px] bg-white relative p-12 mx-auto flex flex-col justify-center items-center text-center font-sans border-[12px] border-[#0B2C4D]"
          style={{ backgroundImage: 'linear-gradient(to bottom right, #ffffff, #f0f4f8)' }}
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-brand-orange"></div>
          <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-brand-orange"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-brand-orange"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-brand-orange"></div>

          <img src="/logo.png" alt="BrandMark Solutions" className="h-16 mb-6 opacity-90" />
          
          <h1 className="text-5xl font-extrabold text-[#0B2C4D] tracking-widest uppercase mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Certificate of Completion
          </h1>
          
          <p className="text-lg text-gray-500 mb-6 italic">This is proudly presented to</p>
          
          <h2 className="text-4xl font-bold text-brand-orange mb-6 border-b-2 border-gray-200 pb-2 inline-block px-12">
            {studentName}
          </h2>
          
          <p className="text-lg text-gray-600 mb-2 max-w-lg">
            For successfully completing the comprehensive curriculum and demonstrating proficiency in:
          </p>
          
          <h3 className="text-2xl font-bold text-[#0B2C4D] mb-12">
            {courseName}
          </h3>
          
          <div className="flex justify-between w-full px-20 mt-auto">
            <div className="text-center">
              <div className="border-b border-gray-400 w-32 pb-1 mb-2 font-bold text-[#0B2C4D]">
                {date}
              </div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Date</p>
            </div>
            
            <div className="text-center">
              <div className="border-b border-gray-400 w-40 pb-1 mb-2">
                <img src="/signature.png" alt="Signature" className="h-8 mx-auto -mb-2 opacity-80" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Rahul "Mark" Rajput<br/>Lead Instructor</p>
            </div>
          </div>
        </div>
      </motion.div>

      <button 
        onClick={downloadPDF}
        className="px-8 py-4 bg-brand-orange text-white font-bold rounded-xl shadow-[0_0_20px_rgba(242,106,33,0.4)] hover:bg-brand-orange-dark hover:scale-105 transition-all flex items-center gap-3 text-lg"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        Download Official PDF
      </button>
    </div>
  );
};
