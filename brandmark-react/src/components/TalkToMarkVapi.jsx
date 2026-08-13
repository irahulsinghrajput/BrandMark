import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../contexts/ModalContext';
import Vapi from '@vapi-ai/web';

let vapi = null;
let vapiConfigured = false;

try {
  const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || '';
  const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID || '';
  const hasValidConfig = Boolean(publicKey && assistantId);

  if (hasValidConfig && typeof Vapi === 'function') {
    vapiConfigured = true;
    vapi = new Vapi(publicKey);
  }
} catch (error) {
  console.error('Vapi initialization failed. Falling back to the support experience:', error);
}

export const TalkToMarkVapi = () => {
  const navigate = useNavigate();
  const { isTalkToMarkOpen, closeTalkToMark } = useModal();
  const [callStatus, setCallStatus] = useState('inactive');
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Ready to talk');
  const [fallbackMode, setFallbackMode] = useState(!vapiConfigured);

  useEffect(() => {
    if (!vapi || !vapiConfigured) return;

    const onCallStart = () => {
      setCallStatus('active');
      setStatusMessage('Connected');
    };
    const onCallEnd = () => {
      setCallStatus('inactive');
      setVolumeLevel(0);
      setStatusMessage('Ready to talk');
    };
    const onVolumeLevel = (level) => setVolumeLevel(level);
    const onError = () => {
      setCallStatus('inactive');
      setStatusMessage('Voice call unavailable right now');
      setFallbackMode(true);
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('volume-level', onVolumeLevel);
    vapi.on('error', onError);

    return () => {
      vapi.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (!isTalkToMarkOpen && callStatus === 'active' && vapi) {
      vapi.stop();
    }
  }, [isTalkToMarkOpen, callStatus]);

  const toggleCall = async () => {
    if (!vapi || !vapiConfigured) {
      setFallbackMode(true);
      setStatusMessage('Voice calling is unavailable right now. Please use chat or WhatsApp instead.');
      closeTalkToMark();
      navigate('/contact');
      return;
    }

    if (callStatus === 'active') {
      setCallStatus('loading');
      vapi.stop();
      return;
    }

    setCallStatus('loading');
    setStatusMessage('Connecting...');
    const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID || '';

    try {
      await vapi.start(assistantId);
    } catch (error) {
      console.error('Failed to start Vapi call:', error);
      setStatusMessage('Voice call unavailable right now');
      setFallbackMode(true);
      setCallStatus('inactive');
    }
  };

  const renderWaveform = () => {
    const bars = Array.from({ length: 5 }).map((_, i) => {
      const scale = callStatus === 'active' ? 1 + (volumeLevel * Math.random() * 2) : 1;
      return (
        <motion.div
          key={i}
          animate={{ height: `${20 * scale}px` }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.1 }}
          className="w-1.5 bg-white rounded-full mx-0.5"
          style={{ minHeight: '4px' }}
        />
      );
    });
    return <div className="flex items-center justify-center h-10 mt-2">{bars}</div>;
  };

  return (
    <AnimatePresence>
      {isTalkToMarkOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTalkToMark}
            className="absolute inset-0 bg-brand-navy/60 backdrop-blur-md cursor-pointer"
          ></motion.div>

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-sm bg-[#0B2C4D] h-full shadow-2xl relative z-10 flex flex-col border-l border-brand-orange/20"
          >
            <div className="p-6 border-b border-brand-border-light/10 flex justify-between items-center bg-[#071F36]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-brand-orange animate-pulse"></div>
                <h2 className="text-xl font-bold text-white">AI Voice Agent</h2>
              </div>
              <button
                onClick={closeTalkToMark}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-brand-orange transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center p-8 relative overflow-hidden">
              <motion.div
                animate={{
                  scale: callStatus === 'active' ? 1 + volumeLevel : 1,
                  opacity: callStatus === 'active' ? 0.3 + (volumeLevel * 0.3) : 0.1
                }}
                className="absolute w-64 h-64 bg-brand-orange rounded-full filter blur-[80px] pointer-events-none"
              />

              <div className="text-center z-10">
                <div className="w-32 h-32 rounded-full bg-brand-navy mx-auto mb-6 overflow-hidden border-4 border-brand-orange/40 relative group shadow-[0_0_30px_rgba(242,106,33,0.3)]">
                  <img src="/assets/chatbot-icon.jpg" alt="Mark AI" className="w-full h-full object-cover" />

                  {callStatus === 'loading' && (
                    <div className="absolute inset-0 bg-brand-navy/80 flex items-center justify-center">
                      <svg className="animate-spin h-8 w-8 text-brand-orange" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>

                <h3 className="text-3xl font-bold text-white mb-2">Mark AI</h3>
                <p className="text-brand-orange text-sm uppercase tracking-widest font-semibold mb-8">
                  {statusMessage}
                </p>

                <div className="h-16 w-full flex items-center justify-center mb-10">
                  {callStatus === 'active' ? renderWaveform() : <div className="h-1 w-20 bg-white/20 rounded-full"></div>}
                </div>
              </div>

              <div className="w-full z-10 mt-auto">
                <button
                  onClick={toggleCall}
                  disabled={callStatus === 'loading'}
                  className={`w-full py-5 font-bold uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center gap-3 ${
                    callStatus === 'active'
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                      : 'bg-brand-orange hover:bg-brand-orange-dark text-white shadow-brand-orange/20 hover:shadow-[0_0_20px_rgba(242,106,33,0.6)]'
                  }`}
                >
                  {callStatus === 'active' ? (
                    <>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      End Call
                    </>
                  ) : fallbackMode ? (
                    <>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      Continue with Chat
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      Start Voice Call
                    </>
                  )}
                </button>
                <p className="text-xs text-center text-white/40 mt-4">
                  {fallbackMode ? 'Voice calling is not available right now, but you can still request a callback or continue through chat.' : 'Microphone access required. Please allow permissions when prompted.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
