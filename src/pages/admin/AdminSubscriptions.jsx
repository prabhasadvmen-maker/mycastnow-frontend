import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MonitorPlay, Plus, Edit2, Trash2, Power, X, Check,
  IndianRupee, Users, Star, Zap, Shield, Crown, Sparkles,
  CheckCircle, XCircle, ToggleLeft, ToggleRight,
  ChevronDown, ChevronUp, Tag, Calendar, Building2, UserCircle
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

// ─── Badge color config ───────────────────────────────────────────────────────
const BADGE_COLORS = {
  gray:   { card: 'border-gray-200',   badge: 'bg-gray-100 text-gray-600',     btn: 'bg-gray-500',    gradient: 'from-gray-400 to-gray-600' },
  blue:   { card: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700',     btn: 'bg-blue-600',    gradient: 'from-blue-500 to-blue-700' },
  purple: { card: 'border-purple-300', badge: 'bg-purple-100 text-purple-700', btn: 'bg-purple-600',  gradient: 'from-purple-500 to-fuchsia-600' },
  gold:   { card: 'border-yellow-400', badge: 'bg-yellow-100 text-yellow-700', btn: 'bg-yellow-500',  gradient: 'from-yellow-400 to-orange-500' },
};

const AUDIENCE_BADGE = {
  Creator: 'bg-fuchsia-100 text-fuchsia-700',
  Company: 'bg-blue-100 text-blue-700',
  Both:    'bg-green-100 text-green-700',
};

const STATUS_COLORS = {
  Active:    'bg-green-100 text-green-700',
  Expired:   'bg-red-100 text-red-600',
  Cancelled: 'bg-gray-100 text-gray-600',
  Trial:     'bg-amber-100 text-amber-700',
};

const EMPTY_FORM = {
  name: '', description: '', targetAudience: 'Both',
  monthlyPrice: '', yearlyPrice: '',
  features: [''],
  maxCastingApplications: -1, maxPortfolioPhotos: -1, maxBookingsPerMonth: -1,
  prioritySupport: false, verifiedBadge: false, featuredListing: false,
  badgeColor: 'blue', isPopular: false, trialDays: 0, isActive: true, sortOrder: 0
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>}
    </div>
  </div>
);

