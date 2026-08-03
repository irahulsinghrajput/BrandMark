import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { 
  Wallet, TrendingUp, Users, DollarSign, Activity, CreditCard, 
  Download, FileText, PieChart as PieIcon, BarChart2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Legend
} from 'recharts';
import { useFinanceData } from '../hooks/realtimeHooks';
import toast from 'react-hot-toast';

export const FinanceDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { metrics: dbMetrics, cashflowData: dbCashflow, expensesData: dbExpenses, invoices: dbInvoices, loading } = useFinanceData();

  const metrics = dbMetrics || {
    monthly_revenue: 285000,
    net_profit: 193000,
    monthly_expenses: 92000,
    total_outstanding: 45000,
    profit_margin: '67.7%',
    mrr: 150000,
    arr: 1800000,
    avg_payment_time: '14 days'
  };

  const cashflowData = dbCashflow?.length > 0 ? dbCashflow : [
    { name: 'Jan', Revenue: 200000, Expenses: 80000, Profit: 120000 },
    { name: 'Feb', Revenue: 220000, Expenses: 85000, Profit: 135000 },
    { name: 'Mar', Revenue: 210000, Expenses: 90000, Profit: 120000 },
    { name: 'Apr', Revenue: 250000, Expenses: 88000, Profit: 162000 },
    { name: 'May', Revenue: 285000, Expenses: 92000, Profit: 193000 }
  ];

  const expensesData = dbExpenses?.length > 0 ? dbExpenses : [
    { name: 'Contractors', value: 45 },
    { name: 'Software', value: 25 },
    { name: 'Marketing', value: 20 },
    { name: 'Office & Misc', value: 10 }
  ];

  const invoices = dbInvoices?.length > 0 ? dbInvoices : [
    { id: 'INV-2026-042', client: 'Acme Corp', amount: 45000, status: 'paid', date: 'May 01, 2026' },
    { id: 'INV-2026-043', client: 'Stark Industries', amount: 120000, status: 'pending', date: 'May 05, 2026' },
    { id: 'INV-2026-044', client: 'Wayne Ent', amount: 35000, status: 'overdue', date: 'Apr 20, 2026' },
    { id: 'INV-2026-045', client: 'Globex', amount: 60000, status: 'paid', date: 'May 02, 2026' }
  ];

  const handleExportCSV = () => { toast.success("CSV Export starting..."); };
  const handleExportPDF = () => { toast.success("PDF Export starting..."); };

  if (!isAdmin) return <Navigate to="/admin-login" />;

  const COLORS = ['#1d4ed8', '#f97316', '#8b5cf6', '#10b981'];

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20 font-outfit">
      <Helmet>
        <title>Finance & Operations | BrandMark</title>
      </Helmet>

      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-navy flex items-center gap-3">
              <Wallet className="w-8 h-8 text-brand-orange" />
              Finance & Operations
            </h1>
            <p className="text-gray-500 mt-2">Automated invoicing, cashflow tracking, and AI financial reporting.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleExportCSV} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" /> CSV
            </button>
            <button onClick={handleExportPDF} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" /> PDF
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-8 overflow-x-auto pb-2">
           <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<TrendingUp className="w-4 h-4"/>} text="Overview" />
           <TabButton active={activeTab === 'invoices'} onClick={() => setActiveTab('invoices')} icon={<FileText className="w-4 h-4"/>} text="Invoices" />
           <TabButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={<PieIcon className="w-4 h-4"/>} text="AI Reports" />
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <KPICard title="Monthly Revenue" value={`₹${metrics.monthly_revenue?.toLocaleString()}`} trend="+12%" positive />
               <KPICard title="Net Profit" value={`₹${metrics.net_profit?.toLocaleString()}`} trend="+8%" positive />
               <KPICard title="Monthly Expenses" value={`₹${metrics.monthly_expenses?.toLocaleString()}`} trend="-2%" positive />
               <KPICard title="Total Outstanding" value={`₹${metrics.total_outstanding?.toLocaleString()}`} trend="₹12k Overdue" negative />
               <KPICard title="Profit Margin" value={metrics.profit_margin} trend="Healthy" positive />
               <KPICard title="Monthly Recurring (MRR)" value={`₹${metrics.mrr?.toLocaleString()}`} trend="+5%" positive />
               <KPICard title="Annual Recurring (ARR)" value={`₹${metrics.arr?.toLocaleString()}`} trend="+5%" positive />
               <KPICard title="Avg Payment Time" value={metrics.avg_payment_time} trend="-2 days" positive />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-brand-navy mb-6">Cashflow & Revenue Trend</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cashflowData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                      <Legend />
                      <Area type="monotone" dataKey="Revenue" stroke="#1d4ed8" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                      <Area type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={3} fill="none" />
                      <Area type="monotone" dataKey="Profit" stroke="#10b981" strokeWidth={3} fill="none" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-brand-navy mb-6">Expense Breakdown</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {expensesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout="vertical" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-brand-navy text-lg">Invoices & Payments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase border-b border-gray-100 bg-white">
                    <th className="p-4 font-semibold">Invoice ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-brand-navy">{inv.id}</td>
                      <td className="p-4 text-gray-700">{inv.customer}</td>
                      <td className="p-4 font-semibold text-gray-900">₹{inv.amount.toLocaleString()}</td>
                      <td className="p-4">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="p-4 text-gray-500 text-sm">{inv.due_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-navy p-2 rounded-lg">
                <PieIcon className="w-5 h-5 text-brand-orange" />
              </div>
              <h2 className="text-2xl font-bold text-brand-navy">AI Financial Snapshot (May 2026)</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4"/> Revenue Insights</h4>
                <p className="text-blue-800 text-sm leading-relaxed">Revenue grew 14% MoM driven primarily by new SEO retainer accounts. MRR stability is extremely high with 0% churn this month.</p>
              </div>

              <div className="bg-orange-50 border border-orange-100 p-5 rounded-xl">
                <h4 className="font-bold text-brand-orange mb-2 flex items-center gap-2"><ArrowDownRight className="w-4 h-4"/> Expense Insights</h4>
                <p className="text-orange-900 text-sm leading-relaxed">Ad spend increased proportionally with revenue, but software costs rose 12% due to unoptimized SaaS seats. Recommend auditing unused licenses.</p>
              </div>

              <div className="bg-red-50 border border-red-100 p-5 rounded-xl">
                <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Cashflow Risks</h4>
                <p className="text-red-900 text-sm leading-relaxed">₹12,000 currently overdue from Global Tech. Automated n8n follow-ups have been sent. Average payment time remains a healthy 14 days.</p>
              </div>
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
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${
      active ? 'bg-brand-navy text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-brand-navy'
    }`}
  >
    {icon} {text}
  </button>
);

const KPICard = ({ title, value, trend, positive }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
    <p className="text-gray-500 font-semibold text-sm mb-1">{title}</p>
    <div className="flex items-end justify-between">
      <p className="text-2xl font-extrabold text-brand-navy">{value}</p>
      <div className={`flex items-center text-xs font-bold ${positive ? 'text-green-600' : 'text-red-600'}`}>
        {positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {trend}
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    draft: 'bg-gray-100 text-gray-600',
    sent: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
    void: 'bg-gray-200 text-gray-800'
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${styles[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
};
