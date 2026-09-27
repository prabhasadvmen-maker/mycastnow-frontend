import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Building2, Users, Receipt, Heart, TrendingUp, TrendingDown } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/stats`);
        setStats(res.data);
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Transform data for recharts
  const chartData = stats?.monthlyTrends?.labels.map((label, index) => ({
    name: label,
    Donations: stats.monthlyTrends.donations[index],
    Expenses: stats.monthlyTrends.expenses[index]
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
          title="Total NGOs" 
          value={stats?.totalNGOs || 0} 
          subtitle="registered NGOs" 
          icon={<Building2 size={24} className="text-emerald-600" />} 
          colorClass="bg-emerald-50"
        />
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          subtitle="all system roles" 
          icon={<Users size={24} className="text-blue-600" />} 
          colorClass="bg-blue-50"
        />
        <StatCard 
          title="Total Donations" 
          value={`₹${stats?.totalDonations || '0'}`} 
          subtitle="total collected" 
          icon={<Receipt size={24} className="text-teal-600" />} 
          colorClass="bg-teal-50"
        />
        <StatCard 
          title="Active Volunteers" 
          value={stats?.activeVolunteers || 0} 
          subtitle="currently active" 
          icon={<Heart size={24} className="text-blue-600" />} 
          colorClass="bg-blue-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">User Registrations</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider">USER REGISTRATIONS (LAST 6 MONTHS)</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100">Monthly</span>
          </div>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                 <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Area type="monotone" dataKey="Donations" stroke="url(#colorUsers)" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Monthly Financial Trends</h3>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-600"></div><span className="text-xs text-gray-500 font-medium">Donations</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-xs text-gray-500 font-medium">Expenses</span></div>
              </div>
            </div>
            <span className="px-3 py-1 bg-red-50 text-red-500 text-xs font-semibold rounded-full border border-red-100 flex items-center gap-1">
              <TrendingUp size={12} />
              Live Trend
            </span>
          </div>
          <div className="h-64 flex items-end justify-between px-2 gap-2 pb-4">
            {chartData.map((d, i) => (
              <div key={i} className="w-full flex gap-1 items-end h-full relative group">
                <div className="w-1/2 bg-gradient-to-t from-blue-600 to-fuchsia-500 rounded-t-sm hover:opacity-80 transition-opacity relative" style={{ height: `${(d.Donations / 8) * 100}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">₹{d.Donations}L</div>
                </div>
                <div className="w-1/2 bg-gradient-to-t from-fuchsia-500 to-yellow-500 rounded-t-sm hover:opacity-80 transition-opacity relative" style={{ height: `${(d.Expenses / 8) * 100}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">₹{d.Expenses}L</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-4 mt-2">
            {chartData.map((d, i) => (
              <span key={i} className="text-xs text-gray-400 font-medium">{d.name}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
