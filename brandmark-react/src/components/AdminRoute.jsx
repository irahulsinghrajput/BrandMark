import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // Temporary override for development until full auth migration is complete
      // In production, check session?.user?.app_metadata?.role === 'admin'
      const isDev = import.meta.env.DEV;
      if (isDev) {
         setIsAdmin(true);
      } else if (session) {
         setIsAdmin(session.user.app_metadata?.role === 'admin');
      } else {
         setIsAdmin(false);
      }
      setLoading(false);
    };
    checkAdmin();
  }, []);

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-brand-navy font-bold">Verifying Administrator Access...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/student-login" />;
  }

  return children;
};
