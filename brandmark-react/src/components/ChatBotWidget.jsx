import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_SUPABASE_URL + '/functions/v1';

export const ChatBotWidget = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
    }

    setMessages([{ role: 'ai', text: "Hello! I'm your BrandMark AI Assistant. How can I help you scale your brand today?" }]);

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore cleanup errors.
        }
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakText = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (text = input) => {
    const userText = text?.trim();
    if (!userText || isThinking) return;

    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      let data = null;
      try {
        data = await response.json();
      } catch (error) {
        data = null;
      }

      const reply = (data && data.reply) ? data.reply : 'Thanks for reaching out. Our team can help with branding, web design, and marketing. Please use the quote request page or WhatsApp for a faster follow-up.';
      setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
      speakText(reply);
    } catch (error) {
      const fallback = 'The assistant is temporarily unavailable, but our team is ready to help. Please use the quote request page or WhatsApp for faster support.';
      setMessages((prev) => [...prev, { role: 'ai', text: fallback }]);
    } finally {
      setIsThinking(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0].transcript).join(' ');
      setInput(transcript);
      handleSend(transcript);
      setIsListening(false);
    };

    recognitionRef.current.onerror = () => setIsListening(false);
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.start();
    setIsListening(true);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[999]">
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="mb-4 w-[90vw] sm:w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-brand-border-light overflow-hidden flex flex-col h-[500px] max-h-[80vh]"
          >
            <div className="p-4 flex justify-between items-center text-white bg-[#0B2C4D]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden border-2 ${isSpeaking ? 'border-brand-orange animate-pulse' : 'border-white/20'}`}>
                  <img src="/assets/chatbot-icon.jpg" alt="AI Bot" className="w-full h-full object-cover scale-110" />
                  {isSpeaking && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-orange"></span>
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-wide">BrandMark AI</h4>
                  <p className="text-xs text-brand-orange font-medium">{isThinking ? 'Thinking...' : isSpeaking ? 'Speaking...' : 'Online'}</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="hover:text-brand-orange text-2xl leading-none">&times;</button>
            </div>

            <div className="flex-grow p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`p-3 rounded-2xl shadow-sm text-sm max-w-[85%] ${msg.role === 'ai' ? 'bg-white border border-gray-100 self-start text-brand-navy rounded-tl-none' : 'bg-brand-orange text-white self-end rounded-tr-none'}`}>
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-brand-border-light">
              <div className="relative flex items-center gap-2">
                <button
                  onClick={toggleListening}
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-brand-bg-light text-brand-navy hover:bg-gray-200'}`}
                  title="Speak your question"
                >
                  🎤
                </button>
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask our AI..."
                    className="w-full bg-brand-bg-light border border-brand-border-light rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={isThinking}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-orange text-white rounded-lg flex items-center justify-center hover:bg-brand-orange-dark transition-colors disabled:opacity-70"
                  >
                    <svg className="w-4 h-4 transform rotate-45 -ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 overflow-hidden border-2 border-[#0B2C4D] cursor-pointer group absolute bottom-0 left-0"
          aria-label="Open AI Assistant"
        >
          <img src="/assets/chatbot-icon.jpg" alt="AI Chat Bot" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-300" />
        </button>
      )}
    </div>
  );
};
