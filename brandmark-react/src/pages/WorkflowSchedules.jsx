import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Play, Clock, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const WorkflowSchedules = () => {
  const [isAdmin] = useState(true);

  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ['workflowSchedules'],
    queryFn: async () => {
      const { data, error } = await supabase.from('workflow_schedules').select('*, workflows(name)').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  if (!isAdmin) return <Navigate to="/admin-login" />;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 font-outfit">
      <Helmet><title>Workflow Schedules | BM-OS</title></Helmet>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
           <Link to="/admin/workflows" className="p-2 hover:bg-gray-200 rounded-full"><ArrowLeft className="w-5 h-5"/></Link>
           <div>
             <h1 className="text-2xl font-bold text-brand-navy">Cron Schedules</h1>
             <p className="text-gray-500 text-sm mt-1">Manage recurring workflow execution intervals.</p>
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Workflow</th>
                  <th className="p-4 font-semibold">Cron Expression</th>
                  <th className="p-4 font-semibold">Next Run</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && <tr><td colSpan="5" className="p-4 text-center text-gray-500">Loading schedules...</td></tr>}
                {!isLoading && schedules.length === 0 && <tr><td colSpan="5" className="p-4 text-center text-gray-500">No schedules found.</td></tr>}
                {schedules.map(sch => (
                  <tr key={sch.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-700 text-sm flex items-center gap-3">
                       <Calendar className="w-5 h-5 text-gray-400"/> {sch.workflows?.name || 'Unknown'}
                    </td>
                    <td className="p-4 font-mono text-sm text-gray-600 bg-gray-50 rounded mx-2">{sch.cron_expression}</td>
                    <td className="p-4 text-sm font-medium text-gray-700">Calculated by Backend</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        sch.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {sch.is_active ? <CheckCircle className="w-3 h-3"/> : <Clock className="w-3 h-3"/>}
                        {sch.is_active ? 'ACTIVE' : 'PAUSED'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                       <button className="text-brand-orange hover:text-brand-navy font-bold text-sm px-3 py-1 bg-orange-50 rounded-lg">Edit</button>
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
