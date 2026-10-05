import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserCheck, Clapperboard, ShieldCheck, CreditCard, Sparkles,
  Building2, CheckCircle2, ArrowRight, Lock, Award, FileText, ChevronRight
} from 'lucide-react';
import PublicLayout from '../../components/public/PublicLayout';

const ARTIST_STEPS = [
  {
    step: '01',
    title: 'Create Your Artist Profile',
    desc: 'Build your professional comp card with photos, video reels, physical measurements, skills & experience.',
    icon: UserCheck,
    color: 'from-purple-500 to-indigo-600'
  },
  {
    step: '02',
    title: 'Apply to Verified Live Castings',
    desc: 'Browse open audition calls for films, OTT web series, TV commercials & fashion campaigns. Submit directly.',
    icon: Clapperboard,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    step: '03',
    title: 'Audition & Receive Escrow Offer',
    desc: 'Get shortlisted by top production houses. Receive clear booking agreements with 100% upfront escrow protection.',
    icon: ShieldCheck,
    color: 'from-emerald-500 to-teal-600'
  },
  {
    step: '04',
    title: 'Perform & Get Instant Payouts',
    desc: 'Complete the shoot or voiceover project. Payment is released directly to your bank account with zero middlemen fee.',
    icon: CreditCard,
    color: 'from-amber-500 to-orange-600'
  }
];

const COMPANY_STEPS = [
  {
    step: '01',
    title: 'Register Production House',
    desc: 'Get your studio or agency account verified with business details and blue checkmark credibility.',
    icon: Building2,
    color: 'from-blue-600 to-indigo-700'
  },
  {
    step: '02',
    title: 'Post Live Casting Calls',
    desc: 'Publish detailed role requirements, budget, location & audition deadline. Receive targeted talent applications.',
    icon: FileText,
    color: 'from-purple-600 to-pink-600'
  },
  {
    step: '03',
    title: 'Filter & Review Video Submissions',
    desc: 'Screen video monologues, digital comp cards & physical stats using our automated talent filtering dashboard.',
    icon: Sparkles,
    color: 'from-amber-500 to-orange-600'
  },
  {
    step: '04',
    title: 'Hire with 100% Escrow Safety',
    desc: 'Deposit project budget into secure platform escrow. Funds are safely held until project deliverables are met.',
    icon: Lock,
    color: 'from-emerald-600 to-teal-700'
  }
];

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState('artists');

  return (
    <PublicLayout>
      {/* ────────────────── HERO BANNER ────────────────── */}
      <section className="bg-gradient-to-b from-purple-950 via-slate-900 to-slate-950 text-white py-16 md:py-24 border-b border-slate-800 text-center relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-xs font-bold text-purple-300 mb-6">
            <Sparkles size={14} className="text-yellow-400 animate-pulse" />
            <span>TRANSPARENT & DIRECT ENTERTAINMENT MARKETPLACE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
            How <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-300">MyCastNow</span> Works
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Connecting artists directly with verified production houses. Zero middleman commission, 100% escrow protected contracts.
          </p>

          {/* Toggle Switch */}
          <div className="mt-10 inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <button
              onClick={() => setActiveTab('artists')}
              className={`px-6 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'artists'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck size={16} />
              <span>For Artists & Creators</span>
            </button>
            <button
              onClick={() => setActiveTab('companies')}
              className={`px-6 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'companies'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 size={16} />
              <span>For Production Houses</span>
            </button>
          </div>
        </div>
      </section>

      {/* ────────────────── STEPS SECTION ────────────────── */}
      <section className="py-20 bg-slate-50 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-extrabold uppercase text-purple-700 tracking-wider">Simple 4-Step Process</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2">
              {activeTab === 'artists' ? 'How Creators Get Auditions & Paid' : 'How Productions Hire Verified Talent'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(activeTab === 'artists' ? ARTIST_STEPS : COMPANY_STEPS).map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl hover:shadow-2xl transition-all duration-300 relative flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon size={26} />
                      </div>
                      <span className="text-3xl font-black text-slate-200 group-hover:text-purple-600 transition-colors">
                        {step.step}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-purple-700">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Verified Workflow
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Banner */}
          <div className="mt-20 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-8 md:p-12 text-white border border-slate-800 shadow-2xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black">Ready to Start Your Casting Journey?</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
                Join thousands of actors, models, and directors using MyCastNow to book auditions and manage escrow projects.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Link
                to="/creator/signup"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
              >
                Join as Artist <ChevronRight size={16} />
              </Link>
              <Link
                to="/company/signup"
                className="px-6 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                Hire Talent <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
