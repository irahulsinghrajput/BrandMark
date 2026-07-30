import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { PageTransition } from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckoutButton } from '../components/CheckoutButton';

export const Courses = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    gsap.fromTo('.courses-hero', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );
  }, []);

  const digitalMarketingModules = [
    { title: "Module 1: Digital Marketing Fundamentals", desc: "Understand the digital landscape, channels, and core strategies", level: "Beginner" },
    { title: "Module 2: Introduction to Gen AI for Marketing", desc: "Explore AI tools, capabilities, and ethical considerations", level: "Beginner" },
    { title: "Module 3: Analytics & Metrics Fundamentals", desc: "Learn key metrics, KPIs, and dashboard setup", level: "Beginner" },
    { title: "Module 4: AI-Powered Content Creation", desc: "Use ChatGPT, Claude to create engaging blog posts, emails, and ads", level: "Intermediate" },
    { title: "Module 5: SEO & AI-Enhanced Copywriting", desc: "Optimize content for search engines using AI tools", level: "Intermediate" },
    { title: "Module 6: Email Marketing & Automation", desc: "Design campaigns with AI personalization and automation", level: "Intermediate" },
    { title: "Module 7: Google Ads & AI Bidding Strategies", desc: "Master Google Ads with smart bidding and AI optimization", level: "Advanced" },
    { title: "Module 8: Facebook & Social Ads with AI", desc: "Create targeted campaigns using Meta's AI tools", level: "Advanced" },
    { title: "Module 9: Performance Marketing & ROI Optimization", desc: "Maximize ROI, attribution, and campaign performance", level: "Advanced" },
    { title: "Module 10: Social Media Strategy with AI", desc: "Plan, create, and schedule content with AI assistance", level: "Advanced" },
    { title: "Module 11: Influencer Marketing Strategies", desc: "Identify and manage influencer campaigns effectively", level: "Advanced" },
    { title: "Module 12: Community Management at Scale", desc: "Build and nurture online communities", level: "Advanced" },
    { title: "Module 13: E-commerce Marketing Strategies", desc: "Drive sales and optimize funnels for online stores", level: "Expert" },
    { title: "Module 14: Conversion Rate Optimization (CRO)", desc: "A/B testing and AI-driven conversion improvements", level: "Expert" },
    { title: "Module 15: Final Capstone Project", desc: "Execute a full-funnel campaign simulation", level: "Expert" }
  ];

  const fullStackModules = [
    { title: "Module 1: JavaScript Mastery", desc: "ES6+, Async programming, and DOM manipulation", level: "Beginner" },
    { title: "Module 2: React 18 Fundamentals", desc: "Hooks, state management, and component architecture", level: "Beginner" },
    { title: "Module 3: Advanced React Patterns", desc: "Context API, Redux, and custom hooks", level: "Intermediate" },
    { title: "Module 4: Next.js App Router", desc: "Server components, routing, and optimizations", level: "Intermediate" },
    { title: "Module 5: Node.js & Express", desc: "Building RESTful APIs and middleware", level: "Intermediate" },
    { title: "Module 6: MongoDB & Mongoose", desc: "Database design, indexing, and aggregations", level: "Intermediate" },
    { title: "Module 7: Authentication & Security", desc: "JWT, OAuth, and protecting routes", level: "Advanced" },
    { title: "Module 8: Gen AI Integration", desc: "OpenAI API, Prompt Engineering, and RAG architectures", level: "Advanced" },
    { title: "Module 9: Vector Databases", desc: "Pinecone and semantic search implementation", level: "Advanced" },
    { title: "Module 10: Building AI Agents", desc: "LangChain and autonomous workflows", level: "Advanced" },
    { title: "Module 11: Real-time with WebSockets", desc: "Socket.io for chat and live updates", level: "Advanced" },
    { title: "Module 12: DevOps & Docker", desc: "Containerization and CI/CD pipelines", level: "Advanced" },
    { title: "Module 13: AWS Deployment", desc: "EC2, S3, and serverless architectures", level: "Expert" },
    { title: "Module 14: System Design", desc: "Scaling MERN apps for production", level: "Expert" },
    { title: "Module 15: Capstone SaaS Project", desc: "Build an AI-powered SaaS from scratch", level: "Expert" }
  ];

  return (
    <PageTransition>
      <div className="pt-32 pb-20 bg-brand-bg-light min-h-screen relative overflow-hidden">
        
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20 courses-hero">
            <span className="inline-block px-4 py-2 bg-brand-navy/10 text-brand-navy text-sm font-bold uppercase tracking-widest rounded-full mb-6">
              BrandMark Academy
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-brand-navy">
              Learn the exact <span className="text-brand-orange">frameworks</span> we use.
            </h1>
            <p className="text-xl text-brand-text-muted font-light max-w-2xl mx-auto">
              Master digital marketing and full-stack development with our comprehensive, AI-integrated curriculum.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Digital Marketing Course */}
            <div className="bg-white rounded-3xl p-8 border border-brand-border-light shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-brand-navy mb-2">Digital Marketing with AI</h2>
                  <p className="text-brand-text-muted font-light">15-Module Masterclass + AI Tutor Access</p>
                </div>
                <div className="text-right">
                  <span className="block text-3xl font-extrabold text-brand-navy">₹99</span>
                  <span className="text-sm text-brand-orange font-semibold uppercase">Lifetime Access</span>
                </div>
              </div>
              
              <CheckoutButton 
                courseId="digital-marketing" 
                price="99" 
                buttonText="Enroll Now"
              />

              <h3 className="text-xl font-bold text-brand-navy mb-4 border-b border-brand-border-light pb-2">Curriculum</h3>
              <div className="space-y-3">
                {digitalMarketingModules.map((mod, i) => (
                  <div key={i} className="border border-brand-border-light rounded-xl overflow-hidden bg-brand-bg-card">
                    <button 
                      onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                      className="w-full p-4 flex justify-between items-center text-left hover:bg-brand-bg-light transition-colors"
                    >
                      <span className="font-semibold text-brand-navy pr-4">{mod.title}</span>
                      <span className="text-brand-orange transform transition-transform duration-300" style={{ transform: activeAccordion === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                    </button>
                    <AnimatePresence>
                      {activeAccordion === i && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 text-brand-text-body font-light border-t border-brand-border-light pt-3 flex justify-between items-end"
                        >
                          <p>{mod.desc}</p>
                          <span className="text-xs font-bold px-2 py-1 bg-brand-navy/10 text-brand-navy rounded-md uppercase">{mod.level}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Stack Course */}
            <div className="bg-brand-navy rounded-3xl p-8 border border-gray-700 shadow-sm hover:shadow-xl transition-shadow duration-300 text-white relative overflow-hidden">
              <div className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-brand-orange rounded-full filter blur-[100px] opacity-20 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Full Stack Gen AI Dev</h2>
                    <p className="text-gray-300 font-light">15-Module Masterclass + AI Tutor Access</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-3xl font-extrabold">₹599</span>
                    <span className="text-sm text-brand-orange font-semibold uppercase">Pro Cohort</span>
                  </div>
                </div>
                
                <CheckoutButton 
                  courseId="full-stack-dev" 
                  price="599" 
                  buttonText="Join Cohort"
                  className="w-full py-4 mb-8 bg-white text-brand-navy font-bold uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-colors duration-300 shadow-md"
                />

                <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Curriculum</h3>
                <div className="space-y-3">
                  {fullStackModules.map((mod, i) => (
                    <div key={`fs-${i}`} className="border border-gray-700 rounded-xl overflow-hidden bg-[#0A2038]">
                      <button 
                        onClick={() => setActiveAccordion(activeAccordion === `fs-${i}` ? null : `fs-${i}`)}
                        className="w-full p-4 flex justify-between items-center text-left hover:bg-[#0E2A4A] transition-colors"
                      >
                        <span className="font-semibold text-white pr-4">{mod.title}</span>
                        <span className="text-brand-orange transform transition-transform duration-300" style={{ transform: activeAccordion === `fs-${i}` ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                      </button>
                      <AnimatePresence>
                        {activeAccordion === `fs-${i}` && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-4 text-gray-300 font-light border-t border-gray-700 pt-3 flex justify-between items-end"
                          >
                            <p>{mod.desc}</p>
                            <span className="text-xs font-bold px-2 py-1 bg-white/10 text-white rounded-md uppercase">{mod.level}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
};
