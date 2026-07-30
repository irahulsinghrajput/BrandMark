import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MagneticButton } from './MagneticButton';
import { Link } from 'react-router-dom';
import { useModal } from '../contexts/ModalContext';

export const Hero = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const { openStrategyModal, openTalkToMark } = useModal();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 40;
      const yPos = (clientY / window.innerHeight - 0.5) * 40;

      gsap.to('.hero-shape', {
        x: xPos,
        y: yPos,
        duration: 1,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const lines = gsap.utils.toArray('.reveal-text');
    gsap.fromTo(lines, 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power4.out', delay: 0.2 }
    );

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden bg-brand-bg-light">
      
      {/* Background Decorative Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
        <div className="hero-shape absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="hero-shape absolute top-1/3 right-1/4 w-96 h-96 bg-brand-navy rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 text-center z-10 flex flex-col items-center">
        <div className="overflow-hidden mb-2">
          <h1 ref={textRef} className="reveal-text text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-brand-navy leading-none">
            Brand Mark
          </h1>
        </div>
        <div className="overflow-hidden mb-8">
          <h1 className="reveal-text text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-brand-orange leading-none">
            Solutions.
          </h1>
        </div>
        
        <div className="overflow-hidden mb-12">
          <p className="reveal-text mt-4 max-w-2xl mx-auto text-xl md:text-2xl text-brand-text-body font-light">
            Building brands and growth systems for global markets. 
            We turn ambition into execution.
          </p>
        </div>

        <div className="overflow-hidden flex flex-col sm:flex-row gap-6 mt-4">
          <div className="reveal-text">
            <button 
              onClick={openTalkToMark}
              className="w-full sm:w-auto px-8 py-4 bg-brand-navy text-white font-bold uppercase tracking-widest rounded-lg hover:bg-brand-navy-dark transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Talk to Mark
            </button>
          </div>
          <div className="reveal-text">
            <button 
              onClick={openStrategyModal}
              className="w-full sm:w-auto px-8 py-4 bg-brand-orange text-white font-bold uppercase tracking-widest rounded-lg hover:bg-brand-orange-dark border border-brand-orange hover:shadow-[0_0_20px_rgba(242,106,33,0.6)] transition-all duration-300 shadow-lg"
            >
              Book a Strategy Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
