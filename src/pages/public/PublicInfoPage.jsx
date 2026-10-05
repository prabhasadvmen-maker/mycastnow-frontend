import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, BadgeCheck, CheckCircle2, CircleHelp, Crown, FileText, HandHeart, ShieldCheck, Sparkles, Star } from 'lucide-react';
import PublicLayout from '../../components/public/PublicLayout';

let API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
if (typeof window !== 'undefined') {
  const host = window.location.hostname;
  if (host !== 'localhost' && host !== '127.0.0.1') {
    if (!import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL.includes('localhost') || import.meta.env.VITE_API_URL.includes('127.0.0.1')) {
      API = 'https://mycastnow-backend.onrender.com/api/v1';
    }
  }
}

const pageContent = {
  plans: { icon: Crown, eyebrow: 'Official Memberships', title: 'Plans built for your craft and scale.', text: 'Choose a verified artist or production studio membership. Direct bookings, transparent escrow, and zero middlemen.', points: ['Direct artist & production contact', 'Verified blue checkmark credibility', 'Zero hidden commission on bookings'] },
  guidelines: { icon: FileText, eyebrow: 'Audition guidelines', title: 'Make every submission count.', text: 'Keep your profile truthful, your portfolio current, and every audition professional. Clear work helps casting teams make confident decisions.', points: ['Use recent, accurate photos and details', 'Read every role requirement before applying', 'Never share sensitive personal or payment details'] },
  safety: { icon: ShieldCheck, eyebrow: 'Safety & verification', title: 'Casting should always feel safe.', text: 'We encourage transparent communication, verified identities, and work managed through the platform. Report anything that feels suspicious.', points: ['Verified records and clear project details', 'Keep conversations within the platform', 'Report suspicious requests quickly'] },
  support: { icon: CircleHelp, eyebrow: 'Support centre', title: 'We are here when you need us.', text: 'Get help with your profile, casting applications, account access, and platform workflows from the MyCastNow support team.', points: ['Account and profile help', 'Casting and booking guidance', 'Safety and reporting support'] },
  escrow: { icon: HandHeart, eyebrow: 'Payment protection', title: 'Clear, protected project payments.', text: 'MyCastNow promotes transparent bookings and clear payout expectations between artists and production teams.', points: ['Confirm project scope before work begins', 'Keep booking details documented', 'Track work and payment updates in one place'] },
  terms: { icon: FileText, eyebrow: 'Terms of service', title: 'A fair platform for every member.', text: 'Use MyCastNow responsibly, provide accurate information, and respect the people you collaborate with.', points: ['Maintain accurate account information', 'Respect platform and community standards', 'Use only authorised content in your portfolio'] },
  privacy: { icon: ShieldCheck, eyebrow: 'Privacy', title: 'Your profile, your control.', text: 'Manage the information you share and keep your account secure with strong credentials and thoughtful privacy settings.', points: ['Review public profile information', 'Use a secure password', 'Contact support for account concerns'] },
  fraud: { icon: ShieldCheck, eyebrow: 'Fraud prevention', title: 'Know the signs. Stay protected.', text: 'Never send money or share OTPs because of an unsolicited casting message. Genuine platform communication does not require this.', points: ['Do not share OTPs or passwords', 'Verify unexpected payment requests', 'Report impersonation immediately'] }
};

