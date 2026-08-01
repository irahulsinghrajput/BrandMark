import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { 
  Settings, Bot, Plug, ToggleLeft, Key, Shield, 
  DatabaseBackup, Activity, Save, RefreshCw, Server,
  CheckCircle, XCircle, Edit3, Trash2, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

// Simulated Configuration Data
const integrations = [
  { id: 1, name: 'OpenAI API', status: 'connected', lastSync: '10 mins ago', type: 'AI Provider' },
  { id: 2, name: 'Supabase', status: 'connected', lastSync: '1 min ago', type: 'Database & Auth' },
  { id: 3, name: 'n8n Webhooks', status: 'connected', lastSync: '1 min ago', type: 'Automation' },
  { id: 4, name: 'Resend', status: 'connected', lastSync: '1 hour ago', type: 'Email' },
  { id: 5, name: 'Slack', status: 'connected', lastSync: '5 mins ago', type: 'Notifications' },
  { id: 6, name: 'HubSpot', status: 'disconnected', lastSync: 'Never', type: 'CRM' }
];

const featureFlags = [
  { id: 'ff-1', name: 'enable_ai_proposals', description: 'Use GPT-4o to auto-generate client proposals.', enabled: true },
  { id: 'ff-2', name: 'beta_client_portal', description: 'Give clients access to the new React portal.', enabled: true },
  { id: 'ff-3', name: 'strict_rag_enforcement', description: 'Prevent AI from answering outside of Knowledge Base context.', enabled: false },
  { id: 'ff-4', name: 'slack_critical_alerts', description: 'Route high-severity alerts to Slack #engineering.', enabled: true }
];

const aiPrompts = [
  { id: 'p-1', name: 'System Context Prompt', version: 'v12', updated: '2 days ago', module: 'BrandMark GPT' },
  { id: 'p-2', name: 'Proposal Generator', version: 'v4', updated: '1 week ago', module: 'Proposals' },
  { id: 'p-3', name: 'Executive Summarizer', version: 'v1', updated: '1 month ago', module: 'Finance' }
];

export const SystemAdministration = () => {
  const [isAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  if (!isAdmin) return <Navigate to="/student-login" />;

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Configuration saved successfully.');
  };

  const handleBackup = () => {
    toast.success('Database backup initiated. You will be notified when complete.');
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-0 font-outfit h-screen flex flex-col overflow-hidden">
      <Helmet>
        <title>System Administration | BM-OS</title>
      </Helmet>

      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 shrink-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="bg-gray-900 p-2 rounded-lg">
              <Settings className="w-5 h-5 text-brand-orange" />
           </div>
           <h1 className="text-xl font-bold text-gray-900">System Configuration</h1>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-sm font-bold text-gray-500 flex items-center gap-2">
             <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span> All Systems Operational
           </span>
           <button onClick={handleSave} className="bg-brand-navy text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm">
             <Save className="w-4 h-4" /> Save Changes
           </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Nav */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 space-y-1">
             <NavButton active={activeTab==='overview'} onClick={()=>setActiveTab('overview')} icon={<Activity className="w-4 h-4"/>} text="Overview" />
             <NavButton active={activeTab==='ai_settings'} onClick={()=>setActiveTab('ai_settings')} icon={<Bot className="w-4 h-4"/>} text="AI & Prompts" />
             <NavButton active={activeTab==='integrations'} onClick={()=>setActiveTab('integrations')} icon={<Plug className="w-4 h-4"/>} text="Integrations" />
             <NavButton active={activeTab==='features'} onClick={()=>setActiveTab('features')} icon={<ToggleLeft className="w-4 h-4"/>} text="Feature Flags" />
             <NavButton active={activeTab==='security'} onClick={()=>setActiveTab('security')} icon={<Shield className="w-4 h-4"/>} text="Roles & Security" />
             <NavButton active={activeTab==='api_keys'} onClick={()=>setActiveTab('api_keys')} icon={<Key className="w-4 h-4"/>} text="API Keys" />
             <NavButton active={activeTab==='backup'} onClick={()=>setActiveTab('backup')} icon={<DatabaseBackup className="w-4 h-4"/>} text="System Backups" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8 relative">
          <div className="max-w-5xl mx-auto">
            
            {/* AI Settings Tab */}
            {activeTab === 'ai_settings' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-brand-orange" /> Global AI Model Configuration
                  </h2>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Default Chat Model</label>
                      <select className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm">
                        <option>gpt-4o</option>
                        <option>gpt-4-turbo</option>
                        <option>gpt-3.5-turbo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Embedding Model (RAG)</label>
                      <select className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm">
                        <option>text-embedding-3-large</option>
                        <option>text-embedding-3-small</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between">
                        <span>Temperature</span> <span className="text-gray-400">0.7</span>
                      </label>
                      <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full accent-brand-orange" />
                      <p className="text-xs text-gray-500 mt-2">Higher values make output more random, lower values more deterministic.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Max Output Tokens</label>
                      <input type="number" defaultValue="4096" className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-900">System Prompts Repository</h2>
                    <button className="text-brand-orange font-bold text-sm flex items-center gap-1 hover:text-orange-700">
                      <Plus className="w-4 h-4"/> New Prompt
                    </button>
                  </div>
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <tr>
                          <th className="p-4 font-semibold">Prompt Name</th>
                          <th className="p-4 font-semibold">Module</th>
                          <th className="p-4 font-semibold">Version</th>
                          <th className="p-4 font-semibold">Last Updated</th>
                          <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {aiPrompts.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="p-4 font-bold text-gray-900">{p.name}</td>
                            <td className="p-4 text-gray-600">{p.module}</td>
                            <td className="p-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold text-xs">{p.version}</span></td>
                            <td className="p-4 text-gray-500">{p.updated}</td>
                            <td className="p-4 flex justify-end gap-2 text-gray-400">
                              <button className="hover:text-brand-navy"><Edit3 className="w-4 h-4"/></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Active Integrations</h2>
                  <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 text-sm flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Sync All
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integrations.map(int => (
                    <div key={int.id} className="bg-white p-5 rounded-2xl border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${int.status === 'connected' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                          <Plug className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{int.name}</h3>
                          <p className="text-xs text-gray-500">{int.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold mb-1 ${
                          int.status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {int.status === 'connected' ? <CheckCircle className="w-3 h-3"/> : <XCircle className="w-3 h-3"/>}
                          {int.status}
                        </span>
                        <p className="text-[10px] text-gray-400">Last Sync: {int.lastSync}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feature Flags Tab */}
            {activeTab === 'features' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ToggleLeft className="w-5 h-5 text-brand-orange" /> Experimental & Core Feature Flags
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Enable or disable system modules globally.</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {featureFlags.map(ff => (
                    <div key={ff.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm mb-1 font-mono">{ff.name}</h3>
                        <p className="text-sm text-gray-500">{ff.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={ff.enabled} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Backup Tab */}
            {activeTab === 'backup' && (
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center max-w-2xl mx-auto">
                  <DatabaseBackup className="w-16 h-16 text-brand-orange mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">System Backup & Export</h2>
                  <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                    Generate a full configuration export including Feature Flags, Prompts, and System Settings. This will be stored securely in Supabase Storage.
                  </p>
                  <button onClick={handleBackup} className="bg-brand-navy text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg">
                    Generate New Backup
                  </button>
                </div>
              </div>
            )}

            {/* Overview / Placeholder for other tabs */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-center h-48">
                   <Server className="w-8 h-8 text-green-500 mb-3" />
                   <h3 className="font-bold text-gray-900">System Core</h3>
                   <p className="text-sm text-gray-500 mt-1">v5.12.0</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-center h-48">
                   <Plug className="w-8 h-8 text-blue-500 mb-3" />
                   <h3 className="font-bold text-gray-900">Active Integrations</h3>
                   <p className="text-sm text-gray-500 mt-1">5 Connected</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-center h-48">
                   <Bot className="w-8 h-8 text-orange-500 mb-3" />
                   <h3 className="font-bold text-gray-900">Default Model</h3>
                   <p className="text-sm text-gray-500 mt-1">gpt-4o</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, text }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
      active ? 'bg-brand-navy text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    {icon} {text}
  </button>
);
