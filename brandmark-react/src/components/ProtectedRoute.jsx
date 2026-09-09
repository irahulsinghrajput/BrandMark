import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const isEnrolled = localStorage.getItem('isEnrolled');
  const paymentStatus = localStorage.getItem('paymentStatus');
  const enrolledCourse = localStorage.getItem('enrolledCourse');

  // Strict check: User must be either explicitly enrolled (via login/checkout) AND have a valid course selected
  if ((isEnrolled === 'true' || paymentStatus === 'success') && enrolledCourse) {
    return children;
  }

  // Redirect unauthorized users to student login
  return <Navigate to="/student-login" replace />;
};
