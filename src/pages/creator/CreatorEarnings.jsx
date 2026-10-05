import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import {
  TrendingUp, DollarSign, Calendar, Sparkles,
  Award, ShieldCheck, ArrowUpRight, BarChart3,
  PieChart, RefreshCw, CheckCircle2
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const CreatorEarnings = () => {
  const { creatorUser } = useCreatorAuth();
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API}/creator/portal/earnings`, { headers });
      if (res.data?.success) {
        setEarningsData(res.data);
      }
    } catch (err) {
      console.error('Error fetching earnings analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const summary = earningsData?.summary || {
    totalGross: 0,
    netReceived: 0,
    inEscrow: 0,
    avgProjectFee: 0,
    completedProjectsCount: 0
  };

  const monthlyTrends = earningsData?.monthlyTrends || [];

  const categoryBreakdown = earningsData?.categoryBreakdown || [];

  const maxMonthVal = Math.max(...monthlyTrends.map(m => m.amount), 1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#180a22] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-purple-800/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-fuchsia-200">
              <TrendingUp size={13} className="text-emerald-400" />
              <span>Commercial Income Analytics</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Earnings & Commercial Revenue
            </h1>
            <p className="text-purple-200 text-xs md:text-sm max-w-xl">
              Track project fees, escrow payouts, and monthly commercial performance.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-purple-200">Lifetime Gross</p>
              <h3 className="text-2xl font-black text-emerald-300">₹{summary.totalGross.toLocaleString('en-IN')}</h3>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-purple-200">Avg Shoot Fee</p>
              <h3 className="text-2xl font-black text-white">₹{summary.avgProjectFee.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Billed</span>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900">₹{summary.totalGross.toLocaleString('en-IN')}</h3>
          <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <ArrowUpRight size={13} /> +42% growth vs last quarter
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Paid to Bank</span>
          <h3 className="text-2xl md:text-3xl font-black text-emerald-600">₹{summary.netReceived.toLocaleString('en-IN')}</h3>
          <p className="text-[11px] text-gray-400">Successfully cleared</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Pending Escrow</span>
          <h3 className="text-2xl md:text-3xl font-black text-purple-600">₹{summary.inEscrow.toLocaleString('en-IN')}</h3>
          <p className="text-[11px] text-gray-400">Scheduled for Diwali TVC shoot</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Completed Projects</span>
          <h3 className="text-2xl md:text-3xl font-black text-blue-600">{summary.completedProjectsCount}</h3>
          <p className="text-[11px] text-gray-400">100% 5-star client reviews</p>
        </div>
      </div>

      {/* MONTHLY REVENUE GROWTH BARS & CATEGORY BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Trend (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-black text-base text-gray-900">Monthly Revenue Growth</h3>
              <p className="text-xs text-gray-400">Total earnings accumulated over the last 6 months</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold">
              2026 Fiscal
            </span>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 pt-8 px-4">
            {monthlyTrends.map((item, idx) => {
              const heightPercent = Math.max(15, Math.round((item.amount / maxMonthVal) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{(item.amount / 1000).toFixed(0)}k
                  </span>
                  <div className="w-full max-w-[48px] bg-gray-100 rounded-2xl overflow-hidden flex flex-col justify-end h-44 p-1">
                    <div
                      className="w-full bg-gradient-to-t from-purple-700 to-fuchsia-500 rounded-xl transition-all duration-700 group-hover:from-purple-600 group-hover:to-fuchsia-400 shadow-sm"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-gray-600">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Category Distribution (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="font-black text-base text-gray-900">Revenue by Category</h3>
            <p className="text-xs text-gray-400">Earnings across modeling & acting disciplines</p>
          </div>

          <div className="space-y-4">
            {categoryBreakdown.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-800">{cat.category}</span>
                  <span className="font-black text-gray-900">₹{cat.amount.toLocaleString('en-IN')} ({cat.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      i === 0
                        ? 'bg-purple-600'
                        : i === 1
                        ? 'bg-fuchsia-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl text-xs space-y-1 border border-gray-100 mt-4">
            <p className="font-bold text-gray-900">Commercial Rates Note</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Fashion shows and commercial OTT shoots represent the highest earnings per shoot day for your profile tier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorEarnings;
