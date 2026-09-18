import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { AITutor } from '../components/AITutor';
import { VideoLessonPlayer } from '../components/VideoLessonPlayer';
import { AILabSandbox } from '../components/AILabSandbox';
import { AIAssignmentEvaluator } from '../components/AIAssignmentEvaluator';
import { ResourceVault } from '../components/ResourceVault';
import { AIMockInterview } from '../components/AIMockInterview';
import { CommunityBanner } from '../components/CommunityBanner';
import { GamificationWidget } from '../components/GamificationWidget';
import { CertificateModal } from '../components/CertificateModal';
import { digitalMarketingModules, fullStackModules } from '../data/courseData';
import { CourseModule } from '../components/CourseModule';
import { MockTest } from '../components/MockTest';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [activeModule, setActiveModule] = useState(0);
  const [activeTab, setActiveTab] = useState('lesson'); // 'lesson' | 'lab' | 'assignment' | 'resources' | 'interview' | 'test'
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [completedModuleIds, setCompletedModuleIds] = useState([]);

  const userName = localStorage.getItem('userName') || 'Student';

  useEffect(() => {
    const isEnrolled = localStorage.getItem('isEnrolled');
    const courseId = localStorage.getItem('enrolledCourse');

    if (!isEnrolled || !courseId) {
      navigate('/student-login');
    } else {
      setCourseData(courseId);
    }

    // Load completed modules from storage
    try {
      const saved = localStorage.getItem(`completed_${courseId}`);
      if (saved) setCompletedModuleIds(JSON.parse(saved));
    } catch (e) {}
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('isEnrolled');
    localStorage.removeItem('paymentStatus');
    localStorage.removeItem('enrolledCourse');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/student-login');
  };

  const isFullStack = courseData === 'full-stack' || courseData === 'fullstack-mern-001' || courseData === 'full-stack-dev';
  const courseTitle = isFullStack 
    ? 'Full Stack Web Development — MERN + GenAI' 
    : 'Digital Marketing Mastery with Gen AI';

  const modules = isFullStack ? fullStackModules : digitalMarketingModules;
  const currentModule = modules[activeModule] || modules[0];

  const handleMarkModuleComplete = (moduleId) => {
    if (!completedModuleIds.includes(moduleId)) {
      const updated = [...completedModuleIds, moduleId];
      setCompletedModuleIds(updated);
      localStorage.setItem(`completed_${courseData}`, JSON.stringify(updated));
    }
  };

  const completionPercentage = Math.round((completedModuleIds.length / modules.length) * 100);

  if (!courseData) return null;

  return (
    <PageTransition>
      <div className="pt-24 min-h-screen bg-brand-bg-light flex flex-col md:flex-row relative">
        
        {/* Sidebar */}
        <aside className="w-full md:w-88 bg-white border-r border-brand-border-light h-[calc(100vh-6rem)] overflow-y-auto flex-shrink-0 relative z-20 flex flex-col justify-between">
          <div>
            {/* Top Brand Header */}
            <div className="p-6 sticky top-0 bg-white/95 backdrop-blur-md border-b border-brand-border-light z-10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 bg-brand-navy/10 text-brand-navy rounded-md">
                  {isFullStack ? 'Full Stack Cohort' : 'Marketing Masterclass'}
                </span>
                <button onClick={handleLogout} className="text-xs text-brand-orange hover:underline font-bold">
                  Sign Out
                </button>
              </div>

              <h2 className="font-black text-brand-navy text-base leading-tight">
                {courseTitle}
              </h2>
              <p className="text-xs text-brand-text-muted mt-0.5">Welcome, <strong className="text-brand-navy">{userName}</strong></p>

              {/* Course Progress Bar */}
              <div className="mt-4 pt-3 border-t border-brand-border-light">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-[11px] font-bold text-brand-navy">Course Progress</span>
                  <span className="text-xs font-black text-brand-orange">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-brand-orange to-amber-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Gamification Streak & XP Widget */}
              <div className="mt-4">
                <GamificationWidget 
                  completedModulesCount={completedModuleIds.length} 
                  totalModules={modules.length} 
                  courseData={courseData} 
                />
              </div>
            </div>

            {/* Modules List */}
            <div className="p-4 space-y-1.5">
              <div className="px-2 py-1 text-[11px] font-extrabold text-brand-text-muted uppercase tracking-wider">
                Course Modules ({modules.length})
              </div>

              {modules.map((mod, idx) => {
                const isActive = activeModule === idx && activeTab === 'lesson';
                const isCompleted = completedModuleIds.includes(mod.id);

                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setActiveModule(idx);
                      setActiveTab('lesson');
                    }}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-center gap-3 ${
                      isActive 
                        ? 'bg-brand-navy/5 border border-brand-orange/40 shadow-sm' 
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isCompleted 
                        ? 'bg-green-100 text-green-700' 
                        : isActive 
                        ? 'bg-brand-orange text-white' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? '✓' : mod.id}
                    </div>
                    <div className="min-w-0 flex-grow">
                      <h4 className={`font-bold text-xs truncate ${isActive ? 'text-brand-orange' : 'text-brand-navy'}`}>
                        {mod.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-medium text-brand-text-muted">{mod.duration}</span>
                        {mod.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded font-semibold">
                            {mod.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Sidebar Action Cards */}
          <div className="p-4 border-t border-brand-border-light bg-gray-50/70 space-y-2">
            {/* Final Test Button */}
            <button 
              onClick={() => setActiveTab('test')}
              className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-center gap-3 ${
                activeTab === 'test' 
                  ? 'bg-brand-navy text-white shadow-lg' 
                  : 'bg-white hover:bg-gray-100 text-brand-navy border border-brand-border-light'
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                activeTab === 'test' ? 'bg-brand-orange text-white' : 'bg-brand-orange/10 text-brand-orange'
              }`}>
                ★
              </div>
              <div>
                <h4 className="font-extrabold text-xs">Final Certification Test</h4>
                <p className={`text-[10px] ${activeTab === 'test' ? 'text-gray-300' : 'text-brand-text-muted'}`}>Comprehensive MCQ Exam</p>
              </div>
            </button>

            {/* Certificate of Mastery Unlock */}
            <button 
              onClick={() => setIsCertificateOpen(true)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>🎓</span> View Official Certificate
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow p-4 md:p-8 lg:p-10 h-[calc(100vh-6rem)] overflow-y-auto relative z-10">
          <div className="max-w-4xl mx-auto pb-32">
            
            {/* VIP Community Banner */}
            <CommunityBanner courseTitle={courseTitle} />

            {/* Top Navigation Tabs */}
            {activeTab !== 'test' && (
              <div className="flex items-center gap-2 mb-6 bg-white p-1.5 rounded-2xl border border-brand-border-light shadow-sm overflow-x-auto">
                <button
                  onClick={() => setActiveTab('lesson')}
                  className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'lesson' 
                      ? 'bg-brand-navy text-white shadow-md' 
                      : 'text-brand-text-muted hover:text-brand-navy hover:bg-gray-100'
                  }`}
                >
                  <span>📖</span> Lesson & Media
                </button>
                <button
                  onClick={() => setActiveTab('lab')}
                  className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'lab' 
                      ? 'bg-brand-orange text-white shadow-md' 
                      : 'text-brand-text-muted hover:text-brand-navy hover:bg-gray-100'
                  }`}
                >
                  <span>🧪</span> {isFullStack ? 'Code Sandbox' : 'AI Ad Copy Lab'}
                </button>
                <button
                  onClick={() => setActiveTab('assignment')}
                  className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'assignment' 
                      ? 'bg-green-600 text-white shadow-md' 
                      : 'text-brand-text-muted hover:text-brand-navy hover:bg-gray-100'
                  }`}
                >
                  <span>📝</span> AI Project Reviewer
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'resources' 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'text-brand-text-muted hover:text-brand-navy hover:bg-gray-100'
                  }`}
                >
                  <span>📂</span> Resource Vault
                </button>
                <button
                  onClick={() => setActiveTab('interview')}
                  className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'interview' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-brand-text-muted hover:text-brand-navy hover:bg-gray-100'
                  }`}
                >
                  <span>🎯</span> AI Mock Interview
                </button>
              </div>
            )}

            {/* Tab 1: Lesson Content with 3-Way Mode Switcher (Video, Audio, Reading) */}
            {activeTab === 'lesson' && (
              <>
                <VideoLessonPlayer 
                  module={currentModule} 
                  courseData={courseData} 
                />

                {/* Course Module Markdown & Knowledge Check */}
                <CourseModule 
                  key={currentModule.id}
                  module={currentModule} 
                  onNext={() => setActiveModule(prev => Math.min(modules.length - 1, prev + 1))}
                  onPrev={() => setActiveModule(prev => Math.max(0, prev - 1))}
                  isFirst={activeModule === 0}
                  isLast={activeModule === modules.length - 1}
                  onCompleteModule={handleMarkModuleComplete}
                />
              </>
            )}

            {/* Tab 2: Interactive AI Lab & Code/Prompt Sandbox */}
            {activeTab === 'lab' && (
              <AILabSandbox 
                courseData={courseData} 
                activeModuleTitle={currentModule.title} 
              />
            )}

            {/* Tab 3: AI Assignment Reviewer */}
            {activeTab === 'assignment' && (
              <AIAssignmentEvaluator 
                module={currentModule} 
                courseData={courseData} 
              />
            )}

            {/* Tab 4: Downloadable Resource Vault */}
            {activeTab === 'resources' && (
              <ResourceVault 
                courseData={courseData} 
              />
            )}

            {/* Tab 5: AI Mock Interview Simulator */}
            {activeTab === 'interview' && (
              <AIMockInterview 
                courseData={courseData} 
                onInterviewCompleted={() => handleMarkModuleComplete(currentModule.id)}
              />
            )}

            {/* Tab 6: Final Certification Mock Test */}
            {activeTab === 'test' && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <button 
                    onClick={() => setActiveTab('lesson')}
                    className="text-xs font-bold text-brand-navy hover:text-brand-orange flex items-center gap-1.5"
                  >
                    ← Back to Course Lessons
                  </button>
                </div>
                <MockTest courseData={courseData} />
              </div>
            )}

          </div>
        </main>

        {/* 24/7 Human-Like AI Voice Tutor Widget */}
        <AITutor 
          courseData={courseData} 
          activeModuleTitle={currentModule.title} 
        />

        {/* Verifiable Certificate Modal */}
        <CertificateModal
          isOpen={isCertificateOpen}
          onClose={() => setIsCertificateOpen(false)}
          userName={userName}
          courseTitle={courseTitle}
        />

      </div>
    </PageTransition>
  );
};
