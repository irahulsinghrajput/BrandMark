import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Target, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const KPIManagement = () => {
  const [isAdmin] = useState(true);

  const { data: kpis = [], isLoading } = useQuery({
    queryKey: ['kpis'],
    queryFn: async () => {
      const { data, error } = await supabase.from('vw_enterprise_metrics').select('*');
      if (error) throw error;
      return data || [];
    }
  });

  if (!isAdmin) return <Navigate to="/admin-login" />;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 font-outfit">
      <Helmet><title>KPI Management | BM-OS</title></Helmet>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
             <Link to="/admin/analytics" className="p-2 hover:bg-gray-200 rounded-full"><ArrowLeft className="w-5 h-5"/></Link>
             <div>
               <h1 className="text-2xl font-bold text-brand-navy">KPI Management</h1>
               <p className="text-gray-500 text-sm mt-1">Track business targets, thresholds, and alerts.</p>
             </div>
           </div>
           <button className="bg-brand-navy text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4"/> Add KPI Target
           </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Indicator</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Current Value</th>
                  <th className="p-4 font-semibold">Target</th>
                  <th className="p-4 font-semibold">Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && <tr><td colSpan="5" className="p-4 text-center text-gray-500">Loading KPIs...</td></tr>}
                {!isLoading && kpis.length === 0 && <tr><td colSpan="5" className="p-4 text-center text-gray-500">No KPIs found.</td></tr>}
                {kpis.map(kpi => (
                  <tr key={kpi.id || kpi.metric_name} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-700 text-sm flex items-center gap-3">
                       <Target className="w-5 h-5 text-gray-400"/> {kpi.metric_name || kpi.name}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-500">{kpi.category || 'General'}</td>
                    <td className="p-4 text-sm font-bold text-brand-navy text-lg">{kpi.current_value || kpi.current}</td>
                    <td className="p-4 text-sm font-medium text-gray-400">{kpi.target_value || kpi.target || 'N/A'}</td>
                    <td className="p-4">
                      {(kpi.status === 'good' || !kpi.status) && <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold"><TrendingUp className="w-3 h-3"/> On Track</span>}
                      {kpi.status === 'warning' && <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs font-bold"><TrendingDown className="w-3 h-3"/> Behind</span>}
                      {kpi.status === 'critical' && <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-bold"><TrendingDown className="w-3 h-3"/> Critical</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
