import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Database, Plus, Search, Filter, Save } from 'lucide-react';

export const BusinessIntelligence = () => {
  const [isAdmin] = useState(true);

  if (!isAdmin) return <Navigate to="/admin-login" />;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 font-outfit">
      <Helmet><title>Business Intelligence | BM-OS</title></Helmet>

      <div className="max-w-7xl mx-auto px-6 h-[calc(100vh-140px)] flex flex-col">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div className="flex items-center gap-4">
             <Link to="/admin/analytics" className="p-2 hover:bg-gray-200 rounded-full"><ArrowLeft className="w-5 h-5"/></Link>
             <div>
               <h1 className="text-2xl font-bold text-brand-navy">Report Builder</h1>
               <p className="text-xs text-gray-500">Query and analyze database models.</p>
             </div>
          </div>
          <button className="bg-brand-navy text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm">
             <Save className="w-4 h-4"/> Save Report
          </button>
        </div>

        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 overflow-y-auto hidden md:block">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Data Models</h3>
            <div className="space-y-2">
               <div className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Database className="w-4 h-4 text-blue-500"/> CRM Core
               </div>
               <div className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Database className="w-4 h-4 text-green-500"/> Financial Transactions
               </div>
               <div className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Database className="w-4 h-4 text-purple-500"/> Marketing Campaigns
               </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-inner relative flex items-center justify-center bg-gray-50/50">
             <div className="text-center max-w-md p-6">
                <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-brand-navy mb-2">Drag Dimensions & Facts Here</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Select a data model from the left panel and drag metrics to build custom tables and charts.
                </p>
                <button className="mx-auto flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg font-bold text-gray-700 hover:bg-gray-50">
                  <Plus className="w-4 h-4"/> Add Custom Query
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
