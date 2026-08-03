import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Activity, Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';

export const WorkflowExecutions = () => {
  const [isAdmin] = useState(true);

  const mockExecutions = [
    { id: 'ex_8992', workflow: 'Client Onboarding', trigger: 'webhook', status: 'success', duration: '2.4s', time: '5 mins ago' },
    { id: 'ex_8993', workflow: 'Invoice Reminder', trigger: 'schedule', status: 'running', duration: '12.1s', time: '18 mins ago' },
    { id: 'ex_8994', workflow: 'Social Auto-Post', trigger: 'manual', status: 'failed', duration: '0.8s', time: '1 hour ago' }
  ];

  if (!isAdmin) return <Navigate to="/admin-login" />;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 font-outfit">
      <Helmet><title>Workflow Executions | BM-OS</title></Helmet>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
           <Link to="/admin/workflows" className="p-2 hover:bg-gray-200 rounded-full"><ArrowLeft className="w-5 h-5"/></Link>
           <div>
             <h1 className="text-2xl font-bold text-brand-navy">Execution History</h1>
             <p className="text-gray-500 text-sm mt-1">Real-time telemetry and step-by-step workflow logs.</p>
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                <Activity className="w-5 h-5" /> Recent Executions
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
                      <th className="p-4 font-semibold">Execution ID</th>
                      <th className="p-4 font-semibold">Workflow</th>
                      <th className="p-4 font-semibold">Trigger</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockExecutions.map(ex => (
                      <tr key={ex.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-mono text-xs text-gray-500">{ex.id}</td>
                        <td className="p-4 font-bold text-gray-700 text-sm">{ex.workflow}</td>
                        <td className="p-4 text-xs font-mono text-gray-500">{ex.trigger}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            ex.status === 'success' ? 'bg-green-100 text-green-700' : 
                            ex.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {ex.status === 'success' ? <CheckCircle className="w-3 h-3"/> : 
                             ex.status === 'failed' ? <XCircle className="w-3 h-3"/> : <Clock className="w-3 h-3 animate-spin"/>}
                            {ex.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-sm font-medium text-gray-700">{ex.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};
