import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, AlertTriangle, Lightbulb, Zap, CheckCircle } from 'lucide-react';

export const AIInsightsEngine = () => {
  const [isAdmin] = useState(true);

  const mockInsights = [
    { id: 1, type: 'anomaly', title: 'Unusual Spike in API Latency', desc: 'Supabase Edge Functions are experiencing a 300ms variance compared to the 7-day moving average.', severity: 'medium', icon: <AlertTriangle className="w-5 h-5 text-yellow-500"/> },
    { id: 2, type: 'opportunity', title: 'High Intent Churn Segment', desc: '14 enterprise clients have not logged in for 30 days. Recommend triggering re-engagement workflow.', severity: 'high', icon: <Lightbulb className="w-5 h-5 text-brand-orange"/> },
    { id: 3, type: 'summary', title: 'Weekly Executive Briefing', desc: 'Revenue increased 4.2% WoW. Active workflows executed 14,000 times successfully with 2 dead-letters.', severity: 'low', icon: <Zap className="w-5 h-5 text-blue-500"/> }
  ];

  if (!isAdmin) return <Navigate to="/admin-login" />;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 font-outfit">
      <Helmet><title>AI Insights Engine | BM-OS</title></Helmet>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
           <Link to="/admin/analytics" className="p-2 hover:bg-gray-200 rounded-full"><ArrowLeft className="w-5 h-5"/></Link>
           <div>
             <h1 className="text-2xl font-bold text-brand-navy flex items-center gap-2">
               <BrainCircuit className="text-brand-orange w-6 h-6"/> AI Insights Engine
             </h1>
             <p className="text-gray-500 text-sm mt-1">Automated anomaly detection, risk profiling, and business summaries.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
           {mockInsights.map(insight => (
              <div key={insight.id} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-xl ${
                         insight.type === 'anomaly' ? 'bg-yellow-50' : 
                         insight.type === 'opportunity' ? 'bg-orange-50' : 'bg-blue-50'
                       }`}>
                          {insight.icon}
                       </div>
                       <h3 className="font-bold text-lg text-brand-navy">{insight.title}</h3>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${
                      insight.severity === 'high' ? 'bg-red-50 text-red-600' :
                      insight.severity === 'medium' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {insight.severity} Priority
                    </span>
                 </div>
                 <p className="text-gray-600 ml-12 mb-4 leading-relaxed">{insight.desc}</p>
                 <div className="ml-12 flex gap-3">
                    <button className="bg-brand-navy text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
                      Review Insight
                    </button>
                    {insight.type === 'opportunity' && (
                      <button className="bg-gray-50 border border-gray-200 text-brand-navy px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors flex items-center gap-2">
                        <CheckCircle className="w-4 h-4"/> Apply Recommendation
                      </button>
                    )}
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
};
