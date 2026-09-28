import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Rocket, TrendingUp, Users, DollarSign, Calendar, Clock,
  Search, Filter, CheckCircle2, AlertCircle, XCircle,
  Plus, Edit3, Trash2, Eye, ShieldCheck, Zap, Sparkles,
  Award, ArrowUpRight, ChevronRight, Check, X, RefreshCw,
  ExternalLink, Smartphone, Copy, CheckCheck
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const AdminBoost = () => {
  // State
  const [stats, setStats]               = useState(null);
  const [boosts, setBoosts]             = useState([]);
  const [plans, setPlans]               = useState([]);
  const [creators, setCreators]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState('boosts'); // 'boosts' | 'plans' | 'apiDocs'
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    creatorId: '',
    planId: '',
    customDays: 7,
    amountCharged: 999,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    notes: ''
  });
  const [manualSubmitting, setManualSubmitting] = useState(false);

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({
    name: '',
    tagline: '',
    badge: '',
    durationDays: 7,
    price: 999,
    originalPrice: 1499,
    features: '',
    priorityScore: 20,
    isPopular: false
  });
  const [planSubmitting, setPlanSubmitting] = useState(false);

  const [extendModal, setExtendModal] = useState({ open: false, boostId: null, days: 7 });

  // Helpers
  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) : '—';

  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const diff = new Date(endDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  // Fetch all initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, reqsRes, plansRes, creatorsRes] = await Promise.all([
        axios.get(`${API}/admin/boost/stats`),
        axios.get(`${API}/admin/boost/requests`),
        axios.get(`${API}/admin/boost/plans`),
        axios.get(`${API}/admin/creators`).catch(() => ({ data: [] }))
      ]);

      setStats(statsRes.data?.stats || null);
      setBoosts(reqsRes.data?.data || []);
      setPlans(plansRes.data?.data || []);

      const cList = creatorsRes.data?.creators || creatorsRes.data || [];
      setCreators(Array.isArray(cList) ? cList : []);
    } catch (err) {
      console.error('Boost data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Status / Extend Boost
  const handleUpdateStatus = async (boostId, newStatus) => {
    try {
      await axios.put(`${API}/admin/boost/requests/${boostId}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update boost status');
    }
  };

  const handleExtendBoost = async () => {
    if (!extendModal.boostId) return;
    try {
      await axios.put(`${API}/admin/boost/requests/${extendModal.boostId}/status`, {
        extendDays: extendModal.days
      });
      setExtendModal({ open: false, boostId: null, days: 7 });
      fetchData();
    } catch (err) {
      alert('Failed to extend boost duration');
    }
  };

  const handleDeleteBoost = async (boostId) => {
    if (!window.confirm('Delete this boost order?')) return;
    try {
      await axios.delete(`${API}/admin/boost/requests/${boostId}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete boost');
    }
  };

  // Submit Manual Boost
  const handleManualBoostSubmit = async (e) => {
    e.preventDefault();
    if (!manualForm.creatorId) {
      alert('Please select a creator to boost');
      return;
    }
    setManualSubmitting(true);
    try {
      await axios.post(`${API}/admin/boost/manual-boost`, manualForm);
      setIsManualModalOpen(false);
      setManualForm({
        creatorId: '',
        planId: '',
        customDays: 7,
        amountCharged: 999,
        paymentMethod: 'UPI',
        paymentStatus: 'Paid',
        notes: ''
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to boost creator');
    } finally {
      setManualSubmitting(false);
    }
  };

  // Plan creation / editing
  const openCreatePlanModal = () => {
    setEditingPlan(null);
    setPlanForm({
      name: '',
      tagline: '',
      badge: '',
      durationDays: 7,
      price: 999,
      originalPrice: 1499,
      features: 'Top of Casting Search, Featured on App Home Screen, Gold Verified Boost Badge',
      priorityScore: 20,
      isPopular: false
    });
    setIsPlanModalOpen(true);
  };

  const openEditPlanModal = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      tagline: plan.tagline || '',
      badge: plan.badge || '',
      durationDays: plan.durationDays,
      price: plan.price,
      originalPrice: plan.originalPrice || plan.price,
      features: Array.isArray(plan.features) ? plan.features.join(', ') : '',
      priorityScore: plan.priorityScore || 20,
      isPopular: Boolean(plan.isPopular)
    });
    setIsPlanModalOpen(true);
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    setPlanSubmitting(true);
    try {
      const payload = {
        ...planForm,
        features: planForm.features.split(',').map(f => f.trim()).filter(Boolean)
      };

      if (editingPlan) {
        await axios.put(`${API}/admin/boost/plans/${editingPlan._id}`, payload);
      } else {
        await axios.post(`${API}/admin/boost/plans`, payload);
      }

      setIsPlanModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save boost plan');
    } finally {
      setPlanSubmitting(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Delete this boost plan?')) return;
    try {
      await axios.delete(`${API}/admin/boost/plans/${planId}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete plan');
    }
  };

  // Filtered boosts
  const filteredBoosts = boosts.filter(b => {
    if (filterStatus !== 'All' && b.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.creatorName?.toLowerCase().includes(q) ||
        b.creatorPhone?.toLowerCase().includes(q) ||
        b.creatorCategory?.toLowerCase().includes(q) ||
        b.planName?.toLowerCase().includes(q) ||
        b.transactionId?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/25">
            <Rocket size={24} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Profile Boost Management
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold flex items-center gap-1">
                <Zap size={11} className="text-rose-600" />
                Paid Promotion Engine
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Creators profile boost requests, payment charging, spotlight priority ranking & mobile app APIs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={openCreatePlanModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition"
          >
            <Edit3 size={14} className="text-gray-500" />
            + New Boost Plan
          </button>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:opacity-95 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-rose-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Rocket size={16} />
            + Boost a Creator Profile
          </button>
        </div>
      </div>

      {/* ── Metric Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* 1. Total Boost Revenue */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#1c0f24] to-[#2b0c36] text-white border border-rose-500/30 shadow-lg shadow-purple-950/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-rose-300/80">Total Boost Revenue</span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center">
                <DollarSign size={16} />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{fmt(stats?.totalRevenue || 0)}</p>
            <p className="text-xs text-rose-200/60 mt-1">Paid directly by creators</p>
          </div>
          <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between text-[11px] text-rose-200">
            <span>Direct Platform Income</span>
            <span className="font-bold text-amber-300">100% Retained</span>
          </div>
        </div>

        {/* 2. Active Promoted Creators */}
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Live Promoted Creators</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Rocket size={16} />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900">{stats?.activeBoosts || 0}</p>
            <p className="text-xs text-gray-400 mt-1">Currently ranking at top of search</p>
          </div>
          <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live in App & Web
            </span>
            <span>Search Spotlight</span>
          </div>
        </div>

        {/* 3. Total Orders */}
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">All-Time Boost Orders</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900">{stats?.totalOrders || 0}</p>
            <p className="text-xs text-gray-400 mt-1">Orders purchased by creators</p>
          </div>
          <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-[11px] text-gray-500">
            <span>Pending Approvals: <b>{stats?.pendingCount || 0}</b></span>
            <span className="text-blue-600 font-bold">Verified</span>
          </div>
        </div>

        {/* 4. Active Pricing Plans */}
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Pricing Packages</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award size={16} />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900">{plans.length} Plans</p>
            <p className="text-xs text-gray-400 mt-1">Available on Mobile App checkout</p>
          </div>
          <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-[11px]">
            <span className="text-gray-500">Starter, Pro, VIP</span>
            <button
              onClick={() => setActiveTab('plans')}
              className="text-amber-600 hover:underline font-bold text-xs"
            >
              Configure Plans →
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex border-b border-gray-200 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('boosts')}
          className={`pb-3 flex items-center gap-2 transition-all ${
            activeTab === 'boosts'
              ? 'border-b-2 border-rose-600 text-rose-700 font-bold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Rocket size={17} />
          Boosted Creators & Orders ({boosts.length})
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`pb-3 flex items-center gap-2 transition-all ${
            activeTab === 'plans'
              ? 'border-b-2 border-rose-600 text-rose-700 font-bold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Award size={17} />
          Pricing Packages & Features ({plans.length})
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* ── TAB 1: BOOSTED CREATORS LIST & ORDERS ── */}
      {/* ══════════════════════════════════════════════════════ */}
      {activeTab === 'boosts' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search creator by name, phone, category, transaction ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="text-gray-400 w-4 h-4 shrink-0" />
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-rose-500 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase">
                  <tr>
                    <th className="py-4 px-5">Creator</th>
                    <th className="py-4 px-5">Boost Plan</th>
                    <th className="py-4 px-5">Amount Charged</th>
                    <th className="py-4 px-5">Payment Info</th>
                    <th className="py-4 px-5">Timeline / Remaining</th>
                    <th className="py-4 px-5">Performance</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan="8" className="py-16 text-center text-gray-400">Loading boost requests...</td></tr>
                  ) : filteredBoosts.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-16 text-center">
                        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Rocket size={22} />
                        </div>
                        <p className="font-bold text-gray-800">No profile boosts found.</p>
                        <p className="text-xs text-gray-400 mt-1">Click "+ Boost a Creator Profile" to boost a creator.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredBoosts.map(b => {
                      const daysLeft = getDaysRemaining(b.endDate);
                      const isActive = b.status === 'Active' && daysLeft > 0;

                      return (
                        <tr key={b._id} className="hover:bg-gray-50/80 transition">
                          {/* Creator Info */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-rose-100 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0 border border-purple-200 overflow-hidden">
                                {b.creatorPhoto ? (
                                  <img src={b.creatorPhoto} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  b.creatorName?.charAt(0) || 'C'
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                                  {b.creatorName}
                                  {isActive && (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Promotion" />
                                  )}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold">
                                    {b.creatorCategory || 'Creator'}
                                  </span>
                                  <span className="text-xs text-gray-400 font-mono">
                                    {b.creatorPhone}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Plan */}
                          <td className="py-4 px-5">
                            <p className="font-bold text-gray-800 text-xs">{b.planName}</p>
                            <span className="text-[11px] text-gray-400">{b.durationDays} Days Duration</span>
                          </td>

                          {/* Amount */}
                          <td className="py-4 px-5">
                            <p className="font-black text-rose-600 text-sm">{fmt(b.amountPaid)}</p>
                            <span className="text-[10px] text-gray-400">Charged</span>
                          </td>

                          {/* Payment */}
                          <td className="py-4 px-5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 size={11} /> {b.paymentMethod || 'UPI'}
                            </span>
                            <p className="text-[10px] text-gray-400 font-mono mt-1 truncate max-w-[120px]">
                              {b.transactionId || '—'}
                            </p>
                          </td>

                          {/* Timeline */}
                          <td className="py-4 px-5">
                            <div className="space-y-0.5">
                              <p className="text-xs font-medium text-gray-700">
                                {fmtDate(b.startDate)} → {fmtDate(b.endDate)}
                              </p>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                                daysLeft > 0 ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'
                              }`}>
                                {daysLeft > 0 ? `⏳ ${daysLeft} days remaining` : 'Expired'}
                              </span>
                            </div>
                          </td>

                          {/* Performance */}
                          <td className="py-4 px-5">
                            <div className="space-y-0.5 text-xs font-mono text-gray-600">
                              <p>👁️ {b.impressions || 0} impressions</p>
                              <p>🎯 {b.clicks || 0} profile visits</p>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-5">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-max ${
                              b.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : b.status === 'Pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                              {b.status === 'Active' && <Zap size={11} className="text-emerald-600" />}
                              {b.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Extend */}
                              <button
                                onClick={() => setExtendModal({ open: true, boostId: b._id, days: 7 })}
                                className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs transition"
                                title="Extend Duration"
                              >
                                + Extend
                              </button>

                              {/* Toggle Status */}
                              {b.status === 'Active' ? (
                                <button
                                  onClick={() => handleUpdateStatus(b._id, 'Cancelled')}
                                  className="p-1.5 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition"
                                  title="Pause / Cancel"
                                >
                                  <AlertCircle size={15} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateStatus(b._id, 'Active')}
                                  className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition"
                                  title="Activate"
                                >
                                  <CheckCircle2 size={15} />
                                </button>
                              )}

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteBoost(b._id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* ── TAB 2: PRICING PACKAGES & FEATURES ── */}
      {/* ══════════════════════════════════════════════════════ */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-2xl text-white">
            <div>
              <h3 className="text-xl font-black">Creator Boost Pricing & Tier Configurations</h3>
              <p className="text-xs text-purple-200 mt-1 max-w-xl">
                Ye packages mobile app aur web par creators ko display hote hain jab wo apni profile boost karte hain. Payment direct gateway (UPI/Razorpay/Card) se charge hota hai.
              </p>
            </div>
            <button
              onClick={openCreatePlanModal}
              className="bg-white text-purple-950 font-black text-xs px-5 py-2.5 rounded-xl shadow hover:bg-purple-50 transition flex items-center gap-1.5 shrink-0"
            >
              <Plus size={15} /> Add New Plan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(p => (
              <div
                key={p._id}
                className={`relative rounded-3xl p-6 bg-white border transition-all flex flex-col justify-between ${
                  p.isPopular ? 'border-rose-400 shadow-xl shadow-rose-500/10 ring-2 ring-rose-400/20' : 'border-gray-200 shadow-sm'
                }`}
              >
                {p.badge && (
                  <span className={`absolute -top-3 right-6 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow ${
                    p.isPopular ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white' : 'bg-gray-800 text-white'
                  }`}>
                    {p.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-black text-gray-900">{p.name}</h4>
                  </div>
                  <p className="text-xs text-gray-500 min-h-[36px]">{p.tagline}</p>

                  <div className="mt-4 mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-gray-900">{fmt(p.price)}</span>
                      {p.originalPrice > p.price && (
                        <span className="text-sm text-gray-400 line-through">{fmt(p.originalPrice)}</span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md inline-block mt-1">
                      {p.durationDays} Days High-Priority Promotion
                    </span>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-gray-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Included Privileges:</p>
                    {Array.isArray(p.features) && p.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                        <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 mt-6 flex gap-2">
                  <button
                    onClick={() => openEditPlanModal(p)}
                    className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
                  >
                    Edit Plan
                  </button>
                  <button
                    onClick={() => handleDeletePlan(p._id)}
                    className="p-2 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* ── MODAL 1: BOOST A CREATOR PROFILE ── */}
      {/* ══════════════════════════════════════════════════════ */}
      {isManualModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
          onClick={() => setIsManualModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[95vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Rocket size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Boost a Creator Profile</h3>
                  <p className="text-xs text-gray-400">Promote creator on casting searches and charge payment</p>
                </div>
              </div>
              <button onClick={() => setIsManualModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleManualBoostSubmit} className="space-y-4">
              {/* Creator Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Select Creator to Boost *</label>
                <select
                  required
                  value={manualForm.creatorId}
                  onChange={e => setManualForm(p => ({ ...p, creatorId: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-rose-500"
                >
                  <option value="">-- Choose Creator --</option>
                  {creators.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.basicDetails?.fullName || 'Unnamed'} ({c.professionalDetails?.primaryCategory || 'Artist'}) - {c.phone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Package Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Select Boost Plan / Package</label>
                <div className="grid grid-cols-3 gap-2">
                  {plans.map(p => (
                    <button
                      type="button"
                      key={p._id}
                      onClick={() => setManualForm(prev => ({
                        ...prev,
                        planId: p._id,
                        customDays: p.durationDays,
                        amountCharged: p.price
                      }))}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        manualForm.planId === p._id
                          ? 'border-rose-500 bg-rose-50/70 shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <p className="text-[11px] font-black text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs font-bold text-rose-600">{fmt(p.price)}</p>
                      <span className="text-[10px] text-gray-400">{p.durationDays} Days</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Duration & Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Duration (Days) *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={manualForm.customDays}
                    onChange={e => setManualForm(p => ({ ...p, customDays: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Amount Charged (₹) *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={manualForm.amountCharged}
                    onChange={e => setManualForm(p => ({ ...p, amountCharged: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Payment Method & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={manualForm.paymentMethod}
                    onChange={e => setManualForm(p => ({ ...p, paymentMethod: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-rose-500"
                  >
                    <option value="UPI">UPI (GPay / PhonePe)</option>
                    <option value="Razorpay">Razorpay / Online</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="Wallet">Wallet Balance</option>
                    <option value="Admin Free">Admin Free (Complimentary)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Payment Status</label>
                  <select
                    value={manualForm.paymentStatus}
                    onChange={e => setManualForm(p => ({ ...p, paymentStatus: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-rose-500"
                  >
                    <option value="Paid">Paid (Confirmed)</option>
                    <option value="Pending">Pending Payment</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Admin Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Paid via offline invoice / audition priority"
                  value={manualForm.notes}
                  onChange={e => setManualForm(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={manualSubmitting}
                  className="flex-1 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl text-xs font-bold shadow hover:opacity-90 transition disabled:opacity-60"
                >
                  {manualSubmitting ? 'Activating...' : 'Activate & Charge Boost'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* ── MODAL 2: CREATE / EDIT BOOST PLAN ── */}
      {/* ══════════════════════════════════════════════════════ */}
      {isPlanModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
          onClick={() => setIsPlanModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full p-6 space-y-4 max-h-[95vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900">
                {editingPlan ? 'Edit Boost Plan' : 'Create New Boost Plan'}
              </h3>
              <button onClick={() => setIsPlanModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePlanSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Plan Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Pro Visibility Boost"
                  value={planForm.name}
                  onChange={e => setPlanForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Ideal for actors looking for TVC roles"
                  value={planForm.tagline}
                  onChange={e => setPlanForm(p => ({ ...p, tagline: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Duration (Days) *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={planForm.durationDays}
                    onChange={e => setPlanForm(p => ({ ...p, durationDays: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Badge (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Popular, VIP, Hot"
                    value={planForm.badge}
                    onChange={e => setPlanForm(p => ({ ...p, badge: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={planForm.price}
                    onChange={e => setPlanForm(p => ({ ...p, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={planForm.originalPrice}
                    onChange={e => setPlanForm(p => ({ ...p, originalPrice: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Features (comma separated) *</label>
                <textarea
                  rows={3}
                  value={planForm.features}
                  onChange={e => setPlanForm(p => ({ ...p, features: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                  placeholder="Top 3 in search, Home screen banner, Gold badge"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={planForm.isPopular}
                  onChange={e => setPlanForm(p => ({ ...p, isPopular: e.target.checked }))}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="popularCheck" className="text-xs font-semibold text-gray-700">
                  Mark as "Most Popular" / Highlighted Plan
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={planSubmitting}
                  className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow hover:bg-rose-700 transition"
                >
                  {planSubmitting ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* ── MODAL 3: EXTEND BOOST DURATION ── */}
      {/* ══════════════════════════════════════════════════════ */}
      {extendModal.open && (
        <div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
          onClick={() => setExtendModal({ open: false, boostId: null, days: 7 })}
        >
          <div
            className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-sm w-full p-6 space-y-4 text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <Clock size={24} />
            </div>

            <div>
              <h3 className="text-base font-black text-gray-900">Extend Boost Duration</h3>
              <p className="text-xs text-gray-400 mt-1">Add additional days to creator's active spotlight boost</p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[3, 7, 15, 30].map(d => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setExtendModal(p => ({ ...p, days: d }))}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    extendModal.days === d ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  +{d} Days
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setExtendModal({ open: false, boostId: null, days: 7 })}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExtendBoost}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow"
              >
                Confirm (+{extendModal.days} Days)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBoost;
