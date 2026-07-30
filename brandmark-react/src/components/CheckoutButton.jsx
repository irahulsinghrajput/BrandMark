import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const CheckoutButton = ({ courseId, price, buttonText = "Enroll Now", className }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    setShowModal(true);
  };

  const simulateRazorpay = () => {
    setIsProcessing(true);
    
    // Simulate Razorpay API call and payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowModal(false);
      
      // Grant access
      localStorage.setItem('isEnrolled', 'true');
      localStorage.setItem('enrolledCourse', courseId);
      
      // Redirect to protected dashboard
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <>
      <button 
        onClick={handleCheckoutClick}
        className={className || "w-full py-4 mb-8 bg-brand-orange text-white font-bold uppercase tracking-widest rounded-xl hover:bg-brand-orange-dark transition-colors duration-300 shadow-md"}
      >
        {buttonText}
      </button>

      {/* Simulated Razorpay Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
            >
              {/* Razorpay Header */}
              <div className="bg-[#02042b] p-6 text-white text-center">
                <h3 className="font-bold text-lg tracking-wider mb-1">RAZORPAY SECURE</h3>
                <p className="text-sm text-gray-400">BrandMark Solutions Private Ltd.</p>
              </div>

              {/* Order Details */}
              <div className="p-8">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-6">
                  <span className="text-gray-500 font-medium">Payable Amount</span>
                  <span className="text-3xl font-extrabold text-brand-navy">₹{price}</span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-brand-orange transition-colors">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">💳</div>
                    <div className="font-semibold text-brand-navy">Card</div>
                  </div>
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-brand-orange transition-colors">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">📱</div>
                    <div className="font-semibold text-brand-navy">UPI</div>
                  </div>
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-brand-orange transition-colors">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">🏦</div>
                    <div className="font-semibold text-brand-navy">Netbanking</div>
                  </div>
                </div>

                <button 
                  onClick={simulateRazorpay}
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#3399cc] text-white font-bold rounded-lg hover:bg-[#2b88b5] transition-colors flex justify-center items-center"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Processing...
                    </span>
                  ) : (
                    `Pay ₹${price}`
                  )}
                </button>

                <button 
                  onClick={() => setShowModal(false)}
                  disabled={isProcessing}
                  className="w-full mt-4 py-2 text-gray-400 font-medium hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
