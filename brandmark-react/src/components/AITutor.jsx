import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AITutor = ({ courseData, activeModuleTitle }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const isFullStack = courseData === 'full-stack' || courseData === 'fullstack-mern-001' || courseData === 'full-stack-dev';

  // Speech Recognition Setup
  const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (SpeechRecognition && !recognitionRef.current) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
        setIsListening(false);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, [SpeechRecognition]);

  // Initial greeting
  useEffect(() => {
    const greeting = isFullStack
      ? `Hello! I'm Dr. Marcus Chen, your Full Stack & GenAI Mentor. I'm here to help you master React, Node.js, and AI architectures for "${activeModuleTitle || 'Core Web'}". How can I guide you today?`
      : `Hello! I'm Alex Vance, your CMO & Growth Marketing Mentor. I'm here to guide your campaigns, SEO, and AI copywriting for "${activeModuleTitle || 'Funnel Strategy'}". What marketing challenge are you tackling?`;

    setMessages([{ role: 'ai', text: greeting }]);
  }, [courseData, activeModuleTitle, isFullStack]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend = input) => {
    const messageText = typeof textToSend === 'string' ? textToSend.trim() : input.trim();
    if (!messageText) return;

    // Add user message
    const updatedMessages = [...messages, { role: 'user', text: messageText }];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/ai-tutor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: messageText,
          message: messageText,
          course: isFullStack ? 'fullstack' : 'digital-marketing',
          module: activeModuleTitle,
          history: updatedMessages.slice(-6).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }))
        })
      });

      const data = await response.json();
      const replyText = data.reply || data.answer || (isFullStack ? "Here is how you approach this engineering challenge: Start by breaking the system into modular components, validate your data flow, and implement proper error boundaries." : "Here is the strategic marketing approach: Identify your primary customer avatar, craft a compelling hook using the PAS framework, and drive traffic to a frictionless landing page.");

      setMessages(prev => [...prev, { role: 'ai', text: replyText }]);

      if (voiceEnabled) {
        speakText(replyText);
      }
    } catch (err) {
      console.warn('AI Tutor network error, using local mentor reasoning:', err);
      const fallbackReply = isFullStack
        ? `Great engineering question on ${activeModuleTitle}!\n\nIn production systems, always maintain clean separation: Frontend (React UI) -> Backend (Express REST APIs) -> Database (MongoDB).\n\nKeep your components focused on a single responsibility, and sanitize inputs to prevent injection vulnerabilities.\n\nWould you like me to show you a practical code pattern for this?`
        : `Excellent marketing question on ${activeModuleTitle}!\n\nFocus on the core conversion formula: **Clear Value Proposition + Irresistible Offer + Urgency**.\n\nMake sure your headline addresses the prospect's acute pain point within 3 seconds.\n\nWould you like me to help you draft 3 high-converting copy angles for this?`;

      setMessages(prev => [...prev, { role: 'ai', text: fallbackReply }]);
      if (voiceEnabled) speakText(fallbackReply);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please type your question.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      window.speechSynthesis.cancel();
      // Strip markdown symbols for cleaner vocalization
      const cleanText = text.replace(/#|\*|`|\[.*?\]\(.*?\)/g, '').slice(0, 300);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = isFullStack ? 0.95 : 1.05;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const quickPrompts = isFullStack ? [
    "Explain this module simply",
    "Show production code snippet",
    "How do I debug common errors?",
    "Quiz me on this concept"
  ] : [
    "Explain this funnel step",
    "Draft high-ROAS ad copy",
    "How to optimize SEO rankings?",
    "Give me an action checklist"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="mb-4 w-80 sm:w-96 md:w-[420px] bg-white rounded-3xl shadow-2xl border border-brand-border-light overflow-hidden flex flex-col h-[540px]"
          >
            {/* Header */}
            <div className={`p-4 flex justify-between items-center text-white ${isFullStack ? 'bg-gradient-to-r from-[#0b1a2d] to-[#132c4d]' : 'bg-gradient-to-r from-brand-navy to-[#182c44]'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl relative shadow-md ${isSpeaking ? 'bg-brand-orange animate-pulse' : 'bg-white/10'}`}>
                  {isFullStack ? '👨‍💻' : '📈'}
                  {isSpeaking && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-orange border-2 border-white"></span>
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm tracking-wide">
                      {isFullStack ? 'Dr. Marcus (Tech Lead)' : 'Alex Vance (CMO)'}
                    </h4>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 bg-brand-orange text-white rounded">
                      Expert AI
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 font-medium flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-400 animate-ping' : 'bg-green-400'}`}></span>
                    {isSpeaking ? 'Speaking Voice Answer...' : isListening ? 'Listening to mic...' : 'Ready to Mentor'}
                  </p>
                </div>
              </div>

              {/* Header Right Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (isSpeaking) stopSpeaking();
                    setVoiceEnabled(!voiceEnabled);
                  }}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${voiceEnabled ? 'text-brand-orange hover:bg-white/10' : 'text-gray-400 hover:bg-white/10'}`}
                  title={voiceEnabled ? "Voice Enabled (Click to mute)" : "Voice Muted (Click to enable)"}
                >
                  {voiceEnabled ? '🔊' : '🔇'}
                </button>
                <button 
                  onClick={() => { stopSpeaking(); setChatOpen(false); }} 
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white text-lg font-bold"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Speaking Audio Wave Visualizer */}
            {isSpeaking && (
              <div className="bg-brand-orange/10 px-4 py-2 border-b border-brand-orange/20 flex items-center justify-between">
                <span className="text-[11px] font-bold text-brand-orange flex items-center gap-1.5">
                  <span className="animate-spin">🎙️</span> Voice Assistance Active
                </span>
                <button 
                  onClick={stopSpeaking}
                  className="text-[10px] font-extrabold text-brand-navy bg-white px-2 py-0.5 rounded shadow-sm hover:underline"
                >
                  Stop Voice
                </button>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-grow p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3 text-xs leading-relaxed">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-2xl shadow-sm max-w-[88%] whitespace-pre-wrap ${
                    msg.role === 'ai' 
                      ? 'bg-white border border-gray-100 self-start text-gray-800' 
                      : 'bg-brand-orange text-white self-end font-medium'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {isLoading && (
                <div className="p-3.5 bg-white border border-gray-100 rounded-2xl self-start text-xs text-brand-orange flex items-center gap-2 shadow-sm">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce delay-100">●</span>
                  <span className="animate-bounce delay-200">●</span>
                  <span className="text-gray-500 font-medium">Mentor is analyzing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Carousel */}
            <div className="px-3 py-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1 bg-brand-bg-light hover:bg-brand-orange hover:text-white text-brand-navy rounded-full border border-brand-border-light transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-white border-t border-brand-border-light">
              <div className="relative flex items-center gap-2">
                
                {/* Microphone Button */}
                <button 
                  onClick={toggleListening}
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse shadow-lg scale-105' 
                      : 'bg-brand-bg-light text-brand-navy hover:bg-gray-200'
                  }`}
                  title={isListening ? "Listening... Click to stop" : "Speak to your AI Mentor"}
                >
                  🎤
                </button>

                {/* Input Text Box */}
                <div className="relative flex-grow">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isListening ? "Listening to your voice..." : "Ask your Mentor a question..."} 
                    className="w-full bg-brand-bg-light border border-brand-border-light rounded-xl pl-3.5 pr-10 py-2.5 text-xs focus:outline-none focus:border-brand-orange transition-colors" 
                  />
                  <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-brand-orange disabled:opacity-40 text-white rounded-lg flex items-center justify-center hover:bg-brand-orange-dark transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 transform rotate-45 -ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>

              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Bubble */}
      {!chatOpen && (
        <motion.button 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setChatOpen(true)}
          className="relative px-5 py-3.5 bg-gradient-to-r from-brand-navy to-[#182c44] text-white rounded-full flex items-center gap-3 shadow-2xl hover:shadow-brand-orange/30 transition-all border border-white/20 group"
        >
          <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center text-base shadow-sm group-hover:rotate-12 transition-transform">
            {isFullStack ? '👨‍💻' : '📈'}
          </div>
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-orange block">
              24/7 AI Voice Mentor
            </span>
            <span className="text-xs font-bold text-white block">
              {isFullStack ? 'Ask Dr. Marcus' : 'Ask Alex Vance'}
            </span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
        </motion.button>
      )}
    </div>
  );
};
