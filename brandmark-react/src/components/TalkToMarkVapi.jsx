import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../contexts/ModalContext';
import Vapi from '@vapi-ai/web';

// Initialize Vapi outside the component to prevent multiple instances
// Wrap in try-catch to prevent app crash if initialization fails due to missing keys or network errors
let vapi = null;
try {
  vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY || 'dummy_public_key');
} catch (error) {
  console.error("Vapi initialization failed. Check your VITE_VAPI_PUBLIC_KEY in .env:", error);
}

export const TalkToMarkVapi = () => {
  const { isTalkToMarkOpen, closeTalkToMark } = useModal();
  const [callStatus, setCallStatus] = useState('inactive'); // inactive, loading, active
  const [volumeLevel, setVolumeLevel] = useState(0);
  
  useEffect(() => {
    if (!vapi) return;

    // Setup event listeners for Vapi
    const onCallStart = () => setCallStatus('active');
    const onCallEnd = () => {
      setCallStatus('inactive');
      setVolumeLevel(0);
    };
    const onVolumeLevel = (level) => setVolumeLevel(level);
    const onError = (e) => {
      console.error(e);
      setCallStatus('inactive');
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('volume-level', onVolumeLevel);
    vapi.on('error', onError);

    return () => {
      // Cleanup listeners
      vapi.removeAllListeners();
    };
  }, []);

  // Ensure call ends if modal is closed unexpectedly
  useEffect(() => {
    if (!isTalkToMarkOpen && callStatus === 'active' && vapi) {
      vapi.stop();
    }
  }, [isTalkToMarkOpen, callStatus]);

  const toggleCall = async () => {
    if (!vapi) {
      alert("Vapi SDK failed to initialize. Please check your API keys.");
      return;
    }

    if (callStatus === 'active') {
      setCallStatus('loading');
      vapi.stop();
    } else {
      setCallStatus('loading');
      const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID || 'dummy_assistant_id';
      try {
        await vapi.start(assistantId);
      } catch (err) {
        console.error("Failed to start Vapi call:", err);
        setCallStatus('inactive');
      }
    }
  };

  const renderWaveform = () => {
    const bars = Array.from({ length: 5 }).map((_, i) => {
      // Create an animated scale based on volumeLevel (0 to 1 range usually)
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
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTalkToMark}
            className="absolute inset-0 bg-brand-navy/60 backdrop-blur-md cursor-pointer"
          ></motion.div>

          {/* Slide-out Panel */}
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
              {/* Background ambient glow based on volume */}
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
                  {callStatus === 'active' ? 'Connected' : callStatus === 'loading' ? 'Connecting...' : 'Ready to Talk'}
                </p>

                {/* Vapi Audio Waveform */}
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
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      Start Voice Call
                    </>
                  )}
                </button>
                <p className="text-xs text-center text-white/40 mt-4">
                  Microphone access required. Please allow permissions when prompted.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
