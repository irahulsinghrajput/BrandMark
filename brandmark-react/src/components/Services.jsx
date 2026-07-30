import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export const Services = () => {
  const containerRef = useRef(null);

  const services = [
    {
      id: 'brand-identity',
      title: 'Brand Identity',
      desc: 'Logos, typography, and visual systems that make your business unforgettable.',
      icon: '✨'
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing',
      desc: 'Data-driven campaigns across social and search to acquire your ideal customers.',
      icon: '📈'
    },
    {
      id: 'social-media',
      title: 'Social Media Management',
      desc: 'Community building and viral content creation for TikTok, Instagram, and LinkedIn.',
      icon: '📱'
    },
    {
      id: 'web-development',
      title: 'Web Development',
      desc: 'High-converting, lightning-fast websites built on modern tech stacks.',
      icon: '💻'
    }
  ];

  useEffect(() => {
    const cards = gsap.utils.toArray('.service-card');
    
    gsap.fromTo(cards, 
      { y: 100, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      }
    );
  }, []);

  return (
    <section ref={containerRef} className="py-32 px-6 bg-white border-b border-brand-border-light">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-extrabold text-brand-navy mb-6 tracking-tight">
            Our Expertise
          </h2>
          <p className="text-xl text-brand-text-muted font-light max-w-2xl mx-auto">
            End-to-end execution across the entire digital landscape. We don't just advise; we build.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <Link to={`/services/${service.id}`} key={i} className="service-card group cursor-pointer block">
              <div className="h-full p-10 rounded-3xl bg-brand-bg-card border border-brand-border-light transition-all duration-500 hover:border-brand-orange hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-white border border-brand-border-light flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-brand-navy mb-4 group-hover:text-brand-orange transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-brand-text-muted font-light leading-relaxed">
                  {service.desc}
                </p>
                <div className="mt-8 flex items-center text-brand-orange font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                  View Details &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
