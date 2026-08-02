import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { 
  MessageSquare, Bell, Book, Activity, Users, Send, 
  Hash, Search, Paperclip, Smile, MoreVertical, Plus, 
  FileText, Clock, FileEdit
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useRealtimeChat, useActivityFeed } from '../hooks/realtimeHooks';

export const TeamCollaboration = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [activeChannel, setActiveChannel] = useState('general');
  const [message, setMessage] = useState('');
  
  const { messages: chatLog, loading: chatLoading, sendMessage } = useRealtimeChat(activeChannel);
  const { feed: liveFeed } = useActivityFeed();
  
  // Simulated fallback data for non-realtime sections
  const channels = ['general', 'marketing', 'engineering', 'leadership', 'project-acme'];
  const [wikiPages, setWikiPages] = useState([
    { id: 1, title: 'Client Onboarding SOP', updated: '2 days ago', author: 'Rahul Rajput' },
    { id: 2, title: 'SEO Pricing Guidelines 2026', updated: '1 week ago', author: 'Rahul Rajput' },
    { id: 3, title: 'Engineering Tech Stack', updated: '1 month ago', author: 'Priya Sharma' }
  ]);
  const teamMembers = [
    { name: 'Rahul Rajput', role: 'Founder & CEO', status: 'online', avatar: 'RR' },
    { name: 'Priya Sharma', role: 'Head of SEO', status: 'online', avatar: 'PS' },
    { name: 'Amit Kumar', role: 'Sales Lead', status: 'away', avatar: 'AK' },
    { name: 'Neha Gupta', role: 'Content Strategist', status: 'offline', avatar: 'NG' }
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await sendMessage(message, 'admin-user-id');
    setMessage('');
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-0 font-outfit h-screen flex flex-col overflow-hidden">
      <Helmet>
        <title>Team Hub | BrandMark OS</title>
      </Helmet>

      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 shrink-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="bg-brand-navy p-2 rounded-lg">
              <Users className="w-5 h-5 text-brand-orange" />
           </div>
           <h1 className="text-xl font-bold text-brand-navy">Team Collaboration Hub</h1>
        </div>
        <div className="flex items-center gap-2">
           <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
           <span className="text-sm font-bold text-gray-500">Realtime Active</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Nav */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-4 space-y-1">
             <NavButton active={activeTab==='chat'} onClick={()=>setActiveTab('chat')} icon={<MessageSquare className="w-4 h-4"/>} text="Team Chat" badge={3} />
             <NavButton active={activeTab==='activity'} onClick={()=>setActiveTab('activity')} icon={<Activity className="w-4 h-4"/>} text="Activity Feed" />
             <NavButton active={activeTab==='wiki'} onClick={()=>setActiveTab('wiki')} icon={<Book className="w-4 h-4"/>} text="Internal Wiki" />
             <NavButton active={activeTab==='directory'} onClick={()=>setActiveTab('directory')} icon={<Users className="w-4 h-4"/>} text="Directory" />
             <NavButton active={activeTab==='notifications'} onClick={()=>setActiveTab('notifications')} icon={<Bell className="w-4 h-4"/>} text="Notifications" badge={12} />
          </div>

          {activeTab === 'chat' && (
            <div className="mt-4 flex-1 overflow-y-auto">
              <div className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between items-center">
                Channels <Plus className="w-3 h-3 cursor-pointer hover:text-brand-orange" />
              </div>
              <ul className="space-y-0.5">
                {channels.map(ch => (
                  <li key={ch}>
                    <button 
                      onClick={() => setActiveChannel(ch)}
                      className={`w-full text-left px-4 py-2 text-sm font-medium flex items-center gap-2 ${activeChannel === ch ? 'bg-orange-50 text-brand-orange font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Hash className="w-4 h-4 opacity-50" /> {ch}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Workspace Content */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden relative">
          
          {/* Chat Interface */}
          {activeTab === 'chat' && (
            <>
              <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
                <h2 className="font-bold text-brand-navy flex items-center gap-2"><Hash className="w-5 h-5 text-gray-400"/> {activeChannel}</h2>
                <div className="flex items-center gap-3 text-gray-400">
                  <Search className="w-5 h-5 cursor-pointer hover:text-brand-navy" />
                  <MoreVertical className="w-5 h-5 cursor-pointer hover:text-brand-navy" />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
                {chatLog.map(msg => (
                  <div key={msg.id} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-navy to-blue-800 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                      {msg.avatar}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-bold text-brand-navy">{msg.sender_id === 'admin-user-id' ? 'Rahul Rajput' : 'User'}</span>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold uppercase">Admin</span>
                        <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="text-gray-700 text-sm leading-relaxed max-w-2xl bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm relative group-hover:border-gray-200 transition-colors">
                        {msg.content}
                        <div className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Smile className="w-4 h-4 text-gray-400 cursor-pointer hover:text-yellow-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white border-t border-gray-200 shrink-0">
                <form onSubmit={handleSendMessage} className="relative flex items-end gap-2 max-w-4xl mx-auto">
                   <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden focus-within:border-brand-orange focus-within:ring-1 focus-within:ring-brand-orange transition-all bg-gray-50">
                     <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={`Message #${activeChannel}...`}
                        className="w-full max-h-32 min-h-[44px] p-3 text-sm focus:outline-none bg-transparent resize-none overflow-y-auto block"
                        rows="1"
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                     ></textarea>
                     <div className="px-3 pb-2 flex items-center gap-3 text-gray-400">
                        <Paperclip className="w-4 h-4 cursor-pointer hover:text-brand-navy" />
                        <Smile className="w-4 h-4 cursor-pointer hover:text-brand-navy" />
                        <span className="text-xs ml-auto">Use Markdown formatting</span>
                     </div>
                   </div>
                   <button type="submit" disabled={!message.trim()} className="h-[44px] px-4 bg-brand-orange text-white rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center mb-1">
                     <Send className="w-4 h-4" />
                   </button>
                </form>
              </div>
            </>
          )}

          {/* Activity Feed */}
          {activeTab === 'activity' && (
            <div className="p-8 overflow-y-auto flex-1">
              <h2 className="text-2xl font-bold text-brand-navy mb-8 flex items-center gap-2">
                <Activity className="w-6 h-6 text-brand-orange" /> Unified Timeline
              </h2>
              <div className="max-w-2xl relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {liveFeed.length === 0 ? (
                  <div className="text-gray-500">No activity yet.</div>
                ) : liveFeed.map((item, i) => (
                  <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                       <Clock className={`w-4 h-4 ${
                         item.type === 'crm' ? 'text-blue-500' :
                         item.type === 'project' ? 'text-purple-500' :
                         item.type === 'finance' ? 'text-green-500' : 'text-orange-500'
                       }`} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm group-hover:border-gray-200 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-brand-navy text-sm">{item.title}</span>
                        <span className="text-xs text-gray-400 font-medium">{new Date(item.created_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internal Wiki */}
          {activeTab === 'wiki' && (
            <div className="p-8 overflow-y-auto flex-1 bg-gray-50/50">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-brand-navy flex items-center gap-2">
                  <Book className="w-6 h-6 text-brand-orange" /> Internal Knowledge Wiki
                </h2>
                <button className="bg-brand-navy text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" /> New Page
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wikiPages.map(page => (
                  <div key={page.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-brand-orange transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-orange-50 rounded-lg text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </div>
                    <h3 className="font-bold text-brand-navy text-lg leading-tight mb-2">{page.title}</h3>
                    <div className="flex justify-between items-center text-xs text-gray-500 font-medium mt-4 pt-4 border-t border-gray-100">
                      <span className="flex items-center gap-1"><FileEdit className="w-3 h-3"/> {page.updated}</span>
                      <span>By {page.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Directory */}
          {activeTab === 'directory' && (
            <div className="p-8 overflow-y-auto flex-1">
              <h2 className="text-2xl font-bold text-brand-navy mb-8 flex items-center gap-2">
                <Users className="w-6 h-6 text-brand-orange" /> Team Directory
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map(member => (
                  <div key={member.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 flex items-center justify-center font-bold text-xl border-2 border-white shadow-sm">
                        {member.avatar}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${
                        member.status === 'online' ? 'bg-green-500' : 
                        member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></span>
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-navy leading-tight">{member.name}</h3>
                      <p className="text-sm text-brand-orange font-bold uppercase tracking-wider text-[10px]">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
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
    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg font-bold text-sm transition-colors ${
      active ? 'bg-brand-navy text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-brand-navy'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon} {text}
    </div>
    {badge && (
      <span className={`px-2 py-0.5 rounded-full text-xs ${active ? 'bg-white/20' : 'bg-brand-orange text-white'}`}>
        {badge}
      </span>
    )}
  </button>
);
