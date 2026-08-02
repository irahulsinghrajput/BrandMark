import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { useRealtimeDashboard } from '../hooks/realtimeHooks';
import * as Sentry from '@sentry/react';
import toast from 'react-hot-toast';
import { Users, Filter, Plus, Phone, Mail, MoreVertical, TrendingUp, DollarSign } from 'lucide-react';

export const SalesCRM = () => {
  const [leads, setLeads] = useState({
    new: [],
    contacted: [],
    qualified: [],
    proposal: [],
    won: []
  });
  const [loading, setLoading] = useState(true);
  
  // Connect to realtime dashboard hook for live aggregates
  const { kpis } = useRealtimeDashboard('vw_sales_kpis');

  useEffect(() => {
    fetchLeads();

    const subscription = supabase
      .channel('leads_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        fetchLeads();
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group leads by status
      const grouped = {
        new: [],
        contacted: [],
        qualified: [],
        proposal: [],
        won: []
      };

      data?.forEach(lead => {
        if (grouped[lead.status]) {
          grouped[lead.status].push(lead);
        } else {
          grouped['new'].push(lead); // fallback
        }
      });

      setLeads(grouped);
    } catch (err) {
      Sentry.captureException(err);
      toast.error('Failed to load CRM data');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id, newStatus) => {
    try {
      // Optimistic update
      const targetLead = Object.values(leads).flat().find(l => l.id === id);
      if (!targetLead) return;

      const updatedGroups = { ...leads };
      updatedGroups[targetLead.status] = updatedGroups[targetLead.status].filter(l => l.id !== id);
      targetLead.status = newStatus;
      updatedGroups[newStatus].push(targetLead);
      setLeads(updatedGroups);

      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success('Pipeline updated');
    } catch (err) {
      Sentry.captureException(err);
      toast.error('Failed to update lead');
      fetchLeads(); // Revert on failure
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 font-outfit">
      <Helmet>
        <title>Sales CRM | BrandMark OS</title>
      </Helmet>

      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-brand-orange" />
              Sales CRM
            </h1>
            <p className="text-gray-500 mt-1">Live Lead Intelligence & Pipeline Management</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-gray-600 hover:bg-gray-50">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="bg-brand-orange text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-orange-600">
              <Plus className="w-4 h-4" /> New Lead
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <KpiCard title="Total Leads" value={kpis?.total_leads || 0} icon={<Users />} />
          <KpiCard title="Pipeline Value" value={`₹${kpis?.pipeline_value || 0}`} icon={<DollarSign />} />
          <KpiCard title="Win Rate" value={`${kpis?.win_rate || 0}%`} icon={<TrendingUp />} />
          <KpiCard title="AI Engaged" value={kpis?.ai_engaged || 0} icon={<Phone />} />
        </div>

        {/* Kanban Board */}
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
          {Object.entries(leads).map(([status, items]) => (
            <div key={status} className="min-w-[320px] bg-gray-100/50 rounded-2xl p-4 snap-center border border-gray-200/50 flex flex-col h-[calc(100vh-300px)]">
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="font-bold text-gray-700 capitalize tracking-wide text-sm">{status}</h3>
                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">{items.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {loading ? (
                  <div className="text-center p-4 text-gray-400 font-bold text-sm">Loading...</div>
                ) : items.length === 0 ? (
                  <div className="text-center p-4 text-gray-400 font-bold text-sm border-2 border-dashed border-gray-200 rounded-xl">Empty</div>
                ) : items.map(lead => (
                  <LeadCard key={lead.id} lead={lead} updateLeadStatus={updateLeadStatus} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-brand-orange transition-colors">
    <div>
      <p className="text-gray-500 font-bold text-sm mb-1">{title}</p>
      <h3 className="text-2xl font-extrabold text-brand-navy">{value}</h3>
    </div>
    <div className="w-12 h-12 bg-orange-50 text-brand-orange rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
  </div>
);

const LeadCard = ({ lead, updateLeadStatus }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-brand-orange transition-colors group">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-bold text-brand-navy leading-tight">{lead.company || lead.name}</h4>
      <MoreVertical className="w-4 h-4 text-gray-300 hover:text-gray-600" />
    </div>
    <p className="text-xs font-bold text-brand-orange mb-3">₹{lead.value?.toLocaleString() || 0}</p>
    
    <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
      <div className="flex gap-2">
        <button className="hover:text-brand-navy transition-colors"><Mail className="w-3.5 h-3.5" /></button>
        <button className="hover:text-brand-navy transition-colors"><Phone className="w-3.5 h-3.5" /></button>
      </div>
      <select 
        value={lead.status}
        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
        className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs font-bold cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-brand-orange"
        onClick={(e) => e.stopPropagation()}
      >
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="qualified">Qualified</option>
        <option value="proposal">Proposal</option>
        <option value="won">Won</option>
      </select>
    </div>
  </div>
);
