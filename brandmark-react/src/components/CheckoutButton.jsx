import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const CheckoutButton = ({ courseId, price, buttonText = "Enroll Now", className }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleCheckoutClick = async () => {
    setIsProcessing(true);

    // Prompt for email (since backend requires it for the order and receipt)
    const email = window.prompt("Please enter your email to proceed with enrollment:", "");
    if (!email || !email.includes('@')) {
      alert("A valid email is required to process your payment.");
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Load Razorpay Script
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you offline?");
        setIsProcessing(false);
        return;
      }

      // 2. Call Vercel backend to create order
      // Fallback to relative URL if VITE_API_URL isn't fully qualified
      const apiUrl = import.meta.env.VITE_API_URL || ''; 
      const orderResponse = await fetch(`${apiUrl}/api/courses/${courseId}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // 3. Initialize native Razorpay popup
      const options = {
        key: orderData.data.keyId,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: "BrandMark Academy",
        description: orderData.data.courseTitle,
        order_id: orderData.data.orderId,
        handler: async function (response) {
          // 4. Verify payment signature on the backend
          try {
            const verifyRes = await fetch(`${apiUrl}/api/courses/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId,
                email
              })
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              // Grant access locally
              localStorage.setItem('isEnrolled', 'true');
              localStorage.setItem('enrolledCourse', courseId);
              localStorage.setItem('userEmail', email);
              // Redirect to protected dashboard
              navigate('/dashboard');
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment successful, but verification failed. Support will contact you.");
          }
        },
        prefill: {
          email: email,
        },
        theme: {
          color: "#f26a21", // brand-orange
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        alert("Payment failed: " + response.error.description);
      });
      
      paymentObject.open();

    } catch (error) {
      console.error("Checkout error:", error);
      alert(error.message || "Failed to process checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button 
      onClick={handleCheckoutClick}
      disabled={isProcessing}
      className={className || "w-full py-4 mb-8 bg-brand-orange text-white font-bold uppercase tracking-widest rounded-xl hover:bg-brand-orange-dark transition-colors duration-300 shadow-md flex justify-center items-center"}
    >
      {isProcessing ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Loading...
        </span>
      ) : (
        buttonText
      )}
    </button>
  );
};
