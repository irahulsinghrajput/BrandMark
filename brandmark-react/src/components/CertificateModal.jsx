import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import brandmarkLogo from '../assets/brandmark-logo-transparent.png';

/**
 * High-precision Vector Ornamental Border SVG Frame
 * Faithfully matches the geometric corner brackets, heraldic shields,
 * side chevrons, and bottom BrandMark accent framing from Image 2.
 */
const CertificateBorderFrame = () => (
  <svg
    viewBox="0 0 1000 707"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 w-full h-full pointer-events-none select-none"
    preserveAspectRatio="none"
  >
    <defs>
      {/* Shield symbol reusable for the 4 corners */}
      <g id="cornerShield">
        <path
          d="M 0,-18 L 13,-18 C 13,-7 13,5 0,18 C -13,5 -13,-7 -13,-18 Z"
          fill="#0B2C4D"
          stroke="#F26A21"
          strokeWidth="2"
        />
        <path
          d="M 0,-14 L 9,-14 C 9,-5 9,4 0,13 C -9,4 -9,-5 -9,-14 Z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeOpacity="0.75"
        />
        {/* Inner chevron */}
        <path
          d="M -4,-2 L 0,2 L 4,-2"
          fill="none"
          stroke="#F26A21"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* Upward Chevron Arrow for Left/Right border */}
      <g id="sideArrow">
        <path
          d="M -8,12 L 0,-2 L 8,12 L 4,12 L 0,4 L -4,12 Z"
          fill="#F26A21"
          stroke="#0B2C4D"
          strokeWidth="1"
        />
      </g>
    </defs>

    {/* Outer Primary Navy Rectangle */}
    <rect
      x="16"
      y="16"
      width="968"
      height="675"
      fill="none"
      stroke="#0B2C4D"
      strokeWidth="3.5"
    />

    {/* Inset Orange Hairline Border */}
    <rect
      x="26"
      y="26"
      width="948"
      height="655"
      fill="none"
      stroke="#F26A21"
      strokeWidth="1.5"
      strokeOpacity="0.9"
    />

    {/* Inner Fine Navy Guide Border */}
    <rect
      x="34"
      y="34"
      width="932"
      height="639"
      fill="none"
      stroke="#0B2C4D"
      strokeWidth="1"
      strokeOpacity="0.4"
    />

    {/* === 4 CORNER STEPPED BEVEL BRACKETS & ORANGE TABS === */}

    {/* Top-Left Corner Stepped Geometry */}
    <path d="M 26,82 L 82,26" stroke="#0B2C4D" strokeWidth="2.5" />
    <path d="M 34,84 L 84,34" stroke="#F26A21" strokeWidth="1.5" />
    {/* Top horizontal orange tab */}
    <polygon points="90,18 135,18 123,26 78,26" fill="#F26A21" />
    {/* Left vertical orange tab */}
    <polygon points="18,90 18,135 26,123 26,78" fill="#F26A21" />
    <line x1="135" y1="18" x2="165" y2="18" stroke="#0B2C4D" strokeWidth="2" />
    <line x1="18" y1="135" x2="18" y2="165" stroke="#0B2C4D" strokeWidth="2" />

    {/* Top-Right Corner Stepped Geometry */}
    <path d="M 918,26 L 974,82" stroke="#0B2C4D" strokeWidth="2.5" />
    <path d="M 916,34 L 966,84" stroke="#F26A21" strokeWidth="1.5" />
    {/* Top horizontal orange tab */}
    <polygon points="910,18 865,18 877,26 922,26" fill="#F26A21" />
    {/* Right vertical orange tab */}
    <polygon points="982,90 982,135 974,123 974,78" fill="#F26A21" />
    <line x1="865" y1="18" x2="835" y2="18" stroke="#0B2C4D" strokeWidth="2" />
    <line x1="982" y1="135" x2="982" y2="165" stroke="#0B2C4D" strokeWidth="2" />

    {/* Bottom-Left Corner Stepped Geometry */}
    <path d="M 26,625 L 82,681" stroke="#0B2C4D" strokeWidth="2.5" />
    <path d="M 34,623 L 84,673" stroke="#F26A21" strokeWidth="1.5" />
    {/* Bottom horizontal orange tab */}
    <polygon points="90,689 135,689 123,681 78,681" fill="#F26A21" />
    {/* Left vertical orange tab */}
    <polygon points="18,617 18,572 26,584 26,629" fill="#F26A21" />
    <line x1="135" y1="689" x2="165" y2="689" stroke="#0B2C4D" strokeWidth="2" />
    <line x1="18" y1="572" x2="18" y2="542" stroke="#0B2C4D" strokeWidth="2" />

    {/* Bottom-Right Corner Stepped Geometry */}
    <path d="M 918,681 L 974,625" stroke="#0B2C4D" strokeWidth="2.5" />
    <path d="M 916,673 L 966,623" stroke="#F26A21" strokeWidth="1.5" />
    {/* Bottom horizontal orange tab */}
    <polygon points="910,689 865,689 877,681 922,681" fill="#F26A21" />
    {/* Right vertical orange tab */}
    <polygon points="982,617 982,572 974,584 974,629" fill="#F26A21" />
    <line x1="865" y1="689" x2="835" y2="689" stroke="#0B2C4D" strokeWidth="2" />
    <line x1="982" y1="572" x2="982" y2="542" stroke="#0B2C4D" strokeWidth="2" />

    {/* === 4 CORNER HERALDIC SHIELDS === */}
    <use href="#cornerShield" x="42" y="42" />
    <use href="#cornerShield" x="958" y="42" />
    <use href="#cornerShield" x="42" y="665" />
    <use href="#cornerShield" x="958" y="665" />

    {/* === MIDWAY SIDE UPWARD CHEVRON ARROWS === */}
    <use href="#sideArrow" x="26" y="353" />
    <use href="#sideArrow" x="974" y="353" />

    {/* === BOTTOM BRANDMARK ACCENT WINGS === */}
    <line x1="200" y1="689" x2="315" y2="689" stroke="#F26A21" strokeWidth="2.5" strokeLinecap="round" />
    <polygon points="315,687 325,689 315,691" fill="#F26A21" />

    <line x1="800" y1="689" x2="685" y2="689" stroke="#F26A21" strokeWidth="2.5" strokeLinecap="round" />
    <polygon points="685,687 675,689 685,691" fill="#F26A21" />
  </svg>
);

