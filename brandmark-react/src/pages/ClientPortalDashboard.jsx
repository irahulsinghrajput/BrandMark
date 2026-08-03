import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, FolderKanban, FileText, MessageSquare, 
  Video, HelpCircle, Bot, BookOpen, Bell, Download, 
  CheckCircle, Clock, Search, Send, ArrowRight, Settings,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useClientPortalData } from '../hooks/realtimeHooks';
import { supabase } from '../lib/supabase';

export const ClientPortalDashboard = () => {
  // In a real app, this would be set by Supabase Auth Context checking if user has 'client' role
  const [isClientAuth, setIsClientAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [chatMsg, setChatMsg] = useState('');
  const [aiQuery, setAiQuery] = useState('');

  // Using a hardcoded demo client ID for UI demonstration. In production, this comes from the auth session.
  const clientId = 'demo-client-123';
  const { project, invoices, documents, tickets, milestones, loading } = useClientPortalData(clientId);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    
    try {
      const { error } = await supabase.from('client_messages').insert([{
        client_id: clientId,
        content: chatMsg,
        sender_type: 'client'
      }]);
      if (error) throw error;
      toast.success('Message sent to your account manager');
      setChatMsg('');
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const clientName = "Acme Corp";

  if (!isClientAuth) return <Navigate to="/client-login" />;

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    toast.success("Support ticket created. Our team will respond shortly.");
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-0 font-outfit h-screen flex flex-col overflow-hidden">
      <Helmet>
        <title>Client Portal | BrandMark Solutions</title>
      </Helmet>

      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 shrink-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-brand-navy rounded-lg flex items-center justify-center text-white font-bold text-xl">
             A
           </div>
           <div>
             <h1 className="text-xl font-bold text-brand-navy">Welcome back, {clientName}</h1>
             <p className="text-sm text-gray-500">Your dedicated brand workspace</p>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <button className="relative p-2 text-gray-400 hover:text-brand-navy transition-colors">
             <Bell className="w-6 h-6" />
             <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
           </button>
           <button className="p-2 text-gray-400 hover:text-brand-navy transition-colors">
             <Settings className="w-6 h-6" />
           </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Nav */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 space-y-1">
             <NavButton active={activeTab==='overview'} onClick={()=>setActiveTab('overview')} icon={<LayoutDashboard className="w-4 h-4"/>} text="Dashboard" />
             <NavButton active={activeTab==='projects'} onClick={()=>setActiveTab('projects')} icon={<FolderKanban className="w-4 h-4"/>} text="Projects & Timeline" />
             <NavButton active={activeTab==='invoices'} onClick={()=>setActiveTab('invoices')} icon={<FileText className="w-4 h-4"/>} text="Invoices & Billing" badge={invoices?.length} />
             <NavButton active={activeTab==='documents'} onClick={()=>setActiveTab('documents')} icon={<Download className="w-4 h-4"/>} text="Documents" />
             <NavButton active={activeTab==='messages'} onClick={()=>setActiveTab('messages')} icon={<MessageSquare className="w-4 h-4"/>} text="Messages" />
             <NavButton active={activeTab==='meetings'} onClick={()=>setActiveTab('meetings')} icon={<Video className="w-4 h-4"/>} text="Meetings" />
             
             <div className="my-4 border-t border-gray-100 pt-4 px-2">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Help & Support</p>
               <NavButton active={activeTab==='ai'} onClick={()=>setActiveTab('ai')} icon={<Bot className="w-4 h-4"/>} text="AI Assistant" />
               <NavButton active={activeTab==='kb'} onClick={()=>setActiveTab('kb')} icon={<BookOpen className="w-4 h-4"/>} text="Knowledge Base" />
               <NavButton active={activeTab==='support'} onClick={()=>setActiveTab('support')} icon={<HelpCircle className="w-4 h-4"/>} text="Support Tickets" />
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
          
          {activeTab === 'overview' && (
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-brand-navy to-blue-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2">Project Update</h2>
                  <p className="text-blue-100 max-w-2xl">The Technical SEO Audit has been completed. We are currently preparing the Content Gap Analysis for your review. Next meeting is scheduled for May 12th.</p>
                  <button onClick={()=>setActiveTab('projects')} className="mt-6 bg-white text-brand-navy px-5 py-2.5 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 text-sm">
                    View Project <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <Bot className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-5" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Active Project Card */}
                {project && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 col-span-2">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-bold text-brand-navy text-lg">{project.name}</h3>
                        <p className="text-sm text-gray-500">Status: <span className="text-green-600 font-bold">{project.status}</span></p>
                      </div>
                      <span className="text-2xl font-extrabold text-brand-navy">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full mb-6 overflow-hidden">
                      <div className="bg-brand-orange h-full rounded-full" style={{width: `${project.progress}%`}}></div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                      <p className="text-xs text-brand-orange font-bold uppercase tracking-wider mb-1">Next Milestone</p>
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-orange-900">{project.next_milestone}</p>
                        <p className="text-sm font-semibold text-orange-700 flex items-center gap-1"><Clock className="w-4 h-4"/> {new Date(project.due_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions / Status */}
                <div className="space-y-6">
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                     <h3 className="font-bold text-brand-navy mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-gray-400"/> Outstanding Invoice</h3>
                     <p className="text-3xl font-extrabold text-gray-900 mb-2">₹{invoices?.find(i => i.status === 'unpaid')?.amount.toLocaleString() || '0'}</p>
                     <p className="text-sm text-red-500 font-bold mb-4">Due: May 15, 2026</p>
                     <button className="w-full bg-brand-navy text-white py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors text-sm">
                       Pay Now
                     </button>
                   </div>
                   
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                     <h3 className="font-bold text-brand-navy mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-brand-orange" /> Recent Support Tickets</h3>
                     <div className="space-y-3">
                        {tickets?.slice(0, 2).map((tkt, i) => (
                          <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                            <div>
                              <p className="font-bold text-brand-navy text-sm leading-tight">{tkt.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{tkt.id} • Updated {new Date(tkt.updated_at || Date.now()).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${tkt.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-brand-orange'}`}>
                              {tkt.status}
                            </span>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="max-w-4xl mx-auto h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-brand-navy text-white flex items-center gap-3">
                <Bot className="w-6 h-6 text-brand-orange" />
                <div>
                  <h2 className="font-bold text-lg">Project AI Assistant</h2>
                  <p className="text-xs text-blue-200">Ask questions about your project, invoices, or reports.</p>
                </div>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
                <div className="flex gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-sm text-gray-700">
                    Hello! I'm your dedicated BrandMark AI assistant. I have secure access to your project timeline, invoices, and deliverables. How can I help you today?
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-gray-200">
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    placeholder="E.g. What is the status of the SEO Audit? or When is my next invoice due?" 
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange text-sm"
                  />
                  <button className="absolute right-2 p-2 bg-brand-navy text-white rounded-lg hover:bg-gray-800 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-brand-navy">Billing & Invoices</h2>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Invoice #</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices?.map(inv => (
                    <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-bold text-brand-navy">{inv.id}</td>
                      <td className="p-4 text-sm text-gray-600">{new Date(inv.created_at).toLocaleDateString()}</td>
                      <td className="p-4 font-bold text-gray-900">₹{inv.amount.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="text-brand-orange hover:text-orange-700 flex items-center gap-1 text-sm font-bold">
                          <Download className="w-4 h-4" /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-brand-navy mb-6">Create Support Ticket</h2>
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                  <input type="text" required className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange bg-gray-50" placeholder="Brief description of the issue" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                    <select className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange bg-gray-50 text-sm">
                      <option>Technical Support</option>
                      <option>Billing & Invoices</option>
                      <option>Project Question</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
                    <select className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange bg-gray-50 text-sm">
                      <option>Normal</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Details</label>
                  <textarea required rows="5" className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange bg-gray-50" placeholder="Please describe how we can help..."></textarea>
                </div>
                <button type="submit" className="bg-brand-navy text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors w-full">
                  Submit Ticket
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, text, badge }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
      active ? 'bg-brand-orange text-white shadow-md shadow-orange-200' : 'text-gray-600 hover:bg-gray-100 hover:text-brand-navy'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon} {text}
    </div>
    {badge && (
      <span className={`px-2 py-0.5 rounded-full text-xs ${active ? 'bg-white/20' : 'bg-red-500 text-white'}`}>
        {badge}
      </span>
    )}
  </button>
);
