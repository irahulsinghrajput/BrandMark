import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, Settings, Plus, GripHorizontal } from 'lucide-react';

export const CustomDashboards = () => {
  const [isAdmin] = useState(true);

  if (!isAdmin) return <Navigate to="/admin-login" />;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 font-outfit">
      <Helmet><title>Custom Dashboards | BM-OS</title></Helmet>

      <div className="max-w-7xl mx-auto px-6 h-[calc(100vh-140px)] flex flex-col">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div className="flex items-center gap-4">
             <Link to="/admin/analytics" className="p-2 hover:bg-gray-200 rounded-full"><ArrowLeft className="w-5 h-5"/></Link>
             <div>
               <h1 className="text-2xl font-bold text-brand-navy">Custom Views</h1>
               <p className="text-xs text-gray-500">Drag and drop widgets to build personalized dashboards.</p>
             </div>
          </div>
          <div className="flex gap-2">
             <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
                <Settings className="w-4 h-4"/> Layout
             </button>
             <button className="bg-brand-navy text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4"/> Add Widget
             </button>
          </div>
        </div>

        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-inner p-8 flex flex-col items-center justify-center bg-gray-50/50 border-dashed">
            <LayoutDashboard className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Blank Canvas</h3>
            <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
              Add widgets from the library to build your custom dashboard. Widgets connect dynamically to PostgreSQL views.
            </p>
            <button className="flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
              <GripHorizontal className="w-5 h-5"/> Browse Widget Library
            </button>
        </div>
      </div>
    </div>
  );
};
