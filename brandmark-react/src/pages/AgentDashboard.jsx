import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Link } from 'react-router-dom';
import { Bot, Activity, CheckCircle, XCircle, Users, LayoutDashboard, BrainCircuit, Target, Briefcase, Phone, MessageSquare, LineChart } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Mock Agent Definitions (Fallback if DB is empty)
const defaultAgents = [
  { id: '1', name: 'Sales Agent', role: 'Sales Development', description: 'Qualifies leads and generates outreach emails.', icon: <Target className="w-5 h-5"/> },
  { id: '2', name: 'Marketing Agent', role: 'Marketing Orchestration', description: 'Generates campaigns, ads, and social media copy.', icon: <LayoutDashboard className="w-5 h-5"/> },
  { id: '3', name: 'Finance Agent', role: 'Financial Operations', description: 'Tracks invoices, calculates ROI, and projects revenue.', icon: <LineChart className="w-5 h-5"/> },
  { id: '4', name: 'Project Manager Agent', role: 'Delivery Orchestration', description: 'Monitors project timelines and delegates tasks.', icon: <Briefcase className="w-5 h-5"/> },
  { id: '5', name: 'Customer Support Agent', role: 'Client Relations', description: 'Drafts responses to client queries and resolves tickets.', icon: <Phone className="w-5 h-5"/> },
  { id: '6', name: 'Knowledge Agent', role: 'Information Retrieval', description: 'Searches internal SOPs and documents using RAG.', icon: <BrainCircuit className="w-5 h-5"/> },
  { id: '7', name: 'Executive Advisor Agent', role: 'Strategic Insights', description: 'Aggregates data to provide executive BI insights.', icon: <Users className="w-5 h-5"/> }
];

export const AgentDashboard = () => {
  const [isAdmin] = useState(true);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('vw_agent_health').select('*');
      if (data && data.length > 0) {
        // Map icons dynamically
        const mappedData = data.map(agent => {
           let icon = <Bot className="w-5 h-5"/>;
           if (agent.name.includes('Sales')) icon = <Target className="w-5 h-5"/>;
           else if (agent.name.includes('Marketing')) icon = <LayoutDashboard className="w-5 h-5"/>;
           else if (agent.name.includes('Finance')) icon = <LineChart className="w-5 h-5"/>;
           else if (agent.name.includes('Project')) icon = <Briefcase className="w-5 h-5"/>;
           else if (agent.name.includes('Support')) icon = <Phone className="w-5 h-5"/>;
           else if (agent.name.includes('Knowledge')) icon = <BrainCircuit className="w-5 h-5"/>;
           else if (agent.name.includes('Executive')) icon = <Users className="w-5 h-5"/>;
           return { ...agent, icon };
        });
        setAgents(mappedData);
      } else {
        setAgents(defaultAgents);
      }
      setLoading(false);
    };
    fetchAgents();
  }, []);

  if (!isAdmin) return <Navigate to="/admin-login" />;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 font-outfit">
      <Helmet>
        <title>AI Agent Framework | BM-OS</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-navy flex items-center gap-3">
              <Bot className="w-8 h-8 text-brand-orange" />
              AI Agent Framework
            </h1>
            <p className="text-gray-500 mt-1">Manage, monitor, and interact with your specialized AI workforce.</p>
          </div>
          <div className="flex gap-2">
             <Link to="/admin/analytics" className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
               <Activity className="w-4 h-4" /> Agent Analytics
             </Link>
          </div>
        </div>

        {loading ? (
           <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {agents.map(agent => (
                <div key={agent.id || agent.name} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-brand-navy rounded-xl text-brand-orange">
                        {agent.icon}
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        (agent.is_active !== false) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {(agent.is_active !== false) ? <CheckCircle className="w-3.5 h-3.5"/> : <XCircle className="w-3.5 h-3.5"/>}
                        {(agent.is_active !== false) ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-brand-navy mb-1">{agent.name}</h2>
                    <p className="text-sm font-medium text-brand-orange mb-3">{agent.role}</p>
                    <p className="text-sm text-gray-500 mb-6">{agent.description || 'Specialized AI Agent deployed in the BM-OS environment.'}</p>
                  </div>
                  
                  <div className="mt-auto">
                    {/* Mock health indicators */}
                    <div className="flex justify-between text-xs text-gray-400 mb-4 pb-4 border-b border-gray-100">
                       <span className="flex items-center gap-1"><Activity className="w-3 h-3"/> {agent.queued_tasks || 0} queued</span>
                       <span className="flex items-center gap-1"><XCircle className="w-3 h-3"/> {agent.recent_failures || 0} faults (24h)</span>
                    </div>
                    
                    <Link 
                      to={`/admin/agents/${encodeURIComponent(agent.name.toLowerCase().replace(/ /g, '-'))}`}
                      className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-brand-navy font-bold py-3 rounded-xl transition-colors border border-gray-200"
                    >
                       <MessageSquare className="w-4 h-4" /> Open Interface
                    </Link>
                  </div>
                </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
};
