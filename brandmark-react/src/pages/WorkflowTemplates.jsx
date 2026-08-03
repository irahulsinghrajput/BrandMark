import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Layers, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const WorkflowTemplates = () => {
  const [isAdmin] = useState(true);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
       const { data } = await supabase.from('workflow_templates').select('*');
       if (data && data.length > 0) setTemplates(data);
       else setTemplates([
         { name: 'New Client Onboarding', category: 'Operations', description: 'Standard sequence for welcoming a new client.' },
         { name: 'Invoice Reminder', category: 'Finance', description: 'Sends automated reminders for overdue invoices.' }
       ]);
    };
    fetchTemplates();
  }, []);

  if (!isAdmin) return <Navigate to="/admin-login" />;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 font-outfit">
      <Helmet><title>Workflow Templates | BM-OS</title></Helmet>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
             <Link to="/admin/workflows" className="p-2 hover:bg-gray-200 rounded-full"><ArrowLeft className="w-5 h-5"/></Link>
             <div>
               <h1 className="text-2xl font-bold text-brand-navy">Workflow Templates</h1>
               <p className="text-gray-500 text-sm mt-1">Deploy pre-built automation sequences instantly.</p>
             </div>
           </div>
           <button className="bg-brand-navy text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4"/> New Template
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {templates.map(t => (
              <div key={t.name} className="bg-white border border-gray-200 p-6 rounded-2xl hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                    <Layers className="w-6 h-6"/>
                 </div>
                 <h3 className="font-bold text-brand-navy text-lg mb-1">{t.name}</h3>
                 <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{t.category}</span>
                 <p className="text-sm text-gray-500 mt-3">{t.description}</p>
                 <button className="mt-4 w-full border border-brand-navy text-brand-navy font-bold py-2 rounded-lg hover:bg-brand-navy hover:text-white transition-colors text-sm">
                   Use Template
                 </button>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
};
