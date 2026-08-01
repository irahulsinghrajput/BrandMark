import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { 
  Activity, Server, Zap, ShieldAlert, Cpu, Database, 
  Clock, GitPullRequest, DollarSign, AlertTriangle, 
  CheckCircle, XCircle, Search, Filter
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Simulated Data for Dashboards
const performanceData = [
  { time: '00:00', latency: 120, aiLatency: 450, errorRate: 0.1 },
  { time: '04:00', latency: 110, aiLatency: 420, errorRate: 0.05 },
  { time: '08:00', latency: 250, aiLatency: 800, errorRate: 1.2 },
  { time: '12:00', latency: 310, aiLatency: 950, errorRate: 2.1 },
  { time: '16:00', latency: 280, aiLatency: 820, errorRate: 1.5 },
  { time: '20:00', latency: 150, aiLatency: 500, errorRate: 0.2 },
];

const costData = [
  { day: 'Mon', cost: 12.50 },
  { day: 'Tue', cost: 18.20 },
  { day: 'Wed', cost: 24.00 },
  { day: 'Thu', cost: 15.30 },
  { day: 'Fri', cost: 35.10 },
  { day: 'Sat', cost: 8.50 },
  { day: 'Sun', cost: 5.20 },
];

const workflows = [
  { id: 'wf-1', name: 'Proposal Generator (Mod 3)', status: 'success', time: '12s ago', duration: '4.2s' },
  { id: 'wf-2', name: 'Knowledge Base Indexer (Mod 10)', status: 'error', time: '5m ago', duration: '14.1s' },
  { id: 'wf-3', name: 'Monthly Finance Sync (Mod 8)', status: 'success', time: '1h ago', duration: '1.2s' },
  { id: 'wf-4', name: 'Marketing Campaign Launch (Mod 7)', status: 'success', time: '2h ago', duration: '8.5s' }
];

const alerts = [
  { id: 1, type: 'critical', msg: 'OpenAI API Timeout in Mod 10', time: '5m ago' },
  { id: 2, type: 'warning', msg: 'API Latency > 300ms on /portal/dashboard', time: '12m ago' },
  { id: 3, type: 'info', msg: 'System Backup Completed', time: '1h ago' }
];

export const SystemAnalytics = () => {
  const [isAdmin] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  if (!isAdmin) return <Navigate to="/student-login" />;

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
                <AreaChart data={performanceData}>
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
                <BarChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="cost" name="Cost USD" fill="#0A1D37" radius={[4, 4, 0, 0]} />
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
              <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                <Database className="w-5 h-5 text-gray-500" /> Recent n8n Workflows
              </h2>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-brand-navy bg-gray-50 rounded-lg"><Search className="w-4 h-4"/></button>
                <button className="p-2 text-gray-400 hover:text-brand-navy bg-gray-50 rounded-lg"><Filter className="w-4 h-4"/></button>
              </div>
            </div>
            <div className="flex-1 overflow-x-auto">
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
                  {workflows.map(wf => (
                    <tr key={wf.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-700 text-sm">{wf.name}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          wf.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {wf.status === 'success' ? <CheckCircle className="w-3 h-3"/> : <XCircle className="w-3 h-3"/>}
                          {wf.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">{wf.time}</td>
                      <td className="p-4 text-sm font-medium text-gray-700">{wf.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              {alerts.map(alert => (
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
