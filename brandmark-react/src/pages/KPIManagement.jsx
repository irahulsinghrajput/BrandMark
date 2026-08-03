import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Target, Plus, TrendingUp, TrendingDown } from 'lucide-react';

export const KPIManagement = () => {
  const [isAdmin] = useState(true);

  const mockKPIs = [
    { id: 1, name: 'Customer Acquisition Cost (CAC)', category: 'Marketing', current: '$120', target: '$100', status: 'warning' },
    { id: 2, name: 'Monthly Recurring Revenue (MRR)', category: 'Financial', current: '$45,000', target: '$50,000', status: 'good' },
    { id: 3, name: 'Server Uptime', category: 'Operational', current: '99.98%', target: '99.99%', status: 'critical' }
  ];

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
                {mockKPIs.map(kpi => (
                  <tr key={kpi.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-700 text-sm flex items-center gap-3">
                       <Target className="w-5 h-5 text-gray-400"/> {kpi.name}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-500">{kpi.category}</td>
                    <td className="p-4 text-sm font-bold text-brand-navy text-lg">{kpi.current}</td>
                    <td className="p-4 text-sm font-medium text-gray-400">{kpi.target}</td>
                    <td className="p-4">
                      {kpi.status === 'good' && <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold"><TrendingUp className="w-3 h-3"/> On Track</span>}
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
