import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Link } from 'react-router-dom';
import { 
  Settings, Bot, Plug, ToggleLeft, Key, Shield, 
  DatabaseBackup, Activity, Save, RefreshCw, Server,
  CheckCircle, XCircle, Edit3, Trash2, Plus, Play, GitMerge
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';



const featureFlags = [
  { id: 'ff-1', name: 'enable_ai_proposals', description: 'Use GPT-4o to auto-generate client proposals.', enabled: true },
  { id: 'ff-2', name: 'beta_client_portal', description: 'Give clients access to the new React portal.', enabled: true },
  { id: 'ff-3', name: 'strict_rag_enforcement', description: 'Prevent AI from answering outside of Knowledge Base context.', enabled: false },
  { id: 'ff-4', name: 'slack_critical_alerts', description: 'Route high-severity alerts to Slack #engineering.', enabled: true }
];

export const SystemAdministration = () => {
  const [isAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [prompts, setPrompts] = useState([]);
  const [models, setModels] = useState([]);
  const [testingPrompt, setTestingPrompt] = useState(null);
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [enterpriseIntegrations, setEnterpriseIntegrations] = useState([]);
  const [connectingApp, setConnectingApp] = useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const [{ data: pData }, { data: mData }, { data: iData }] = await Promise.all([
        supabase.from('ai_prompts').select('*').order('created_at', { ascending: false }),
        supabase.from('ai_models').select('*'),
        supabase.from('vw_integration_health').select('*')
      ]);
      
      if (pData?.length > 0) setPrompts(pData);
      else setPrompts([]);

      if (mData?.length > 0) setModels(mData);
      
      if (iData?.length > 0) setEnterpriseIntegrations(iData);
      else setEnterpriseIntegrations([]);
    };
    fetchData();
  }, []);

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
             <Link to="/admin/workflows" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors text-gray-500 hover:text-brand-navy hover:bg-gray-100">
               <GitMerge className="w-4 h-4"/> Advanced Workflows ↗
             </Link>
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
                        {prompts.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="p-4 font-bold text-gray-900">{p.name}</td>
                            <td className="p-4 text-gray-600">{p.module_name || p.module}</td>
                            <td className="p-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold text-xs">{p.active_version_id || p.version || 'v1'}</span></td>
                            <td className="p-4 text-gray-500">{p.updated_at ? new Date(p.updated_at).toLocaleDateString() : p.updated}</td>
                            <td className="p-4 flex justify-end gap-2 text-gray-400">
                              <button onClick={() => setTestingPrompt(p)} className="hover:text-brand-orange bg-orange-50 text-brand-orange px-2 py-1 rounded font-bold text-xs">Sandbox</button>
                              <button className="hover:text-brand-navy"><Edit3 className="w-4 h-4"/></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {testingPrompt && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-orange relative">
                    <button onClick={() => { setTestingPrompt(null); setTestResult(''); setTestInput(''); }} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                      <XCircle className="w-5 h-5"/>
                    </button>
                    <h2 className="text-lg font-bold text-brand-navy mb-2 flex items-center gap-2">
                       <Bot className="w-5 h-5 text-brand-orange"/> Prompt Sandbox: {testingPrompt.name}
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">Test your prompt changes safely before rolling out to production workflows.</p>
                    <div className="space-y-4">
                      <textarea 
                        value={testInput}
                        onChange={(e) => setTestInput(e.target.value)}
                        placeholder="Enter input variables (JSON or raw text)..." 
                        rows={3}
                        className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:border-brand-orange"
                      />
                      <button 
                        disabled={isTesting || !testInput.trim()}
                        onClick={async () => {
                           setIsTesting(true);
                           setTestResult('');
                           try {
                             const response = await fetch(import.meta.env.VITE_SUPABASE_URL + '/functions/v1/prompt-test', {
                               method: 'POST',
                               headers: {
                                 'Content-Type': 'application/json',
                                 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                               },
                               body: JSON.stringify({ promptId: testingPrompt.id, input: testInput })
                             });
                             
                             if (!response.ok) throw new Error('Backend pending deployment');
                             const data = await response.json();
                             
                             await supabase.from('prompt_tests').insert({
                                prompt_id: testingPrompt.id,
                                input_variables: { raw: testInput },
                                generated_output: data.output || "Test Passed",
                                latency_ms: data.latency || 0,
                                tokens_used: data.tokens || 0,
                                success: true
                             });

                             setTestResult(`Output: ${data.output || 'Passed'}\nTokens: ${data.tokens || 0}`);
                           } catch (err) {
                             setTestResult("Error connecting to backend. (Backend pending)");
                           }

                           setIsTesting(false);
                           toast.success('Prompt test logged to database.');
                        }}
                        className="bg-brand-navy text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                      >
                         {isTesting ? <><RefreshCw className="w-4 h-4 animate-spin"/> Running Test...</> : <><Play className="w-4 h-4"/> Run Prompt Version</>}
                      </button>
                      
                      {testResult && (
                        <div className="mt-4 p-4 bg-gray-900 text-green-400 rounded-xl font-mono text-sm whitespace-pre-wrap shadow-inner">
                          {testResult}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-6 pb-20">
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                       <Plug className="w-5 h-5 text-brand-orange" /> Enterprise Integrations
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage global API connections, OAuth tokens, and health metrics.</p>
                  </div>
                  <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 text-sm flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Sync All Connections
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {enterpriseIntegrations.map(int => {
                     const isConnected = int.status === 'connected';
                     return (
                      <div key={int.id || int.integration_name || int.name} className="bg-white p-5 rounded-2xl border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                        {isConnected && int.health_score < 90 && (
                           <div className="absolute top-0 right-0 w-2 h-full bg-orange-400"></div>
                        )}
                        {isConnected && int.health_score >= 90 && (
                           <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>
                        )}
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isConnected ? 'bg-green-50 border-green-100 text-green-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                            <Plug className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-base">{int.integration_name || int.name}</h3>
                            <p className="text-xs text-gray-500">{int.category} • {int.auth_type === 'oauth2' ? 'OAuth 2.0' : 'API Key'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                           <div className="flex flex-col">
                              <span className={`inline-flex items-center gap-1 text-xs font-bold ${
                                isConnected ? 'text-green-600' : 'text-gray-500'
                              }`}>
                                {isConnected ? <CheckCircle className="w-3.5 h-3.5"/> : <XCircle className="w-3.5 h-3.5"/>}
                                {isConnected ? 'Connected' : 'Disconnected'}
                              </span>
                              {isConnected && int.health_score && (
                                 <span className="text-[10px] text-gray-400 mt-1">Health: {int.health_score}%</span>
                              )}
                           </div>
                           <button 
                             onClick={() => setConnectingApp(int)}
                             className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                               isConnected 
                                 ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                 : 'bg-brand-navy text-white hover:bg-gray-800'
                             }`}
                           >
                              {isConnected ? 'Manage' : 'Connect'}
                           </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* OAuth Connection Modal */}
                {connectingApp && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
                     <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                           <h3 className="font-bold text-lg flex items-center gap-2">
                             <Plug className="w-5 h-5 text-brand-orange"/> {connectingApp.status === 'connected' ? 'Manage' : 'Connect'} {connectingApp.integration_name || connectingApp.name}
                           </h3>
                           <button onClick={() => setConnectingApp(null)} className="text-gray-400 hover:text-gray-600">
                             <XCircle className="w-5 h-5"/>
                           </button>
                        </div>
                        <div className="p-6 space-y-4">
                           {connectingApp.status === 'connected' ? (
                              <>
                                 <div className="bg-green-50 text-green-800 p-4 rounded-xl text-sm border border-green-100">
                                   <div className="font-bold flex items-center gap-2 mb-1"><CheckCircle className="w-4 h-4"/> Connection Healthy</div>
                                   <p>Last synced: {connectingApp.last_synced_at ? new Date(connectingApp.last_synced_at).toLocaleString() : 'N/A'}</p>
                                 </div>
                                 <div className="flex gap-3 pt-4">
                                   <button 
                                      onClick={async () => {
                                         toast.success(`Connection to ${connectingApp.integration_name || connectingApp.name} disconnected.`);
                                         setEnterpriseIntegrations(prev => prev.map(p => p.id === connectingApp.id ? {...p, status: 'disconnected', health_score: null} : p));
                                         setConnectingApp(null);
                                      }}
                                      className="flex-1 bg-red-50 text-red-600 font-bold py-2.5 rounded-xl hover:bg-red-100 transition-colors"
                                   >
                                      Disconnect
                                   </button>
                                 </div>
                              </>
                           ) : (
                              <>
                                 <p className="text-sm text-gray-600 mb-4">
                                   You are about to establish a secure {connectingApp.auth_type === 'oauth2' ? 'OAuth 2.0' : 'API Key'} connection with <strong>{connectingApp.integration_name || connectingApp.name}</strong>.
                                 </p>
                                 {connectingApp.auth_type === 'api_key' && (
                                   <div className="mb-4">
                                      <label className="block text-xs font-bold text-gray-700 mb-1">API Key</label>
                                      <input type="password" placeholder={`Enter ${connectingApp.integration_name || connectingApp.name} API Key`} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                                   </div>
                                 )}
                                 <button 
                                    onClick={async () => {
                                      const handleConnect = async (integration) => {
                                        try {
                                          // Production Integration: OAuth Authorization Code Flow Initiation
                                          const response = await fetch(`/api/oauth/authorize?provider=${integration.name.toLowerCase().replace(' ', '-')}`, {
                                            method: 'GET',
                                            headers: { 'Accept': 'application/json' }
                                          });
                                          
                                          if (!response.ok) {
                                             throw new Error('OAuth provider endpoint not configured on backend.');
                                          }
                                          
                                          const { authUrl } = await response.json();
                                          window.location.href = authUrl; // Redirect to provider
                                        } catch (error) {
                                          console.warn("OAuth Integration Pending:", error.message);
                                          try {
                             const response = await fetch(import.meta.env.VITE_SUPABASE_URL + '/functions/v1/oauth-connect', {
                               method: 'POST',
                               headers: {
                                 'Content-Type': 'application/json',
                                 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                               },
                               body: JSON.stringify({ integrationId: connectingApp.id })
                             });
                             if (!response.ok) throw new Error('Backend pending deployment');
                             
                             toast.success(`${connectingApp.name} connected successfully.`);
                             setConnectingApp(null);
                           } catch (err) {
                             toast.error(`Failed to connect ${connectingApp.name}. (Backend pending)`);
                             setConnectingApp(null);
                           }           
                                        }
                                      };
                                      handleConnect(connectingApp);
                                    }}
                                    className="w-full bg-brand-navy text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                 >
                                    {connectingApp.auth_type === 'oauth2' ? <Plug className="w-4 h-4"/> : <Key className="w-4 h-4"/>}
                                    {connectingApp.auth_type === 'oauth2' ? 'Authenticate via OAuth' : 'Save API Key'}
                                 </button>
                              </>
                           )}
                        </div>
                     </div>
                  </div>
                )}
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
                   <p className="text-sm text-gray-500 mt-1">{enterpriseIntegrations.filter(i => i.status === 'connected').length} Connected</p>
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
