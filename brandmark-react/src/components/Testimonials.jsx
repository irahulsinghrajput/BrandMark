import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

export const Testimonials = () => {
  const containerRef = useRef(null);

  const reviews = [
    {
      initials: 'RS',
      name: 'Rajesh Sharma',
      role: 'Founder, TechVista Solutions',
      text: '"BrandMark completely transformed our online presence. Within 3 months, our social media engagement increased by 300% and we saw a significant boost in sales."'
    },
    {
      initials: 'PK',
      name: 'Priya Kapoor',
      role: 'Owner, Artisan Bakery',
      text: '"As a small business owner, I was overwhelmed with marketing. BrandMark took that burden off my shoulders and delivered results beyond my expectations."'
    },
    {
      initials: 'AM',
      name: 'Amit Mehta',
      role: 'CEO, GreenLeaf Enterprises',
      text: '"Professional, creative, and results-driven. BrandMark helped us rebrand our entire company and the response from customers has been phenomenal!"'
    }
  ];

  useEffect(() => {
    gsap.fromTo('.testimonial-header', 
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 1, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      }
    );

    gsap.fromTo('.testimonial-card',
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
        }
      }
    );
  }, []);

  return (
    <section ref={containerRef} className="py-32 bg-brand-bg-light border-t border-brand-border-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16 testimonial-header">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-brand-navy">What Our Clients Say</h2>
          <p className="text-xl text-brand-text-muted font-light max-w-2xl mx-auto">
            Don't just take our word for it. Here's what growth-focused businesses say about working with us.
          </p>
        </div>

        <motion.div 
          className="flex gap-8 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ right: 0, left: -((reviews.length * 400) - window.innerWidth + 100) }}
          whileTap={{ cursor: "grabbing" }}
        >
          {reviews.map((review, i) => (
            <motion.div 
              key={i} 
              className="testimonial-card flex-shrink-0 w-full md:w-[400px] bg-white p-10 rounded-3xl border border-brand-border-light shadow-sm hover:shadow-xl hover:border-brand-orange transition-all duration-300 select-none"
            >
              <div className="flex text-brand-orange text-xl mb-6">
                {'★'.repeat(5)}
              </div>
              <p className="text-brand-text-body font-light text-lg mb-8 leading-relaxed italic">
                {review.text}
              </p>
              <div className="flex items-center mt-auto border-t border-brand-border-light pt-6">
                <div className="w-14 h-14 bg-brand-navy rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                  {review.initials}
                </div>
                <div>
                  <h4 className="font-bold text-brand-navy">{review.name}</h4>
                  <p className="text-sm text-brand-text-muted">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <div className="mt-20 text-center testimonial-header">
          <p className="text-brand-text-muted text-sm font-semibold uppercase tracking-widest mb-8">
            Trusted by businesses serving clients across the US, Europe, and Middle East
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-80">
            <div className="flex items-center gap-3">
              <span className="text-brand-orange text-3xl">🏆</span>
              <span className="text-brand-navy font-bold text-lg">98% Client Satisfaction</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-brand-orange text-3xl">⏱️</span>
              <span className="text-brand-navy font-bold text-lg">On-Time Delivery</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-brand-orange text-3xl">🤝</span>
              <span className="text-brand-navy font-bold text-lg">Long-term Partnerships</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
