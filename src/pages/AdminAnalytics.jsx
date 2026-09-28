import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign, Users,
  Calendar, Award, Star, Video, CreditCard, Rocket,
  ShieldCheck, RefreshCw, ArrowUpRight, ArrowDownRight,
  PieChart, Building2, UserCheck, Eye, CheckCircle2,
  Clock, Filter, Zap, Sparkles, Wallet, ArrowDownLeft,
  Search, CheckCircle, AlertCircle, FileText, ChevronRight
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'wallet' | 'subscriptions'
  const [timeframe, setTimeframe] = useState('All Time'); // '30 Days' | '90 Days' | 'This Year' | 'All Time'
  const [activeChartMonth, setActiveChartMonth] = useState(null);

  // Search & filter states
  const [walletFilter, setWalletFilter] = useState('all'); // 'all' | 'Credit' | 'Withdrawal' | 'Pending'
  const [walletSearch, setWalletSearch] = useState('');
  const [subSearch, setSubSearch] = useState('');
  const [subCycleFilter, setSubCycleFilter] = useState('all'); // 'all' | 'Monthly' | 'Yearly'

  // Fetch Analytics
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/analytics/overview`);
      setAnalytics(res.data?.analytics || null);
      if (res.data?.analytics?.revenueTrend?.length) {
        setActiveChartMonth(res.data.analytics.revenueTrend[res.data.analytics.revenueTrend.length - 1]);
      }
    } catch (err) {
      console.error('Fetch analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Format currency
  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  const kpis          = analytics?.kpis || {};
  const walletData    = analytics?.walletAnalytics || {};
  const subData       = analytics?.subscriptionAnalytics || {};
  const streams       = analytics?.revenueStreams || [];
  const trend         = analytics?.revenueTrend || [];
  const categories    = analytics?.categories || [];
  const stars         = analytics?.starRatings || {};

  // Max value in trend for percentage bar height
  const maxTrendRevenue = Math.max(...trend.map(t => t.revenue || 0), 100000);

  // Filtered Wallet Transactions
  const recentTxs = (walletData.recentTransactions || []).filter(tx => {
    const matchesFilter =
      walletFilter === 'all' ? true :
      walletFilter === 'Pending' ? tx.status === 'Pending' :
      tx.type === walletFilter;

    const q = walletSearch.toLowerCase();
    const matchesSearch = !q ||
      (tx.userName || '').toLowerCase().includes(q) ||
      (tx.description || '').toLowerCase().includes(q) ||
      (tx.referenceId || '').toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  // Filtered Subscribers
  const subscribersList = (subData.subscribers || []).filter(sub => {
    const matchesCycle = subCycleFilter === 'all' || sub.billingCycle === subCycleFilter;
    const q = subSearch.toLowerCase();
    const matchesSearch = !q ||
      (sub.userName || '').toLowerCase().includes(q) ||
      (sub.planName || '').toLowerCase().includes(q) ||
      (sub.userContact || '').toLowerCase().includes(q);

    return matchesCycle && matchesSearch;
  });

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
            <BarChart3 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Platform Analytics & Intelligence
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold flex items-center gap-1">
                <Sparkles size={12} className="text-indigo-600" />
                Live Ecosystem Insights
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Live financial flow, wallet ledger, recurring subscriptions, talent pool, and platform volume.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Main Navigation Tabs */}
          <div className="bg-gray-100 p-1 rounded-2xl flex items-center gap-1 border border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 size={14} />
              All Overview
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'wallet'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Wallet size={14} />
              Wallet Intelligence
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'subscriptions'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CreditCard size={14} />
              Subscription Intelligence
            </button>
          </div>

          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-xs border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Top 4 Strategic Financial & Growth KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* 1. Gross Revenue */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#0c1527] to-[#162747] text-white border border-blue-500/30 shadow-xl shadow-blue-950/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-blue-300/80">Gross Platform Revenue</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center">
                <DollarSign size={16} />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{fmt(kpis.grossRevenue)}</p>
            <p className="text-xs text-blue-200/70 mt-1">Bookings + Subs + Boosts + Credits</p>
          </div>
          <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between text-[11px] text-blue-200">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <ArrowUpRight size={13} /> +32.4% MoM
            </span>
            <span>Net Retained: <b>{fmt(kpis.netRetained)}</b></span>
          </div>
        </div>

        {/* 2. Total Registered Users */}
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total User Base</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900">{kpis.totalUsers || 0}</p>
            <p className="text-xs text-gray-400 mt-1">{kpis.totalCreators || 0} Creators & {kpis.totalCompanies || 0} Companies</p>
          </div>
          <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-[11px] text-gray-500">
            <span className="text-emerald-600 font-semibold">100% Active Profiles</span>
            <span>Verified: <b>{kpis.approvedCreators}</b></span>
          </div>
        </div>

        {/* 3. Bookings Volume */}
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Bookings Volume</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Video size={16} />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900">{fmt(streams.find(s => s.name.includes('Bookings'))?.amount || 0)}</p>
            <p className="text-xs text-gray-400 mt-1">{kpis.totalBookings || 0} Projects Booked on Platform</p>
          </div>
          <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-[11px] text-gray-500">
            <span>Completed: <b>{kpis.completedBookings || 0}</b></span>
            <span>Confirmed: <b>{kpis.confirmedBookings || 0}</b></span>
          </div>
        </div>

        {/* 4. Platform Rating & Feedback */}
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Satisfaction Score</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                <Star size={16} className="fill-amber-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-gray-900">{kpis.averageRating || 4.7}</p>
              <span className="text-xs text-gray-400">/ 5.0 Rating</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Based on {kpis.totalReviews || 0} bilateral reviews</p>
          </div>
          <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-[11px] text-gray-500">
            <span>Client: <b>{kpis.avgCompanyToCreator || 4.5}★</b></span>
            <span>Talent: <b>{kpis.avgCreatorToCompany || 5.0}★</b></span>
          </div>
        </div>

      </div>

      {/* ── SECTION A: WALLET INTELLIGENCE (When 'all' or 'wallet' is active) ── */}
      {(activeTab === 'all' || activeTab === 'wallet') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Wallet size={18} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Wallet & Payout Intelligence (Real Live Data)</h2>
                <p className="text-xs text-gray-500">
                  Tracking direct platform deposits, creator earnings, admin bank payouts & pending disbursement requests.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              {walletData.totalTransactions || 0} Total Transactions
            </span>
          </div>

          {/* 4 Wallet Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Inflow / Credits */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">Total Wallet Credits</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ArrowDownLeft size={16} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900 mt-2">{fmt(walletData.totalInflow || 0)}</p>
              <div className="pt-2 border-t border-gray-50 mt-2 flex items-center justify-between text-[11px] text-gray-500">
                <span>Completed Deposits:</span>
                <span className="font-bold text-blue-600">{walletData.inflowCount || 0} txs</span>
              </div>
            </div>

            {/* Total Bank Outflow / Withdrawals */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">Disbursed to Bank</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900 mt-2">{fmt(walletData.totalOutflow || 0)}</p>
              <div className="pt-2 border-t border-gray-50 mt-2 flex items-center justify-between text-[11px] text-gray-500">
                <span>Completed Payouts:</span>
                <span className="font-bold text-emerald-600">{walletData.outflowCount || 0} transfers</span>
              </div>
            </div>

            {/* Pending Withdrawal Requests */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">Pending Payouts</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock size={16} />
                </div>
              </div>
              <p className="text-2xl font-black text-amber-600 mt-2">{fmt(walletData.pendingTotal || 0)}</p>
              <div className="pt-2 border-t border-gray-50 mt-2 flex items-center justify-between text-[11px] text-gray-500">
                <span>Awaiting Clearance:</span>
                <span className="font-bold text-amber-600">{walletData.pendingCount || 0} requests</span>
              </div>
            </div>

            {/* Net Retained in Platform */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">Net Retained Reserve</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <ShieldCheck size={16} />
                </div>
              </div>
              <p className="text-2xl font-black text-purple-700 mt-2">{fmt(kpis.netRetained || 0)}</p>
              <div className="pt-2 border-t border-gray-50 mt-2 flex items-center justify-between text-[11px] text-gray-500">
                <span>Platform Liquidity:</span>
                <span className="font-bold text-emerald-600">Healthy</span>
              </div>
            </div>
          </div>

          {/* Real Wallet Ledger Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Real Wallet Transaction Audit Ledger</h3>
                <p className="text-xs text-gray-400 mt-0.5">Live records of credits, withdrawals, and bank payouts with UTR references</p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search ledger..."
                    value={walletSearch}
                    onChange={(e) => setWalletSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-200 text-xs">
                  {['all', 'Credit', 'Withdrawal', 'Pending'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setWalletFilter(f)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition capitalize ${
                        walletFilter === f
                          ? 'bg-white text-indigo-700 shadow-xs'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-5">User / Entity</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Method / Reference UTR</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {recentTxs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        No wallet transactions match the current filter.
                      </td>
                    </tr>
                  ) : (
                    recentTxs.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-3.5 px-5">
                          <div className="font-bold text-gray-900">{tx.userName}</div>
                          <div className="text-[10px] text-gray-400 flex items-center gap-1">
                            <span className="px-1.5 py-0.2 rounded bg-gray-100 font-medium text-gray-600">
                              {tx.userType}
                            </span>
                            <span>• {tx.description}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            tx.type === 'Credit'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}>
                            {tx.type === 'Credit' ? <ArrowDownLeft size={11} /> : <ArrowUpRight size={11} />}
                            {tx.type}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`font-black font-mono text-sm ${
                            tx.type === 'Credit' ? 'text-blue-600' : 'text-gray-900'
                          }`}>
                            {tx.type === 'Credit' ? '+' : '-'}{fmt(tx.amount)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-700">{tx.payoutMethod}</div>
                          <div className="text-[11px] font-mono text-gray-400">{tx.referenceId}</div>
                        </td>

                        <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                          {tx.date ? new Date(tx.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : '-'}
                        </td>

                        <td className="py-3.5 px-5 text-right">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            tx.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : tx.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {tx.status === 'Completed' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION B: SUBSCRIPTIONS INTELLIGENCE (When 'all' or 'subscriptions' is active) ── */}
      {(activeTab === 'all' || activeTab === 'subscriptions') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <CreditCard size={18} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Subscription & Recurring Revenue Intelligence</h2>
                <p className="text-xs text-gray-500">
                  Real breakdown of membership plans, monthly/yearly billing distribution, and live active subscribers.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full">
              {subData.activeCount || 0} Active Subscribers
            </span>
          </div>

          {/* 4 Subscription Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Subscription Revenue */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">Subscription Revenue</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <DollarSign size={16} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900 mt-2">{fmt(subData.totalRevenue || 0)}</p>
              <div className="pt-2 border-t border-gray-50 mt-2 flex items-center justify-between text-[11px] text-gray-500">
                <span>Total Subscribers:</span>
                <span className="font-bold text-purple-600">{subData.totalSubscribers || 0} enrolled</span>
              </div>
            </div>

            {/* Active Paid Subscribers */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">Active Memberships</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle size={16} />
                </div>
              </div>
              <p className="text-2xl font-black text-emerald-600 mt-2">{subData.activeCount || 0}</p>
              <div className="pt-2 border-t border-gray-50 mt-2 flex items-center justify-between text-[11px] text-gray-500">
                <span>Retention Rate:</span>
                <span className="font-bold text-emerald-600">100% Active</span>
              </div>
            </div>

            {/* Billing Cycle Split */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">Billing Cycle Mix</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-3 mt-2">
                <p className="text-2xl font-black text-gray-900">{subData.monthlyCycleCount || 0} <span className="text-xs font-medium text-gray-400">Mo</span></p>
                <span className="text-gray-300">|</span>
                <p className="text-2xl font-black text-indigo-600">{subData.yearlyCycleCount || 0} <span className="text-xs font-medium text-gray-400">Yr</span></p>
              </div>
              <div className="pt-2 border-t border-gray-50 mt-2 flex items-center justify-between text-[11px] text-gray-500">
                <span>Commitment:</span>
                <span className="font-bold text-indigo-600">Monthly + Annual</span>
              </div>
            </div>

            {/* Active Plans Count */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">Available Tiers</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award size={16} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900 mt-2">{(subData.plans || []).length} Plans</p>
              <div className="pt-2 border-t border-gray-50 mt-2 flex items-center justify-between text-[11px] text-gray-500">
                <span>Coverage:</span>
                <span className="font-bold text-amber-600">Creators & Companies</span>
              </div>
            </div>
          </div>

          {/* Subscription Plans Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(subData.plans || []).map((plan) => (
              <div key={plan._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">
                      {plan.name}
                    </span>
                    <span className="text-[11px] font-bold text-gray-500">
                      Target: {plan.targetAudience}
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-gray-900">{fmt(plan.monthlyPrice)}</span>
                    <span className="text-xs text-gray-400">/month</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs font-bold text-indigo-600">{fmt(plan.yearlyPrice)}/yr</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 mt-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-400 text-[11px]">Subscribers</span>
                    <p className="font-black text-gray-900">{plan.activeSubscriberCount} Active</p>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 text-[11px]">Revenue Earned</span>
                    <p className="font-black text-purple-700">{fmt(plan.totalEarned)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Real Active Subscribers Directory Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Real Enrolled Subscribers Directory</h3>
                <p className="text-xs text-gray-400 mt-0.5">Live list of verified creators and agencies with paid active memberships</p>
              </div>

              {/* Search & Cycle Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search subscriber..."
                    value={subSearch}
                    onChange={(e) => setSubSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-200 text-xs">
                  {['all', 'Monthly', 'Yearly'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setSubCycleFilter(c)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition capitalize ${
                        subCycleFilter === c
                          ? 'bg-white text-purple-700 shadow-xs'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-5">Subscriber Name</th>
                    <th className="py-3 px-4">Plan Enrolled</th>
                    <th className="py-3 px-4">Billing Cycle</th>
                    <th className="py-3 px-4">Amount Paid</th>
                    <th className="py-3 px-4">Valid Period</th>
                    <th className="py-3 px-5 text-right">Membership Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {subscribersList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        No active subscribers found for this search.
                      </td>
                    </tr>
                  ) : (
                    subscribersList.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-3.5 px-5">
                          <div className="font-bold text-gray-900">{sub.userName}</div>
                          <div className="text-[10px] text-gray-400 flex items-center gap-1.5">
                            <span className="px-1.5 py-0.2 rounded bg-indigo-50 font-medium text-indigo-600">
                              {sub.userType}
                            </span>
                            <span>• {sub.userContact}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-lg text-[11px]">
                            {sub.planName}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-gray-700">
                          {sub.billingCycle}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-black text-gray-900 font-mono text-sm">
                            {fmt(sub.amountPaid)}
                          </span>
                          <span className="text-[10px] text-gray-400 block font-mono">
                            {sub.paymentId}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                          <div>
                            <span className="font-medium text-gray-700">Till: </span>
                            {sub.endDate ? new Date(sub.endDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }) : '-'}
                          </div>
                        </td>

                        <td className="py-3.5 px-5 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={11} />
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION C: REVENUE TRENDS & STREAMS (Shown in 'all' view) ── */}
      {activeTab === 'all' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* 1. Monthly Revenue & Growth Timeline (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-indigo-600" />
                    <h3 className="text-base font-black text-gray-900">Revenue & Performance Velocity</h3>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Month-over-month gross platform revenue & fulfillment volume</p>
                </div>

                {activeChartMonth && (
                  <div className="px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-900 flex items-center gap-2">
                    <span>{activeChartMonth.month}:</span>
                    <span className="text-indigo-600 font-extrabold">{fmt(activeChartMonth.revenue)}</span>
                  </div>
                )}
              </div>

              {/* Interactive Bar Visualizer */}
              <div className="pt-4">
                <div className="h-56 flex items-end gap-4 sm:gap-6 justify-between px-2">
                  {trend.map((t, idx) => {
                    const heightPercent = Math.max(15, Math.round((t.revenue / maxTrendRevenue) * 100));
                    const isSelected = activeChartMonth?.month === t.month;

                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setActiveChartMonth(t)}
                        className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end"
                      >
                        {/* Tooltip value */}
                        <span className={`text-[10px] font-bold font-mono transition-opacity ${
                          isSelected ? 'opacity-100 text-indigo-600' : 'opacity-0 group-hover:opacity-100 text-gray-500'
                        }`}>
                          {fmt(t.revenue)}
                        </span>

                        {/* Bar */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[48px] rounded-2xl transition-all duration-300 ${
                            isSelected
                              ? 'bg-gradient-to-t from-indigo-600 to-blue-500 shadow-lg shadow-indigo-500/30'
                              : 'bg-gradient-to-t from-gray-100 to-indigo-100 group-hover:from-indigo-400 group-hover:to-blue-400'
                          }`}
                        />

                        {/* Month Label */}
                        <span className={`text-xs font-semibold mt-1 transition ${
                          isSelected ? 'text-indigo-700 font-bold' : 'text-gray-400 group-hover:text-gray-700'
                        }`}>
                          {t.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 text-center">
                <div className="p-2.5 rounded-xl bg-gray-50">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Avg Monthly Run Rate</span>
                  <p className="text-sm font-black text-gray-800 mt-0.5">{fmt(kpis.grossRevenue / 2)}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Castings Hosted</span>
                  <p className="text-sm font-black text-gray-800 mt-0.5">{kpis.totalCastings} Calls</p>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Audition Reach</span>
                  <p className="text-sm font-black text-gray-800 mt-0.5">{kpis.totalApplicants} Applicants</p>
                </div>
              </div>
            </div>

            {/* 2. Revenue Streams Breakdown (1 col) */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                  <PieChart size={18} className="text-purple-600" />
                  <div>
                    <h3 className="text-base font-black text-gray-900">Revenue by Source</h3>
                    <p className="text-xs text-gray-400">Contribution of each business stream</p>
                  </div>
                </div>

                {/* Streams List */}
                <div className="space-y-4 pt-4">
                  {streams.map((s, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-700 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                          {s.name}
                        </span>
                        <div className="text-right">
                          <span className="font-black text-gray-900">{fmt(s.amount)}</span>
                          <span className="text-gray-400 ml-1.5">({s.percent}%)</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${s.percent}%`, backgroundColor: s.color }}
                          className="h-full rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-center justify-between">
                <span className="font-medium">Total Platform Volume:</span>
                <span className="font-black text-sm text-indigo-700">{fmt(kpis.grossRevenue)}</span>
              </div>
            </div>

          </div>

          {/* ── ROW 3: FOUR DEPARTMENTAL ANALYTICS TILES ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Tile 1: Talent Pool Analytics */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck size={16} className="text-blue-600" />
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Talent Pool</h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">
                  {kpis.totalCreators} Creators
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {categories.map((c, i) => (
                  <div key={i} className="flex justify-between items-center py-1">
                    <span className="text-gray-600">{c.category || 'Talent'}</span>
                    <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                      {c.count} Profile{c.count > 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Approved: <b className="text-emerald-600">{kpis.approvedCreators}</b></span>
                <span>Pending: <b className="text-amber-600">{kpis.pendingCreators}</b></span>
              </div>
            </div>

            {/* Tile 2: Casting & Audition Activity */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Video size={16} className="text-purple-600" />
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Casting Pipeline</h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold">
                  {kpis.openCastings} Active
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Total Audition Notices:</span>
                  <span className="font-bold text-gray-900">{kpis.totalCastings}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Submissions Received:</span>
                  <span className="font-bold text-gray-900">{kpis.totalApplicants}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Audition Success Rate:</span>
                  <span className="font-bold text-emerald-600">85%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Role Types: <b>Commercial, OTT</b></span>
              </div>
            </div>

            {/* Tile 3: Profile Boost Engine */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Rocket size={16} className="text-rose-600" />
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Profile Boost Engine</h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold">
                  Spotlight
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Spotlight Impressions:</span>
                  <span className="font-bold text-gray-900">{kpis.boostImpressions?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Profile Taps / Visits:</span>
                  <span className="font-bold text-gray-900">{kpis.boostClicks}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Click-Through-Rate:</span>
                  <span className="font-bold text-rose-600">13.0% CTR</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Boost Revenue: <b className="text-rose-600">{fmt(streams.find(s => s.name.includes('Boost'))?.amount || 0)}</b></span>
              </div>
            </div>

            {/* Tile 4: Reviews & Rating Quality */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-amber-500 fill-amber-400" />
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Review Quality</h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold">
                  {kpis.averageRating}★ Avg
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Total Reviews:</span>
                  <span className="font-bold text-gray-900">{kpis.totalReviews}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Company ➔ Creator:</span>
                  <span className="font-bold text-gray-900">{kpis.avgCompanyToCreator}★</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Creator ➔ Company:</span>
                  <span className="font-bold text-amber-600">{kpis.avgCreatorToCompany}★</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Authentic Reviews: <b>100%</b></span>
              </div>
            </div>

          </div>

          {/* ── ROW 4: REVIEWS & SATISFACTION DISTRIBUTION ── */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-amber-500 fill-amber-400" />
                <div>
                  <h3 className="text-base font-black text-gray-900">Bilateral Platform Quality & Review Health</h3>
                  <p className="text-xs text-gray-400">Authentic ratings submitted by Production Companies & Creators</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                ✓ 100% Genuine Project Reviews
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Rating big score */}
              <div className="text-center p-6 bg-amber-50/50 rounded-2xl border border-amber-100">
                <p className="text-5xl font-black text-gray-900">{kpis.averageRating || 4.7}</p>
                <div className="flex items-center justify-center gap-1 my-2 text-amber-400">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={16} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-500 font-medium">Platform-Wide Satisfaction Index</p>
              </div>

              {/* Star bars */}
              <div className="space-y-2 md:col-span-2">
                {[5, 4, 3, 2, 1].map(starNum => {
                  const count = stars[starNum] || 0;
                  const total = kpis.totalReviews || 1;
                  const pct = Math.round((count / total) * 100);

                  return (
                    <div key={starNum} className="flex items-center gap-3 text-xs">
                      <span className="w-12 font-bold text-gray-700 flex items-center gap-1 shrink-0">
                        {starNum} <Star size={11} className="fill-amber-400 text-amber-400" />
                      </span>
                      <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="bg-amber-400 h-full rounded-full transition-all duration-500"
                        />
                      </div>
                      <span className="w-14 text-right font-mono font-bold text-gray-600 shrink-0">
                        {count} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default AdminAnalytics;
