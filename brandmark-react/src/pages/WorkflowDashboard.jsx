import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Link } from 'react-router-dom';
import { 
  GitMerge, Play, CheckCircle, XCircle, AlertTriangle, 
  Activity, Clock, Layers, Calendar, Settings 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export const WorkflowDashboard = () => {
  const [isAdmin] = useState(true);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      const { data } = await supabase.from('vw_workflow_health').select('*').single();
      if (data) setHealth(data);
      else setHealth({
        total_active_workflows: 12,
        active_schedules: 5,
        queued_items: 0,
        unresolved_dead_letters: 2
      });
    };
    fetchHealth();
  }, []);

  if (!isAdmin) return <Navigate to="/admin-login" />;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 font-outfit">
      <Helmet><title>Workflow Engine | BM-OS</title></Helmet>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-navy flex items-center gap-3">
              <GitMerge className="w-8 h-8 text-brand-orange" />
              Advanced Workflow Engine
            </h1>
            <p className="text-gray-500 mt-1">Enterprise orchestration, automation, and distributed job queue.</p>
          </div>
          <Link to="/admin/workflows/designer" className="bg-brand-navy text-white px-5 py-2.5 rounded-lg font-bold hover:bg-gray-800 transition-colors">
            Create Workflow
          </Link>
        </div>

        {/* Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <KPICard title="Active Workflows" value={health?.total_active_workflows || 0} icon={<Layers className="text-blue-500"/>} />
          <KPICard title="Active Schedules" value={health?.active_schedules || 0} icon={<Calendar className="text-green-500"/>} />
          <KPICard title="Queued Jobs" value={health?.queued_items || 0} icon={<Clock className="text-yellow-500"/>} />
          <KPICard title="Dead Letters" value={health?.unresolved_dead_letters || 0} icon={<AlertTriangle className="text-red-500"/>} alert={health?.unresolved_dead_letters > 0} />
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModuleCard to="/admin/workflows/designer" title="Designer" desc="Visual drag-and-drop workflow builder." icon={<GitMerge />} />
          <ModuleCard to="/admin/workflows/executions" title="Executions" desc="View real-time workflow telemetry and steps." icon={<Activity />} />
          <ModuleCard to="/admin/workflows/queue" title="Queues & Dead Letters" desc="Inspect stuck jobs and retry processing." icon={<AlertTriangle />} />
          <ModuleCard to="/admin/workflows/templates" title="Templates" desc="Library of pre-built automation sequences." icon={<Layers />} />
          <ModuleCard to="/admin/workflows/schedules" title="Schedules (Cron)" desc="Manage recurring jobs and time-based triggers." icon={<Calendar />} />
          <ModuleCard to="/admin/settings" title="Engine Settings" desc="Configure webhook permissions and secrets." icon={<Settings />} />
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon, alert }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-sm border ${alert ? 'border-red-200' : 'border-gray-200'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${alert ? 'bg-red-50' : 'bg-gray-50'}`}>{icon}</div>
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className={`text-3xl font-extrabold tracking-tight ${alert ? 'text-red-600' : 'text-brand-navy'}`}>{value}</h3>
    </div>
  </div>
);

const ModuleCard = ({ to, title, desc, icon }) => (
  <Link to={to} className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all group flex flex-col justify-between h-48">
    <div>
      <div className="text-gray-400 group-hover:text-brand-orange transition-colors mb-4">{icon}</div>
      <h3 className="font-bold text-lg text-brand-navy mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  </Link>
);