// ─── Plan Card ────────────────────────────────────────────────────────────────
const PlanCard = ({ plan, onEdit, onDelete, onToggle }) => {
  const colors = BADGE_COLORS[plan.badgeColor] || BADGE_COLORS.blue;
  const formatPrice = (p) => p > 0 ? `₹${p.toLocaleString('en-IN')}` : 'Free';

  return (
    <div className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all hover:shadow-md ${colors.card} ${!plan.isActive ? 'opacity-60' : ''}`}>
      {/* Card Header */}
      <div className={`bg-gradient-to-br ${colors.gradient} p-5 text-white relative`}>
        {plan.isPopular && (
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Star size={11} fill="white" /> Popular
          </div>
        )}
        {!plan.isActive && (
          <div className="absolute top-3 left-3 bg-black/30 px-2 py-0.5 rounded text-[10px] font-bold">INACTIVE</div>
        )}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-xs border border-white/20">
            {plan.targetAudience === 'Both' ? '👥 Both Panels (Creator & Company)' : plan.targetAudience === 'Creator' ? '🎨 Creators Only' : '🏢 Companies Only'}
          </span>
        </div>
        <h3 className="text-2xl font-black">{plan.name}</h3>
        {plan.description && <p className="text-white/80 text-xs mt-1 line-clamp-2">{plan.description}</p>}

        <div className="mt-4 flex items-end gap-3">
          <div>
            <span className="text-3xl font-black">{formatPrice(plan.monthlyPrice)}</span>
            {plan.monthlyPrice > 0 && <span className="text-white/70 text-sm">/mo</span>}
          </div>
          {plan.yearlyPrice > 0 && (
            <div className="text-sm text-white/80">
              {formatPrice(plan.yearlyPrice)}<span className="text-white/60">/yr</span>
            </div>
          )}
        </div>
        {plan.trialDays > 0 && (
          <p className="text-xs text-white/80 mt-1">{plan.trialDays}-day free trial</p>
        )}
      </div>

      {/* Features */}
      <div className="p-5">
        <ul className="space-y-2 mb-5">
          {plan.features.slice(0, 6).map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
          {plan.features.length > 6 && (
            <li className="text-xs text-gray-400 pl-5">+{plan.features.length - 6} more features</li>
          )}
          {plan.features.length === 0 && (
            <li className="text-xs text-gray-400 italic">No features listed</li>
          )}
        </ul>

        {/* Limits row */}
        <div className="flex flex-wrap gap-2 mb-5">
          {plan.verifiedBadge && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold flex items-center gap-1"><Shield size={9} />Verified</span>}
          {plan.prioritySupport && <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-1 rounded-full font-bold flex items-center gap-1"><Zap size={9} />Priority</span>}
          {plan.featuredListing && <span className="text-[10px] bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full font-bold flex items-center gap-1"><Star size={9} />Featured</span>}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(plan)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 rounded-xl text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
          >
            <Edit2 size={14} /> Edit
          </button>
          <button
            onClick={() => onToggle(plan._id)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition border ${plan.isActive ? 'border-orange-200 text-orange-600 hover:bg-orange-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
            title={plan.isActive ? 'Deactivate Plan' : 'Activate Plan'}
          >
            {plan.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          </button>
          <button
            onClick={() => onDelete(plan._id, plan.name)}
            className="flex items-center justify-center px-3 py-2 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminSubscriptions = () => {
  const [plans, setPlans]               = useState([]);
  const [stats, setStats]               = useState(null);
  const [subscribers, setSubscribers]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState('plans'); // 'plans' | 'subscribers'
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editPlan, setEditPlan]         = useState(null);   // null = create mode
  const [formData, setFormData]         = useState(EMPTY_FORM);
  const [formLoading, setFormLoading]   = useState(false);
  const [newFeature, setNewFeature]     = useState('');
  const [filterAudience, setFilterAudience] = useState('All'); // 'All' | 'Both' | 'Creator' | 'Company'

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const [plansRes, statsRes] = await Promise.all([
        axios.get(`${API}/admin/subscriptions/plans`),
        axios.get(`${API}/admin/subscriptions/plans/stats`)
      ]);
      setPlans(plansRes.data);
      setStats(statsRes.data);
    } catch (e) {
      console.error('Failed to fetch plans:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const res = await axios.get(`${API}/admin/subscriptions/subscribers`);
      setSubscribers(res.data);
    } catch (e) {
      console.error('Failed to fetch subscribers:', e);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchSubscribers();
  }, []);

  // ── Open Modal ─────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditPlan(null);
    setFormData(EMPTY_FORM);
    setNewFeature('');
    setIsModalOpen(true);
  };

  const openEdit = (plan) => {
    setEditPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      targetAudience: plan.targetAudience,
      monthlyPrice: plan.monthlyPrice,
      yearlyPrice: plan.yearlyPrice,
      features: plan.features.length > 0 ? plan.features : [''],
      maxCastingApplications: plan.maxCastingApplications,
      maxPortfolioPhotos: plan.maxPortfolioPhotos,
      maxBookingsPerMonth: plan.maxBookingsPerMonth,
      prioritySupport: plan.prioritySupport,
      verifiedBadge: plan.verifiedBadge,
      featuredListing: plan.featuredListing,
      badgeColor: plan.badgeColor,
      isPopular: plan.isPopular,
      trialDays: plan.trialDays,
      isActive: plan.isActive,
      sortOrder: plan.sortOrder
    });
    setNewFeature('');
    setIsModalOpen(true);
  };

  // ── Feature list handlers ──────────────────────────────────────────────────
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(p => ({ ...p, features: [...p.features, newFeature.trim()] }));
      setNewFeature('');
    }
  };

  const removeFeature = (idx) => {
    setFormData(p => ({ ...p, features: p.features.filter((_, i) => i !== idx) }));
  };

  const updateFeature = (idx, val) => {
    setFormData(p => {
      const f = [...p.features];
      f[idx] = val;
      return { ...p, features: f };
    });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = {
        ...formData,
        features: formData.features.filter(f => f.trim()),
        monthlyPrice: Number(formData.monthlyPrice) || 0,
        yearlyPrice: Number(formData.yearlyPrice) || 0,
        trialDays: Number(formData.trialDays) || 0,
        sortOrder: Number(formData.sortOrder) || 0,
      };

      if (editPlan) {
        await axios.put(`${API}/admin/subscriptions/plans/${editPlan._id}`, payload);
      } else {
        await axios.post(`${API}/admin/subscriptions/plans`, payload);
      }
      setIsModalOpen(false);
      fetchPlans();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save plan');
    } finally {
      setFormLoading(false);
    }
  };

  // ── Toggle active ──────────────────────────────────────────────────────────
  const handleToggle = async (planId) => {
    try {
      const res = await axios.put(`${API}/admin/subscriptions/plans/${planId}/toggle`);
      setPlans(prev => prev.map(p => p._id === planId ? res.data : p));
    } catch {
      alert('Failed to toggle plan');
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (planId, planName) => {
    if (!window.confirm(`Delete plan "${planName}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/admin/subscriptions/plans/${planId}`);
      setPlans(prev => prev.filter(p => p._id !== planId));
    } catch {
      alert('Failed to delete plan');
    }
  };

  // ── Subscriber cancel ──────────────────────────────────────────────────────
  const handleCancelSub = async (subId) => {
    if (!window.confirm('Cancel this subscription?')) return;
    try {
      const res = await axios.put(`${API}/admin/subscriptions/subscribers/${subId}`, { status: 'Cancelled' });
      setSubscribers(prev => prev.map(s => s._id === subId ? res.data : s));
    } catch {
      alert('Failed to cancel subscription');
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const formatPrice = (n) => n > 0 ? `₹${Number(n).toLocaleString('en-IN')}` : 'Free';

  const ColorDot = ({ color, selected, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-8 h-8 rounded-full bg-gradient-to-br ${BADGE_COLORS[color]?.gradient || ''} transition-all ${selected ? 'ring-4 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`}
    />
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MonitorPlay className="text-purple-600" size={26} />
            Subscription Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage subscription plans for Creators and Companies.
          </p>
        </div>
        {activeTab === 'plans' && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:opacity-90 transition-opacity"
          >
            <Plus size={18} /> Create Plan
          </button>
        )}
      </div>

      {/* ── Stats ── */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Total Plans"       value={stats.totalPlans}       icon={MonitorPlay}  color="bg-purple-50 text-purple-600" />
          <StatCard title="Active Plans"      value={stats.activePlans}      icon={ToggleRight}  color="bg-green-50 text-green-600" />
          <StatCard title="Total Subscribers" value={stats.totalSubscribers} icon={Users}        color="bg-blue-50 text-blue-600" />
          <StatCard title="Active Subs"       value={stats.activeSubscribers} icon={CheckCircle} color="bg-emerald-50 text-emerald-600" />
          <StatCard title="Total Revenue"     value={formatPrice(stats.totalRevenue)} icon={IndianRupee} color="bg-yellow-50 text-yellow-600" subtext="All time" />
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { key: 'plans', label: 'Subscription Plans', icon: MonitorPlay },
          { key: 'subscribers', label: 'Subscribers', icon: Users }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === t.key ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <t.icon size={16} /> {t.label}
            {t.key === 'subscribers' && subscribers.length > 0 && (
              <span className="bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{subscribers.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Plans Grid ── */}
      {activeTab === 'plans' && (
        loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : plans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MonitorPlay size={28} className="text-purple-300" />
            </div>
            <p className="text-gray-600 font-bold text-lg">No Subscription Plans Yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-5">Create your first plan to get started</p>
            <button
              onClick={openCreate}
              className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition"
            >
              <Plus size={16} className="inline mr-1" /> Create First Plan
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Audience filter tabs */}
            <div className="flex flex-wrap items-center gap-2 pb-1">
              {[
                { key: 'All', label: 'All Plans', count: plans.length },
                { key: 'Both', label: '👥 Both Panels', count: plans.filter(p => p.targetAudience === 'Both').length },
                { key: 'Creator', label: '🎨 Creators Only', count: plans.filter(p => p.targetAudience === 'Creator').length },
                { key: 'Company', label: '🏢 Companies Only', count: plans.filter(p => p.targetAudience === 'Company').length },
              ].map(f => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilterAudience(f.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    filterAudience === f.key
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                    filterAudience === f.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Plans list */}
            {plans.filter(p => filterAudience === 'All' || p.targetAudience === filterAudience).length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-sm text-gray-500">
                No plans found for audience "{filterAudience}". Click "Create Plan" to add one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {plans
                  .filter(p => filterAudience === 'All' || p.targetAudience === filterAudience)
                  .map(plan => (
                    <PlanCard
                      key={plan._id}
                      plan={plan}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                      onToggle={handleToggle}
                    />
                  ))}
              </div>
            )}
          </div>
        )
      )}

      {/* ── Subscribers Table ── */}
      {activeTab === 'subscribers' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-gray-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-4 px-5">#</th>
                  <th className="py-4 px-5">User</th>
                  <th className="py-4 px-5">Type</th>
                  <th className="py-4 px-5">Plan</th>
                  <th className="py-4 px-5">Billing</th>
                  <th className="py-4 px-5">Amount</th>
                  <th className="py-4 px-5">Expires</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-16 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users size={22} className="text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-sm">No subscribers yet</p>
                    </td>
                  </tr>
                ) : subscribers.map((sub, idx) => {
                  const colors = BADGE_COLORS[sub.plan?.badgeColor] || BADGE_COLORS.blue;
                  return (
                    <tr key={sub._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-5 text-gray-400">{idx + 1}</td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${sub.userType === 'Company' ? 'bg-blue-100' : 'bg-fuchsia-100'}`}>
                            {sub.userType === 'Company' ? <Building2 size={14} className="text-blue-500" /> : <UserCircle size={14} className="text-fuchsia-500" />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{sub.userName || sub.userId}</p>
                            <p className="text-xs text-gray-400">{sub.userContact}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${AUDIENCE_BADGE[sub.userType] || ''}`}>{sub.userType}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors.badge}`}>{sub.plan?.name || 'Unknown'}</span>
                      </td>
                      <td className="py-4 px-5 text-gray-600 capitalize">{sub.billingCycle}</td>
                      <td className="py-4 px-5 font-bold text-gray-800">
                        {sub.amountPaid > 0 ? `₹${sub.amountPaid.toLocaleString('en-IN')}` : 'Free'}
                      </td>
                      <td className="py-4 px-5 text-gray-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-gray-400" />
                          {formatDate(sub.endDate)}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[sub.status] || 'bg-gray-100 text-gray-600'}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        {sub.status === 'Active' && (
                          <button
                            onClick={() => handleCancelSub(sub._id)}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"
                            title="Cancel Subscription"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
           CREATE / EDIT PLAN MODAL
      ═══════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  {editPlan ? <Edit2 className="text-purple-600" size={20} /> : <Plus className="text-purple-600" size={20} />}
                  {editPlan ? `Edit Plan — ${editPlan.name}` : 'Create New Subscription Plan'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editPlan ? 'Update plan details below' : 'Fill in the details to create a new subscription plan'}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">

              {/* ── Basic Info ── */}
              <section>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Tag size={15} className="text-purple-500" /> Basic Info
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="form-label">Plan Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Pro Creator, Business"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Brief description of this plan..."
                      value={formData.description}
                      onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                      className="form-input resize-none"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="form-label">Target Audience *</label>
                    <select value={formData.targetAudience} onChange={e => setFormData(p => ({ ...p, targetAudience: e.target.value }))} className="form-select">
                      <option value="Both">Both (Creators & Companies)</option>
                      <option value="Creator">Creators Only</option>
                      <option value="Company">Companies Only</option>
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="form-label">Sort Order</label>
                    <input type="number" min="0" value={formData.sortOrder} onChange={e => setFormData(p => ({ ...p, sortOrder: e.target.value }))} className="form-input" placeholder="0" />
                  </div>
                  <div className="col-span-2 p-3 rounded-xl text-xs flex items-start gap-2.5 border bg-purple-50/70 border-purple-200 text-purple-900">
                    <Sparkles size={16} className="text-purple-600 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      {formData.targetAudience === 'Both' && (
                        <span>
                          <strong>Visibility: Both Panels.</strong> This plan will dynamically appear on <strong>both Creator Subscription Panel</strong> and <strong>Company Subscription Panel</strong>, and on all public website plan sections.
                        </span>
                      )}
                      {formData.targetAudience === 'Creator' && (
                        <span>
                          <strong>Visibility: Creator Only.</strong> This plan will appear <strong>only on the Creator Subscription Panel</strong> and website creator filter. It will <strong>NOT</strong> appear on the Company panel.
                        </span>
                      )}
                      {formData.targetAudience === 'Company' && (
                        <span>
                          <strong>Visibility: Company Only.</strong> This plan will appear <strong>only on the Company Subscription Panel</strong> and website production filter. It will <strong>NOT</strong> appear on the Creator panel.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* ── Pricing ── */}
              <section>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <IndianRupee size={15} className="text-purple-500" /> Pricing
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Monthly Price (₹)</label>
                    <input type="number" min="0" placeholder="0 = Free" value={formData.monthlyPrice} onChange={e => setFormData(p => ({ ...p, monthlyPrice: e.target.value }))} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Yearly Price (₹)</label>
                    <input type="number" min="0" placeholder="Optional" value={formData.yearlyPrice} onChange={e => setFormData(p => ({ ...p, yearlyPrice: e.target.value }))} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Trial Days</label>
                    <input type="number" min="0" placeholder="0 = No trial" value={formData.trialDays} onChange={e => setFormData(p => ({ ...p, trialDays: e.target.value }))} className="form-input" />
                  </div>
                </div>
              </section>

              {/* ── Features List ── */}
              <section>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <CheckCircle size={15} className="text-purple-500" /> Features
                </h3>
                <div className="space-y-2 mb-3">
                  {formData.features.map((f, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={f}
                        onChange={e => updateFeature(i, e.target.value)}
                        placeholder={`Feature ${i + 1}`}
                        className="form-input flex-1"
                      />
                      <button type="button" onClick={() => removeFeature(i)} className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition border border-red-100">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={e => setNewFeature(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    placeholder="Type a feature and press Add..."
                    className="form-input flex-1"
                  />
                  <button type="button" onClick={addFeature} className="px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition flex items-center gap-1">
                    <Plus size={14} /> Add
                  </button>
                </div>
              </section>

              {/* ── Limits ── */}
              <section>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Shield size={15} className="text-purple-500" /> Limits (-1 = Unlimited)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Casting Applications</label>
                    <input type="number" min="-1" value={formData.maxCastingApplications} onChange={e => setFormData(p => ({ ...p, maxCastingApplications: Number(e.target.value) }))} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Portfolio Photos</label>
                    <input type="number" min="-1" value={formData.maxPortfolioPhotos} onChange={e => setFormData(p => ({ ...p, maxPortfolioPhotos: Number(e.target.value) }))} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Bookings/Month</label>
                    <input type="number" min="-1" value={formData.maxBookingsPerMonth} onChange={e => setFormData(p => ({ ...p, maxBookingsPerMonth: Number(e.target.value) }))} className="form-input" />
                  </div>
                </div>
              </section>

              {/* ── Perks ── */}
              <section>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Star size={15} className="text-purple-500" /> Perks & Display
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    { key: 'prioritySupport', label: 'Priority Support', icon: Zap },
                    { key: 'verifiedBadge', label: 'Verified Badge', icon: Shield },
                    { key: 'featuredListing', label: 'Featured Listing', icon: Star },
                    { key: 'isPopular', label: 'Mark as Popular', icon: Crown },
                  ].map(({ key, label, icon: Icon }) => (
                    <label key={key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition select-none">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition ${formData[key] ? 'bg-purple-600 border-purple-600' : 'border-gray-300'}`}>
                        {formData[key] && <Check size={12} className="text-white" />}
                      </div>
                      <input type="checkbox" checked={formData[key]} onChange={e => setFormData(p => ({ ...p, [key]: e.target.checked }))} className="hidden" />
                      <Icon size={14} className={formData[key] ? 'text-purple-600' : 'text-gray-400'} />
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>

                {/* Badge color */}
                <div>
                  <label className="form-label mb-2">Card Color</label>
                  <div className="flex items-center gap-3">
                    {Object.keys(BADGE_COLORS).map(c => (
                      <ColorDot key={c} color={c} selected={formData.badgeColor === c} onClick={() => setFormData(p => ({ ...p, badgeColor: c }))} />
                    ))}
                    <span className="text-xs text-gray-400 capitalize ml-2">Selected: {formData.badgeColor}</span>
                  </div>
                </div>
              </section>

              {/* ── Active toggle ── */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div className={`relative w-12 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-purple-600' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${formData.isActive ? 'left-6' : 'left-0.5'}`} />
                </div>
                <input type="checkbox" checked={formData.isActive} onChange={e => setFormData(p => ({ ...p, isActive: e.target.checked }))} className="hidden" />
                <span className="text-sm font-semibold text-gray-700">
                  {formData.isActive ? 'Plan is Active (visible to users)' : 'Plan is Inactive (hidden from users)'}
                </span>
              </label>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={formLoading} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-60">
                  {formLoading ? 'Saving...' : editPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ColorDot component
const ColorDot = ({ color, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-8 h-8 rounded-full bg-gradient-to-br ${BADGE_COLORS[color]?.gradient || ''} transition-all ${selected ? 'ring-4 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`}
  />
);

export default AdminSubscriptions;
