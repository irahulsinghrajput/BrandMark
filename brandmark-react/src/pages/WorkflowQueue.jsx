import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Trash2, ArrowLeft, Database, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export const WorkflowQueue = () => {
  const [isAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState('dead'); // 'dead' or 'queue'
  
  const [deadLetters, setDeadLetters] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueues();

    // Set up Realtime subscriptions for the queues
    const queueSub = supabase.channel('workflow_queue_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workflow_queue' }, fetchQueues)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workflow_dead_letters' }, fetchQueues)
      .subscribe();

    return () => supabase.removeChannel(queueSub);
  }, []);

  const fetchQueues = async () => {
    setLoading(true);
    try {
      const [dlRes, qRes] = await Promise.all([
        supabase.from('workflow_dead_letters').select('*, workflows(name)').order('created_at', { ascending: false }),
        supabase.from('vw_workflow_queue').select('*').order('created_at', { ascending: false })
      ]);
      if (dlRes.data) setDeadLetters(dlRes.data);
      if (qRes.data) setQueue(qRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (id) => {
    toast.loading('Triggering backend worker...', { id: 'retry' });
    try {
      // Simulate backend ping for retry since we don't have n8n running in UI
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/workflow-retry`, {
         method: 'POST',
         body: JSON.stringify({ dead_letter_id: id }),
         headers: { 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` }
      });
      if(!res.ok) throw new Error("Worker unavailable.");
      toast.success(`Job ${id} moved back to active queue.`, { id: 'retry' });
      fetchQueues();
    } catch(err) {
      toast.error('Worker polling failed: Make sure Edge Functions are deployed.', { id: 'retry' });
    }
  };

  const handleDiscard = async (id) => {
    await supabase.from('workflow_dead_letters').delete().eq('id', id);
    fetchQueues();
    toast.success('Dead letter discarded');
  };

  if (!isAdmin) return <Navigate to="/admin-login" />;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 font-outfit">
      <Helmet><title>Workflow Queues | BM-OS</title></Helmet>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
           <Link to="/admin/workflows" className="p-2 hover:bg-gray-200 rounded-full"><ArrowLeft className="w-5 h-5"/></Link>
           <div>
             <h1 className="text-2xl font-bold text-brand-navy">Message Brokers & Queues</h1>
             <p className="text-gray-500 text-sm mt-1">Manage dead letters, retries, and active job backlogs.</p>
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-100">
             <button onClick={() => setActiveTab('dead')} className={`px-6 py-4 font-bold text-sm flex items-center gap-2 ${activeTab === 'dead' ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-gray-500 hover:text-gray-800'}`}>
                <AlertTriangle className="w-4 h-4"/> Dead-Letter Queue
             </button>
             <button onClick={() => setActiveTab('queue')} className={`px-6 py-4 font-bold text-sm flex items-center gap-2 ${activeTab === 'queue' ? 'text-brand-navy border-b-2 border-brand-navy bg-gray-50' : 'text-gray-500 hover:text-gray-800'}`}>
                <Database className="w-4 h-4"/> Active Queue
             </button>
          </div>

          <div className="p-6">
            {activeTab === 'dead' ? (
              <div>
                <p className="text-sm text-gray-500 mb-4">Jobs that exhausted all retry attempts and failed permanently.</p>
                <div className="space-y-4">
                  {deadLetters.length === 0 && <p className="text-gray-500">No dead letters found.</p>}
                  {deadLetters.map(dl => (
                     <div key={dl.id} className="bg-red-50 border border-red-100 p-4 rounded-xl flex justify-between items-center">
                       <div>
                         <h4 className="font-bold text-red-900">{dl.workflows?.name || 'Unknown Workflow'}</h4>
                         <p className="text-sm text-red-600 font-mono mt-1">{dl.error_message}</p>
                         <p className="text-xs text-red-400 mt-2">{new Date(dl.created_at).toLocaleString()}</p>
                       </div>
                       <div className="flex gap-2">
                         <button onClick={() => handleRetry(dl.id)} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg text-xs hover:bg-gray-50 flex items-center gap-1">
                           <RefreshCw className="w-3 h-3"/> Retry
                         </button>
                         <button onClick={() => handleDiscard(dl.id)} className="px-3 py-1.5 bg-red-600 text-white font-bold rounded-lg text-xs hover:bg-red-700 flex items-center gap-1">
                           <Trash2 className="w-3 h-3"/> Discard
                         </button>
                       </div>
                     </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-4 flex gap-2">
                   <AlertTriangle className="w-5 h-5 shrink-0" />
                   <strong>Backend Dependency:</strong> The UI correctly tracks these queued jobs in the database, but they will remain in "Awaiting Backend Worker" status until the n8n orchestrator or Supabase Edge Functions are actively running to process the polling queue.
                </p>
                <div className="space-y-4">
                  {queue.length === 0 && <p className="text-gray-500">Queue is currently empty.</p>}
                  {queue.map(q => (
                     <div key={q.id} className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex justify-between items-center">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center animate-pulse text-blue-600">
                            <Clock className="w-5 h-5"/>
                          </div>
                         <div>
                           <h4 className="font-bold text-gray-900">{q.workflow_name || 'Workflow'}</h4>
                           <span className="inline-flex mt-1 items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold">
                             {q.status || 'Awaiting Backend Worker'}
                           </span>
                         </div>
                       </div>
                       <span className="text-xs font-bold text-gray-400 border border-gray-200 px-2 py-1 rounded">Priority: {q.priority}</span>
                     </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
