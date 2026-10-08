import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Crown, CheckCircle2, ShieldCheck, Sparkles, Zap, Star, HelpCircle, ArrowRight, Loader2, RotateCw, RotateCcw, Check, ZapOff, Film, Video, Shield } from 'lucide-react';
import PublicLayout from '../../components/public/PublicLayout';

let API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
if (API && !API.includes('/api')) {
  API = API.replace(/\/+$/, '') + '/api';
}
if (typeof window !== 'undefined') {
  const host = window.location.hostname;
  if (host !== 'localhost' && host !== '127.0.0.1') {
    if (!import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL.includes('localhost') || import.meta.env.VITE_API_URL.includes('127.0.0.1')) {
      API = 'https://mycastnow-backend.onrender.com/api';
    }
  }
}

const DEFAULT_PLANS = [
  {
    _id: 'plan_creator_starter',
    name: 'Artist Free Starter',
    description: 'Essential casting presence for emerging actors, models, and voice artists.',
    targetAudience: 'Creator',
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: 'INR',
    features: ['Up to 5 Casting Submissions/mo', 'Upload 6 Portfolio Photos', 'Verified Artist Profile Search', 'Standard Support'],
    maxCastingApplications: 5,
    maxPortfolioPhotos: 6,
    maxBookingsPerMonth: 2,
    prioritySupport: false,
    verifiedBadge: false,
    featuredListing: false,
    badgeColor: 'blue',
    isPopular: false,
    trialDays: 0,
    isActive: true
  },
  {
    _id: 'plan_creator_pro',
    name: 'Creator Spotlight Pro',
    description: 'Maximum audition reach, direct casting director alerts, and verified credibility.',
    targetAudience: 'Creator',
    monthlyPrice: 999,
    yearlyPrice: 9990,
    currency: 'INR',
    features: ['Unlimited Casting Applications', 'Unlimited Portfolio & Video Reels', 'Blue Verified Artist Checkmark', 'Priority Audition Screening', 'Instant WhatsApp Casting Alerts', 'Direct Chat with Production Houses'],
    maxCastingApplications: -1,
    maxPortfolioPhotos: -1,
    maxBookingsPerMonth: -1,
    prioritySupport: true,
    verifiedBadge: true,
    featuredListing: true,
    badgeColor: 'purple',
    isPopular: true,
    trialDays: 7,
    isActive: true
  },
  {
    _id: 'plan_company_studio',
    name: 'Production Studio Suite',
    description: 'Powerful casting pipeline, talent search, and escrow-protected hiring for studios & agencies.',
    targetAudience: 'Company',
    monthlyPrice: 4999,
    yearlyPrice: 49990,
    currency: 'INR',
    features: ['Unlimited Live Casting Calls', 'Full Access to 10,000+ Verified Artists', 'Automated Audition Video Submissions', '100% Escrow Protected Contracts', 'Team Collaboration Dashboard', 'Dedicated Casting Support Manager'],
    maxCastingApplications: -1,
    maxPortfolioPhotos: -1,
    maxBookingsPerMonth: -1,
    prioritySupport: true,
    verifiedBadge: true,
    featuredListing: true,
    badgeColor: 'gold',
    isPopular: false,
    trialDays: 14,
    isActive: true
  },
  {
    _id: 'plan_company_enterprise',
    name: 'Enterprise Production Agency',
    description: 'Full studio talent scouting, unlimited hiring pipelines, dedicated casting director support & NDA protection.',
    targetAudience: 'Company',
    monthlyPrice: 9999,
    yearlyPrice: 99990,
    currency: 'INR',
    features: ['Unlimited Priority Casting Calls', 'Direct Artist Contact & WhatsApp Desk', 'Custom Talent Audition Pipelines', 'VIP Executive Account Manager', 'Custom Escrow & Billing Invoicing', 'Featured Casting Calls Placement'],
    maxCastingApplications: -1,
    maxPortfolioPhotos: -1,
    maxBookingsPerMonth: -1,
    prioritySupport: true,
    verifiedBadge: true,
    featuredListing: true,
    badgeColor: 'purple',
    isPopular: true,
    trialDays: 14,
    isActive: true
  }
];

