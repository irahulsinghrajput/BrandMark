import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { AITutor } from '../components/AITutor';
import { digitalMarketingModules, fullStackModules } from '../data/courseData';

import { AnimatePresence } from 'framer-motion';
import { CourseModule } from '../components/CourseModule';
import { MockTest } from '../components/MockTest';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [activeModule, setActiveModule] = useState(0);

  useEffect(() => {
    const isEnrolled = localStorage.getItem('isEnrolled');
    const courseId = localStorage.getItem('enrolledCourse');

    if (!isEnrolled) {
      navigate('/courses');
    } else {
      setCourseData(courseId);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isEnrolled');
    localStorage.removeItem('enrolledCourse');
    navigate('/courses');
  };

  const modules = courseData === 'digital-marketing' ? digitalMarketingModules : fullStackModules;

  if (!courseData) return null;

  return (
    <PageTransition>
      <div className="pt-24 min-h-screen bg-brand-bg-light flex flex-col md:flex-row relative">
        
        {/* Sidebar */}
        <aside className="w-full md:w-80 bg-white border-r border-brand-border-light h-[calc(100vh-6rem)] overflow-y-auto flex-shrink-0 relative z-20">
          <div className="p-6 sticky top-0 bg-white border-b border-brand-border-light z-10 flex justify-between items-center">
            <h2 className="font-bold text-brand-navy">Course Content</h2>
            <button onClick={handleLogout} className="text-xs text-brand-orange hover:underline font-semibold">Sign Out</button>
          </div>
          <div className="p-4 space-y-2">
            {modules.map((mod, index) => (
              <button 
                key={mod.id}
                onClick={() => setActiveModule(index)}
                className={`w-full text-left p-4 rounded-xl transition-colors flex items-start gap-3 ${activeModule === index ? 'bg-brand-orange/10 border border-brand-orange/20' : 'hover:bg-brand-bg-light border border-transparent'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${mod.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {mod.completed ? '✓' : mod.id}
                </div>
                <div>
                  <h4 className={`font-semibold text-sm ${activeModule === index ? 'text-brand-orange' : 'text-brand-navy'}`}>{mod.title}</h4>
                  <p className="text-xs text-brand-text-muted mt-1">{mod.duration}</p>
                </div>
              </button>
            ))}
            
            {/* Mock Test Button */}
            <div className="pt-4 mt-2 border-t border-brand-border-light">
              <button 
                onClick={() => setActiveModule('mock-test')}
                className={`w-full text-left p-4 rounded-xl transition-colors flex items-start gap-3 ${activeModule === 'mock-test' ? 'bg-brand-navy text-white shadow-md' : 'hover:bg-brand-bg-light border border-transparent text-brand-navy'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${activeModule === 'mock-test' ? 'bg-white/20 text-white' : 'bg-brand-orange/20 text-brand-orange'}`}>
                  ★
                </div>
                <div>
                  <h4 className={`font-semibold text-sm ${activeModule === 'mock-test' ? 'text-white' : 'text-brand-navy'}`}>Final Certification Test</h4>
                  <p className={`text-xs mt-1 ${activeModule === 'mock-test' ? 'text-white/70' : 'text-brand-text-muted'}`}>Multiple Choice Quiz</p>
                </div>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow p-6 md:p-10 h-[calc(100vh-6rem)] overflow-y-auto relative z-10">
          <div className="max-w-4xl mx-auto pb-32">
            <div className="bg-brand-navy rounded-3xl aspect-video mb-8 flex items-center justify-center shadow-xl relative overflow-hidden group cursor-pointer border border-brand-border-light/20">
               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
               <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center z-20 group-hover:scale-110 transition-transform">
                 <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-2"></div>
               </div>
               <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000" alt="Video placeholder" className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-overlay" />
            </div>

            <AnimatePresence mode="wait">
              {activeModule === 'mock-test' ? (
                <MockTest key="mock-test" courseData={courseData} />
              ) : (
                <CourseModule 
                  key={modules[activeModule].id}
                  module={modules[activeModule]} 
                  onNext={() => setActiveModule(prev => Math.min(modules.length - 1, prev + 1))}
                  onPrev={() => setActiveModule(prev => Math.max(0, prev - 1))}
                  isFirst={activeModule === 0}
                  isLast={activeModule === modules.length - 1}
                />
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* AI Tutor Component */}
        <AITutor courseData={courseData} activeModuleTitle={activeModule === 'mock-test' ? "Mock Test" : modules[activeModule].title} />

      </div>
    </PageTransition>
  );
};
