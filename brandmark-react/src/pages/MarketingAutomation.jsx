import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { 
  Megaphone, Plus, Calendar, Zap, Users, FileText, Settings, Play, Pause, Search, 
  BarChart2, Clock, Globe, Bot, AlertCircle, ArrowRight, CheckCircle, Eye, Briefcase, Mail, Camera, MessageCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import * as Sentry from '@sentry/react';
import { useMarketingData } from '../hooks/realtimeHooks';

export const MarketingAutomation = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { campaigns: dbCampaigns, assets: dbAssets, loading } = useMarketingData();

  const campaigns = dbCampaigns?.length > 0 ? dbCampaigns : [
    { id: 1, name: 'Q3 Enterprise SaaS Launch', status: 'active', platform: 'LinkedIn', spend: '₹45,000', roas: '3.2x', conversions: 124 },
    { id: 2, name: 'Local SEO Audit Offer', status: 'paused', platform: 'Google Ads', spend: '₹12,500', roas: '1.8x', conversions: 45 },
    { id: 3, name: 'Brand Identity Webinar', status: 'draft', platform: 'Email', spend: '₹0', roas: '-', conversions: 0 }
  ];

  const assets = dbAssets?.length > 0 ? dbAssets : [
    { id: 1, title: 'How to scale B2B SaaS', type: 'Blog Post', status: 'published', date: '2 days ago', author: 'AI Agent' },
    { id: 2, title: 'SEO Audit Checklist', type: 'Lead Magnet', status: 'review', date: '5 hours ago', author: 'Rahul' },
    { id: 3, title: 'Q3 Promotional Email', type: 'Email Copy', status: 'draft', date: '1 day ago', author: 'AI Agent' }
  ];

  if (!isAdmin) return <Navigate to="/admin-login" />;

  const handleGenerateCampaign = async () => {
    setIsGenerating(true);
    const loadingToast = toast.loading('AI is generating multi-channel campaign...');
    
    try {
      const response = await fetch(import.meta.env.VITE_SUPABASE_URL + '/functions/v1/generate-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ prompt: 'Generate multi-channel campaign' })
      });
      
      if (!response.ok) throw new Error('Backend pending deployment');
      
      const { data, error } = await supabase.from('campaigns').insert([{
        name: 'AI Generated Campaign - ' + new Date().toLocaleTimeString(),
        status: 'draft',
        platform: 'Multi-Channel',
        spend: '₹0',
        roas: '-',
        conversions: 0
      }]);

      if (error) throw error;
      toast.success('Campaign generated successfully', { id: loadingToast });
    } catch (err) {
      Sentry.captureException(err);
      toast.error('Failed to generate campaign. (Backend pending)', { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20 font-outfit">
      <Helmet>
        <title>AI Marketing Automation | BrandMark</title>
      </Helmet>

      <div className="max-w-[1400px] mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-navy flex items-center gap-3">
              <Megaphone className="w-8 h-8 text-brand-orange" />
              AI Marketing Automation
            </h1>
            <p className="text-gray-500 mt-2">Generate, approve, and auto-publish omnichannel campaigns.</p>
          </div>
          <button onClick={handleGenerateCampaign} disabled={isGenerating} className="bg-brand-orange text-white px-5 py-2.5 rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" /> {isGenerating ? 'Generating...' : 'New AI Campaign'}
          </button>
        </div>

        <div className="flex gap-4 border-b border-gray-200 mb-8 overflow-x-auto pb-2">
           <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<BarChart2 className="w-4 h-4"/>} text="Dashboard" />
           <TabButton active={activeTab === 'approvals'} onClick={() => setActiveTab('approvals')} icon={<FileText className="w-4 h-4"/>} text="Content Assets" />
           <TabButton active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} icon={<Calendar className="w-4 h-4"/>} text="Calendar" />
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
        {loading ? (
          <div className="flex justify-center items-center h-full font-bold text-gray-400">Loading Marketing Data...</div>
        ) : activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-brand-navy text-lg">Recent Campaigns</h3>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search campaigns..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange w-64" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase border-b border-gray-100">
                      <th className="p-4 font-semibold">Campaign Name</th>
                      <th className="p-4 font-semibold">Platform</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {campaigns.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="p-4 font-bold text-brand-navy">{c.name}</td>
                        <td className="p-4 text-gray-600 text-sm">{c.platform}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            c.status === 'active' ? 'bg-green-100 text-green-700' :
                            c.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                            c.status === 'generating' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {c.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => setActiveTab('approvals')} className="text-brand-orange hover:text-brand-navy font-semibold text-sm transition-colors">
                            View Assets
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wizard' && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
             <h2 className="text-2xl font-bold text-brand-navy mb-2">Campaign Wizard</h2>
             <p className="text-gray-500 mb-8 text-sm">Provide a high-level objective, and BrandMark GPT will generate a complete omnichannel marketing campaign (Emails, LinkedIn, Blogs, Ads) for your approval.</p>
             
             <form onSubmit={handleGenerateCampaign} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Name</label>
                  <input required name="name" type="text" placeholder="e.g., Winter SEO Push" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Primary Objective</label>
                  <select required name="objective" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange">
                    <option value="Lead Generation">Lead Generation</option>
                    <option value="Brand Awareness">Brand Awareness</option>
                    <option value="Event Promotion">Event Promotion</option>
                    <option value="Product Launch">Product Launch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Target Audience / Details</label>
                  <textarea required name="audience" rows="4" placeholder="Describe the target audience, tone, and any specific offers..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange"></textarea>
                </div>
                <button 
                  disabled={isGenerating}
                  type="submit" 
                  className="w-full bg-brand-navy text-white font-bold py-3.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  {isGenerating ? <><RefreshCw className="w-5 h-5 animate-spin" /> Generating Campaign...</> : <><Bot className="w-5 h-5" /> Generate Campaign</>}
                </button>
             </form>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-brand-navy mb-6 flex items-center gap-2"><CheckCircle className="w-6 h-6 text-brand-orange" /> Content Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assets.map((asset) => (
                <div key={asset.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group hover:border-brand-orange transition-colors">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                        {asset.type}
                      </span>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        asset.status === 'published' ? 'bg-green-100 text-green-700' :
                        asset.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {asset.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-brand-navy text-lg mb-2">{asset.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{asset.date} • {asset.author}</p>
                    <button className="text-brand-orange hover:text-orange-700 font-bold text-sm flex items-center gap-1 transition-colors">
                      <Eye className="w-4 h-4" /> Preview Asset
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center py-20">
             <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
             <h2 className="text-xl font-bold text-brand-navy mb-2">Content Calendar</h2>
             <p className="text-gray-500 mb-6">Visual schedule of all approved and pending campaign assets.</p>
             <button onClick={handleGenerateCampaign} className="bg-brand-orange text-white px-6 py-2 rounded-lg font-bold mx-auto">Create Campaign to Populate Calendar</button>
          </div>
        )}

      </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, text }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-2 px-1 py-3 font-bold text-sm whitespace-nowrap transition-colors border-b-2 ${
      active ? 'border-brand-orange text-brand-navy' : 'border-transparent text-gray-500 hover:text-brand-navy'
    }`}
  >
    {icon} {text}
  </button>
);

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
    <div className="p-4 bg-gray-50 rounded-xl">
      {icon}
    </div>
    <div>
      <p className="text-gray-500 font-semibold text-sm">{title}</p>
      <p className="text-2xl font-extrabold text-brand-navy">{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    draft: 'bg-gray-100 text-gray-600',
    generating: 'bg-blue-100 text-blue-700',
    pending_approval: 'bg-orange-100 text-brand-orange',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-purple-100 text-purple-700'
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${styles[status] || 'bg-gray-100'}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const PlatformIcon = ({ type }) => {
  switch (type) {
    case 'linkedin': return <Briefcase className="w-4 h-4 text-blue-600"/>;
    case 'email': return <Mail className="w-4 h-4 text-orange-500"/>;
    case 'facebook': return <Users className="w-4 h-4 text-blue-800"/>;
    case 'instagram': return <Camera className="w-4 h-4 text-pink-600"/>;
    case 'twitter': return <MessageCircle className="w-4 h-4 text-sky-500"/>;
    default: return <FileText className="w-4 h-4 text-gray-500"/>;
  }
};
