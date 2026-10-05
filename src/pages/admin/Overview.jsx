import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Building2, Users, Receipt, Heart, TrendingUp, TrendingDown, Star, Video, CreditCard, RefreshCcw } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setIsRefreshing(true);
      const res = await axios.get(`${API}/admin/analytics/overview`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.data.success) {
        setStats(res.data.analytics);
        setError(null);
      } else {
        setError("Failed to load analytics");
      }
    } catch (err) {
      console.error("Failed to load stats", err);
      setError(err.response?.data?.message || "Failed to load stats");
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 text-rose-600 p-6 rounded-2xl border border-rose-200 text-center shadow-sm max-w-lg mx-auto mt-20">
        <h3 className="text-lg font-bold mb-2">Oops! Something went wrong.</h3>
        <p className="text-sm">{error}</p>
        <button onClick={fetchStats} className="mt-4 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  // Transform data for recharts
  const chartData = stats?.revenueTrend?.map(item => ({
    name: item.month,
    Revenue: item.revenue,
    Users: item.users
  })) || [];

  const StatCard = ({ title, value, subtitle, icon, colorClass, shadowColor }) => (
    <div className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${colorClass} ${shadowColor} transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tight">{value}</h3>
      <p className="text-sm font-bold text-slate-700">{title}</p>
      <p className="text-xs text-slate-400 mt-1.5 font-medium">{subtitle}</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Platform Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time performance and metrics overview</p>
        </div>
        <button 
          onClick={fetchStats} 
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-700 hover:text-violet-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <RefreshCcw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Syncing...' : 'Refresh Data'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Creators" 
          value={stats?.kpis?.totalCreators || 0} 
          subtitle={`${stats?.kpis?.approvedCreators || 0} approved profiles`} 
          icon={<Users size={26} className="text-violet-600" />} 
          colorClass="bg-violet-50"
          shadowColor="shadow-lg shadow-violet-100"
        />
        <StatCard 
          title="Production Houses" 
          value={stats?.kpis?.totalCompanies || 0} 
          subtitle="verified partners" 
          icon={<Building2 size={26} className="text-blue-600" />} 
          colorClass="bg-blue-50"
          shadowColor="shadow-lg shadow-blue-100"
        />
        <StatCard 
          title="Gross Revenue" 
          value={`₹${(stats?.kpis?.grossRevenue || 0).toLocaleString()}`} 
          subtitle="total platform revenue" 
          icon={<CreditCard size={26} className="text-emerald-600" />} 
          colorClass="bg-emerald-50"
          shadowColor="shadow-lg shadow-emerald-100"
        />
        <StatCard 
          title="Active Castings" 
          value={stats?.kpis?.openCastings || 0} 
          subtitle={`${stats?.kpis?.totalApplicants || 0} total applications`} 
          icon={<Video size={26} className="text-amber-600" />} 
          colorClass="bg-amber-50"
          shadowColor="shadow-lg shadow-amber-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-7 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900">Revenue Growth</h3>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">Past 6 Months Performance</p>
            </div>
            <span className="px-4 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-full border border-slate-200">Monthly Trend</span>
          </div>
          <div className="h-72 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                     <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} tickFormatter={(val) => `₹${val/1000}k`} />
                 <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '12px' }} 
                   itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                   formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                 />
                 <Area type="monotone" dataKey="Revenue" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Breakdown Section */}
        <div className="bg-white rounded-[2rem] p-7 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900">Revenue Streams</h3>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">Distribution By Source</p>
            </div>
            <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Receipt size={16} />
            </span>
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-6">
            {stats?.revenueStreams?.length === 0 && (
               <p className="text-sm text-slate-400 text-center italic">No revenue recorded yet.</p>
            )}
            {stats?.revenueStreams?.map((stream, i) => (
              <div key={i} className="w-full group">
                <div className="flex justify-between items-end mb-2.5">
                  <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{stream.name}</span>
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 block">₹{stream.amount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex shadow-inner">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${stream.percent}%`, backgroundColor: stream.color }}
                  />
                  <div className="ml-2 text-[10px] font-black flex items-center justify-center px-1" style={{color: stream.color}}>
                    {stream.percent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
