import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { 
  Activity, Server, Zap, ShieldAlert, Cpu, Database, 
  Clock, GitPullRequest, DollarSign, AlertTriangle, 
  CheckCircle, XCircle, Search, Filter
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useSystemAnalytics } from '../hooks/realtimeHooks';

export const SystemAnalytics = () => {
  const [isAdmin] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState('success');
  
  const { performanceData, costData, workflows, workflowFailures, alerts, loading } = useSystemAnalytics(timeRange);

  // Fallbacks if tables are empty in DEV mode
  const perfData = performanceData?.length > 0 ? performanceData : [
    { time: '00:00', latency: 45, requests: 120, errors: 2 },
    { time: '04:00', latency: 42, requests: 85, errors: 0 },
    { time: '08:00', latency: 68, requests: 350, errors: 12 },
    { time: '12:00', latency: 85, requests: 520, errors: 8 },
    { time: '16:00', latency: 55, requests: 410, errors: 4 },
    { time: '20:00', latency: 48, requests: 220, errors: 1 }
  ];

  const costs = costData?.length > 0 ? costData : [
    { date: 'Mon', gpt4: 12.5, claude3: 8.2, embeddings: 2.1 },
    { date: 'Tue', gpt4: 15.0, claude3: 7.5, embeddings: 2.5 },
    { date: 'Wed', gpt4: 18.2, claude3: 9.1, embeddings: 3.0 },
    { date: 'Thu', gpt4: 14.5, claude3: 8.5, embeddings: 2.2 },
    { date: 'Fri', gpt4: 22.1, claude3: 11.2, embeddings: 4.1 },
    { date: 'Sat', gpt4: 9.5, claude3: 5.4, embeddings: 1.5 },
    { date: 'Sun', gpt4: 8.2, claude3: 4.8, embeddings: 1.2 }
  ];

  const flowList = workflows?.length > 0 ? workflows : [
    { id: 'wf_892', name: 'Client Onboarding', status: 'success', duration: '2.4s', time: '5 mins ago' },
    { id: 'wf_891', name: 'SEO Report Gen', status: 'failed', duration: '12.1s', time: '18 mins ago' },
    { id: 'wf_890', name: 'Invoice Reminder', status: 'success', duration: '0.8s', time: '1 hour ago' },
    { id: 'wf_889', name: 'Social Auto-Post', status: 'success', duration: '4.2s', time: '3 hours ago' },
    { id: 'wf_888', name: 'Lead Enrichment', status: 'success', duration: '1.5s', time: '5 hours ago' }
  ];

  const failureList = workflowFailures?.length > 0 ? workflowFailures : [
    { id: 'wf_891', name: 'SEO Report Gen', error: 'OpenAI timeout (504)', time: '18 mins ago', retries: 2 }
  ];

  const alertList = alerts?.length > 0 ? alerts : [
    { id: 1, type: 'error', message: 'Stripe webhook delivery failed (500)', source: 'api_gateway', time: '18 mins ago' },
    { id: 2, type: 'warning', message: 'High latency detected on Supabase Edge Function', source: 'database', time: '2 hours ago' },
    { id: 3, type: 'warning', message: 'GPT-4o API rate limit approaching (85%)', source: 'ai_service', time: '5 hours ago' }
  ];

  if (!isAdmin) return <Navigate to="/admin-login" />;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 font-outfit">
      <Helmet>
        <title>System Analytics | BM-OS</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-navy flex items-center gap-3">
              <Activity className="w-8 h-8 text-brand-orange" />
              Observability & AI Analytics
            </h1>
            <p className="text-gray-500 mt-1">Real-time system health, workflow monitoring, and AI cost tracking.</p>
          </div>
          <div className="flex gap-2">
            {['1h', '24h', '7d', '30d'].map(range => (
              <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                  timeRange === range ? 'bg-brand-navy text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard title="System Health" value="99.9%" icon={<Server className="w-6 h-6 text-green-500" />} trend="+0.1%" trendUp={true} />
          <KPICard title="Workflow Success Rate" value="98.2%" icon={<GitPullRequest className="w-6 h-6 text-blue-500" />} trend="-0.5%" trendUp={false} />
          <KPICard title="AI API Cost (30d)" value="$142.80" icon={<DollarSign className="w-6 h-6 text-orange-500" />} trend="+$12.40" trendUp={false} />
          <KPICard title="Avg API Latency" value="184ms" icon={<Clock className="w-6 h-6 text-purple-500" />} trend="-12ms" trendUp={true} />
        </div>

        {/* Main Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Latency Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 lg:col-span-2">
            <h2 className="text-lg font-bold text-brand-navy mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" /> System & AI Latency
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={perfData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="aiLatency" name="OpenAI Latency (ms)" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorAi)" />
                  <Area type="monotone" dataKey="latency" name="API Latency (ms)" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorLatency)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Cost Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-brand-navy mb-6 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-brand-orange" /> OpenAI Cost Trend
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="gpt4" name="GPT-4" stackId="a" fill="#0A1D37" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="claude3" name="Claude 3" stackId="a" fill="#F97316" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="embeddings" name="Embeddings" stackId="a" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section: Tables & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Workflows */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 lg:col-span-2 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex gap-4">
                <button onClick={() => setActiveTab('success')} className={`text-lg font-bold flex items-center gap-2 ${activeTab === 'success' ? 'text-brand-navy' : 'text-gray-400 hover:text-brand-navy'}`}>
                  <Database className="w-5 h-5" /> Recent Workflows
                </button>
                <button onClick={() => setActiveTab('failures')} className={`text-lg font-bold flex items-center gap-2 ${activeTab === 'failures' ? 'text-red-600' : 'text-gray-400 hover:text-red-500'}`}>
                  <AlertTriangle className="w-5 h-5" /> Dead-Letter (Failures)
                </button>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-brand-navy bg-gray-50 rounded-lg"><Search className="w-4 h-4"/></button>
                <button className="p-2 text-gray-400 hover:text-brand-navy bg-gray-50 rounded-lg"><Filter className="w-4 h-4"/></button>
              </div>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              {activeTab === 'success' ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Workflow Name</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Time</th>
                      <th className="p-4 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {flowList.map(wf => (
                      <tr key={wf.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-bold text-gray-700 text-sm">{wf.name || wf.workflow_name}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            wf.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {wf.status === 'success' ? <CheckCircle className="w-3 h-3"/> : <XCircle className="w-3 h-3"/>}
                            {(wf.status || 'success').toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">{wf.time || new Date(wf.created_at).toLocaleTimeString()}</td>
                        <td className="p-4 text-sm font-medium text-gray-700">{wf.duration || `${wf.execution_time_ms}ms`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Failed Workflow</th>
                      <th className="p-4 font-semibold">Error Context</th>
                      <th className="p-4 font-semibold">Retries</th>
                      <th className="p-4 font-semibold">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {failureList.map(wf => (
                      <tr key={wf.id} className="hover:bg-red-50 transition-colors">
                        <td className="p-4 font-bold text-red-700 text-sm">{wf.name || wf.workflow_name}</td>
                        <td className="p-4 text-sm text-gray-700 font-mono">{wf.error || wf.error_details}</td>
                        <td className="p-4 text-sm font-medium text-gray-500">{wf.retries || wf.retry_count || 0}</td>
                        <td className="p-4 text-sm text-gray-500">{wf.time || new Date(wf.created_at).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
             <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" /> Active Alerts
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {alertList.map(alert => (
                <div key={alert.id} className={`p-4 rounded-xl border-l-4 flex gap-3 ${
                  alert.type === 'critical' ? 'bg-red-50 border-red-500' :
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <AlertTriangle className={`w-5 h-5 shrink-0 ${
                    alert.type === 'critical' ? 'text-red-500' :
                    alert.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-500'
                  }`} />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{alert.msg}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon, trend, trendUp }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gray-50 rounded-xl">
        {icon}
      </div>
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {trend}
      </span>
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-extrabold text-brand-navy tracking-tight">{value}</h3>
    </div>
  </div>
);
