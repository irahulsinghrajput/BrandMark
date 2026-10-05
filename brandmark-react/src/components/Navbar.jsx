import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Link, useLocation } from 'react-router-dom';
import { useModal } from '../contexts/ModalContext';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const navRef = useRef(null);
  const location = useLocation();
  const { openStrategyModal, openTalkToMark } = useModal();
  const isCoursesPage = location.pathname === '/courses';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
          gsap.to(navRef.current, { y: '-100%', duration: 0.3, ease: 'power2.out' });
        } else {
          gsap.to(navRef.current, { y: '0%', duration: 0.3, ease: 'power2.out', backgroundColor: 'rgba(255, 255, 255, 0.95)' });
        }
      } else {
        gsap.to(navRef.current, { backgroundColor: 'rgba(255, 255, 255, 0)', duration: 0.3 });
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const links = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Blog', path: '/blog' },
    { label: 'Careers', path: '/careers' },
    { label: 'Courses', path: '/courses' },
  ];

  return (
    <>
      <motion.nav 
        ref={navRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed w-full z-[100] transition-colors backdrop-blur-md top-0 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 relative z-[110]">
            <picture>
              <source srcSet="/brandmark-logo-new.png.avif" type="image/avif" />
              <source srcSet="/brandmark-logo-new.png.webp" type="image/webp" />
              <img src="/brandmark-logo-new.png.png" alt="Brand Mark Logo" className="h-10 w-10 rounded-full object-cover" />
            </picture>
            <span className={`text-2xl font-extrabold tracking-tighter transition-colors duration-300 ${isMobileMenuOpen ? 'text-white' : 'text-brand-navy'}`}>
              Brand<span className="font-light text-brand-orange">Mark</span><span className="text-xs align-top">®</span>
            </span>
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden lg:flex space-x-8 items-center">
            {links.map((link, i) => (
              <Link 
                key={i} 
                to={link.path} 
                className={`relative group overflow-hidden ${location.pathname === link.path ? 'text-brand-orange' : 'text-brand-navy'}`}
              >
                <span className="block transition-transform duration-300 group-hover:-translate-y-full font-medium">
                  {link.label}
                </span>
                <span className="absolute top-full left-0 transition-transform duration-300 group-hover:-translate-y-full text-brand-orange font-medium">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex gap-4">
            {!isCoursesPage && (
              <>
                <button 
                  onClick={openTalkToMark}
                  className="px-6 py-2 border border-brand-navy text-brand-navy text-sm font-bold uppercase tracking-wide hover:bg-brand-navy hover:text-white transition-colors duration-300 rounded-lg"
                >
                  Talk to Mark
                </button>
                <button 
                  onClick={openStrategyModal}
                  className="px-6 py-2 bg-brand-orange text-white text-sm font-bold uppercase tracking-wide rounded-lg hover:bg-brand-orange-dark hover:shadow-[0_0_15px_rgba(242,106,33,0.5)] transition-all duration-300"
                >
                  Free Consultation
                </button>
              </>
            )}
            {isCoursesPage && (
              <Link 
                to="/student-login"
                className="px-6 py-2 border border-brand-orange text-brand-orange text-sm font-bold uppercase tracking-wide rounded-lg hover:bg-brand-orange hover:text-white transition-all duration-300"
              >
                Student Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="lg:hidden relative z-[110] p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-8 h-8 text-white transition-colors duration-300" />
            ) : (
              <Menu className="w-8 h-8 text-brand-navy transition-colors duration-300" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#0B2C4D] z-[90] flex flex-col justify-center items-center px-6 overflow-y-auto pt-24 pb-12"
          >
            <div className="flex flex-col gap-8 w-full max-w-sm">
              {/* Links */}
              <div className="flex flex-col gap-6 text-center">
                {links.map((link, i) => (
                  <Link 
                    key={i} 
                    to={link.path}
                    className={`text-3xl font-extrabold tracking-tight transition-colors ${location.pathname === link.path ? 'text-brand-orange' : 'text-white hover:text-brand-orange/80'}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-white/20">
                {!isCoursesPage ? (
                  <>
                    <button 
                      onClick={() => { setIsMobileMenuOpen(false); openTalkToMark(); }}
                      className="w-full py-4 border-2 border-white text-white font-bold uppercase tracking-widest hover:bg-white hover:text-[#0B2C4D] transition-colors rounded-xl"
                    >
                      Talk to Mark
                    </button>
                    <button 
                      onClick={() => { setIsMobileMenuOpen(false); openStrategyModal(); }}
                      className="w-full py-4 bg-brand-orange text-white font-bold uppercase tracking-widest hover:bg-brand-orange-dark transition-colors rounded-xl"
                    >
                      Book Strategy Call
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/student-login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-4 bg-brand-orange text-white text-center font-bold uppercase tracking-widest hover:bg-brand-orange-dark transition-colors rounded-xl"
                  >
                    Student Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
