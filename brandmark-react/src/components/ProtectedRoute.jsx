import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const isEnrolled = localStorage.getItem('isEnrolled');
  const paymentStatus = localStorage.getItem('paymentStatus');

  // Strict check: User must be either explicitly enrolled (via login) OR have a successful payment token
  if (isEnrolled === 'true' || paymentStatus === 'success') {
    return children;
  }

  // Redirect unauthorized users to courses page
  return <Navigate to="/courses" replace />;
};
