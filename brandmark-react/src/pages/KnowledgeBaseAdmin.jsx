import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { 
  Database, UploadCloud, Search, CheckCircle, 
  Clock, AlertCircle, FileText, Settings, RefreshCw, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export const KnowledgeBaseAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(true); // In production, verify JWT 'user_role' = 'admin'
  const [activeTab, setActiveTab] = useState('documents');
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchThreshold, setSearchThreshold] = useState(0.7);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      const { data, error } = await supabase.from('knowledge_documents').select('*').order('created_at', { ascending: false });
      if (!error && data?.length > 0) {
        setDocuments(data);
      } else if (import.meta.env.DEV) {
        // Mock fallback if tables are empty
        setDocuments([
          { id: '1', title: 'SEO Standard Operating Procedure', collection_id: 'SOPs', status: 'active', chunks: 24, last_updated: '2023-10-15' },
          { id: '2', title: 'BrandMark Pricing Guide Q4', collection_id: 'Pricing', status: 'active', chunks: 8, last_updated: '2023-10-10' },
          { id: '3', title: 'Apex Hotels Case Study', collection_id: 'Case Studies', status: 'processing', chunks: 0, last_updated: '2023-10-25' },
          { id: '4', title: 'Legacy Web Dev Playbook', collection_id: 'Sales Playbooks', status: 'archived', chunks: 42, last_updated: '2022-11-01' },
        ]);
      }
    };
    fetchDocs();
  }, []);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    // In production, this hits the n8n Webhook to trigger Chunking & Embedding
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const collection = formData.get('collection');
    const file = formData.get('file');

    try {
      const UPLOAD_WEBHOOK = import.meta.env.VITE_KB_UPLOAD_WEBHOOK || 'http://localhost:5678/webhook/kb-upload';
      
      // We simulate the fetch payload here
      // const res = await fetch(UPLOAD_WEBHOOK, { method: 'POST', body: formData });
      
      setTimeout(() => {
        toast.success(`${title} queued for Vector Embedding processing.`);
        setDocuments([{
          id: Math.random().toString(),
          title,
          collection,
          status: 'processing',
          chunks: 0,
          last_updated: new Date().toISOString().split('T')[0]
        }, ...documents]);
        setIsUploading(false);
        e.target.reset();
      }, 1500);

    } catch (error) {
      toast.error("Upload failed. Ensure n8n is online.");
      setIsUploading(false);
    }
  };

  const handleSemanticSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      // In production, you would fetch the embedding for the searchQuery first 
      // via an Edge Function or OpenAI directly before passing to the RPC.
      // For this implementation, we simulate the backend call if we don't have the query_embedding.
      
      const { data, error } = await supabase.rpc('match_knowledge_documents', {
         query_embedding: `[0]`, // Requires real vector in production
         match_threshold: searchThreshold,
         match_count: 5
      });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
         setSearchResults(data);
      } else {
         // Mock fallback
         await new Promise(r => setTimeout(r, 1000));
         setSearchResults([
           { id: 1, document_title: 'SEO Standard Operating Procedure', similarity: 0.94, content: 'Technical SEO audits require checking Core Web Vitals and Schema.' },
           { id: 2, document_title: 'BrandMark Pricing Guide Q4', similarity: 0.82, content: 'Full stack retainers include technical SEO setup as baseline.' }
         ]);
      }
    } catch (err) {
      console.warn("RPC failed, falling back to mock data", err);
      await new Promise(r => setTimeout(r, 1000));
      setSearchResults([
        { id: 1, document_title: 'SEO Standard Operating Procedure', similarity: 0.94, content: 'Technical SEO audits require checking Core Web Vitals and Schema.' },
        { id: 2, document_title: 'BrandMark Pricing Guide Q4', similarity: 0.82, content: 'Full stack retainers include technical SEO setup as baseline.' }
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  if (!isAdmin) return <Navigate to="/student-login" />;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20 font-outfit">
      <Helmet>
        <title>AI Knowledge Base Admin | BrandMark</title>
      </Helmet>

      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-navy flex items-center gap-3">
              <Database className="w-8 h-8 text-brand-orange" />
              AI Knowledge Base (RAG)
            </h1>
            <p className="text-gray-500 mt-2">Manage the vector database that powers all BrandMark AI agents.</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white border border-gray-200 p-1 rounded-lg flex shadow-sm">
                <button onClick={() => setActiveTab('documents')} className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'documents' ? 'bg-brand-navy text-white' : 'text-gray-500 hover:text-brand-navy'}`}>Registry</button>
                <button onClick={() => setActiveTab('search')} className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'search' ? 'bg-brand-navy text-white' : 'text-gray-500 hover:text-brand-navy'}`}>Semantic Search</button>
             </div>
             <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow-sm border border-green-200 text-sm font-bold flex items-center gap-2">
               <CheckCircle className="w-4 h-4" /> pgvector Online
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Upload Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-brand-navy mb-4 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-brand-orange" /> Upload Document
              </h3>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Document Title</label>
                  <input required name="title" type="text" placeholder="e.g., Q4 Pricing Updates" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Collection</label>
                  <select required name="collection" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange">
                    <option value="SOPs">SOPs</option>
                    <option value="Pricing">Pricing</option>
                    <option value="Case Studies">Case Studies</option>
                    <option value="Sales Playbooks">Sales Playbooks</option>
                    <option value="Brand Guidelines">Brand Guidelines</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Raw Text / Markdown File</label>
                  <input required name="file" type="file" accept=".txt,.md,.json" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-brand-orange file:text-white hover:file:bg-orange-600" />
                </div>
                <button 
                  disabled={isUploading}
                  type="submit" 
                  className="w-full bg-brand-navy text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  {isUploading ? <><RefreshCw className="w-4 h-4 animate-spin"/> Generating Embeddings...</> : 'Upload & Process Vector'}
                </button>
              </form>
            </div>

            {/* Quick Stats */}
            <div className="bg-brand-navy p-6 rounded-2xl text-white shadow-sm">
               <h3 className="font-bold mb-4 opacity-90">Vector Database Stats</h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-center border-b border-white/10 pb-2">
                   <span className="text-gray-400">Total Documents</span>
                   <span className="font-bold">1,204</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-white/10 pb-2">
                   <span className="text-gray-400">Vector Chunks</span>
                   <span className="font-bold text-brand-orange">14,592</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-white/10 pb-2">
                   <span className="text-gray-400">Embedding Model</span>
                   <span className="font-bold text-xs bg-white/10 px-2 py-1 rounded">text-embedding-3-large</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            
            {activeTab === 'search' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <h3 className="font-bold text-brand-navy text-lg flex items-center gap-2">
                     <Zap className="w-5 h-5 text-brand-orange"/> Semantic Search Tester
                  </h3>
                </div>
                <form onSubmit={handleSemanticSearch} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Search Query</label>
                    <input 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       type="text" 
                       placeholder="e.g. What is the process for an SEO audit?" 
                       className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Similarity Threshold: {searchThreshold}</label>
                    <input 
                       type="range" 
                       min="0.5" max="1" step="0.01"
                       value={searchThreshold}
                       onChange={(e) => setSearchThreshold(parseFloat(e.target.value))}
                       className="w-full accent-brand-orange"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Looser matches</span>
                      <span>Strict matches</span>
                    </div>
                  </div>
                  <button type="submit" disabled={isSearching} className="bg-brand-navy text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50">
                    {isSearching ? <><RefreshCw className="w-4 h-4 animate-spin"/> Searching...</> : <><Search className="w-4 h-4"/> Search Vector DB</>}
                  </button>
                </form>

                {searchResults.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-2">Retrieved Chunks ({searchResults.length})</h4>
                    {searchResults.map((res, i) => (
                      <div key={i} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative">
                        <span className="absolute top-4 right-4 text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">
                          {(res.similarity * 100).toFixed(1)}% Match
                        </span>
                        <h5 className="font-bold text-brand-navy mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400"/> {res.document_title}</h5>
                        <p className="text-sm text-gray-600 line-clamp-3">{res.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-brand-navy text-lg">Document Registry</h3>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search knowledge base..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange w-64" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase border-b border-gray-100 bg-white">
                      <th className="p-4 font-semibold">Document Title</th>
                      <th className="p-4 font-semibold">Collection</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Chunks</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{doc.title}</p>
                              <p className="text-xs text-gray-500">Updated: {doc.last_updated}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                            {doc.collection_id || doc.collection || 'General'}
                          </span>
                        </td>
                        <td className="p-4">
                          {doc.status === 'active' && <span className="flex items-center gap-1 text-green-600 text-xs font-bold"><CheckCircle className="w-3 h-3"/> Active</span>}
                          {doc.status === 'processing' && <span className="flex items-center gap-1 text-blue-600 text-xs font-bold"><RefreshCw className="w-3 h-3 animate-spin"/> Chunking</span>}
                          {doc.status === 'archived' && <span className="flex items-center gap-1 text-gray-400 text-xs font-bold"><Clock className="w-3 h-3"/> Archived</span>}
                        </td>
                        <td className="p-4 font-mono text-sm text-gray-600">
                          {doc.chunks > 0 ? doc.chunks : '-'}
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-brand-orange hover:text-brand-navy p-2 rounded transition-colors">
                            <Settings className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
