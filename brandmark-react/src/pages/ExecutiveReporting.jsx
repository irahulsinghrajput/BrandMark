import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Calendar, Mail, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const ExecutiveReporting = () => {
  const [isAdmin] = useState(true);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['executiveReports'],
    queryFn: async () => {
      const { data, error } = await supabase.from('executive_reports').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  if (!isAdmin) return <Navigate to="/admin-login" />;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 font-outfit">
      <Helmet><title>Executive Reporting | BM-OS</title></Helmet>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
             <Link to="/admin/analytics" className="p-2 hover:bg-gray-200 rounded-full"><ArrowLeft className="w-5 h-5"/></Link>
             <div>
               <h1 className="text-2xl font-bold text-brand-navy">Scheduled Executive Reports</h1>
               <p className="text-gray-500 text-sm mt-1">Manage PDF and Excel distributions to stakeholders.</p>
             </div>
           </div>
           <button className="bg-brand-navy text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4"/> Create Report
           </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Report Title</th>
                  <th className="p-4 font-semibold">Format</th>
                  <th className="p-4 font-semibold">Schedule</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && <tr><td colSpan="5" className="p-4 text-center text-gray-500">Loading reports...</td></tr>}
                {!isLoading && reports.length === 0 && <tr><td colSpan="5" className="p-4 text-center text-gray-500">No reports found.</td></tr>}
                {reports.map(rep => (
                  <tr key={rep.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-700 text-sm flex items-center gap-3">
                       <FileText className="w-5 h-5 text-gray-400"/> {rep.title || rep.report_name}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-500">
                       <span className={`px-2 py-1 rounded text-xs font-bold ${rep.format === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                         {rep.format || 'PDF'}
                       </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-700 flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400"/> {rep.schedule_frequency || 'Manual'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        rep.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                         {rep.status === 'active' && <CheckCircle className="w-3 h-3"/>} {rep.status || 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                       <button className="text-gray-500 hover:text-brand-navy p-2 bg-gray-50 rounded-lg"><Download className="w-4 h-4"/></button>
                       <button className="text-gray-500 hover:text-brand-navy p-2 bg-gray-50 rounded-lg"><Mail className="w-4 h-4"/></button>
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
