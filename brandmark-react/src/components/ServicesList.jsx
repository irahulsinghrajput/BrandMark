import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../contexts/ModalContext';

export const ServicesList = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const { openStrategyModal } = useModal();

  const services = [
    {
      id: 'web-development',
      title: 'Website Development',
      price: 'Starting from ₹1,50,000',
      tags: ['Custom UI/UX', 'MERN Stack', 'SEO Optimized'],
      desc: 'High-converting, lightning-fast websites built on modern tech stacks. We engineer scalable architectures that drive international market dominance and unmatched user experiences.'
    },
    {
      id: 'social-media',
      title: 'Social Media Management',
      price: 'Starting from ₹40,000 / mo',
      tags: ['Content Creation', 'Community Growth', 'Analytics'],
      desc: 'Data-driven social strategies and premium content creation designed to build engaged communities and elevate your brand\'s digital presence across all platforms.'
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing & SEO',
      price: 'Starting from ₹75,000 / mo',
      tags: ['Lead Generation', 'PPC', 'Google Ranking'],
      desc: 'Comprehensive growth marketing and search engine optimization to outrank competitors and drive high-intent, qualified traffic to your funnels.'
    },
    {
      id: 'ai-automation',
      title: 'AI Automation & Chatbots',
      price: 'Starting from ₹2,00,000',
      tags: ['Gen AI', 'Client Tutors', 'Workflow Automation'],
      desc: 'Custom-trained LLMs and AI voice agents integrated directly into your business workflows to automate customer service and scale operations seamlessly.'
    },
    {
      id: 'photography',
      title: 'Photography & Cinematic Videography',
      price: 'Starting from ₹50,000 / day',
      tags: ['Wedding & Pre-Wedding', 'Corporate Conferences', 'Events & Birthdays', 'Servicing: UP, Delhi NCR, Bihar'],
      desc: 'High-end visual storytelling for your most important moments. From cinematic pre-wedding narratives and grand wedding celebrations to professional corporate conference coverage and private events. We deploy industry-leading gear and creative direction across UP, Delhi NCR, and Bihar to capture memories that scale.'
    }
  ];

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="py-24 md:py-32 bg-white text-[#0B2C4D] font-outfit">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Area */}
        <div className="mb-20">
          <p className="text-orange-500 uppercase tracking-widest font-bold text-sm mb-4">Our Expertise</p>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#0B2C4D]">
            Digital craftsmanship <br className="hidden md:block"/> at scale.
          </h2>
        </div>

        {/* Accordion List Area */}
        <div className="flex flex-col">
          <div className="border-t border-[#0B2C4D]/10 w-full"></div>
          
          {services.map((service, index) => {
            const isHovered = hoveredIndex === index;
            const isExpanded = expandedIndex === index;

            return (
              <div 
                key={service.id}
                className="group border-b border-[#0B2C4D]/10 transition-colors duration-500"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Expandable Header Row */}
                <button 
                  onClick={() => handleToggle(index)}
                  className={`w-full py-12 md:py-16 text-left transition-colors duration-500 ${isHovered || isExpanded ? 'bg-orange-50/50' : 'bg-transparent'}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start px-4 md:px-8">
                    
                    {/* Left Side: Index & Title */}
                    <div className="col-span-1 md:col-span-7 flex items-start gap-6 md:gap-10">
                      <span className="text-2xl md:text-3xl text-[#3B82F6] font-light italic font-serif mt-2">
                        0{index + 1}
                      </span>
                      <h3 className={`text-4xl md:text-6xl font-extrabold tracking-tight transition-colors duration-500 ${isHovered || isExpanded ? 'text-orange-500' : 'text-[#0B2C4D]'}`}>
                        {service.title}
                      </h3>
                    </div>
                    
                    {/* Right Side: Tags & Price */}
                    <div className="col-span-1 md:col-span-5 flex flex-col items-start md:items-end gap-6 mt-4 md:mt-0">
                      <div className="flex flex-wrap items-center justify-start md:justify-end gap-3 w-full">
                        {service.tags.map((tag, i) => (
                          <span key={i} className="px-4 py-2 border border-[#0B2C4D]/10 rounded-full text-[#0B2C4D] text-sm font-semibold bg-white shadow-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-lg font-bold text-[#0B2C4D]">
                        {service.price}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Animated Dropdown Content via Framer Motion */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden bg-orange-50/50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-4 md:px-8 pb-16">
                        <div className="col-span-1 md:col-span-7 md:col-start-2">
                          <p className="text-xl md:text-2xl font-light leading-relaxed text-[#3B82F6] mb-8 max-w-2xl">
                            {service.desc}
                          </p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              openStrategyModal();
                            }}
                            className="px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-full transition-all duration-300 shadow-[0_8px_30px_rgba(249,115,22,0.3)] hover:-translate-y-1 inline-flex items-center gap-3"
                          >
                            Start a project 
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
