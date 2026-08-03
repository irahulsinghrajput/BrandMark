import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Link } from 'react-router-dom';
import { 
  BarChart2, PieChart, TrendingUp, Target, Database, 
  Lightbulb, Activity, ArrowRight, LayoutDashboard, BrainCircuit 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export const EnterpriseAnalytics = () => {
  const [isAdmin] = useState(true);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const { data } = await supabase.from('vw_enterprise_metrics').select('*').single();
      if (data) setMetrics(data);
      else setMetrics({ total_sessions: 4520, total_events: 18450 });
    };
    fetchMetrics();
  }, []);

  if (!isAdmin) return <Navigate to="/admin-login" />;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 font-outfit">
      <Helmet><title>Enterprise Analytics | BM-OS</title></Helmet>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-navy flex items-center gap-3">
              <BarChart2 className="w-8 h-8 text-brand-orange" />
              Enterprise Analytics Hub
            </h1>
            <p className="text-gray-500 mt-1">Centralized Business Intelligence and Executive AI Insights.</p>
          </div>
        </div>

        {/* Global Pulse */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6 justify-between items-center mb-8">
           <div className="flex gap-6 items-center">
             <div className="bg-blue-50 text-blue-500 p-4 rounded-xl">
               <Activity className="w-8 h-8"/>
             </div>
             <div>
                <p className="text-sm font-bold text-gray-400">Total Analytics Sessions</p>
                <h3 className="text-3xl font-extrabold text-brand-navy">{metrics?.total_sessions.toLocaleString() || 0}</h3>
             </div>
             <div className="h-12 w-px bg-gray-200 hidden md:block"></div>
             <div>
                <p className="text-sm font-bold text-gray-400">Total Telemetry Events</p>
                <h3 className="text-3xl font-extrabold text-brand-navy">{metrics?.total_events.toLocaleString() || 0}</h3>
             </div>
           </div>
           <Link to="/admin/analytics/custom" className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200">
             <LayoutDashboard className="w-4 h-4"/> Custom Dashboards
           </Link>
        </div>

        {/* Suite Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModuleCard to="/admin/analytics/bi" title="Business Intelligence" desc="Drag-and-drop report builder and OLAP." icon={<Database />} />
          <ModuleCard to="/admin/analytics/reporting" title="Executive Reporting" desc="Scheduled PDF/Excel exports and email delivery." icon={<PieChart />} />
          <ModuleCard to="/admin/analytics/predictive" title="Predictive Analytics" desc="AI-powered forecasting and churn models." icon={<TrendingUp />} />
          <ModuleCard to="/admin/analytics/kpi" title="KPI Management" desc="Track business targets, thresholds, and alerts." icon={<Target />} />
          <ModuleCard to="/admin/analytics/ai-insights" title="AI Insights Engine" desc="Automated executive summaries and anomaly detection." icon={<BrainCircuit />} />
          <ModuleCard to="/admin/analytics/custom" title="Custom Views" desc="Build personalized widget layouts." icon={<LayoutDashboard />} />
        </div>
      </div>
    </div>
  );
};

const ModuleCard = ({ to, title, desc, icon }) => (
  <Link to={to} className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-brand-orange hover:shadow-md transition-all group flex flex-col justify-between h-48 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange opacity-5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
    <div className="relative z-10">
      <div className="text-gray-400 group-hover:text-brand-orange transition-colors mb-4">{icon}</div>
      <h3 className="font-bold text-lg text-brand-navy mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
    <div className="relative z-10 text-brand-orange font-bold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 mt-4">
      Open Module <ArrowRight className="w-4 h-4" />
    </div>
  </Link>
);
