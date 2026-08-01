import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0B2C4D] to-[#0B0F19] text-white font-outfit border-t border-[#0B2C4D]/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8">
        
        {/* Main Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand Info & Socials */}
          <div className="flex flex-col">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <picture>
                <source srcSet="/brandmark-logo-new.png.avif" type="image/avif" />
                <source srcSet="/brandmark-logo-new.png.webp" type="image/webp" />
                <img src="/brandmark-logo-new.png.png" alt="Brand Mark Logo" className="h-10 w-10 rounded-full object-cover" loading="lazy" />
              </picture>
              <span className="text-2xl font-extrabold tracking-tighter text-white">
                Brand<span className="font-light text-[#F97316]">Mark</span><span className="text-xs align-top text-[#94A3B8]">®</span>
              </span>
            </Link>
            
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-8 max-w-sm">
              We help ambitious businesses build stronger brands, better websites, and predictable growth across global markets.
            </p>
            
            <div className="flex gap-4">
              <a href="https://www.instagram.com/brandmarksolutions/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#283750] border border-[#3A4C6B]/40 flex items-center justify-center text-white hover:bg-[#F97316] hover:border-[#F97316] transition-all duration-300 group">
                <InstagramIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a href="https://www.linkedin.com/company/brandmarksolutions/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#283750] border border-[#3A4C6B]/40 flex items-center justify-center text-white hover:bg-[#F97316] hover:border-[#F97316] transition-all duration-300 group">
                <LinkedinIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a href="https://www.facebook.com/brandmarksolutions" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#283750] border border-[#3A4C6B]/40 flex items-center justify-center text-white hover:bg-[#F97316] hover:border-[#F97316] transition-all duration-300 group">
                <FacebookIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="flex flex-col">
            <h4 className="text-white tracking-wider text-sm font-bold mb-6">SERVICES</h4>
            <ul className="flex flex-col gap-4">
              <li>
                <Link to="/services/brand-identity" className="text-[#94A3B8] hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm">Brand Identity</Link>
              </li>
              <li>
                <Link to="/services/digital-marketing" className="text-[#94A3B8] hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm">Digital Marketing</Link>
              </li>
              <li>
                <Link to="/services/web-development" className="text-[#94A3B8] hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm">Web Development</Link>
              </li>
              <li>
                <Link to="/services/social-media" className="text-[#94A3B8] hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm">Social Media</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col">
            <h4 className="text-white tracking-wider text-sm font-bold mb-6">COMPANY</h4>
            <ul className="flex flex-col gap-4">
              <li>
                <Link to="/about" className="text-[#94A3B8] hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm">About Us</Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-[#94A3B8] hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm">Portfolio</Link>
              </li>
              <li>
                <Link to="/careers" className="text-[#94A3B8] hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm">Careers</Link>
              </li>
              <li>
                <Link to="/blog" className="text-[#94A3B8] hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Get in Touch */}
          <div className="flex flex-col">
            <h4 className="text-white tracking-wider text-sm font-bold mb-6">GET IN TOUCH</h4>
            <ul className="flex flex-col gap-6">
              <li className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
                <a href="mailto:contact@brandmarksolutions.site" className="text-[#94A3B8] hover:text-white transition-colors text-sm">contact@brandmarksolutions.site</a>
              </li>
              <li className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
                <a href="tel:+917091863003" className="text-[#94A3B8] hover:text-white transition-colors text-sm">+91 709 186 3003</a>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
                <span className="text-[#94A3B8] text-sm leading-relaxed">Gangotri, Buddha colony,<br />Patna - 800001</span>
              </li>
            </ul>
          </div>
          
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-[#2A3B58] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#94A3B8] text-xs text-center md:text-left">
            © 2026 Brand Mark Solutions. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-[#94A3B8] hover:text-white text-xs transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-[#94A3B8] hover:text-white text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
};
