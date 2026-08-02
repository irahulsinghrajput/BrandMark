import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const ClientRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const checkClient = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // Temporary override for development until full auth migration is complete
      const isDev = import.meta.env.DEV;
      if (isDev) {
         setIsClient(true);
      } else if (session) {
         setIsClient(session.user.app_metadata?.role === 'client');
      } else {
         setIsClient(false);
      }
      setLoading(false);
    };
    checkClient();
  }, []);

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-brand-navy font-bold">Verifying Client Access...</div>;
  }

  if (!isClient) {
    return <Navigate to="/client-login" />;
  }

  return children;
};
