import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import {
  CreditCard, Check, Sparkles, ShieldCheck, Zap,
  CheckCircle2, AlertCircle, RefreshCw, X, ArrowRight,
  Star, Award
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const CreatorSubscription = () => {
  const { creatorUser } = useCreatorAuth();
  const [subData, setSubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [annualBilling, setAnnualBilling] = useState(false);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState(null);
  const [upgrading, setUpgrading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API}/creator/portal/subscription`, { headers });
      if (res.data?.success) {
        setSubData(res.data);
      }
    } catch (err) {
      console.error('Error fetching subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleUpgradeSubmit = async (plan) => {
    try {
      setUpgrading(true);
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(`${API}/creator/portal/subscription/upgrade`, {
        planName: plan.name,
        billingCycle: annualBilling ? 'Yearly' : 'Monthly'
      }, { headers });

      if (res.data?.success) {
        showToast(`Upgraded to ${plan.name} successfully!`);
        setSelectedPlanForUpgrade(null);
        fetchSubscription();
      }
    } catch (err) {
      showToast('Failed to upgrade subscription', 'error');
    } finally {
      setUpgrading(false);
    }
  };

  const currentPlan = subData?.currentPlan || {
    planName: 'Pro Creator VIP',
    price: 999,
    status: 'Active',
    expiryDate: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000),
    features: [
      'Unlimited Casting Call Applications',
      'Verified Talent Badge on Search',
      'Direct Messaging with Casting Directors',
      '0% Platform Booking Commission',
      'Priority Audition Listing'
    ]
  };

  const plans = subData?.plans || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200 ${
            toast.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} className="text-emerald-600" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#180a22] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-purple-800/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-fuchsia-200">
              <Zap size={13} className="text-yellow-400" />
              <span>Membership & Benefits</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Talent Subscription & Badges
            </h1>
            <p className="text-purple-200 text-xs md:text-sm max-w-xl">
              Unlock unlimited casting applications, verified blue checkmark, and zero platform commissions.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-right">
            <span className="text-[10px] uppercase font-bold text-purple-200 block">Current Membership</span>
            <h3 className="text-xl font-black text-white flex items-center gap-1.5 justify-end">
              <Sparkles size={16} className="text-yellow-400" /> {currentPlan.planName}
            </h3>
            <span className="text-[11px] text-emerald-300 font-semibold mt-0.5 block">
              Active • Valid for 85 days
            </span>
          </div>
        </div>
      </div>

      {/* ACTIVE PLAN PERKS HIGHLIGHT CARD */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
              Active Tier
            </span>
            <h3 className="font-black text-base text-gray-900">{currentPlan.planName}</h3>
          </div>
          <p className="text-xs text-gray-500">
            Enjoy full platform privileges with zero commission on all direct bookings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {currentPlan.features?.slice(0, 3).map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold"
            >
              <CheckCircle2 size={13} className="text-purple-600" />
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* BILLING TOGGLE */}
      <div className="flex items-center justify-center gap-3 pt-4">
        <span className={`text-xs font-bold ${!annualBilling ? 'text-gray-900' : 'text-gray-400'}`}>
          Monthly Billing
        </span>
        <button
          onClick={() => setAnnualBilling(!annualBilling)}
          className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
            annualBilling ? 'bg-purple-600' : 'bg-gray-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-sm ${
              annualBilling ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-xs font-bold flex items-center gap-1 ${annualBilling ? 'text-gray-900' : 'text-gray-400'}`}>
          Annual Billing
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black">
            Save 20%
          </span>
        </span>
      </div>

      {/* PLANS COMPARISON GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-sm text-gray-400">Loading plans from database...</div>
        ) : plans.length === 0 ? (
          <div className="col-span-full py-16 text-center text-sm text-gray-400">No creator subscription plans found.</div>
        ) : (
          plans.map((plan) => {
            const isCurrent = plan.name === currentPlan.planName;
            const displayPrice = annualBilling ? Math.round(plan.price * 0.8) : plan.price;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between relative ${
                plan.popular
                  ? 'border-purple-500 shadow-xl ring-2 ring-purple-500/20'
                  : 'border-gray-100 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-black text-[10px] tracking-wider uppercase shadow-md">
                  Most Popular for Creators
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-black text-lg text-gray-900">{plan.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-black text-gray-900">
                    ₹{displayPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">
                    {plan.price === 0 ? '' : annualBilling ? '/ mo (billed yearly)' : '/ month'}
                  </span>
                </div>

                <div className="h-px bg-gray-100"></div>

                <ul className="space-y-2.5">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check size={11} />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                {isCurrent ? (
                  <div className="w-full py-2.5 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200">
                    <CheckCircle2 size={14} />
                    <span>Your Current Active Plan</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpgradeSubmit(plan)}
                    disabled={upgrading}
                    className={`w-full py-2.5 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      plan.popular
                        ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/30'
                        : 'bg-gray-900 hover:bg-black text-white'
                    }`}
                  >
                    <span>{plan.price === 0 ? 'Switch to Free' : 'Upgrade Plan'}</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
      </div>
    </div>
  );
};

export default CreatorSubscription;
