import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CreditCard, Check, Sparkles, ShieldCheck, Crown, Film,
  Clock, Calendar, ArrowRight, Zap, RefreshCw, X, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

const CompanySubscription = () => {
  const [subscription, setSubscription] = useState({
    planName: 'Pro Production House',
    status: 'Active',
    daysRemaining: 320,
    billingCycle: 'Yearly',
    activeCastingsCount: 3,
    castingsQuota: 50,
    endDate: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000)
  });
  const [plans, setPlans] = useState([]);
  const [billingCycle, setBillingCycle] = useState('Yearly');
  const [loading, setLoading] = useState(true);

  // Upgrade Modal
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  // Fetch Subscription Data
  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API}/company/subscription`, { headers });
      if (res.data?.success) {
        if (res.data.currentSubscription) {
          setSubscription(res.data.currentSubscription);
        }
        setPlans(res.data.plans || []);
      }
    } catch (err) {
      console.error('Fetch subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  // Handle Upgrade Submit
  const handleUpgradeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setUpgrading(true);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const price = billingCycle === 'Yearly' ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice;

      const res = await axios.post(`${API}/company/subscription/upgrade`, {
        planName: selectedPlan.name,
        billingCycle,
        amount: price
      }, { headers });

      if (res.data?.success) {
        setUpgradeSuccess(true);
        setTimeout(() => {
          setUpgradeSuccess(false);
          setSelectedPlan(null);
          fetchSubscription();
        }, 1200);
      }
    } catch (err) {
      console.error('Upgrade error:', err);
      alert(err.response?.data?.message || 'Failed to update subscription');
    } finally {
      setUpgrading(false);
    }
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0b1120] via-[#121c33] to-[#1e1b4b] rounded-3xl p-6 text-white shadow-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center gap-1">
              <Crown size={12} className="text-purple-400" />
              Verified Studio Membership
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Active Plan: {subscription.planName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Studio Membership & Subscription Plans
          </h1>
          <p className="text-xs text-gray-300 max-w-2xl">
            Scale your casting production with unlimited casting notices, zero platform escrow commissions, and priority talent contracting.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <Link
            to="/company/dashboard/wallet"
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition"
          >
            Company Wallet
          </Link>
        </div>
      </div>

      {/* ── Active Subscription Status Card ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/20">
              <Crown size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-gray-900">{subscription.planName}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {subscription.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Billed {subscription.billingCycle || 'Yearly'} • Renews on{' '}
                <b>
                  {subscription.endDate
                    ? new Date(subscription.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                    : 'Annual Renewal'}
                </b>
              </p>
            </div>
          </div>

          <div className="bg-indigo-50/70 border border-indigo-100 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-500 block">Plan Validity</span>
              <p className="text-lg font-black text-indigo-950 mt-0.5">{subscription.daysRemaining || 320} Days Remaining</p>
            </div>
            <Clock size={20} className="text-indigo-600" />
          </div>
        </div>

        {/* Quota & Feature Meters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Casting Notices</span>
            <div className="flex items-center justify-between font-black text-gray-900 text-sm">
              <span>{subscription.activeCastingsCount || 3} Active Calls</span>
              <span className="text-emerald-600 font-bold text-xs">Unlimited Quota</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[25%]" />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Direct Talent Messaging</span>
            <div className="flex items-center justify-between font-black text-gray-900 text-sm">
              <span>Active Chat Enabled</span>
              <span className="text-indigo-600 font-bold text-xs">100% Unlimited</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full w-[100%]" />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Platform Commission Fee</span>
            <div className="flex items-center justify-between font-black text-gray-900 text-sm">
              <span>0% Escrow Fee</span>
              <span className="text-purple-600 font-bold text-xs">Zero Deductions</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full w-[100%]" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Available Membership Plans ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-gray-900">Explore Studio Membership Plans</h2>
            <p className="text-xs text-gray-400">Upgrade or change your production tier anytime</p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="bg-gray-100 p-1 rounded-2xl flex items-center text-xs self-start sm:self-auto border border-gray-200">
            <button
              onClick={() => setBillingCycle('Monthly')}
              className={`px-4 py-1.5 rounded-xl font-bold transition ${
                billingCycle === 'Monthly'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('Yearly')}
              className={`px-4 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                billingCycle === 'Yearly'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>Yearly</span>
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => {
            const isCurrent = subscription.planName?.toLowerCase().includes(p.name?.toLowerCase().slice(0, 5));
            const price = billingCycle === 'Yearly' ? p.yearlyPrice : p.monthlyPrice;

            return (
              <div
                key={p.id || p._id}
                className={`bg-white rounded-3xl p-6 border transition relative flex flex-col justify-between ${
                  p.isPopular
                    ? 'border-purple-300 shadow-xl ring-2 ring-purple-600/10'
                    : 'border-gray-200 shadow-sm hover:shadow-md'
                }`}
              >
                {p.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-[10px] tracking-wide shadow-sm">
                    MOST POPULAR
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">{p.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{p.description}</p>
                  </div>

                  {/* Price */}
                  <div className="py-2 border-y border-gray-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-900">{fmt(price)}</span>
                      <span className="text-xs text-gray-400">/{billingCycle === 'Yearly' ? 'year' : 'month'}</span>
                    </div>
                    {billingCycle === 'Yearly' && (
                      <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
                        Equivalent to {fmt(Math.round(price / 12))}/month
                      </span>
                    )}
                  </div>

                  {/* Features Checklist */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[11px] uppercase font-bold text-gray-400 block">Plan Features:</span>
                    {(p.features || []).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={10} />
                        </div>
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Action CTA */}
                <div className="pt-6">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-2xl bg-gray-100 text-gray-500 font-bold text-xs cursor-default flex items-center justify-center gap-1.5"
                    >
                      <Check size={14} />
                      <span>Current Active Plan</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedPlan(p)}
                      className={`w-full py-2.5 rounded-2xl font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 ${
                        p.isPopular
                          ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                    >
                      <span>Upgrade to {p.name}</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MODAL: CONFIRM PLAN UPGRADE ── */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Crown size={16} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Confirm Plan Upgrade</h3>
                  <p className="text-[11px] text-gray-400">Upgrade studio membership tier</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {upgradeSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <h4 className="text-base font-bold text-gray-900">Plan Upgraded Successfully!</h4>
                <p className="text-xs text-gray-500">Your new studio benefits are active immediately.</p>
              </div>
            ) : (
              <form onSubmit={handleUpgradeSubmit} className="space-y-4 text-xs">
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700">Selected Tier:</span>
                    <span className="font-black text-purple-700 text-sm">{selectedPlan.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700">Billing Cycle:</span>
                    <span className="font-bold text-gray-900">{billingCycle}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-purple-200/60">
                    <span className="font-black text-gray-900">Total Due:</span>
                    <span className="font-black text-gray-900 text-base">
                      {fmt(billingCycle === 'Yearly' ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice)}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500">
                  Payment will be debited from your Company Wallet or logged as corporate invoice settlement.
                </p>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(null)}
                    className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={upgrading}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20 transition flex items-center gap-1.5"
                  >
                    <Sparkles size={13} />
                    <span>{upgrading ? 'Upgrading...' : 'Confirm & Activate'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default CompanySubscription;
