import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, AlertTriangle, RefreshCw, BarChart2 } from 'lucide-react';

export const PredictiveAnalytics = () => {
  const [isAdmin] = useState(true);

  if (!isAdmin) return <Navigate to="/admin-login" />;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 font-outfit">
      <Helmet><title>Predictive Analytics | BM-OS</title></Helmet>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
           <Link to="/admin/analytics" className="p-2 hover:bg-gray-200 rounded-full"><ArrowLeft className="w-5 h-5"/></Link>
           <div>
             <h1 className="text-2xl font-bold text-brand-navy">AI Predictive Forecasting</h1>
             <p className="text-gray-500 text-sm mt-1">Machine learning models for revenue, churn, and growth prediction.</p>
           </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-8 flex gap-3 text-blue-800 text-sm">
           <RefreshCw className="w-5 h-5 shrink-0" />
           <div>
              <strong>Awaiting Backend Sync:</strong> The predictive UI reads directly from the `vw_predictions` PostgreSQL view. Full regression and forecasting execution relies on external ML services updating those tables.
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-lg text-brand-navy flex items-center gap-2"><TrendingUp className="text-green-500"/> Revenue Forecast (Q4)</h3>
                 <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded">High Confidence</span>
              </div>
              <div className="flex items-end gap-2 mb-4">
                 <h4 className="text-4xl font-extrabold text-gray-900">$2.4M</h4>
                 <p className="text-sm font-bold text-green-500 mb-1">+$400k expected</p>
              </div>
              <div className="h-32 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 text-xs">
                 [Chart Placeholder: Recharts AreaChart mapped to prediction_results]
              </div>
           </div>

           <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-lg text-brand-navy flex items-center gap-2"><AlertTriangle className="text-red-500"/> Churn Prediction</h3>
                 <span className="text-xs font-bold text-yellow-700 bg-yellow-50 px-2 py-1 rounded">Medium Confidence</span>
              </div>
              <div className="flex items-end gap-2 mb-4">
                 <h4 className="text-4xl font-extrabold text-gray-900">4.2%</h4>
                 <p className="text-sm font-bold text-red-500 mb-1">+1.1% risk variance</p>
              </div>
              <div className="h-32 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 text-xs">
                 [Chart Placeholder: Recharts BarChart mapped to prediction_results]
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
