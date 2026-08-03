import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, Activity, FileText, Search, 
  MapPin, MousePointer, ShieldAlert, CheckCircle, RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import * as Sentry from '@sentry/react';

// Theme Colors for Charts
const COLORS = ['#F97316', '#1F2937', '#3B82F6', '#10B981', '#8B5CF6'];

export const ExecutiveDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(true); // In production, verify JWT 'user_role' = 'admin'

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: dbData, error } = await supabase.from('vw_executive_dashboard').select('*').single();
        
        if (error) throw error;
        setData(dbData);
      } catch (err) {
        Sentry.captureException(err);
        setError('Failed to load dashboard metrics. Database view might not exist.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();

    const subscription = supabase
      .channel('exec_dashboard_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'system_events' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  if (!isAdmin) return <Navigate to="/admin-login" />;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-brand-orange animate-spin" />
          <p className="font-bold text-brand-navy">Aggregating Live APIs (HubSpot, GA4, GSC)...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-lg">
           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
           <h2 className="text-xl font-bold text-brand-navy mb-2">Dashboard Unavailable</h2>
           <p className="text-gray-500 mb-6">{error || 'No data found in vw_executive_dashboard.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20 font-outfit">
      <Helmet>
        <title>Executive Revenue Dashboard | BrandMark</title>
      </Helmet>
      
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">Executive Revenue Dashboard</h1>
            <p className="text-gray-500">Real-time business intelligence across all channels.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm font-bold text-gray-700 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" /> Live Sync Active
          </div>
        </div>

        {/* 1. AI Executive Summary (GPT-4o) */}
        <div className="bg-brand-navy text-white rounded-2xl p-6 shadow-xl mb-8 flex gap-6">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-brand-orange" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-brand-orange">AI Executive Summary</h3>
            <p className="text-gray-300 leading-relaxed mb-4">{data.ai_insights.summary}</p>
            <div className="flex flex-wrap gap-4">
              {data.ai_insights.actions.map((action, i) => (
                <span key={i} className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-400" /> {action}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Top Level KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard title="Monthly Revenue" value={data.kpis.revenue_mtd} icon={<DollarSign/>} trend="+12.5%" />
          <KpiCard title="Pipeline Value" value={data.kpis.pipeline_value} icon={<TrendingUp/>} trend="+5.2%" />
          <KpiCard title="Active Clients" value={data.kpis.active_clients} icon={<Users/>} trend="+2" />
          <KpiCard title="Proposals Sent" value={data.kpis.proposals_sent} icon={<FileText/>} trend="85% Win Rate" />
        </div>

        {/* Grid Layout for Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Revenue Trend (Area Chart) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-brand-navy mb-6">Revenue Forecast vs Actuals (YTD)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.charts.revenue_trend}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip />
                  <Area type="monotone" dataKey="actual" stroke="#F97316" fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="forecast" stroke="#1F2937" fillOpacity={0} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sales Pipeline (Bar Chart) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-brand-navy mb-6">HubSpot CRM Pipeline Stage</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.charts.pipeline_stages}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="stage" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#F3F4F6'}} />
                  <Bar dataKey="value" fill="#1F2937" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Website Traffic GA4 (Line Chart) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-brand-navy flex items-center gap-2"><MousePointer className="w-5 h-5 text-blue-500"/> GA4 Website Traffic</h3>
              <span className="text-sm font-bold text-gray-500">Sessions</span>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.charts.website_traffic}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="sessions" stroke="#3B82F6" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SEO Performance GSC (Line Chart) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
             <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-brand-navy flex items-center gap-2"><Search className="w-5 h-5 text-green-500"/> Search Console Performance</h3>
              <span className="text-sm font-bold text-gray-500">Organic Clicks</span>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.charts.seo_clicks}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>
        
        {/* Third Row: Ads and Revenue by Service */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
           
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 lg:col-span-1">
            <h3 className="font-bold text-brand-navy mb-6">Revenue by Service</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.charts.revenue_by_service} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {data.charts.revenue_by_service.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {data.charts.revenue_by_service.map((entry, index) => (
                <div key={index} className="flex items-center gap-1 text-xs font-bold text-gray-600">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 lg:col-span-2">
            <h3 className="font-bold text-brand-navy mb-6">Active Proposals & Contracts</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm uppercase border-b border-gray-100">
                    <th className="pb-3 font-semibold">Client</th>
                    <th className="pb-3 font-semibold">Service</th>
                    <th className="pb-3 font-semibold">Value</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.proposals.map((prop, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="py-4 font-bold text-gray-900">{prop.client}</td>
                      <td className="py-4 text-gray-600">{prop.service}</td>
                      <td className="py-4 font-semibold text-brand-navy">{prop.value}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          prop.status === 'Accepted' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-brand-orange'
                        }`}>
                          {prop.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

// Component for KPI cards
const KpiCard = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gray-50 rounded-xl text-brand-orange">
        {icon}
      </div>
      <span className="text-sm font-bold text-green-500 bg-green-50 px-2 py-1 rounded-md">{trend}</span>
    </div>
    <div>
      <h4 className="text-gray-500 font-semibold text-sm mb-1">{title}</h4>
      <p className="text-3xl font-extrabold text-brand-navy">{value}</p>
    </div>
  </div>
);

export default ExecutiveDashboard;
