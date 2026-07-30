import React, { useEffect, useRef } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP Plugins globally
gsap.registerPlugin(ScrollTrigger);

export const Layout = ({ children }) => {
  const cursorRef = useRef(null);

  // Lenis instance for syncing with GSAP
  useLenis(({ scroll }) => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    // Custom Magnetic Cursor Logic
    const moveCursor = (e) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: 'power2.out'
        });
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
      {/* Custom Cursor removed as requested */}
      
      {/* Main Wrapper */}
      <main className="bg-brand-bg-light min-h-screen text-brand-text-body font-sans selection:bg-brand-orange selection:text-white relative overflow-x-hidden flex flex-col">
        <div className="flex-grow">
          {children}
        </div>
      </main>
    </ReactLenis>
  );
};
