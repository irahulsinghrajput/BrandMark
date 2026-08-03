import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Play, Plus, GitMerge, Webhook } from 'lucide-react';
import toast from 'react-hot-toast';

export const WorkflowDesigner = () => {
  const [isAdmin] = useState(true);

  if (!isAdmin) return <Navigate to="/admin-login" />;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 font-outfit">
      <Helmet><title>Workflow Designer | BM-OS</title></Helmet>

      <div className="max-w-7xl mx-auto px-6 h-[calc(100vh-140px)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 shrink-0">
          <div className="flex items-center gap-4">
             <Link to="/admin/workflows" className="p-2 hover:bg-gray-200 rounded-full"><ArrowLeft className="w-5 h-5"/></Link>
             <div>
               <h1 className="text-xl font-bold text-brand-navy">Untitled Workflow</h1>
               <p className="text-xs text-gray-500">Draft • v1</p>
             </div>
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-2 border border-gray-200 bg-white text-gray-700 font-bold rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
               <Save className="w-4 h-4"/> Save Draft
             </button>
             <button className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg text-sm hover:bg-green-700 flex items-center gap-2">
               <Play className="w-4 h-4"/> Execute
             </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-inner relative overflow-hidden flex items-center justify-center bg-grid-pattern">
           <div className="absolute top-4 left-4 flex gap-2">
              <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-2 flex flex-col gap-2">
                 <button className="p-2 hover:bg-brand-orange hover:text-white text-gray-500 rounded transition-colors" title="Add Trigger"><Webhook className="w-5 h-5"/></button>
                 <button className="p-2 hover:bg-brand-orange hover:text-white text-gray-500 rounded transition-colors" title="Add Action"><GitMerge className="w-5 h-5"/></button>
                 <button className="p-2 hover:bg-brand-orange hover:text-white text-gray-500 rounded transition-colors" title="Add Node"><Plus className="w-5 h-5"/></button>
              </div>
           </div>

           <div className="text-center max-w-md p-6 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm">
              <GitMerge className="w-12 h-12 text-brand-orange mx-auto mb-4" />
              <h3 className="text-lg font-bold text-brand-navy mb-2">Visual Designer Interface</h3>
              <p className="text-sm text-gray-500 mb-4">
                This canvas persists nodes and edges as JSON arrays into the <code>workflow_versions</code> database table. 
                Full interactive node drag-and-drop requires integrating React Flow.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
