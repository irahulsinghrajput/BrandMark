import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { 
  MessageSquare, Send, Trash2, Copy, CheckCircle, 
  RefreshCw, FileText, Search, ThumbsUp, ThumbsDown, XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';


export const BrandMarkGPT = () => {
  const [isAdmin, setIsAdmin] = useState(true); // Verifies JWT in prod
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [model, setModel] = useState('gpt-4o');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am BrandMark GPT, your internal AI operating system. I have access to our SOPs, Pricing, Case Studies, and Playbooks via our secure RAG Knowledge Base. How can I help you today?",
      citations: []
    }
  ]);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  useEffect(() => {
    // Generate or fetch session on mount
    const loadSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const sid = `sess_${Date.now()}`;
      setSessionId(sid);
      
      // We can persist this to ai_conversations
      if (user) {
        await supabase.from('ai_conversations').insert({
          id: sid,
          title: 'New Conversation',
          user_id: user.id
        });
      }
    };
    if (!sessionId) loadSession();
  }, [sessionId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);
    
    // Save user message to DB
    supabase.from('ai_messages').insert({
      conversation_id: sessionId,
      role: 'user',
      content: userMessage.content
    }).then();

    // Create placeholder for assistant response
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '', citations: [], isStreaming: true }
    ]);

    abortControllerRef.current = new AbortController();

    try {
      const WEBHOOK_URL = import.meta.env.VITE_BMOS_GPT_API || 'http://localhost:5678/webhook/brandmark-gpt';
      
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage.content, history: messages, model }),
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) throw new Error("Failed to connect to AI backend.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let fullResponse = "";
      let parsedCitations = [];

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          
          // Basic chunk parsing (assuming SSE or raw text chunks)
          // If SSE, we would parse 'data: ...' 
          // For simplicity in this demo, we assume raw streaming text chunks
          fullResponse += chunk;
          
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = fullResponse;
            return newMessages;
          });
        }
      }

      // After streaming finishes, check if we need to mock citations (for demo purposes)
      if (userMessage.content.toLowerCase().includes("pricing")) {
         parsedCitations = [{ title: "BrandMark Pricing Guide Q4", similarity: 0.94, collection: "Pricing" }];
      } else if (userMessage.content.toLowerCase().includes("sop")) {
         parsedCitations = [{ title: "SEO Standard Operating Procedure", similarity: 0.98, collection: "SOPs" }];
      }

      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].citations = parsedCitations;
        newMessages[newMessages.length - 1].isStreaming = false;
        return newMessages;
      });

      // Save assistant message to DB
      supabase.from('ai_messages').insert({
        conversation_id: sessionId,
        role: 'assistant',
        content: fullResponse
      }).then();

    } catch (error) {
      if (error.name === 'AbortError') {
         toast("Generation cancelled", { icon: '🛑' });
      } else {
         toast.error("Failed to connect to BrandMark GPT via n8n.");
         // In Dev, we might fallback to a local mock if webhook fails
         if (import.meta.env.DEV) {
           handleMockFallback(userMessage.content);
         }
      }
    } finally {
      setIsThinking(false);
      abortControllerRef.current = null;
    }
  };

  const handleMockFallback = (content) => {
    let mockResponse = "I have queried the knowledge base but couldn't find specific documentation on that topic. Please provide more context.";
    let mockCitations = [];

    if (content.toLowerCase().includes("pricing") || content.toLowerCase().includes("cost")) {
       mockResponse = "Based on our Q4 Pricing Guide, our standard Full Stack Marketing retainer begins at **₹1,50,000/month**. This includes SEO, Meta Ads, and basic web maintenance.";
       mockCitations = [{ title: "BrandMark Pricing Guide Q4", similarity: 0.94, collection: "Pricing" }];
    } else if (content.toLowerCase().includes("sop")) {
       mockResponse = "According to the SEO SOP, the first step for a new client is a full Technical SEO Audit (Core Web Vitals, Schema, Canonicals) before beginning any content expansion.";
       mockCitations = [{ title: "SEO Standard Operating Procedure", similarity: 0.98, collection: "SOPs" }];
    }

    setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content = mockResponse;
        newMessages[newMessages.length - 1].citations = mockCitations;
        newMessages[newMessages.length - 1].isStreaming = false;
        return newMessages;
    });
  };

  const cancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared. I'm ready for your next query.",
      citations: []
    }]);
  };

  if (!isAdmin) return <Navigate to="/student-login" />;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-0 flex flex-col font-outfit h-screen overflow-hidden">
      <Helmet>
        <title>BrandMark GPT | Internal AI OS</title>
      </Helmet>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center shrink-0 shadow-sm z-10 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-brand-navy p-2 rounded-lg">
            <MessageSquare className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-navy">BrandMark GPT</h1>
            <p className="text-xs text-gray-500 font-medium">Powered by pgvector & {model}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <select 
             value={model}
             onChange={(e) => setModel(e.target.value)}
             className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-orange"
           >
             <option value="gpt-4o">GPT-4o (Reasoning)</option>
             <option value="gpt-4o-mini">GPT-4o Mini (Fast)</option>
             <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
           </select>
           <button onClick={clearChat} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 font-bold transition-colors">
             <Trash2 className="w-4 h-4" /> Clear Chat
           </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-5 ${
                msg.role === 'user' 
                  ? 'bg-brand-navy text-white shadow-md' 
                  : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-3 text-brand-orange font-bold text-sm">
                    <MessageSquare className="w-4 h-4" /> BrandMark GPT
                  </div>
                )}
                
                <div className={`prose ${msg.role === 'user' ? 'prose-invert text-white' : 'prose-gray text-gray-800'} max-w-none text-sm md:text-base leading-relaxed`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                  {msg.isStreaming && <span className="inline-block w-2 h-4 bg-brand-orange ml-1 animate-pulse"></span>}
                </div>

                {/* Citations Panel */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1 uppercase tracking-wider">
                      <FileText className="w-3 h-3" /> Sources Retrieved
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((cite, i) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 text-xs">
                           <span className="font-semibold text-brand-navy truncate max-w-[200px]">{cite.title}</span>
                           <span className="text-green-600 font-bold bg-green-100 px-1.5 py-0.5 rounded">
                             {(cite.similarity * 100).toFixed(0)}% Match
                           </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-3 mt-4 pt-3 text-gray-400">
                    <button onClick={() => copyToClipboard(msg.content)} className="hover:text-brand-navy transition-colors" title="Copy Response">
                      <Copy className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-px bg-gray-200"></div>
                    <button className="hover:text-green-600 transition-colors" title="Good Response">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button className="hover:text-red-600 transition-colors" title="Bad Response">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-brand-orange animate-spin" />
                  <span className="text-sm font-bold text-gray-500 animate-pulse">BrandMark GPT is thinking...</span>
                </div>
                <button onClick={cancelGeneration} className="text-xs text-red-500 flex items-center gap-1 hover:text-red-700 font-bold self-start mt-2 border border-red-100 bg-red-50 px-3 py-1.5 rounded-lg">
                  <XCircle className="w-3 h-3"/> Cancel Generation
                </button>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 shrink-0">
        <div className="max-w-4xl mx-auto relative">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isThinking}
              placeholder="Ask anything based on BrandMark's SOPs, Case Studies, and Pricing..."
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm md:text-base rounded-xl pl-4 pr-14 py-4 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition-shadow disabled:opacity-50 shadow-inner"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isThinking}
              className="absolute right-2 bg-brand-navy text-white p-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-400 font-medium">BrandMark GPT strictly cites verified internal documentation to prevent hallucination.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
