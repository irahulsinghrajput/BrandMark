import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const TIERS = [
  {
    id: 'self-paced',
    name: 'Self-Paced Masterclass',
    badge: 'Essential',
    price: 99,
    formattedPrice: '₹99',
    description: 'Full 15 curriculum modules, 24/7 AI Tutor, audio narration, and certificate.',
    perks: [
      '15 Deep GenAI Curriculum Modules',
      '24/7 Human-Like AI Tutor with Voice Speech',
      'Podcast-Mode Audio Lesson Player',
      'Official Certificate of Mastery'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Agency & Developer Tier',
    badge: '★ Recommended / Best Value',
    price: 999,
    formattedPrice: '₹999',
    description: 'Everything in Self-Paced plus the exclusive Downloadable Resource Vault and AI Mock Interview Simulator.',
    perks: [
      'Everything in Self-Paced Masterclass',
      'Downloadable Resource Vault (Templates & SOPs)',
      '100+ GenAI Prompt Bank & Boilerplates',
      'AI Mock Interview Simulator & Readiness Scoring',
      'VIP WhatsApp Student Network Access'
    ]
  },
  {
    id: 'mentorship',
    name: '1-on-1 VIP Mentorship Cohort',
    badge: 'VIP Placement Cohort',
    price: 4999,
    formattedPrice: '₹4,999',
    description: 'Everything in Pro Tier plus weekly live founder Q&A sessions and direct resume/portfolio reviews.',
    perks: [
      'Everything in Pro Tier',
      'Weekly Live Zoom Q&A with Founders',
      'Personalized Resume & Portfolio Audit',
      'Direct 1-on-1 WhatsApp Mentorship Channel',
      'Priority Client Acquisition / Placement Support'
    ]
  }
];

const courseDetails = {
  'digital-marketing': {
    id: 'digital-marketing',
    title: 'Digital Marketing Mastery with Gen AI',
    badge: '15-Module Masterclass',
    duration: 'Mastery Curriculum',
    description: 'Master AI-driven content creation, SEO, performance marketing, and automated campaign strategy.'
  },
  'full-stack-dev': {
    id: 'full-stack-dev',
    title: 'Full Stack Web Development — MERN + GenAI',
    badge: 'Engineering Cohort',
    duration: 'Full Stack + GenAI',
    description: 'Build production-ready web apps with React 18, Next.js, Node.js, Express, MongoDB, and AI Agent workflows.'
  }
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const EnrollmentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Normalize courseId if legacy or missing
  const activeCourseId = courseId === 'full-stack' || courseId === 'fullstack-mern-001' ? 'full-stack-dev' : 
                         (courseId === 'digital-marketing-001' ? 'digital-marketing' : (courseId || 'digital-marketing'));

  const course = courseDetails[activeCourseId] || courseDetails['digital-marketing'];

  const [step, setStep] = useState(1); // Step 1: Details & Tier, Step 2: Payment, Step 3: Password
  const [selectedTier, setSelectedTier] = useState('pro'); // default to recommended pro tier
  const [isProcessing, setIsProcessing] = useState(false);

  const activeTier = TIERS.find(t => t.id === selectedTier) || TIERS[1];

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    paymentId: '',
    orderId: ''
  });

  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  // Restore pending enrollment if user previously paid but registration step was interrupted
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pendingEnrollment');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.courseId === course.id && parsed.paymentId) {
          if (parsed.formData) setFormData(parsed.formData);
          if (parsed.tier) setSelectedTier(parsed.tier);
          setPaymentInfo({
            paymentId: parsed.paymentId,
            orderId: parsed.orderId || ''
          });
          setStep(3);
        }
      }
    } catch (e) {
      console.warn('Could not restore pending enrollment:', e);
    }
  }, [course.id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Step 1 -> Step 2
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setError('Please enter a valid phone number (at least 10 digits)');
      return;
    }
    if (!formData.age || isNaN(formData.age) || Number(formData.age) < 10 || Number(formData.age) > 100) {
      setError('Please enter a valid age');
      return;
    }

    setStep(2);
  };

  // Step 2: Pay Now via Razorpay
  const handlePayNow = async () => {
    setIsProcessing(true);
    setError('');

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway SDK. Please check your internet connection.');
      }

      const apiUrl = import.meta.env.VITE_API_URL || '';
      
      const orderResponse = await fetch(`${apiUrl}/api/courses/${course.id}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          tier: selectedTier,
          customAmount: activeTier.price
        })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to initialize order');
      }

      const options = {
        key: orderData.data.keyId,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: "BrandMark Academy",
        description: `${course.title} (${activeTier.name})`,
        order_id: orderData.data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${apiUrl}/api/courses/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: course.id,
                email: formData.email,
                tier: selectedTier
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              const payData = {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id
              };
              setPaymentInfo(payData);
              // Save pending enrollment so student never loses paid state if password step fails or page refreshes
              localStorage.setItem('pendingEnrollment', JSON.stringify({
                formData,
                tier: selectedTier,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                courseId: course.id,
                courseTitle: course.title
              }));
              toast.success('Payment verified successfully!');
              setStep(3);
            } else {
              setError('Payment verification failed. Please contact support.');
              toast.error('Payment verification failed.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            setError('Payment succeeded, but signature verification encountered an error.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#0B2C4D"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function (response) {
        setError(response.error.description || 'Payment failed. Please try again.');
        toast.error('Payment failed.');
        setIsProcessing(false);
      });

    } catch (err) {
      console.error('Order creation error:', err);
      setError(err.message || 'Unable to open checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 3: Password Creation & Final Registration
  const handleRegisterAccount = async (e) => {
    e.preventDefault();
    setError('');

    if (!passwordData.password || passwordData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (passwordData.password !== passwordData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsProcessing(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/students/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          age: Number(formData.age),
          password: passwordData.password,
          courseId: course.id,
          courseTitle: course.title,
          tier: selectedTier,
          paymentId: paymentInfo.paymentId || `pay_demo_${Date.now()}`,
          orderId: paymentInfo.orderId || `order_demo_${Date.now()}`
        })
      });

      const data = await response.json();

      if (!data.success) {
        const errorDetail = data.error ? `${data.message} (${data.error})` : (data.message || 'Registration failed.');
        throw new Error(errorDetail);
      }

      // Store credentials locally
      localStorage.setItem('studentToken', data.data.token);
      localStorage.setItem('isEnrolled', 'true');
      localStorage.setItem('paymentStatus', 'success');
      localStorage.setItem('enrolledCourse', course.id);
      localStorage.setItem('enrolledTier', selectedTier);
      localStorage.setItem('userEmail', data.data.email);
      localStorage.setItem('userName', data.data.name);
      localStorage.removeItem('pendingEnrollment');

      toast.success('Account created & enrolled successfully!');
      navigate('/dashboard');

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to complete registration.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-20 bg-brand-bg-light relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-brand-orange/15 rounded-full filter blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-brand-navy/10 rounded-full filter blur-[120px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          
          {/* Breadcrumb navigation */}
          <div className="mb-8 flex items-center justify-between">
            <Link to="/courses" className="text-brand-navy font-bold text-sm hover:text-brand-orange transition-colors flex items-center gap-2">
              ← Back to Courses
            </Link>
            <span className="text-xs uppercase font-extrabold tracking-widest px-3 py-1 bg-brand-navy/10 text-brand-navy rounded-full">
              Step {step} of 3
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Column: Course Overview Summary Card */}
            <div className="lg:col-span-5 bg-brand-navy text-white rounded-3xl p-8 shadow-xl relative overflow-hidden border border-gray-800">
              <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-48 h-48 bg-brand-orange/20 rounded-full filter blur-3xl pointer-events-none"></div>
              
              <span className="inline-block px-3 py-1 bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider rounded-md mb-4">
                {activeTier.badge}
              </span>
              <h2 className="text-2xl font-black mb-2 leading-tight">{course.title}</h2>
              <p className="text-gray-300 text-xs font-light mb-6 leading-relaxed">{activeTier.description}</p>
              
              <div className="border-t border-b border-gray-700/60 py-4 my-6 flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-medium">Selected Tier</span>
                  <span className="text-3xl font-extrabold text-white">{activeTier.formattedPrice}</span>
                  <span className="text-[11px] text-brand-orange block font-bold mt-0.5">{activeTier.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 block uppercase font-medium">Access</span>
                  <span className="text-sm font-semibold text-emerald-400">Lifetime Included</span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-gray-200 mb-3 uppercase tracking-wider">Plan Inclusions:</h4>
              <ul className="space-y-2.5">
                {activeTier.perks.map((item, idx) => (
                  <li key={idx} className="flex items-start text-xs text-gray-300 gap-2">
                    <span className="text-brand-orange font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Step-by-Step Enrollment Form */}
            <div className="lg:col-span-7 bg-white/80 backdrop-blur-xl border border-brand-border-light rounded-3xl p-8 shadow-xl">
              
              {/* Stepper Progress Bar */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-brand-border-light">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-brand-navy font-bold' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-brand-navy text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                  <span className="text-xs md:text-sm">Tier & Info</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-3">
                  <div className="h-full bg-brand-orange transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
                </div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-brand-navy font-bold' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-brand-navy text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                  <span className="text-xs md:text-sm">Payment</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-3">
                  <div className="h-full bg-brand-orange transition-all duration-500" style={{ width: step === 3 ? '100%' : '0%' }}></div>
                </div>
                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-brand-navy font-bold' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-brand-navy text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                  <span className="text-xs md:text-sm">Password</span>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold text-center">
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                
                {/* STEP 1: PLAN SELECTOR & STUDENT DETAILS */}
                {step === 1 && (
                  <motion.form 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleProceedToPayment} 
                    className="space-y-6"
                  >
                    {/* Tier Selection */}
                    <div>
                      <h3 className="text-xl font-extrabold text-brand-navy mb-1">Select Learning Tier</h3>
                      <p className="text-xs text-brand-text-muted mb-4">Choose the plan that fits your career and execution goals.</p>

                      <div className="space-y-3">
                        {TIERS.map((tier) => {
                          const isSelected = selectedTier === tier.id;
                          return (
                            <div
                              key={tier.id}
                              onClick={() => setSelectedTier(tier.id)}
                              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                isSelected 
                                  ? 'border-brand-orange bg-brand-orange/5 shadow-md' 
                                  : 'border-brand-border-light hover:border-brand-navy/30 bg-white'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <input 
                                    type="radio" 
                                    name="tier" 
                                    checked={isSelected} 
                                    onChange={() => setSelectedTier(tier.id)} 
                                    className="accent-brand-orange w-4 h-4"
                                  />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-extrabold text-sm text-brand-navy">{tier.name}</span>
                                      {tier.id === 'pro' && (
                                        <span className="px-2 py-0.5 bg-brand-orange text-white text-[9px] font-black uppercase rounded">
                                          Recommended
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-brand-text-muted mt-0.5">{tier.description}</p>
                                  </div>
                                </div>
                                <span className="text-base font-black text-brand-navy pl-2 whitespace-nowrap">
                                  {tier.formattedPrice}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Student Info */}
                    <div className="pt-4 border-t border-brand-border-light space-y-4">
                      <h4 className="font-extrabold text-sm text-brand-navy">Student Contact Information</h4>

                      <div>
                        <label className="block text-xs font-bold text-brand-navy mb-1" htmlFor="name">Full Name *</label>
                        <input 
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Rahul Singh"
                          className="w-full px-4 py-3 bg-white border border-brand-border-light rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-brand-navy mb-1" htmlFor="email">Email Address *</label>
                          <input 
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="rahul@example.com"
                            className="w-full px-4 py-3 bg-white border border-brand-border-light rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-brand-navy mb-1" htmlFor="phone">Phone Number *</label>
                          <input 
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91 9876543210"
                            className="w-full px-4 py-3 bg-white border border-brand-border-light rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-brand-navy mb-1" htmlFor="age">Age *</label>
                        <input 
                          id="age"
                          name="age"
                          type="number"
                          min="10"
                          max="100"
                          value={formData.age}
                          onChange={handleInputChange}
                          placeholder="e.g. 24"
                          className="w-full px-4 py-3 bg-white border border-brand-border-light rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-4 bg-brand-orange text-white font-bold rounded-xl hover:bg-brand-orange-dark transition-all duration-300 shadow-md hover:shadow-lg text-sm uppercase tracking-wider"
                    >
                      Proceed to Checkout ({activeTier.formattedPrice}) →
                    </button>
                  </motion.form>
                )}

                {/* STEP 2: PAYMENT */}
                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl font-extrabold text-brand-navy mb-1">Confirm & Pay</h3>
                      <p className="text-xs text-brand-text-muted">Review your selected tier and details before initiating secure Razorpay checkout.</p>
                    </div>

                    <div className="bg-brand-bg-light rounded-2xl p-5 border border-brand-border-light text-xs space-y-2">
                      <div className="flex justify-between"><span className="text-brand-text-muted">Name:</span> <span className="font-bold text-brand-navy">{formData.name}</span></div>
                      <div className="flex justify-between"><span className="text-brand-text-muted">Email:</span> <span className="font-bold text-brand-navy">{formData.email}</span></div>
                      <div className="flex justify-between"><span className="text-brand-text-muted">Phone:</span> <span className="font-bold text-brand-navy">{formData.phone}</span></div>
                      <div className="flex justify-between"><span className="text-brand-text-muted">Age:</span> <span className="font-bold text-brand-navy">{formData.age} yrs</span></div>
                      <div className="flex justify-between pt-2 border-t border-brand-border-light"><span className="text-brand-text-muted">Course:</span> <span className="font-bold text-brand-navy">{course.title}</span></div>
                      <div className="flex justify-between"><span className="text-brand-text-muted">Plan:</span> <span className="font-bold text-brand-orange">{activeTier.name}</span></div>
                      <div className="flex justify-between font-bold text-sm text-brand-navy pt-2 border-t border-brand-border-light"><span className="text-brand-navy font-bold">Total Amount Payable:</span> <span className="text-brand-navy font-extrabold text-base">{activeTier.formattedPrice}</span></div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-1/3 py-4 bg-gray-100 text-brand-navy font-bold rounded-xl hover:bg-gray-200 transition-all text-xs uppercase tracking-wider"
                      >
                        ← Edit Info
                      </button>
                      <button 
                        onClick={handlePayNow}
                        disabled={isProcessing}
                        className="w-2/3 py-4 bg-brand-orange text-white font-bold rounded-xl hover:bg-brand-orange-dark transition-all shadow-md hover:shadow-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Opening Razorpay...
                          </>
                        ) : (
                          `Pay ${activeTier.formattedPrice} via Razorpay 🔒`
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: CREATE PASSWORD */}
                {step === 3 && (
                  <motion.form 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleRegisterAccount}
                    className="space-y-5"
                  >
                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl text-xs flex items-center gap-3">
                      <span className="text-xl">🎉</span>
                      <div>
                        <strong className="block font-bold text-sm">Payment Successful for {activeTier.name}!</strong>
                        <span>Create your secret account password to complete registration and log in.</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-extrabold text-brand-navy mb-1">Set Password</h3>
                      <p className="text-xs text-brand-text-muted">You will use this password to log in directly next time.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-navy mb-1" htmlFor="password">Create Password *</label>
                      <input 
                        id="password"
                        name="password"
                        type="password"
                        value={passwordData.password}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-white border border-brand-border-light rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors"
                        required
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-navy mb-1" htmlFor="confirmPassword">Confirm Password *</label>
                      <input 
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-white border border-brand-border-light rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors"
                        required
                        minLength={6}
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-4 bg-brand-navy text-white font-bold rounded-xl hover:bg-brand-navy/90 transition-all duration-300 shadow-md hover:shadow-lg text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Finalizing Registration...
                        </>
                      ) : (
                        'Generate Password & Access Course Dashboard'
                      )}
                    </button>
                  </motion.form>
                )}

              </AnimatePresence>

            </div>

          </div>

        </div>
      </div>
    </PageTransition>
  );
};
