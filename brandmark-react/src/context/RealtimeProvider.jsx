import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import * as Sentry from '@sentry/react';
import toast from 'react-hot-toast';

const RealtimeContext = createContext(null);

export const RealtimeProvider = ({ children }) => {
  const [status, setStatus] = useState('disconnected');
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    let reconnectTimer;
    let channel;

    const setupConnection = async () => {
      try {
        setStatus('connecting');
        
        // Use a single global channel for app-wide presence & health
        channel = supabase.channel('bmos_global_realtime');
        
        channel
          .on('system', { event: '*' }, (payload) => {
            console.log('System Event:', payload);
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              setStatus('connected');
              setConnection(channel);
            } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
              setStatus('disconnected');
              setConnection(null);
              // Exponential backoff or simple reconnect logic could go here
            }
          });

      } catch (error) {
        Sentry.captureException(error);
        setStatus('error');
      }
    };

    setupConnection();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      clearTimeout(reconnectTimer);
    };
  }, []);

  return (
    <RealtimeContext.Provider value={{ status, connection }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useGlobalRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useGlobalRealtime must be used within a RealtimeProvider');
  }
  return context;
};
