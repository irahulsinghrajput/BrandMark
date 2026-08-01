import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Download, CheckCircle2, MessageSquare, Clock, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

export const ClientProposalPortal = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [proposal, setProposal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        // In production, this hits an n8n webhook or Supabase Edge Function
        // which verifies the token and returns the proposal HTML & metadata
        const API_URL = import.meta.env.VITE_PROPOSAL_API_URL || 'http://localhost:5678/webhook/get-proposal';
        
        const res = await fetch(`${API_URL}?id=${id}&token=${token}`);
        if (!res.ok) throw new Error('Invalid or expired proposal link.');
        
        const data = await res.json();
        setProposal(data);
      } catch (err) {
        // For development/demonstration purposes if webhook is down:
        if (import.meta.env.DEV) {
          setProposal({
            client_name: 'Acme Corp',
            title: 'Digital Growth Strategy',
            html_content: '<h1>Acme Corp Proposal</h1><p>Strategic growth plan tailored for your industry...</p>',
            proposal_value: '₹1,50,000',
            status: 'draft',
            pdf_url: '#'
          });
        } else {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id && token) {
      fetchProposal();
    } else {
      setError('Missing proposal credentials.');
      setIsLoading(false);
    }
  }, [id, token]);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      const ACTION_URL = import.meta.env.VITE_PROPOSAL_ACTION_URL || 'http://localhost:5678/webhook/action-proposal';
      
      await fetch(ACTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, token, action: 'accept' })
      });
      
      setProposal({ ...proposal, status: 'accepted' });
      toast.success('Proposal Accepted! We will be in touch shortly to kick off the project.');
    } catch (err) {
      toast.error('Failed to accept proposal. Please contact us directly.');
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-brand-navy font-bold">Loading Proposal...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      <Helmet>
        <title>{`Proposal for ${proposal.client_name} | BrandMark Solutions`}</title>
      </Helmet>

      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-8">
        
        {/* Proposal Document Viewer */}
        <div className="flex-1 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          {/* Action Bar */}
          <div className="bg-brand-navy p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-brand-orange" />
              <span className="font-bold">{proposal.title}</span>
            </div>
            {proposal.pdf_url && (
              <a 
                href={proposal.pdf_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <Download className="w-4 h-4" /> Download PDF
              </a>
            )}
          </div>

          {/* HTML Content Render */}
          <div 
            className="p-8 md:p-12 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: proposal.html_content }}
          />
        </div>

        {/* Sidebar Actions */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="font-bold text-xl text-brand-navy mb-4">Investment Summary</h3>
            <p className="text-3xl font-extrabold text-brand-orange mb-6">{proposal.proposal_value}</p>
            
            {proposal.status === 'accepted' ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 font-bold border border-green-200">
                <CheckCircle2 className="w-6 h-6" />
                Proposal Accepted
              </div>
            ) : (
              <div className="space-y-4">
                <button 
                  onClick={handleAccept}
                  disabled={isAccepting}
                  className="w-full bg-brand-navy text-white font-bold py-4 rounded-xl hover:bg-brand-orange transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-navy/20"
                >
                  {isAccepting ? 'Processing...' : 'Accept Proposal & Quote'}
                </button>
                <button className="w-full bg-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Request Changes
                </button>
              </div>
            )}
          </div>

          <div className="bg-brand-orange/5 p-6 rounded-2xl border border-brand-orange/20">
            <div className="flex items-center gap-3 mb-4 text-brand-navy font-bold">
              <Clock className="w-5 h-5 text-brand-orange" />
              Next Steps
            </div>
            <ol className="text-sm space-y-4 text-gray-700 list-decimal list-inside">
              <li>Review the scope of work and pricing.</li>
              <li>Click "Accept Proposal" to electronically sign.</li>
              <li>You will receive an automated invoice for the advance payment.</li>
              <li>Your dedicated client portal and Slack channel will be created automatically.</li>
            </ol>
          </div>
        </div>

      </div>
    </div>
  );
};