// Interactive 3D Flip Card Component (Hover to Flip)
function FlipPlanCard({ plan, billingCycle }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const isPopular = plan.isPopular;

  return (
    <div
      className="group [perspective:1000px] w-full min-h-[530px]"
      onClick={() => setIsFlipped((prev) => !prev)}
    >
      <div
        className={`relative w-full h-full duration-700 [transform-style:preserve-3d] transition-transform ease-in-out rounded-3xl group-hover:[transform:rotateY(180deg)] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* ────────────────── FRONT FACE ────────────────── */}
        <div
          className={`absolute inset-0 w-full h-full bg-white rounded-3xl p-7 border transition-all duration-300 flex flex-col justify-between [backface-visibility:hidden] ${
            isPopular
              ? 'border-purple-500 shadow-2xl ring-2 ring-purple-600/20'
              : 'border-slate-200/90 shadow-xl hover:shadow-2xl'
          }`}
        >
          {isPopular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 z-20">
              <Sparkles size={12} className="text-yellow-300 fill-yellow-300" /> Most Popular
            </div>
          )}

          <div>
            {/* Header badges */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase tracking-wider">
                {(plan.targetAudience || '').toLowerCase().includes('creator') || (plan.targetAudience || '').toLowerCase().includes('artist') ? 'Artist & Creator' : 'Production House'}
              </span>
              {plan.verifiedBadge && (
                <span className="text-emerald-600 flex items-center gap-1 text-[11px] font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck size={14} /> Blue Badge
                </span>
              )}
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">{plan.name}</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 min-h-[36px]">{plan.description}</p>

            {/* Price tag */}
            <div className="mb-6 pb-5 border-b border-slate-100">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">
                  {price > 0 ? `₹${price.toLocaleString('en-IN')}` : 'Free'}
                </span>
                {price > 0 && (
                  <span className="text-xs text-slate-500 font-bold"> / {billingCycle === 'yearly' ? 'year' : 'month'}</span>
                )}
              </div>
              {billingCycle === 'yearly' && price > 0 && (
                <p className="text-[11px] font-semibold text-emerald-600 mt-1">
                  Effective ₹{Math.round(price / 12).toLocaleString('en-IN')}/mo (save 20%)
                </p>
              )}
            </div>

            {/* Key Features List */}
            <ul className="space-y-2.5 mb-6">
              {plan.features?.slice(0, 4).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <div className="w-full py-2 px-3 rounded-xl bg-purple-50 group-hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 pointer-events-none">
              <RotateCw size={13} />
              <span>Hover or Click to Flip Details</span>
            </div>

            <Link
              to={(plan.targetAudience || '').toLowerCase().includes('company') || (plan.targetAudience || '').toLowerCase().includes('production') ? '/company/signup' : '/creator/signup'}
              onClick={(e) => e.stopPropagation()}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs text-center transition-all flex items-center justify-center gap-2 shadow-md ${
                isPopular
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-600/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <span>Get Started Now</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ────────────────── BACK FACE (FLIPPED REVEAL) ────────────────── */}
        <div
          className={`absolute inset-0 w-full h-full bg-slate-950 text-white rounded-3xl p-7 border border-purple-500/50 shadow-2xl flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden]`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-black uppercase text-purple-400 tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-yellow-400" /> Full Plan Specs
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                <RotateCcw size={12} /> Flipped
              </span>
            </div>

            <h4 className="text-lg font-black text-white mb-4">{plan.name}</h4>

            {/* Spec Highlights Grid */}
            <div className="space-y-3 text-xs">
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Audition Submissions:</span>
                <span className="font-extrabold text-emerald-400">
                  {plan.maxCastingApplications === -1 ? 'Unlimited Auditions' : `${plan.maxCastingApplications} / month`}
                </span>
              </div>

              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Portfolio Media Uploads:</span>
                <span className="font-extrabold text-purple-300">
                  {plan.maxPortfolioPhotos === -1 ? 'Unlimited Photos & Reels' : `Up to ${plan.maxPortfolioPhotos} Uploads`}
                </span>
              </div>

              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Blue Verified Checkmark:</span>
                <span className="font-extrabold text-white">
                  {plan.verifiedBadge ? 'Included ✓' : 'Not Included'}
                </span>
              </div>

              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Priority Support & Alerts:</span>
                <span className="font-extrabold text-amber-300">
                  {plan.prioritySupport ? '24/7 Dedicated Manager' : 'Standard Ticket Support'}
                </span>
              </div>

              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-medium">100% Escrow Protection:</span>
                <span className="font-extrabold text-emerald-400">Guaranteed ✓</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-800">
            <div className="w-full py-2 px-3 rounded-xl bg-slate-900 text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5 pointer-events-none">
              <RotateCcw size={13} />
              <span>Move Cursor Away to Flip Back</span>
            </div>

            <Link
              to={(plan.targetAudience || '').toLowerCase().includes('company') || (plan.targetAudience || '').toLowerCase().includes('production') ? '/company/signup' : '/creator/signup'}
              onClick={(e) => e.stopPropagation()}
              className="w-full py-3.5 rounded-2xl font-bold text-xs text-center transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white shadow-lg shadow-purple-600/30"
            >
              <span>Subscribe & Get Started</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [audienceFilter, setAudienceFilter] = useState('Creator');

  useEffect(() => {
    let active = true;
    axios.get(`${API}/public/plans`)
      .then(({ data }) => {
        if (active && data?.success && Array.isArray(data.plans) && data.plans.length > 0) {
          let fetchedPlans = data.plans;
          const hasCompanyPlan = fetchedPlans.some(p => {
            const t = (p.targetAudience || '').toLowerCase();
            return t === 'company' || t === 'production' || t === 'studio' || t === 'agency' || t === 'both' || t === 'all';
          });
          if (!hasCompanyPlan) {
            const defaultCompanyPlans = DEFAULT_PLANS.filter(p => p.targetAudience === 'Company');
            fetchedPlans = [...fetchedPlans, ...defaultCompanyPlans];
          }
          setPlans(fetchedPlans);
        } else if (active) {
          setPlans(DEFAULT_PLANS);
        }
      })
      .catch((err) => {
        console.error('Error loading plans:', err);
        if (active) setPlans(DEFAULT_PLANS);
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const activePlans = plans.length > 0 ? plans : DEFAULT_PLANS;

  const displayedPlans = useMemo(() => {
    const list = activePlans.filter((p) => {
      if (audienceFilter === 'All') return true;
      const target = (p.targetAudience || '').toLowerCase();
      const filter = audienceFilter.toLowerCase();
      if (filter === 'creator') {
        return target === 'creator' || target === 'artist' || target === 'all' || target === 'both' || target.includes('creator') || target.includes('artist');
      }
      if (filter === 'company') {
        return target === 'company' || target === 'production' || target === 'studio' || target === 'agency' || target === 'recruiter' || target === 'all' || target === 'both' || target.includes('company') || target.includes('production');
      }
      return target === filter || target === 'both' || target === 'all';
    });

    if (list.length === 0 && audienceFilter === 'Company') {
      return DEFAULT_PLANS.filter(p => p.targetAudience === 'Company');
    }
    if (list.length === 0 && audienceFilter === 'Creator') {
      return DEFAULT_PLANS.filter(p => p.targetAudience === 'Creator');
    }

    return list;
  }, [activePlans, audienceFilter]);

  return (
    <PublicLayout>
      {/* ────────────────── HERO BANNER ────────────────── */}
      <section className="bg-slate-950 text-white py-16 md:py-24 text-center relative overflow-hidden border-b border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-xs font-bold text-purple-300 mb-6">
            <Crown size={14} className="text-yellow-400" />
            <span>TRANSPARENT & FAIR MEMBERSHIPS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
            Plans Built for Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-300">Craft & Scale</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Choose a verified artist or production studio membership. Direct bookings, transparent escrow, and zero middlemen commissions.
          </p>

          {/* Plan Duration Toggle */}
          <div className="mt-10 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Plan
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Yearly Plan</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded">SAVE 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* ────────────────── PLANS CARDS GRID ────────────────── */}
      <section className="py-20 bg-slate-50 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* Audience Filter Tabs */}
          <div className="flex justify-center gap-3 mb-12">
            {['Creator', 'Company'].map((tab) => (
              <button
                key={tab}
                onClick={() => setAudienceFilter(tab)}
                className={`px-6 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  audienceFilter === tab
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab === 'All' ? 'All Plans' : tab === 'Creator' ? 'For Artists & Creators' : 'For Production Houses'}
              </button>
            ))}
          </div>

          {/* Loading Indicator */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader2 size={36} className="animate-spin text-purple-600 mb-3" />
              <p className="text-xs font-bold">Loading Membership Plans...</p>
            </div>
          ) : (
            /* Grid of 3D Flip Cards */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayedPlans.map((plan) => (
                <FlipPlanCard key={plan._id} plan={plan} billingCycle={billingCycle} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
