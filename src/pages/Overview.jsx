import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Building2, Users, Receipt, Heart, TrendingUp, TrendingDown, Star, Video, CreditCard } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/analytics/overview`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (res.data.success) {
          setStats(res.data.analytics);
        } else {
          setError("Failed to load analytics");
        }
      } catch (err) {
        console.error("Failed to load stats", err);
        setError(err.response?.data?.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100 text-center">
        {error}
      </div>
    );
  }

  // Transform data for recharts
  const chartData = stats?.revenueTrend?.map(item => ({
    name: item.month,
    Revenue: item.revenue,
    Users: item.users
  })) || [];

  const StatCard = ({ title, value, subtitle, icon, colorClass }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClass}`}>
        {icon}
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-sm font-semibold text-gray-600">{title}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Creators" 
          value={stats?.kpis?.totalCreators || 0} 
          subtitle={`${stats?.kpis?.approvedCreators || 0} approved profiles`} 
          icon={<Users size={24} className="text-fuchsia-600" />} 
          colorClass="bg-fuchsia-50"
        />
        <StatCard 
          title="Production Houses" 
          value={stats?.kpis?.totalCompanies || 0} 
          subtitle="registered companies" 
          icon={<Building2 size={24} className="text-blue-600" />} 
          colorClass="bg-blue-50"
        />
        <StatCard 
          title="Gross Revenue" 
          value={`₹${(stats?.kpis?.grossRevenue || 0).toLocaleString()}`} 
          subtitle="total platform revenue" 
          icon={<CreditCard size={24} className="text-emerald-600" />} 
          colorClass="bg-emerald-50"
        />
        <StatCard 
          title="Active Castings" 
          value={stats?.kpis?.openCastings || 0} 
          subtitle={`${stats?.kpis?.totalApplicants || 0} total applications`} 
          icon={<Video size={24} className="text-amber-600" />} 
          colorClass="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Platform Revenue Growth</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider">REVENUE (LAST 6 MONTHS)</p>
            </div>
            <span className="px-3 py-1 bg-fuchsia-50 text-fuchsia-600 text-xs font-semibold rounded-full border border-fuchsia-100">Monthly</span>
          </div>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#d946ef" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                 <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Area type="monotone" dataKey="Revenue" stroke="url(#colorRev)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Revenue Stream Breakdown</h3>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">DISTRIBUTION BY SOURCE</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full border border-emerald-100 flex items-center gap-1">
              <Receipt size={12} />
              Earnings
            </span>
          </div>
          <div className="h-64 flex flex-col justify-center px-2 gap-4 pb-4">
            {stats?.revenueStreams?.map((stream, i) => (
              <div key={i} className="w-full">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-semibold text-gray-700">{stream.name}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900 block">₹{stream.amount.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 font-medium">{stream.percent}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${stream.percent}%`, backgroundColor: stream.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
