import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { 
  Megaphone, Plus, Calendar as CalendarIcon, 
  CheckCircle, Clock, XCircle, BarChart2, FileText,
  Mail, Briefcase, Users, Camera, MessageCircle, Search, Filter, 
  Play, Pause, RefreshCw, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

export const MarketingAutomation = () => {
  const [isAdmin, setIsAdmin] = useState(true); // Verifies JWT in prod
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    // In production, fetch from Supabase `campaigns` and `campaign_assets`
    if (import.meta.env.DEV) {
      setCampaigns([
        { id: '1', name: 'Q4 B2B Lead Gen', objective: 'Lead Gen', status: 'pending_approval', created_at: '2023-11-01' },
        { id: '2', name: 'Black Friday SaaS Sale', objective: 'Sales', status: 'active', created_at: '2023-10-15' },
        { id: '3', name: 'Brand Awareness - SEO', objective: 'Brand Awareness', status: 'draft', created_at: '2023-11-10' }
      ]);
      setAssets([
        { id: 'a1', campaign_id: '1', type: 'linkedin', content: 'Struggling to scale your B2B leads? Discover how BrandMark uses AI to automate pipeline growth. #B2B #Growth', status: 'draft' },
        { id: 'a2', campaign_id: '1', type: 'email', content: 'Subject: Unlock 3x Pipeline Velocity\\n\\nHi {{First Name}},\\n\\nI noticed your agency is growing...', status: 'draft' }
      ]);
    }
  }, []);

  const handleGenerateCampaign = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const objective = formData.get('objective');
    const audience = formData.get('audience');

    try {
      // In production, this hits the n8n Webhook to trigger GPT-4o asset generation
      const WEBHOOK = import.meta.env.VITE_MARKETING_GENERATOR_WEBHOOK || 'http://localhost:5678/webhook/marketing-generator';
      // await fetch(WEBHOOK, { method: 'POST', body: JSON.stringify({ name, objective, audience }) });
      
      setTimeout(() => {
        toast.success(`Campaign "${name}" queued for AI Generation. You will be notified via Slack when drafts are ready for approval.`);
        setCampaigns([{
          id: Math.random().toString(),
          name,
          objective,
          status: 'generating',
          created_at: new Date().toISOString().split('T')[0]
        }, ...campaigns]);
        setIsGenerating(false);
        setActiveTab('dashboard');
        e.target.reset();
      }, 2000);
    } catch (err) {
      toast.error("Failed to trigger campaign generation.");
      setIsGenerating(false);
    }
  };

  const handleApproveAsset = (id) => {
    // In production, updates Supabase `campaign_assets` to 'approved' and sets a `campaign_schedule` row.
    setAssets(assets.map(a => a.id === id ? { ...a, status: 'approved' } : a));
    toast.success("Asset approved and scheduled for publishing.");
  };

  const handleRejectAsset = (id) => {
    // In production, updates status to 'rejected'
    setAssets(assets.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
    toast.error("Asset rejected.");
  };

  if (!isAdmin) return <Navigate to="/student-login" />;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20 font-outfit">
      <Helmet>
        <title>AI Marketing Automation | BrandMark</title>
      </Helmet>

      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-navy flex items-center gap-3">
              <Megaphone className="w-8 h-8 text-brand-orange" />
              AI Marketing Automation
            </h1>
            <p className="text-gray-500 mt-2">Generate, approve, and auto-publish omnichannel campaigns.</p>
          </div>
          <button onClick={() => setActiveTab('wizard')} className="bg-brand-orange text-white px-5 py-2.5 rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" /> New AI Campaign
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-8 overflow-x-auto pb-2">
           <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<BarChart2 className="w-4 h-4"/>} text="Dashboard" />
           <TabButton active={activeTab === 'approvals'} onClick={() => setActiveTab('approvals')} icon={<CheckCircle className="w-4 h-4"/>} text="Pending Approvals" />
           <TabButton active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} icon={<CalendarIcon className="w-4 h-4"/>} text="Content Calendar" />
        </div>

        {/* Content Area */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <StatCard title="Active Campaigns" value="3" icon={<Play className="text-green-500"/>} />
               <StatCard title="Pending Approvals" value="5" icon={<Clock className="text-orange-500"/>} />
               <StatCard title="Published this Month" value="24" icon={<CheckCircle className="text-blue-500"/>} />
               <StatCard title="Avg. Engagement Rate" value="4.8%" icon={<BarChart2 className="text-purple-500"/>} />
            </div>

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
                      <th className="p-4 font-semibold">Objective</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Created</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {campaigns.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="p-4 font-bold text-brand-navy">{c.name}</td>
                        <td className="p-4 text-gray-600 text-sm">{c.objective}</td>
                        <td className="p-4">
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="p-4 text-gray-500 text-sm">{c.created_at}</td>
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
                  {isGenerating ? <><RefreshCw className="w-5 h-5 animate-spin"/> Generating 20+ Assets via GPT-4o...</> : 'Generate AI Campaign'}
                </button>
             </form>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-xl font-bold text-brand-navy">Pending Manual Approval</h2>
               <p className="text-sm text-gray-500 font-medium">Nothing is published without your explicit consent.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assets.map((asset) => (
                <div key={asset.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                  <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-brand-navy text-sm uppercase tracking-wide">
                      <PlatformIcon type={asset.type} /> {asset.type}
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${asset.status === 'approved' ? 'bg-green-100 text-green-700' : asset.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-brand-orange'}`}>
                      {asset.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="p-6 flex-1">
                     <p className="text-sm text-gray-700 whitespace-pre-wrap">{asset.content}</p>
                  </div>
                  {asset.status === 'draft' && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                      <button onClick={() => handleApproveAsset(asset.id)} className="flex-1 bg-brand-navy text-white py-2 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors">Approve</button>
                      <button onClick={() => handleRejectAsset(asset.id)} className="flex-1 bg-white border border-gray-200 text-gray-700 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center py-20">
             <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
             <h2 className="text-xl font-bold text-brand-navy mb-2">Content Calendar</h2>
             <p className="text-gray-500 mb-6">Visual schedule of all approved and pending campaign assets.</p>
             <button onClick={() => setActiveTab('wizard')} className="bg-brand-orange text-white px-6 py-2 rounded-lg font-bold mx-auto">Create Campaign to Populate Calendar</button>
          </div>
        )}

      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, text }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${
      active ? 'bg-brand-navy text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-brand-navy'
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
