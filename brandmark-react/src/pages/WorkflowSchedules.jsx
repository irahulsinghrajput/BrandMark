import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Play, Clock, CheckCircle } from 'lucide-react';

export const WorkflowSchedules = () => {
  const [isAdmin] = useState(true);

  const mockSchedules = [
    { id: 1, workflow: 'Weekly SEO Audit', cron: '0 0 * * 0', next: 'Sunday at 12:00 AM', status: 'active' },
    { id: 2, workflow: 'Daily Invoice Sync', cron: '0 23 * * *', next: 'Today at 11:00 PM', status: 'active' },
    { id: 3, workflow: 'Monthly P&L Report', cron: '0 0 1 * *', next: '1st of next month', status: 'paused' }
  ];

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
                {mockSchedules.map(sch => (
                  <tr key={sch.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-700 text-sm flex items-center gap-3">
                       <Calendar className="w-5 h-5 text-gray-400"/> {sch.workflow}
                    </td>
                    <td className="p-4 font-mono text-sm text-gray-600 bg-gray-50 rounded mx-2">{sch.cron}</td>
                    <td className="p-4 text-sm font-medium text-gray-700">{sch.next}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        sch.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {sch.status === 'active' ? <CheckCircle className="w-3 h-3"/> : <Clock className="w-3 h-3"/>}
                        {sch.status.toUpperCase()}
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