export default function PublicInfoPage({ page = 'support' }) {
  const content = pageContent[page] || pageContent.support;
  const Icon = content.icon;
  const isPlansPage = page === 'plans';

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(isPlansPage);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [audienceFilter, setAudienceFilter] = useState('Creator');

  useEffect(() => {
    if (!isPlansPage) return;
    let active = true;

    axios.get(`${API}/public/landing`).then(({ data: res }) => {
      if (active && res?.plans?.length) setPlans(res.plans);
      // Also query public plans endpoint to ensure latest updates
      return axios.get(`${API}/public/plans`);
    }).then((pRes) => {
      const fetchedPlans = pRes?.data?.plans || (Array.isArray(pRes?.data) ? pRes.data : null);
      if (active && Array.isArray(fetchedPlans) && fetchedPlans.length) {
        setPlans(fetchedPlans.filter((p) => p.isActive !== false));
      }
    }).catch(() => {})
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [isPlansPage]);

  const displayedPlans = useMemo(() => {
    if (audienceFilter === 'All') return plans;
    return plans.filter((p) => p.targetAudience === audienceFilter || p.targetAudience === 'Both');
  }, [plans, audienceFilter]);

  return (
    <PublicLayout>
      <section className="bg-gradient-to-br from-violet-50 via-white to-sky-50 py-20">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <Icon size={27} />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[.2em] text-violet-600">{content.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{content.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600">{content.text}</p>

          {isPlansPage && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    billingCycle === 'monthly' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly Plan
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    billingCycle === 'yearly' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Annual Plan</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                    Save 20%
                  </span>
                </button>
              </div>

              <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
                {['Creator', 'Company'].map((aud) => (
                  <button
                    key={aud}
                    type="button"
                    onClick={() => setAudienceFilter(aud)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                      audienceFilter === aud ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {aud === 'All' ? 'All Plans' : aud === 'Creator' ? 'For Creators' : 'For Production'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {isPlansPage && (
        <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 animate-pulse rounded-3xl bg-slate-100" />
              ))}
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {displayedPlans.map((plan) => {
                const isYearly = billingCycle === 'yearly';
                const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
                const isFree = !price || price === 0;

                return (
                  <div
                    key={plan._id}
                    className={`relative flex flex-col justify-between rounded-3xl border-2 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                      plan.isPopular ? 'border-violet-500 shadow-violet-100 ring-2 ring-violet-500/20' : 'border-slate-200'
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md flex items-center gap-1">
                        <Star size={11} fill="white" />
                        <span>Most Popular</span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-700">
                          {plan.targetAudience === 'Creator'
                            ? 'For Artists'
                            : plan.targetAudience === 'Company'
                            ? 'For Production'
                            : 'All Members'}
                        </span>
                        {plan.trialDays > 0 && (
                          <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                            {plan.trialDays}-Day Free Trial
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 text-2xl font-black text-slate-900">{plan.name}</h3>
                      <p className="mt-2 text-xs text-slate-500 min-h-[36px]">{plan.description}</p>

                      <div className="mt-6 border-y border-slate-100 py-5">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-slate-950">
                            {isFree ? 'Free' : `₹${Number(price).toLocaleString('en-IN')}`}
                          </span>
                          {!isFree && <span className="text-xs font-semibold text-slate-500">{isYearly ? '/year' : '/month'}</span>}
                        </div>
                        {isYearly && !isFree && (
                          <p className="mt-1 text-[11px] font-semibold text-emerald-600">
                            Effective ₹{Math.round(price / 12).toLocaleString('en-IN')}/mo (billed annually)
                          </p>
                        )}
                      </div>

                      <div className="mt-5 space-y-2 text-xs font-semibold text-slate-700">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-violet-600 shrink-0" />
                          <span>
                            {plan.maxCastingApplications === -1 ? 'Unlimited Audition Submissions' : `${plan.maxCastingApplications} Applications / Month`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-violet-600 shrink-0" />
                          <span>
                            {plan.maxPortfolioPhotos === -1 ? 'Unlimited Media & Reels' : `Up to ${plan.maxPortfolioPhotos} Media Uploads`}
                          </span>
                        </div>
                        {plan.verifiedBadge && (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                            <span className="text-emerald-700">Official Blue Verified Badge</span>
                          </div>
                        )}
                        {plan.prioritySupport && (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                            <span className="text-emerald-700">24/7 Dedicated Priority Support</span>
                          </div>
                        )}
                        {plan.featuredListing && (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                            <span className="text-emerald-700">Featured Placement in Search</span>
                          </div>
                        )}
                      </div>

                      {plan.features?.length > 0 && (
                        <div className="mt-5 border-t border-slate-100 pt-4">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Features</p>
                          <ul className="space-y-1.5">
                            {plan.features.map((feat, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 pt-4">
                      <Link
                        to={plan.targetAudience === 'Company' ? '/company/signup' : '/creator/signup'}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-violet-700"
                      >
                        <span>{isFree ? 'Get Started Free' : plan.trialDays > 0 ? `Start ${plan.trialDays}-Day Trial` : 'Select Plan'}</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {!isPlansPage && (
        <section className="mx-auto max-w-4xl px-5 py-16">
          <div className="grid gap-4 sm:grid-cols-3">
            {content.points.map((point) => (
              <div key={point} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <CheckCircle2 size={20} className="text-emerald-500" />
                <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-700">{point}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-5 pb-20">
        <div className="rounded-3xl bg-slate-950 p-8 text-center text-white">
          <BadgeCheck className="mx-auto text-violet-300" size={26} />
          <h2 className="mt-3 text-xl font-black">Ready to take the next step?</h2>
          <p className="mt-2 text-sm text-slate-300">Create your profile or join as a production team today.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/creator/signup" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950">
              Join as a creator <ArrowRight size={15} />
            </Link>
            <Link to="/company/signup" className="rounded-xl border border-white/30 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 transition">
              Register a company
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
