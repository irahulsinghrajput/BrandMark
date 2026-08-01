import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { 
  Briefcase, CheckCircle, Clock, AlertTriangle, Play, CheckSquare, 
  Search, Filter, Plus, FileText, MessageSquare, List, Calendar, LayoutGrid
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProjectOperations = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState('kanban');
  const [activeProject, setActiveProject] = useState('1');
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    // In production, fetch from Supabase `project_tasks` where project_id = activeProject
    if (import.meta.env.DEV) {
      setTasks([
        { id: 't1', title: 'Technical SEO Audit', status: 'done', priority: 'high', due_date: '2026-05-10', assignee: 'Rahul' },
        { id: 't2', title: 'Configure GA4 / GTM', status: 'in_progress', priority: 'medium', due_date: '2026-05-15', assignee: 'Rahul' },
        { id: 't3', title: 'Content Gap Analysis', status: 'todo', priority: 'medium', due_date: '2026-05-20', assignee: 'AI System' },
        { id: 't4', title: 'Backlink Outreach Strategy', status: 'backlog', priority: 'low', due_date: '2026-06-01', assignee: 'Unassigned' },
        { id: 't5', title: 'Client Approval on Keywords', status: 'review', priority: 'high', due_date: '2026-05-14', assignee: 'Client' },
      ]);
    }
  }, [activeProject]);

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    toast.success(`Task moved to ${newStatus.replace('_', ' ')}`);
    // In production, this fires a Supabase update and triggers `task_activity` log.
  };

  const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

  const KanbanColumn = ({ title, status, icon }) => (
    <div className="bg-gray-50/50 rounded-xl border border-gray-200 p-4 min-w-[300px] flex-1 flex flex-col h-[70vh]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-brand-navy flex items-center gap-2 text-sm uppercase tracking-wide">
          {icon} {title} <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">{getTasksByStatus(status).length}</span>
        </h3>
        <button className="text-gray-400 hover:text-brand-orange"><Plus className="w-4 h-4" /></button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
        {getTasksByStatus(status).map(task => (
          <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 group hover:border-brand-orange transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                task.priority === 'high' ? 'bg-red-100 text-red-700' : 
                task.priority === 'medium' ? 'bg-orange-100 text-brand-orange' : 'bg-gray-100 text-gray-600'
              }`}>
                {task.priority}
              </span>
              {/* Dropdown simulator for status change */}
              <select 
                className="text-xs bg-transparent text-gray-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer outline-none"
                value={status}
                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            <h4 className="font-bold text-gray-900 text-sm leading-tight mb-3">{task.title}</h4>
            <div className="flex justify-between items-center text-xs text-gray-500 font-medium border-t border-gray-100 pt-3 mt-1">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {task.due_date}</span>
              <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">{task.assignee}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (!isAdmin) return <Navigate to="/student-login" />;

  return (
    <div className="bg-white min-h-screen pt-24 pb-0 flex flex-col font-outfit h-screen overflow-hidden">
      <Helmet>
        <title>Project Delivery | BrandMark OS</title>
      </Helmet>

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center shrink-0 bg-white z-10">
        <div>
          <div className="flex items-center gap-3">
             <div className="bg-brand-navy p-2 rounded-lg">
                <Briefcase className="w-5 h-5 text-brand-orange" />
             </div>
             <h1 className="text-xl font-bold text-brand-navy">Acme Corp - Q2 SEO Expansion</h1>
             <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold border border-green-200">ON TRACK</span>
          </div>
          <p className="text-gray-500 text-sm font-medium mt-1">Budget: ₹50,000 / ₹1,20,000 (41% used) • 12 Tasks Remaining</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search tasks..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange w-64 bg-gray-50" />
          </div>
          <button className="bg-brand-navy text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 flex gap-6 border-b border-gray-200 shrink-0 bg-white z-10 pt-2">
         <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<List className="w-4 h-4"/>} text="Overview" />
         <TabButton active={activeTab === 'kanban'} onClick={() => setActiveTab('kanban')} icon={<LayoutGrid className="w-4 h-4"/>} text="Kanban Board" />
         <TabButton active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} icon={<Calendar className="w-4 h-4"/>} text="Timeline" />
         <TabButton active={activeTab === 'files'} onClick={() => setActiveTab('files')} icon={<FileText className="w-4 h-4"/>} text="Files & Docs" />
      </div>

      {/* Workspace Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden bg-white p-6">
        {activeTab === 'kanban' && (
          <div className="flex gap-4 h-full">
            <KanbanColumn title="Backlog" status="backlog" icon={<List className="w-4 h-4 text-gray-500" />} />
            <KanbanColumn title="To Do" status="todo" icon={<CheckSquare className="w-4 h-4 text-brand-orange" />} />
            <KanbanColumn title="In Progress" status="in_progress" icon={<Play className="w-4 h-4 text-blue-500" />} />
            <KanbanColumn title="Client Review" status="review" icon={<MessageSquare className="w-4 h-4 text-purple-500" />} />
            <KanbanColumn title="Done" status="done" icon={<CheckCircle className="w-4 h-4 text-green-500" />} />
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="max-w-4xl mx-auto space-y-6 overflow-y-auto h-full pr-4 pb-20">
             <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                   <p className="text-gray-500 text-sm font-semibold mb-1">Project Progress</p>
                   <p className="text-3xl font-extrabold text-brand-navy">65%</p>
                   <div className="w-full bg-gray-200 h-2 rounded-full mt-3 overflow-hidden">
                     <div className="bg-green-500 h-full w-[65%]"></div>
                   </div>
                </div>
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                   <p className="text-gray-500 text-sm font-semibold mb-1">Hours Logged</p>
                   <p className="text-3xl font-extrabold text-brand-navy">42.5<span className="text-lg text-gray-400 font-medium"> hrs</span></p>
                   <p className="text-xs text-brand-orange font-bold mt-2">Within budget allocation</p>
                </div>
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                   <p className="text-gray-500 text-sm font-semibold mb-1">Next Milestone</p>
                   <p className="text-lg font-bold text-brand-navy leading-tight">Phase 1 Delivery</p>
                   <p className="text-xs text-red-500 font-bold mt-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Due in 3 days</p>
                </div>
             </div>

             <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-brand-navy text-white px-3 py-1 text-xs font-bold rounded-bl-lg">AI SUMMARY</div>
                <h3 className="font-bold text-blue-900 mb-2">Weekly GPT-4o Project Brief</h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  The Q2 SEO Expansion project is tracking well against budget constraints. The Technical Audit was completed ahead of schedule. However, 'Content Gap Analysis' is at risk of missing the May 20th deadline due to delayed client keyword approvals. 
                  <br/><br/><strong>Recommendation:</strong> Escalate keyword approval to the client sponsor via automated reminder.
                </p>
             </div>
          </div>
        )}
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
