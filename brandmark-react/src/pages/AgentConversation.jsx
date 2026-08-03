import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, useParams, Link } from 'react-router-dom';
import { 
  MessageSquare, Send, Trash2, Copy, CheckCircle, 
  RefreshCw, FileText, Bot, ArrowLeft, Wrench, Database, BrainCircuit, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';

export const AgentConversation = () => {
  const { id } = useParams();
  const [isAdmin] = useState(true);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [agentContext, setAgentContext] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Normalize ID to name
  const agentNameMap = {
     'sales-agent': 'Sales Agent',
     'marketing-agent': 'Marketing Agent',
     'finance-agent': 'Finance Agent',
     'project-manager-agent': 'Project Manager Agent',
     'customer-support-agent': 'Customer Support Agent',
     'knowledge-agent': 'Knowledge Agent',
     'executive-advisor-agent': 'Executive Advisor Agent'
  };
  
  const agentName = agentNameMap[id] || 'AI Agent';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  useEffect(() => {
    const initSession = async () => {
      // 1. Fetch Agent Meta
      const { data: agentData } = await supabase.from('ai_agents').select('*').eq('name', agentName).single();
      
      const context = agentData || {
         name: agentName,
         role: 'Specialized AI',
         model: 'gpt-4o'
      };
      setAgentContext(context);
      
      // 2. Initial Message
      setMessages([
        {
          role: 'assistant',
          content: `System initialized. I am the **${context.name}**. I am configured for ${context.role}. How can I assist you today?`,
          citations: [],
          tools_used: []
        }
      ]);
      
      // 3. Create Session (Mocking auth context)
      const sid = `sess_${Date.now()}`;
      setSessionId(sid);
      
      if (agentData?.id) {
         await supabase.from('agent_conversations').insert({
            id: sid,
            agent_id: agentData.id,
            user_id: 'local_admin',
            title: 'New Interaction'
         }).then();
      }
    };
    initSession();
  }, [agentName]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);
    
    // Create placeholder for assistant response
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '', citations: [], tools_used: [], isStreaming: true }
    ]);

    abortControllerRef.current = new AbortController();

    try {
      // Mocking streaming & tool usage for React framework
      await new Promise(r => setTimeout(r, 1000));
      
      let mockResponse = `I have processed your request regarding "${userMessage.content}". `;
      let tools = [];
      let citations = [];

      if (agentName === 'Sales Agent') {
         tools = ['HubSpot Search', 'Lead Enrichment (Clearbit)'];
         mockResponse += "I've drafted a follow-up sequence for the requested leads. I can automatically deploy this via the CRM if you approve.";
      } else if (agentName === 'Knowledge Agent') {
         tools = ['pgvector Search'];
         citations = [{ title: "Internal SOP v4", similarity: 0.95 }];
         mockResponse += "Based on our documentation, the standard protocol is detailed below.";
      } else if (agentName === 'Finance Agent') {
         tools = ['Stripe API', 'PostgreSQL (Invoices)'];
         mockResponse += "I've generated the revenue projection. Outstanding invoices total ₹4,50,000.";
      } else {
         tools = ['Memory Retrieval'];
         mockResponse += "Action completed successfully.";
      }

      setMessages((prev) => {
        const newMessages = [...prev];
        const last = newMessages[newMessages.length - 1];
        last.content = mockResponse;
        last.tools_used = tools;
        last.citations = citations;
        last.isStreaming = false;
        return newMessages;
      });

      // Insert into DB if agentContext has ID
      if (agentContext?.id) {
          await supabase.from('agent_messages').insert([
             { conversation_id: sessionId, role: 'user', content: userMessage.content },
             { conversation_id: sessionId, role: 'assistant', content: mockResponse, tool_calls: tools, tokens_used: 154 }
          ]).then();
          
          await supabase.from('agent_usage').upsert({
             agent_id: agentContext.id,
             date: new Date().toISOString().split('T')[0],
             total_requests: 1,
             total_tokens: 154
          }).then();
      }

    } catch (error) {
       toast.error("Agent execution failed.");
    } finally {
      setIsThinking(false);
      abortControllerRef.current = null;
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Context cleared. I am the **${agentContext?.name}**. How can I help?`,
      citations: [], tools_used: []
    }]);
  };

  if (!isAdmin) return <Navigate to="/admin-login" />;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-outfit h-screen overflow-hidden">
      <Helmet>
        <title>{agentName} | BM-OS Framework</title>
      </Helmet>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center shrink-0 shadow-sm z-10 gap-4 mt-20">
        <div className="flex items-center gap-4">
          <Link to="/admin/agents" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div className="bg-brand-navy p-2 rounded-lg">
            <Bot className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-navy">{agentName}</h1>
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
               <Activity className="w-3 h-3 text-green-500"/> Online • {agentContext?.model || 'gpt-4o'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <Link to="/admin/analytics" className="text-sm text-gray-500 hover:text-brand-navy font-bold transition-colors">
             View Usage
           </Link>
           <button onClick={clearChat} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 font-bold transition-colors">
             <Trash2 className="w-4 h-4" /> Clear Memory
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
                    <Bot className="w-4 h-4" /> {agentName}
                  </div>
                )}
                
                <div className={`prose ${msg.role === 'user' ? 'prose-invert text-white' : 'prose-gray text-gray-800'} max-w-none text-sm md:text-base leading-relaxed`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                  {msg.isStreaming && <span className="inline-block w-2 h-4 bg-brand-orange ml-1 animate-pulse"></span>}
                </div>

                {/* Tool Usage Panel */}
                {msg.tools_used && msg.tools_used.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1 uppercase tracking-wider">
                      <Wrench className="w-3 h-3" /> Tools Executed
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {msg.tools_used.map((tool, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-md px-2.5 py-1 text-xs font-mono font-medium">
                           <Database className="w-3 h-3" /> {tool}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Citations Panel */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1 uppercase tracking-wider">
                      <BrainCircuit className="w-3 h-3" /> RAG Memory Retrieved
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((cite, i) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 text-xs">
                           <span className="font-semibold text-gray-700">{cite.title}</span>
                           <span className="text-green-600 font-bold bg-green-100 px-1.5 py-0.5 rounded">
                             {(cite.similarity * 100).toFixed(0)}% Match
                           </span>
                        </div>
                      ))}
                    </div>
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
                  <span className="text-sm font-bold text-gray-500 animate-pulse">Agent is reasoning & executing tools...</span>
                </div>
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
              placeholder={`Assign a task to the ${agentName}...`}
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
        </div>
      </div>
    </div>
  );
};
