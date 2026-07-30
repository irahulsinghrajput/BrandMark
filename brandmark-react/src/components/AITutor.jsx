import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AITutor = ({ courseData, activeModuleTitle }) => {
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Speech Recognition Setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    // Initial greeting based on context
    const greeting = courseData === 'digital-marketing' 
      ? `Hello! I'm your Marketing AI Tutor. I can help you with SEO, campaigns, and strategy for ${activeModuleTitle}.`
      : `Hello! I'm your Full Stack AI Tutor. I can help you with MERN, Node.js, and architecture for ${activeModuleTitle}.`;
    
    setMessages([{ role: 'ai', text: greeting }]);
  }, [courseData, activeModuleTitle]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInput('');

    // Simulate AI Context Fencing and Processing
    setTimeout(() => {
      let aiResponse = '';
      const lowerText = text.toLowerCase();
      
      // Strict Context Fencing
      if (courseData === 'digital-marketing') {
        if (lowerText.includes('react') || lowerText.includes('node') || lowerText.includes('code')) {
          aiResponse = "I am specialized in Digital Marketing. For coding questions, please refer to the Full Stack course materials.";
        } else {
          aiResponse = `Regarding marketing and ${activeModuleTitle}: That's an excellent question. To optimize that, you should focus on audience segmentation and clear CTA messaging.`;
        }
      } else {
        if (lowerText.includes('seo') || lowerText.includes('ads') || lowerText.includes('marketing')) {
          aiResponse = "I am specialized in Full Stack Development. For marketing strategies, please refer to the Digital Marketing course.";
        } else {
          aiResponse = `Regarding development and ${activeModuleTitle}: Make sure you modularize your components and handle state efficiently to avoid unnecessary re-renders.`;
        }
      }

      setMessages([...newMessages, { role: 'ai', text: aiResponse }]);
      speakText(aiResponse);
    }, 1000);
  };

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {chatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-brand-border-light overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className={`p-4 flex justify-between items-center text-white ${courseData === 'digital-marketing' ? 'bg-brand-navy' : 'bg-[#0A2038]'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl relative ${isSpeaking ? 'bg-brand-orange animate-pulse' : 'bg-white/10'}`}>
                  🤖
                  {isSpeaking && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-wide">AI Tutor</h4>
                  <p className="text-xs text-brand-orange font-medium">{isSpeaking ? 'Speaking...' : 'Online'}</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="hover:text-brand-orange text-xl">&times;</button>
            </div>
            
            {/* Chat Area */}
            <div className="flex-grow p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`p-4 rounded-2xl shadow-sm text-sm max-w-[85%] ${msg.role === 'ai' ? 'bg-white border border-gray-100 self-start text-gray-700' : 'bg-brand-orange text-white self-end'}`}>
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
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
                    placeholder="Ask your tutor..." 
                    className="w-full bg-brand-bg-light border border-brand-border-light rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-brand-orange transition-colors" 
                  />
                  <button 
                    onClick={() => handleSend()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-orange text-white rounded-lg flex items-center justify-center hover:bg-brand-orange-dark transition-colors"
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
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChatOpen(true)}
          className="w-16 h-16 bg-brand-orange text-white rounded-full flex items-center justify-center shadow-xl hover:bg-brand-orange-dark transition-colors text-2xl absolute bottom-0 right-0"
        >
          🤖
        </motion.button>
      )}
    </div>
  );
};
