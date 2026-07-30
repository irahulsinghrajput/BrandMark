import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { motion } from 'framer-motion';

export const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Simulated Authentication Logic
    // In a real app, this would be an API call to /api/auth/login
    if (email && password) {
      // For demonstration, any non-empty credential works, but we enforce it sets the token
      localStorage.setItem('isEnrolled', 'true');
      localStorage.setItem('paymentStatus', 'success');
      
      // Defaulting to digital marketing if no course was selected during a previous session
      if (!localStorage.getItem('enrolledCourse')) {
        localStorage.setItem('enrolledCourse', 'digital-marketing');
      }

      navigate('/dashboard');
    } else {
      setError('Please enter both email and password.');
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
          className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-brand-border-light p-10 rounded-3xl shadow-2xl relative z-10"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-brand-navy mb-2">Student Portal</h1>
            <p className="text-brand-text-muted">Welcome back. Please log in to access your dashboard.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-brand-navy mb-2" htmlFor="email">Email Address</label>
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-white border border-brand-border-light rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors"
                placeholder="mark@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-brand-navy mb-2" htmlFor="password">Password</label>
              <input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white border border-brand-border-light rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-brand-navy text-white font-bold rounded-xl hover:bg-brand-navy-dark transition-all duration-300 shadow-lg hover:shadow-xl mt-4"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-brand-text-muted">
              Don't have an account? <button onClick={() => navigate('/courses')} className="text-brand-orange font-bold hover:underline">Browse Courses</button>
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};
