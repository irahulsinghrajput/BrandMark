import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Client-Side Mark AI Knowledge Engine for zero-latency instant answers & fail-safe resilience
function getClientSideReply(rawMessage) {
  const rawStr = String(rawMessage ?? '').trim();
  if (!rawStr) {
    return "Hello! I'm Mark, your BrandMark AI Assistant. How can I help scale your brand or web presence today?";
  }

  const msg = rawStr.toLowerCase();

  // Strip greeting prefix if user provided an additional query (e.g. "Hi, what are your services?")
  const queryWithoutGreeting = msg.replace(
    /^(hi|hello|hey|hola|namaste|good\s*(morning|afternoon|evening))\s*(mark)?\s*([!,.-]\s*)*/i,
    ''
  ).trim();
  const testMsg = queryWithoutGreeting.length > 0 ? queryWithoutGreeting : msg;

  // 1. Contact, Phone, WhatsApp & Office Location
  if (/\b(contact|phone|call|whatsapp|email|location|address|where\s*are\s*you|office|reach|meet|rahul|appointment)\b/i.test(testMsg)) {
    return "You can reach our team and founder Rahul directly: 📱 WhatsApp/Call: +91 7091863003 | ✉️ Email: info.aimservicesprivatelimited@gmail.com | 📍 Office: Gangotri, Buddha Colony, Patna, Bihar, India (serving global clients across US, UK, Middle East, and India). Feel free to message anytime!";
  }

  // 2. Careers & Hiring
  if (/\b(job|jobs|career|careers|hiring|internship|internships|vacancy|vacancies|work\s*with\s*you|apply|apply\s*for)\b/i.test(testMsg)) {
    return "We are always scouting for exceptional developers, performance marketers, and creative designers. Explore open positions and submit your profile at https://www.brandmarksolutions.site/careers.";
  }

  // 3. Pricing, Quotes & Costs
  if (/\b(quote|quotes|pricing|price|prices|cost|costs|how\s*much|estimate|budget|fee|rate|rates|package|packages)\b/i.test(testMsg)) {
    return "You can request a custom proposal or project estimate directly on our Contact Page: https://www.brandmarksolutions.site/contact. For immediate scope discussions or an enterprise quote, connect directly with our founder Rahul on WhatsApp at +91 7091863003.";
  }

  // 4. Services Overview
  if (/\bservices?|what\s*(do\s*you|can\s*you)\s*(do|offer|provide)|what\s*are\s*your\s*services|offerings?|solutions\b/i.test(testMsg)) {
    return "BrandMark Solutions is a full-service digital agency. We specialize in: 1) Custom Web & SaaS Development (React, Next.js, MERN), 2) High-ROAS Performance Marketing (Meta & Google Ads), 3) Advanced Search Engine Optimization (SEO & AI Search), and 4) Brand Identity & PR Strategy. Which area can we assist you with?";
  }

  // 5. Web & App Development
  if (/\b(web|websites?|mern|react(\.js)?|next(\.js)?|node(\.js)?|apps?|applications?|web\s*apps?|mobile\s*apps?|frontend|backend|full\s*stack|software|developer|coding|e-?commerce|shopify|wordpress)\b/i.test(testMsg)) {
    return "We engineer ultra-fast, modern web applications and scalable SaaS platforms using React, Next.js, Node.js, and cloud architectures. Our builds boast sub-2-second load times, mobile-first responsiveness, and conversion-optimized UX. What type of web platform are you planning to build?";
  }

  // 6. Digital Marketing, SEO & Ads
  if (/\b(marketing|seo|google\s*ads|meta\s*ads|facebook\s*ads|instagram\s*ads|ppc|roas|lead\s*gen|traffic|ranking|funnel)\b/i.test(testMsg)) {
    return "Our growth marketing engine specializes in high-ROAS Meta & Google advertising, technical SEO (ranking for high-intent keywords), and automated lead-generation funnels. We focus on measurable revenue rather than vanity metrics. Are you looking to generate qualified B2B leads or scale direct-to-consumer sales?";
  }

  // 7. Branding, PR & Creative Design
  if (/\b(branding|brand\s*identity|logos?|graphic\s*design|creative|pr|public\s*relations|rebrand)\b/i.test(testMsg)) {
    return "From distinctive brand identities and visual guidelines to strategic Public Relations (PR) and social media acceleration, we shape how the market perceives your business. We recently led the social media and PR strategy for Govinda International School driving record admissions. Would you like to review our creative portfolio?";
  }

  // 8. Portfolio & Case Studies
  if (/\b(portfolio|case\s*stud(y|ies)|our\s*work|previous\s*work|past\s*work|client\s*results|gis|govinda)\b/i.test(testMsg)) {
    return "You can view our featured client work and case studies at https://www.brandmarksolutions.site/portfolio, including our Social Media & PR campaign for Govinda International School (GIS Patna), bespoke e-commerce platforms, and SaaS products. Would you like details on a specific industry?";
  }

  // 9. Academy & Courses
  if (/\b(courses?|academy|classes|curriculum|syllabus|enroll(ment)?|certificat(e|ion)|training\s*program)\b|\blearn\s+(web|marketing|coding|mern|dev)\b/i.test(testMsg)) {
    return "We offer two flagship masterclasses at BrandMark Academy: 1) Digital Marketing Mastery with Gen AI and 2) Full Stack Web Development (MERN + GenAI). Each features 15 comprehensive modules, 24/7 AI Tutor mentorship, hands-on labs, and verified certification. Learn more and enroll at https://www.brandmarksolutions.site/courses.";
  }

  // 10. Timelines & Delivery
  if (/\b(how\s*long|timeline|timelines|turnaround|delivery|deadline|duration|time\s*frame)\b/i.test(testMsg)) {
    return "Most custom website and branding projects are delivered within 2 to 4 weeks, while marketing campaigns and ad funnels typically go live within 5 to 7 business days following strategy sign-off. What is your target launch date?";
  }

  // 11. Greetings & Introductions
  if (/^(hi|hello|hey|hola|namaste|good\s*(morning|afternoon|evening)|hi\s*mark|hey\s*mark|who\s*are\s*you|what\s*is\s*your\s*name)\b/i.test(msg)) {
    return "Hello! I'm Mark, your BrandMark AI Assistant. We help ambitious businesses build high-performance web applications, scale profitable ad campaigns, and dominate search rankings. How can I help scale your brand or project today?";
  }

  // 12. Default Smart Response
  return "Thanks for reaching out! At BrandMark Solutions, we help businesses scale with custom web development, high-ROAS digital marketing, and brand identity design. You can request an estimate on our Contact Page at https://www.brandmarksolutions.site/contact or chat directly with our founder Rahul on WhatsApp at +91 7091863003. How can we best assist your project today?";
}

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
        } catch {
          // Ignore cleanup errors
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
      // Connect to BrandMark production API (/api/chat)
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      let data = null;
      if (response.ok) {
        try {
          data = await response.json();
        } catch {
          data = null;
        }
      }

      // If backend responded with valid reply, use it; otherwise fallback to intelligent client engine
      const reply = (data && data.reply) ? data.reply : getClientSideReply(userText);
      setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
      speakText(reply);
    } catch {
      // Network disconnect or temporary glitch -> instant intelligent client fallback
      const reply = getClientSideReply(userText);
      setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
      speakText(reply);
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

  const quickPrompts = [
    "What services do you provide?",
    "How much does a website cost?",
    "BrandMark Academy Courses",
    "Contact Rahul on WhatsApp"
  ];

  return (
    <div className="fixed bottom-6 left-6 z-[999]">
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="mb-4 w-[90vw] sm:w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-brand-border-light overflow-hidden flex flex-col h-[520px] max-h-[82vh]"
          >
            {/* Header */}
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
              <button 
                onClick={() => setChatOpen(false)} 
                className="hover:text-brand-orange text-2xl leading-none transition-colors"
                aria-label="Close Chat"
              >
                &times;
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3.5">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed max-w-[85%] break-words ${
                    msg.role === 'ai' 
                      ? 'bg-white border border-gray-100 self-start text-brand-navy rounded-tl-none' 
                      : 'bg-brand-orange text-white self-end rounded-tr-none'
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {isThinking && (
                <div className="bg-white border border-gray-100 self-start text-brand-navy p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 text-xs text-brand-text-muted">
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                  <span className="ml-1 text-[11px] font-semibold text-slate-500">Mark is thinking...</span>
                </div>
              )}

              {/* Quick suggestion chips if few messages */}
              {messages.length <= 2 && (
                <div className="pt-2 flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggested Questions:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {quickPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(prompt)}
                        className="text-[11px] font-medium bg-white hover:bg-orange-50 hover:border-brand-orange hover:text-brand-orange text-slate-600 px-2.5 py-1.5 rounded-xl border border-slate-200 transition-all text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-white border-t border-brand-border-light">
              <div className="relative flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-brand-bg-light text-brand-navy hover:bg-gray-200'
                  }`}
                  title="Speak your question"
                  aria-label="Voice input"
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
                    className="w-full bg-brand-bg-light border border-brand-border-light rounded-xl pl-3.5 pr-11 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={isThinking}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-orange text-white rounded-lg flex items-center justify-center hover:bg-brand-orange-dark transition-colors disabled:opacity-70"
                    aria-label="Send message"
                  >
                    <svg className="w-4 h-4 transform rotate-45 -ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
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
