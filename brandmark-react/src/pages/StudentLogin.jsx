import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [courseId, setCourseId] = useState('digital-marketing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/students/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, courseId })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      // Check if student has enrollment for this specific course
      const enrolledCourses = data.data?.enrolledCourses || [];
      const hasCourse = enrolledCourses.some((c) => c.courseId === courseId);

      if (!hasCourse && enrolledCourses.length > 0) {
        throw new Error(`You are registered, but you do NOT have an active enrollment for this course. Please select your enrolled course or purchase access.`);
      }

      // Success - Save authentication & course state
      localStorage.setItem('studentToken', data.data.token);
      localStorage.setItem('isEnrolled', 'true');
      localStorage.setItem('paymentStatus', 'success');
      localStorage.setItem('enrolledCourse', courseId);
      localStorage.setItem('userEmail', data.data.email);
      localStorage.setItem('userName', data.data.name);

      toast.success('Logged in successfully!');
      navigate('/dashboard');

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Unable to log in. Please verify your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 bg-brand-bg-light flex items-center justify-center px-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-brand-orange/20 rounded-full filter blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-brand-navy/10 rounded-full filter blur-[100px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-brand-border-light p-8 md:p-10 rounded-3xl shadow-2xl relative z-10"
        >
          <div className="text-center mb-8">
            <span className="px-3 py-1 bg-brand-navy/10 text-brand-navy text-xs font-bold uppercase tracking-wider rounded-full inline-block mb-3">
              BrandMark Student Portal
            </span>
            <h1 className="text-3xl font-extrabold text-brand-navy mb-2">Welcome Back</h1>
            <p className="text-xs text-brand-text-muted">Log in to access your enrolled course modules and AI Tutor.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold text-center leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-2">Select Course to Access *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCourseId('digital-marketing')}
                  className={`p-3 rounded-xl text-xs font-bold text-center border transition-all ${
                    courseId === 'digital-marketing'
                      ? 'bg-brand-navy text-white border-brand-navy shadow-md'
                      : 'bg-white text-brand-navy border-brand-border-light hover:bg-gray-50'
                  }`}
                >
                  Digital Marketing
                </button>
                <button
                  type="button"
                  onClick={() => setCourseId('full-stack-dev')}
                  className={`p-3 rounded-xl text-xs font-bold text-center border transition-all ${
                    courseId === 'full-stack-dev'
                      ? 'bg-brand-navy text-white border-brand-navy shadow-md'
                      : 'bg-white text-brand-navy border-brand-border-light hover:bg-gray-50'
                  }`}
                >
                  Full Stack GenAI
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1" htmlFor="email">Email Address *</label>
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-brand-border-light rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1" htmlFor="password">Password *</label>
              <input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-brand-border-light rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-brand-orange text-white font-bold rounded-xl hover:bg-brand-orange-dark transition-all duration-300 shadow-md hover:shadow-lg mt-2 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Authenticating...
                </>
              ) : (
                'Access Dashboard →'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-brand-text-muted">
              Don't have an account or enrolled in a new course?{' '}
              <button onClick={() => navigate('/courses')} className="text-brand-orange font-bold hover:underline">
                Enroll Now
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};
