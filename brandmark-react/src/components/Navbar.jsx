import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Link, useLocation } from 'react-router-dom';
import { MagneticButton } from './MagneticButton';
import { useModal } from '../contexts/ModalContext';

export const Navbar = () => {
  const navRef = useRef(null);
  const location = useLocation();
  const { openStrategyModal, openTalkToMark } = useModal();
  const isCoursesPage = location.pathname === '/courses';

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
          // Scrolling down
          gsap.to(navRef.current, { y: '-100%', duration: 0.3, ease: 'power2.out' });
        } else {
          // Scrolling up
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
    <motion.nav 
      ref={navRef}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed w-full z-50 transition-colors backdrop-blur-md top-0 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img src="/brandmark-logo-new.png.png" alt="Brand Mark Logo" className="h-10 w-10 rounded-full object-cover" />
          <span className="text-2xl font-extrabold tracking-tighter text-brand-navy">
            Brand<span className="font-light text-brand-orange">Mark</span><span className="text-xs align-top">®</span>
          </span>
        </Link>
        
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

        <div className="hidden md:flex gap-4">
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
                Strategy Call
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
      </div>
    </motion.nav>
  );
};