export const CertificateModal = ({ isOpen, onClose, userName, courseTitle }) => {
  if (!isOpen) return null;

  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Unique verified certificate hash
  const certId = `BM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // Adapt certificate details to match Digital Marketing (Image 2) or Full Stack seamlessly
  const isFullStack = courseTitle?.toLowerCase().includes('stack') || courseTitle?.toLowerCase().includes('mern');

  const displayCourseTitle = isFullStack 
    ? "Professional Course in Full Stack Web Development"
    : "Professional Course in Digital Marketing";

  const curriculum = isFullStack ? [
    "React.js, Next.js • Node.js",
    "Full-Stack Architecture & APIs",
    "MongoDB & Cloud Databases",
    "GenAI & Intelligent Systems"
  ] : [
    "SEO, SEM • SMM",
    "SMM And Marketing",
    "Content Strategy",
    "CBP+ Content Modules"
  ];

  const proficiencyStatement = isFullStack
    ? "Demonstrating proficiency in full-stack architecture, modern web development, and cloud tools."
    : "Demonstrating proficiency in essential digital marketing strategies and tools.";

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Floating Top-Right Action Controls (Close & Print) - Hidden on Print */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 no-print">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gradient-to-r from-[#F26A21] to-[#E65C17] hover:brightness-110 text-white text-xs md:text-sm font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            title="Download / Print Certificate"
          >
            <span>🖨️</span>
            <span>Print / Save as PDF</span>
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/90 hover:bg-white text-[#0B2C4D] flex items-center justify-center text-2xl font-bold shadow-lg transition-all cursor-pointer hover:rotate-90 active:scale-90"
            title="Close certificate"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Certificate Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-4xl bg-[#FAF9F5] rounded-lg shadow-2xl overflow-hidden print-certificate-container text-center flex flex-col justify-between select-none border border-slate-200"
          style={{
            aspectRatio: '1000 / 707',
            background: 'linear-gradient(135deg, #FCFCFA 0%, #F8F6F0 50%, #FCFCFA 100%)'
          }}
        >
          {/* Ornate Vector Frame (Exact Image 2 Framing) */}
          <CertificateBorderFrame />

          {/* Faint Background Crest Watermark (Official BrandMark Logo) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <img 
              src={brandmarkLogo} 
              alt="" 
              aria-hidden="true"
              className="w-72 sm:w-80 md:w-96 max-w-[46%] h-auto object-contain opacity-[0.08] select-none pointer-events-none"
            />
          </div>

          {/* Certificate Content Body */}
          <div className="relative z-10 w-full h-full flex flex-col justify-between px-8 sm:px-14 md:px-16 py-6 sm:py-8 md:py-10">

            {/* TOP HEADER: Official BrandMark Logo + Certification Lead */}
            <div className="flex flex-col items-center">
              {/* Crest Logo */}
              <div className="mb-2 sm:mb-3 flex items-center justify-center">
                <img 
                  src={brandmarkLogo} 
                  alt="BrandMark Solutions Official Logo" 
                  className="h-14 sm:h-16 md:h-20 w-auto object-contain drop-shadow-sm select-none"
                />
              </div>

              {/* Lead Text */}
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-[#0B2C4D] tracking-normal mb-1">
                This is to certify that
              </h1>

              {/* Student's Full Name (Cursive Terracotta Script matching Image 2) */}
              <div className="my-1 sm:my-2 w-full flex items-center justify-center">
                <span 
                  className="font-['Alex_Brush',cursive] text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-[#D9531E] tracking-wide font-normal px-2 leading-tight drop-shadow-sm"
                  style={{ textShadow: '0 1px 1px rgba(217,83,30,0.15)' }}
                >
                  [{userName || "Student's Full Name"}]
                </span>
              </div>

              {/* Completion Statement */}
              <p className="text-xs sm:text-sm text-[#0B2C4D] font-medium mb-1">
                has successfully completed the comprehensive
              </p>

              {/* Course Title */}
              <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#0B2C4D] tracking-tight mb-2 sm:mb-3">
                {displayCourseTitle}
              </h2>

              {/* 2-Column Syllabus Highlights Bullet Points (Exact match to Image 2) */}
              <div className="grid grid-cols-2 gap-x-6 sm:gap-x-10 text-[11px] sm:text-xs md:text-[13px] text-[#0B2C4D] font-semibold max-w-md mx-auto mb-2 text-left">
                <div className="space-y-0.5">
                  <p className="flex items-center gap-1.5">
                    <span className="text-[#0B2C4D] font-black text-sm leading-none">•</span>
                    <span>{curriculum[0]}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="text-[#0B2C4D] font-black text-sm leading-none">•</span>
                    <span>{curriculum[1]}</span>
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="flex items-center gap-1.5">
                    <span className="text-[#0B2C4D] font-black text-sm leading-none">•</span>
                    <span>{curriculum[2]}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="text-[#0B2C4D] font-black text-sm leading-none">•</span>
                    <span>{curriculum[3]}</span>
                  </p>
                </div>
              </div>

              {/* Demonstrating Proficiency Clause */}
              <p className="text-[10px] sm:text-[11px] md:text-xs text-[#2A3B4C] max-w-lg mx-auto mb-2 leading-tight font-normal">
                {proficiencyStatement}
              </p>

              {/* Award Metadata (Date, Certificate ID, Provider) */}
              <div className="text-[10px] sm:text-[11px] md:text-xs text-[#0B2C4D] space-y-0.5 mb-2">
                <p className="font-medium">
                  Awarded on this day: <span className="font-bold">[{formattedDate}]</span>
                </p>
                <p className="font-mono text-[10px] sm:text-[11px] text-[#0B2C4D]">
                  Certificate ID: <span className="font-bold text-[#D9531E]">[{certId}]</span>
                </p>
                <p className="text-[#0B2C4D] font-medium text-[10px] sm:text-[11px]">
                  provided by Brand Mark Solution
                </p>
              </div>
            </div>

            {/* BOTTOM SECTION: Dual Signatures, Verification URL, and Footer Banner */}
            <div className="w-full mt-auto">
              {/* Dual Signatures */}
              <div className="grid grid-cols-2 gap-8 max-w-xl mx-auto my-1 text-center">
                {/* Left: Course Director */}
                <div className="flex flex-col items-center">
                  <span 
                    className="font-['Great_Vibes',cursive] text-2xl sm:text-3xl text-[#0B2C4D] leading-none mb-1 select-none"
                    style={{ fontStyle: 'italic' }}
                  >
                    Signature
                  </span>
                  <div className="w-36 sm:w-44 border-t border-[#0B2C4D]/70 my-1"></div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#0B2C4D] leading-tight">
                    Course Director:
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-gray-700 font-medium">
                    [Rahul Singh Rajput]
                  </span>
                </div>

                {/* Right: CEO */}
                <div className="flex flex-col items-center">
                  <span 
                    className="font-['Great_Vibes',cursive] text-2xl sm:text-3xl text-[#0B2C4D] leading-none mb-1 select-none"
                    style={{ fontStyle: 'italic' }}
                  >
                    Signature
                  </span>
                  <div className="w-36 sm:w-44 border-t border-[#0B2C4D]/70 my-1"></div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#0B2C4D] leading-tight">
                    Brand Mark Solution CEO:
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-gray-700 font-medium">
                    [Rajeshree Shekhar]
                  </span>
                </div>
              </div>

              {/* Website URL & Copyright Notice */}
              <div className="text-center text-[9px] sm:text-[10px] text-gray-600 space-y-0.5 mt-2">
                <p>
                  For more information, visit our website: <span className="text-[#0B2C4D] font-semibold">[https://www.brandmarksolutions.site]</span>
                </p>
                <p className="text-gray-500">
                  © Brand Mark Solution. All Rights Reserved.
                </p>
                <p className="font-semibold text-[#0B2C4D]">
                  www.brandmarksolutions.site
                </p>
              </div>

              {/* Bottom Center Brand Banner with Flanking Orange Accent Rules */}
              <div className="flex items-center justify-center gap-3 mt-1.5">
                <div className="h-[2px] w-12 sm:w-16 bg-[#F26A21]"></div>
                <span className="text-sm sm:text-base md:text-lg font-black text-[#0B2C4D] tracking-wide">
                  BrandMark Solutions
                </span>
                <div className="h-[2px] w-12 sm:w-16 bg-[#F26A21]"></div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
