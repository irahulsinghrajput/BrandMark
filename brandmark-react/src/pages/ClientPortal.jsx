import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FolderOpen, 
  FileText, 
  CheckSquare, 
  CreditCard, 
  Calendar, 
  MessageSquare,
  LogOut,
  ExternalLink,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ClientPortal = () => {
  const { clientId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [clientData, setClientData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // In production, this would use Supabase Auth session
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Simulated fetch of authenticated client data from Supabase/n8n API
    const fetchClientData = async () => {
      try {
        const API_URL = import.meta.env.VITE_CLIENT_PORTAL_API || 'http://localhost:5678/webhook/client-data';
        
        // In real app, headers would include Bearer ${supabase.auth.session().access_token}
        const res = await fetch(`${API_URL}?clientId=${clientId}`);
        
        if (!res.ok) {
          // Fallback for development so the UI renders
          if (import.meta.env.DEV) {
            setClientData({
              company_name: "Acme Corp",
              primary_contact_name: "John Doe",
              status: "onboarding",
              google_drive_url: "https://drive.google.com/drive/folders/mock",
              project: {
                name: "Growth & SEO Campaign",
                status: "kickoff",
                timeline: [
                  { task: "Proposal Signed", completed: true },
                  { task: "Invoice Paid", completed: false },
                  { task: "Kickoff Questionnaire", completed: false },
                  { task: "Strategy Meeting", completed: false }
                ]
              },
              invoices: [
                { id: "INV-1001", amount: "₹59,000", status: "unpaid", due_date: "2023-11-01", pdf_url: "#" }
              ],
              tasks: [
                { id: 1, title: "Fill out Kickoff Questionnaire", status: "todo", priority: "high" },
                { id: 2, title: "Provide Google Analytics Access", status: "todo", priority: "medium" }
              ],
              documents: [
                { id: 1, title: "Signed Proposal", type: "contract", date: "2023-10-25", url: "#" }
              ]
            });
            setIsLoading(false);
            return;
          }
          throw new Error('Unauthorized');
        }
        
        const data = await res.json();
        setClientData(data);
      } catch (err) {
        setIsAuthenticated(false);
        toast.error("Authentication failed or portal not found.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  if (!isAuthenticated) return <Navigate to="/student/login" />; // Redirect to a generic login for now

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-brand-navy font-bold">Loading secure portal...</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-brand-navy mb-4">Project Timeline</h3>
              <div className="space-y-4">
                {clientData.project.timeline.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {step.completed ? '✓' : idx + 1}
                    </div>
                    <span className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>{step.task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'tasks':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-brand-navy">Your Action Items</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {clientData.tasks.map(task => (
                <div key={task.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <input type="checkbox" className="w-5 h-5 text-brand-orange rounded border-gray-300 focus:ring-brand-orange" />
                    <span className="font-semibold text-gray-800">{task.title}</span>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-brand-orange'}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'invoices':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                  <th className="p-4 font-semibold">Invoice</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Due Date</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clientData.invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="p-4 font-semibold text-brand-navy">{inv.id}</td>
                    <td className="p-4 font-bold text-gray-900">{inv.amount}</td>
                    <td className="p-4 text-gray-600">{inv.due_date}</td>
                    <td className="p-4">
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-brand-orange hover:underline font-bold flex items-center justify-end gap-2 w-full">
                        <CreditCard className="w-4 h-4" /> Pay Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'documents':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Supabase Stored Documents */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-brand-navy mb-4">Official Documents</h3>
              <ul className="space-y-4">
                {clientData.documents.map(doc => (
                  <li key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-bold text-sm text-gray-900">{doc.title}</p>
                        <p className="text-xs text-gray-500">{doc.date}</p>
                      </div>
                    </div>
                    <a href={doc.url} className="text-brand-orange hover:text-brand-navy transition-colors">
                      <Download className="w-5 h-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Google Drive Link */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                <FolderOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Shared Workspace</h3>
              <p className="text-gray-500 text-sm mb-6">Access all your project assets, design files, and reports in Google Drive.</p>
              <a 
                href={clientData.google_drive_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Open Google Drive <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-brand-bg-light min-h-screen font-outfit">
      <Helmet>
        <title>{`${clientData.company_name} Client Portal | BrandMark Solutions`}</title>
      </Helmet>

      {/* Top Navbar specifically for Portal */}
      <header className="bg-brand-navy text-white py-4 px-6 sticky top-0 z-50 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-xl">
            {clientData.company_name.charAt(0)}
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">{clientData.company_name}</h1>
            <p className="text-xs text-gray-400">Secure Client Portal</p>
          </div>
        </div>
        <button className="text-gray-300 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <nav className="w-full md:w-64 space-y-2 flex-shrink-0">
          {[
            { id: 'overview', icon: <Calendar className="w-5 h-5" />, label: 'Project Overview' },
            { id: 'tasks', icon: <CheckSquare className="w-5 h-5" />, label: 'Action Items' },
            { id: 'invoices', icon: <CreditCard className="w-5 h-5" />, label: 'Invoices & Billing' },
            { id: 'documents', icon: <FolderOpen className="w-5 h-5" />, label: 'Files & Documents' },
            { id: 'messages', icon: <MessageSquare className="w-5 h-5" />, label: 'Messages' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                  ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20' 
                  : 'text-gray-600 hover:bg-gray-200/50 hover:text-brand-navy'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        {/* Main Content Area */}
        <main className="flex-1">
          {renderTabContent()}
        </main>
        
      </div>
    </div>
  );
};
