import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowRight, BadgeCheck, Building2, CheckCircle2, ChevronLeft, ChevronRight, Clapperboard,
  Crown, MapPin, Maximize2, Pause, Play, RotateCcw, Search, ShieldCheck,
  Sparkles, Star, Users, Volume2, VolumeX, Zap,
  Camera, Eye, X, Phone, Mail, Globe, Calendar, Share2, Check, ExternalLink, Film, Award, DollarSign, User, Briefcase,
  Lock, Heart, MessageCircle, Send, MoreVertical
} from 'lucide-react';
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
const mediaUrl = (value) => (!value || /^(https?:|data:)/.test(value) ? value : `${API.replace(/\/api\/?$/, '')}${value.startsWith('/') ? '' : '/'}${value}`);

const PLAN_STYLES = {
  purple: {
    badge: 'bg-purple-100 text-purple-700',
    btn: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-200'
  },
  blue: {
    badge: 'bg-blue-100 text-blue-700',
    btn: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-blue-200'
  },
  gold: {
    badge: 'bg-amber-100 text-amber-800',
    btn: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-amber-200'
  },
  gray: {
    badge: 'bg-slate-100 text-slate-700',
    btn: 'bg-slate-900 hover:bg-black text-white shadow-slate-200'
  }
};

function HeroVideoCard() {
  const videoRef = useRef(null);

  return (
    <div className="relative w-[220px] mx-auto flex items-center justify-center shrink-0">
      {/* Ambient glowing background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-tr from-violet-300/40 via-purple-200/30 to-fuchsia-100/40 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Phone Mockup Frame - Fixed dimensions to prevent collapsing */}
      <div className="relative group overflow-hidden rounded-[2rem] border-[10px] border-[#121212] bg-[#121212] shadow-2xl shadow-violet-900/20 w-[220px] h-[440px] rotate-[4deg] hover:rotate-[1deg] transition-all duration-500 ease-out shrink-0">
        {/* Video Background */}
        <video
          ref={videoRef}
          src="/My%20cast%20now%20video%20.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover rounded-[1.4rem] bg-slate-900"
        />

        {/* Top Gradient for text readability */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none rounded-t-[1.4rem]" />
        {/* Bottom Gradient */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none rounded-b-[1.4rem]" />

        {/* Top Header */}
        <div className="absolute top-4 left-4 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
            <span className="text-white text-xs font-bold tracking-wide drop-shadow-md">MyCastNow Reel</span>
          </div>
          <MoreVertical size={16} className="text-white drop-shadow-md" />
        </div>

        {/* Right Side Social Actions */}
        <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5 z-10">
          <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
            <div className="bg-black/20 backdrop-blur-md p-1.5 rounded-full">
              <Heart size={20} className="text-white fill-white drop-shadow-md" />
            </div>
            <span className="text-white text-[10px] font-black drop-shadow-md">12.4K</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
            <div className="bg-black/20 backdrop-blur-md p-1.5 rounded-full">
              <MessageCircle size={18} className="text-white fill-white drop-shadow-md" />
            </div>
            <span className="text-white text-[10px] font-black drop-shadow-md">320</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
            <div className="bg-black/20 backdrop-blur-md p-1.5 rounded-full pl-2">
              <Send size={18} className="text-white fill-white drop-shadow-md -ml-0.5" />
            </div>
          </div>
        </div>

        {/* Bottom Progress Bar & Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 z-10">
          <Play size={14} className="text-white fill-white drop-shadow-md shrink-0 cursor-pointer hover:scale-110 transition-transform" />
          <div className="text-white text-[9px] font-bold drop-shadow-md tracking-wider shrink-0">
            0:16 / 0:28
          </div>
          <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer relative backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-[57%] h-full bg-[#8B5CF6] rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
          </div>
          <Maximize2 size={12} className="text-white drop-shadow-md shrink-0 cursor-pointer hover:scale-110 transition-transform" />
        </div>
      </div>
    </div>
  );
}

export default function PublicWebsite() {
  const [data, setData] = useState({ talents: [], castings: [], stats: {}, plans: [], companies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [showAllCreators, setShowAllCreators] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [audienceFilter, setAudienceFilter] = useState('All');
  const [selectedTalentModal, setSelectedTalentModal] = useState(null);
  const [modalTab, setModalTab] = useState('portfolio');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const companiesScrollRef = useRef(null);

  useEffect(() => {
    let active = true;
    axios.get(`${API}/public/landing`).then(({ data: response }) => {
      if (!response?.success) throw new Error(response?.message || 'Could not load live platform data.');
      if (active) {
        setData({
          talents: response.talents || [],
          castings: response.castings || [],
          stats: response.stats || {},
          plans: response.plans || [],
          companies: response.companies || []
        });
      }
      // Also query public plans endpoint to merge any freshly created active plans
      axios.get(`${API}/public/plans`).then((pRes) => {
        const fetchedPlans = pRes.data?.plans || (Array.isArray(pRes.data) ? pRes.data : null);
        if (active && Array.isArray(fetchedPlans) && fetchedPlans.length > 0) {
          setData((prev) => ({
            ...prev,
            plans: fetchedPlans.filter((p) => p.isActive !== false)
          }));
        }
      }).catch(() => { });
      // Also query public companies endpoint to ensure latest approved companies
      axios.get(`${API}/public/companies`).then((cRes) => {
        if (active && Array.isArray(cRes.data?.companies) && cRes.data.companies.length > 0) {
          setData((prev) => ({
            ...prev,
            companies: cRes.data.companies
          }));
        }
      }).catch(() => { });
    }).catch((err) => {
      if (active) setError(err.message || 'Could not connect to the platform.');
      axios.get(`${API}/public/plans`).then((pRes) => {
        const fetchedPlans = pRes.data?.plans || (Array.isArray(pRes.data) ? pRes.data : null);
        if (active && Array.isArray(fetchedPlans) && fetchedPlans.length > 0) {
          setData((prev) => ({ ...prev, plans: fetchedPlans.filter((p) => p.isActive !== false) }));
        }
      }).catch(() => { });
      axios.get(`${API}/public/companies`).then((cRes) => {
        if (active && Array.isArray(cRes.data?.companies) && cRes.data.companies.length > 0) {
          setData((prev) => ({ ...prev, companies: cRes.data.companies }));
        }
      }).catch(() => { });
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const castings = useMemo(() => {
    const term = query.trim().toLowerCase();
    return data.castings.filter((c) => !term || [c.title, c.roleType, c.projectType, c.location].filter(Boolean).some((v) => v.toLowerCase().includes(term))).slice(0, 6);
  }, [data.castings, query]);

  const displayedPlans = useMemo(() => {
    const list = data.plans || [];
    if (audienceFilter === 'All') return list;
    return list.filter((p) => p.targetAudience === audienceFilter || p.targetAudience === 'Both');
  }, [data.plans, audienceFilter]);

  const approvedCompanies = useMemo(() => {
    return Array.isArray(data.companies) ? data.companies : [];
  }, [data.companies]);

  // Seamless right-to-left infinite loop: ensure enough cards to fill track then duplicate for smooth 50% translation
  const marqueeCompanies = useMemo(() => {
    if (!approvedCompanies.length) return [];
    let list = [...approvedCompanies];
    while (list.length < 8) {
      list = [...list, ...approvedCompanies];
    }
    return [...list, ...list];
  }, [approvedCompanies]);

  const scrollCompanies = (dir) => {
    if (companiesScrollRef.current) {
      const scrollAmount = dir === 'left' ? -360 : 360;
      companiesScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return <PublicLayout>
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-sky-50">
      <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" /><div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-sky-200/50 blur-3xl" />
      <div className="relative mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 max-w-[1050px] px-5 pt-4 pb-20 md:pt-8 md:pb-24 lg:pb-28 md:px-8">
        {/* LEFT COLUMN: HERO TEXT & ACTIONS */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none flex flex-col justify-center -mt-6 lg:-mt-20">
          <div>
            <h1 style={{ fontFamily: "'Permanent Marker', cursive" }} className="text-4xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.75rem] font-normal">
              Discover & Hire <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Premium Talent.</span>
            </h1>
            <p style={{ fontFamily: "'Handlee', cursive" }} className="mt-6 max-w-lg text-[20px] leading-relaxed text-slate-700 font-medium tracking-wide">
              MyCastNow brings verified actors, models, and creators together with top production houses in one direct, secure ecosystem.
            </p>
            <div style={{ fontFamily: "'Handlee', cursive" }} className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-100/60 px-4 py-2 text-[13px] font-bold tracking-wide text-emerald-600 shadow-sm border border-emerald-200/50 uppercase">
              <Sparkles size={15} /> INDIA'S VERIFIED CASTING NETWORK
            </div>
          </div>

          <div style={{ fontFamily: "'Handlee', cursive" }} className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-[16px] font-bold text-slate-800 tracking-wide">
            <span className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-50 text-[#8B5CF6] shadow-sm">
                <ShieldCheck size={14} />
              </div>
              Verified Artists
            </span>
            <span className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-50 text-[#8B5CF6] shadow-sm">
                <Users size={14} />
              </div>
              Zero Middlemen
            </span>
            <span className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-50 text-[#8B5CF6] shadow-sm">
                <Lock size={14} />
              </div>
              100% Secure
            </span>
          </div>


        </div>

        {/* RIGHT COLUMN: HERO VIDEO CARD */}
        <div className="flex flex-col justify-center lg:justify-end shrink-0 w-full lg:w-auto">
          <HeroVideoCard />
        </div>
      </div>
    </section>
    <section className="relative z-10 mx-auto -mt-8 grid max-w-[1240px] grid-cols-2 gap-3 px-5 md:grid-cols-4 md:px-8">{[[Users, data.stats.artistsCount, 'Creators on platform'], [Building2, data.stats.productionsCount, 'Production partners'], [Clapperboard, data.stats.castingsCount, 'Live casting calls'], [ShieldCheck, data.stats.escrowPayouts, 'Completed payouts']].map(([Icon, amount, label]) => <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-lg shadow-slate-200/50 md:p-5"><Icon size={19} className="mb-2 text-violet-600" /><p className="text-xl font-black text-slate-900 md:text-2xl">{loading ? '—' : amount ?? '0'}</p><p className="mt-1 text-[11px] font-semibold text-slate-500 md:text-xs">{label}</p></div>)}</section>

    {/* ────────────────── POPULAR TALENT CATEGORIES ────────────────── */}
    <section className="relative z-10 mx-auto max-w-[1400px] px-5 py-20 md:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Hire Top Talent by Category</h2>
        <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">Explore our diverse pool of verified professionals ready to bring your creative vision to life.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { name: 'Actors', icon: Film, color: 'bg-rose-50 text-rose-600 border-rose-100', hover: 'hover:border-rose-300 hover:shadow-rose-100' },
          { name: 'Models', icon: Camera, color: 'bg-violet-50 text-violet-600 border-violet-100', hover: 'hover:border-violet-300 hover:shadow-violet-100' },
          { name: 'Voiceover', icon: Volume2, color: 'bg-blue-50 text-blue-600 border-blue-100', hover: 'hover:border-blue-300 hover:shadow-blue-100' },
          { name: 'Dancers', icon: Sparkles, color: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100', hover: 'hover:border-fuchsia-300 hover:shadow-fuchsia-100' },
          { name: 'Creators', icon: Play, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', hover: 'hover:border-emerald-300 hover:shadow-emerald-100' },
          { name: 'Crew', icon: Briefcase, color: 'bg-amber-50 text-amber-600 border-amber-100', hover: 'hover:border-amber-300 hover:shadow-amber-100' },
        ].map((cat) => (
          <Link key={cat.name} to="/talents" className={`group flex flex-col items-center justify-center p-6 rounded-3xl border border-slate-200 bg-white hover:-translate-y-1 hover:shadow-xl ${cat.hover} transition-all duration-300`}>
            <div className={`p-4 rounded-2xl ${cat.color} mb-4 transition-transform group-hover:scale-110`}>
              <cat.icon size={26} strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-slate-950">{cat.name}</h3>
            <span className="text-[11px] text-slate-400 mt-1 font-semibold flex items-center gap-1 group-hover:text-slate-600 transition-colors">Explore <ArrowRight size={10} /></span>
          </Link>
        ))}
      </div>
    </section>
    <section id="castings" className="mx-auto max-w-[1400px] px-5 py-20 md:px-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-violet-600">Updated from the database</p><h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Live casting calls</h2><p className="mt-2 text-sm text-slate-500">Current, open projects posted by companies on MyCastNow.</p></div><label className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm sm:max-w-xs"><Search size={17} className="text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full text-sm outline-none" placeholder="Search role or location" /></label></div>
      {error ? <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">{error}</div> : loading ? <div className="mt-8 grid gap-5 md:grid-cols-3">{[1, 2, 3].map((n) => <div key={n} className="h-72 animate-pulse rounded-3xl bg-slate-100" />)}</div> : castings.length ? <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{castings.map((c) => <article key={c._id} className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100"><div className="flex items-start justify-between gap-3"><span className="rounded-lg bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-700">{c.projectType || 'Casting call'}</span><span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700"><i className="h-2 w-2 rounded-full bg-emerald-500" /> LIVE</span></div><h3 className="mt-4 text-lg font-black text-slate-900">{c.title}</h3><p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500"><Building2 size={14} />{c.company?.name || 'Verified production'}</p><div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">{c.roleType && <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">{c.roleType}</span>}{c.location && <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5"><MapPin size={12} />{c.location}</span>}</div><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-sm font-bold text-emerald-700">{c.budget || 'Budget on selection'}</span><Link to="/castings" className="inline-flex items-center gap-1 text-xs font-bold text-violet-700">View role <ArrowRight size={14} /></Link></div></article>)}</div> : <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><Clapperboard className="mx-auto text-slate-300" size={38} /><h3 className="mt-3 font-bold text-slate-700">No matching live castings</h3><p className="mt-1 text-sm text-slate-500">Try a different search, or check back for the next verified opportunity.</p></div>}<div className="mt-8 text-center"><Link to="/castings" className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-bold text-violet-700 hover:bg-violet-100">See all live castings <ArrowRight size={16} /></Link></div></section>

    {/* ────────────────── APPROVED PRODUCTION COMPANIES (RIGHT-TO-LEFT INFINITE SLIDER) ────────────────── */}
    <section className="relative overflow-hidden border-y border-slate-200/80 bg-gradient-to-r from-violet-50/50 via-white to-indigo-50/50 py-16">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/90 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-violet-700 shadow-2xs">
              <Building2 size={13} className="text-violet-600" />
              <span>Verified Production Partners</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Trusted by India's Top Production Studios
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Approved production companies, casting agencies, and OTT studios currently casting on MyCastNow.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>{approvedCompanies.length} Approved Studios</span>
            </span>
          </div>
        </div>
      </div>

      {/* Marquee slider track - continuously sliding right to left */}
      <div className="marquee-container relative w-full overflow-hidden py-2">
        {/* Left & Right gradient edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent" />

        {marqueeCompanies.length === 0 ? (
          <div className="mx-auto max-w-[1400px] px-5 text-center py-6 text-sm text-slate-400 italic">
            Approved production houses will appear here once approved by Super Admin.
          </div>
        ) : (
          <div className="animate-marquee-rtl flex items-center gap-5">
            {marqueeCompanies.map((comp, idx) => (
              <div
                key={`${comp._id || idx}-${idx}`}
                className="group relative flex w-[310px] sm:w-[350px] shrink-0 items-center gap-4 rounded-3xl border border-slate-200/90 bg-white p-4.5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 cursor-pointer"
              >
                {/* Logo / Monogram */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-white font-black text-xl shadow-md shadow-violet-200">
                  {comp.logo ? (
                    <img
                      src={mediaUrl(comp.logo)}
                      alt={comp.name}
                      className="h-full w-full object-cover bg-white"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>{comp.name?.charAt(0) || 'P'}</span>
                  )}
                </div>

                {/* Company Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate font-black text-slate-900 text-sm group-hover:text-violet-700 transition">
                      {comp.name}
                    </h3>
                    <BadgeCheck size={16} className="text-violet-600 shrink-0" />
                  </div>

                  <p className="truncate text-xs font-semibold text-violet-600/90 mt-0.5">
                    {comp.industry || 'Film & OTT Production'}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{comp.location || 'Mumbai'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600 shrink-0">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </span>
                      Approved
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
    <section className="bg-slate-50 py-20" id="talents">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-violet-600">Meet the talent</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Creators ready for their next brief</h2>
            <p className="mt-2 text-sm text-slate-600">Click any creator card to explore their full portfolio, all high-res photos, physical stats, and commercial booking rates.</p>
          </div>
          {!loading && data.talents.length > 0 && (
            <span className="text-xs font-semibold text-violet-700 bg-violet-100/70 border border-violet-200 px-3.5 py-1.5 rounded-full self-start md:self-auto">
              {data.talents.length} verified creators live
            </span>
          )}
        </div>

        {!loading && data.talents.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            Creator profiles will appear here as artists join the platform.
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(loading ? [1, 2, 3, 4] : data.talents.slice(0, showAllCreators ? data.talents.length : 8)).map((talent, i) => (
                <article
                  key={talent?.id || i}
                  onClick={() => {
                    if (!loading && talent) {
                      setSelectedTalentModal(talent);
                      setModalTab('portfolio');
                    }
                  }}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col"
                >
                  {loading ? (
                    <div className="aspect-[3/4] w-full animate-pulse bg-slate-200" />
                  ) : (
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-violet-100 via-slate-100 to-sky-100">
                      {talent.image ? (
                        <img
                          src={mediaUrl(talent.image)}
                          alt={talent.name}
                          className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.parentElement?.querySelector('.talent-fallback');
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`talent-fallback flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-100 to-sky-100 ${talent.image ? 'hidden' : 'flex'}`}>
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-200 text-3xl font-black text-violet-700 shadow-inner">
                          {talent.name?.charAt(0) || 'C'}
                        </div>
                      </div>

                      {/* Badges Overlay */}
                      <div className="absolute inset-x-3 top-3 flex items-center justify-between pointer-events-none">
                        {talent.photos?.length > 1 ? (
                          <span className="flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                            <Camera size={11} />
                            {talent.photos.length} Photos
                          </span>
                        ) : <span />}

                        {talent.verified && (
                          <span className="flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-violet-700 shadow-sm">
                            <BadgeCheck size={12} className="text-violet-600" />
                            Verified
                          </span>
                        )}
                      </div>

                      {/* Hover Prompt Overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between text-white text-xs font-bold">
                        <span className="flex items-center gap-1.5"><Eye size={13} /> View Full Profile & Photos</span>
                        <span className="rounded-full bg-white/20 p-1"><ArrowRight size={12} /></span>
                      </div>
                    </div>
                  )}

                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    {loading ? (
                      <div className="space-y-2">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
                      </div>
                    ) : (
                      <>
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-black text-slate-900 text-base group-hover:text-violet-600 transition-colors">
                              {talent.name}
                            </h3>
                            {talent.dayRate && (
                              <span className="text-[11px] font-extrabold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-lg border border-violet-100 shrink-0">
                                {talent.dayRate}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs font-bold text-violet-600">
                            {talent.role || talent.category || 'Professional Talent'}
                          </p>
                        </div>

                        <div className="space-y-2 pt-1 border-t border-slate-100">
                          {talent.city && (
                            <p className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                              <MapPin size={13} className="text-slate-400 shrink-0" />
                              {talent.city}
                            </p>
                          )}
                          {talent.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {talent.skills.slice(0, 3).map((skill, sIdx) => (
                                <span key={sIdx} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                  {skill}
                                </span>
                              ))}
                              {talent.skills.length > 3 && (
                                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                                  +{talent.skills.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {!loading && data.talents.length > 4 && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setShowAllCreators((value) => !value)}
                  className="rounded-2xl border border-violet-200 bg-white px-6 py-3.5 text-sm font-bold text-violet-700 shadow-sm hover:bg-violet-50 hover:border-violet-300 transition-all cursor-pointer"
                >
                  {showAllCreators ? 'Show less' : `Show all creators (${data.talents.length})`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>

    {/* ────────────────── MEMBERSHIP & SUBSCRIPTION PLANS ────────────────── */}
    <section id="plans" className="relative overflow-hidden bg-gradient-to-b from-white via-violet-50/50 to-white py-24">
      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-violet-700 shadow-xs">
            <Crown size={14} className="text-violet-600" />
            <span>Official Subscriptions & Memberships</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Choose the plan that powers <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">your career.</span>
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Direct, verified casting with zero middlemen. Choose flexible monthly billing or save 20% with annual plans.
          </p>

          {/* Billing Toggle & Target Audience Filter */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            {/* Monthly / Yearly Toggle */}
            <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${billingCycle === 'monthly'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Monthly Plan
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${billingCycle === 'yearly'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <span>Annual Plan</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                  Save 20%
                </span>
              </button>
            </div>

            {/* Audience Filter Tabs */}
            <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
              {['All', 'Creator', 'Company'].map((aud) => (
                <button
                  key={aud}
                  type="button"
                  onClick={() => setAudienceFilter(aud)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${audienceFilter === aud
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  {aud === 'All' ? 'All Plans' : aud === 'Creator' ? 'For Creators' : 'For Production'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayedPlans.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
              No subscription plans found for this filter. Check back soon or create one in Super Admin!
            </div>
          ) : (
            displayedPlans.map((plan) => {
              const isYearly = billingCycle === 'yearly';
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
              const colors = PLAN_STYLES[plan.badgeColor] || PLAN_STYLES.purple;
              const isFree = !price || price === 0;

              return (
                <div
                  key={plan._id}
                  className={`relative flex flex-col justify-between rounded-3xl border-2 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${plan.isPopular
                    ? 'border-violet-500 shadow-violet-100 ring-2 ring-violet-500/20'
                    : 'border-slate-200'
                    }`}
                >
                  {/* Popular Badge */}
                  {plan.isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md shadow-violet-300 flex items-center gap-1">
                      <Star size={11} fill="white" />
                      <span>Most Popular</span>
                    </div>
                  )}

                  <div>
                    {/* Audience & Trial Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-700">
                        {plan.targetAudience === 'Creator'
                          ? 'For Artists & Creators'
                          : plan.targetAudience === 'Company'
                            ? 'For Production Houses'
                            : 'For All Members'}
                      </span>
                      {plan.trialDays > 0 && (
                        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                          {plan.trialDays}-Day Free Trial
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-2xl font-black text-slate-900">{plan.name}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 min-h-[36px]">
                      {plan.description || 'Premium features to elevate your casting and production journey.'}
                    </p>

                    {/* Price display */}
                    <div className="mt-6 border-y border-slate-100 py-5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black tracking-tight text-slate-950">
                          {isFree ? 'Free' : `₹${Number(price).toLocaleString('en-IN')}`}
                        </span>
                        {!isFree && (
                          <span className="text-xs font-semibold text-slate-500">
                            {isYearly ? '/year' : '/month'}
                          </span>
                        )}
                      </div>
                      {isYearly && !isFree && (
                        <p className="mt-1 text-[11px] font-semibold text-emerald-600">
                          Effective ₹{Math.round(price / 12).toLocaleString('en-IN')}/mo (billed annually)
                        </p>
                      )}
                    </div>

                    {/* Core Platform Limits */}
                    <div className="mt-5 space-y-2 text-xs font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={15} className="text-violet-600 shrink-0" />
                        <span>
                          {plan.maxCastingApplications === -1
                            ? 'Unlimited Auditions / Casting Calls'
                            : `${plan.maxCastingApplications} Applications / Month`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={15} className="text-violet-600 shrink-0" />
                        <span>
                          {plan.maxPortfolioPhotos === -1
                            ? 'Unlimited Photos, Videos & Audio'
                            : `Up to ${plan.maxPortfolioPhotos} Media Uploads`}
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

                    {/* Custom Plan Features List */}
                    {plan.features?.length > 0 && (
                      <div className="mt-5 border-t border-slate-100 pt-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Included Features
                        </p>
                        <ul className="space-y-2">
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

                  {/* Call to action */}
                  <div className="mt-8 pt-4">
                    <Link
                      to={plan.targetAudience === 'Company' ? '/company/signup' : '/creator/signup'}
                      className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-bold shadow-md transition hover:-translate-y-0.5 ${colors.btn}`}
                    >
                      <span>
                        {isFree
                          ? 'Get Started Free'
                          : plan.trialDays > 0
                            ? `Start ${plan.trialDays}-Day Free Trial`
                            : 'Choose Plan'}
                      </span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Custom Agency Note */}
        <div className="mt-12 rounded-3xl border border-violet-100 bg-white p-6 sm:p-8 shadow-sm text-center max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-600">Enterprise or Custom Needs?</p>
            <h4 className="text-lg font-black text-slate-900 mt-1">Need custom scouting for a feature film or large agency?</h4>
            <p className="text-xs text-slate-500 mt-1">We offer custom pipeline setups, dedicated casting coordinators, and tailored escrow.</p>
          </div>
          <Link
            to="/support"
            className="shrink-0 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold text-slate-800 hover:border-violet-300 hover:text-violet-700 transition"
          >
            <span>Contact Studio Team</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>

    <section id="how-it-works" className="mx-auto max-w-5xl px-5 py-20 text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-violet-600">Simple by design</p><h2 className="mt-2 text-3xl font-black text-slate-900">From profile to production, without the noise</h2><div className="mt-10 grid gap-5 md:grid-cols-3">{[['01', 'Build your presence', 'Add your craft, work and availability so the right teams can discover you.'], ['02', 'Discover verified work', 'Browse live opportunities and submit directly through your creator dashboard.'], ['03', 'Work with confidence', 'Manage conversations, bookings and payouts in one transparent place.']].map(([number, title, copy]) => <div key={number} className="rounded-3xl border border-slate-200 bg-white p-6 text-left"><span className="text-sm font-black text-violet-600">{number}</span><h3 className="mt-5 text-lg font-black text-slate-900">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">{copy}</p></div>)}</div></section>

    {/* ── TALENT DETAILS & ALL PORTFOLIO PHOTOS MODAL ── */}
    {selectedTalentModal && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
        onClick={() => setSelectedTalentModal(null)}
      >
        <div
          className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* MODAL HEADER */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-2xl overflow-hidden bg-violet-100 border border-violet-200 shrink-0">
                {selectedTalentModal.image ? (
                  <img
                    src={mediaUrl(selectedTalentModal.image)}
                    alt={selectedTalentModal.name}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-black text-violet-600 text-lg">
                    {selectedTalentModal.name?.charAt(0) || 'C'}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">{selectedTalentModal.name}</h3>
                  {selectedTalentModal.verified && (
                    <span className="flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                      <BadgeCheck size={12} /> Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedTalentModal.category}
                  {selectedTalentModal.role ? (' • ' + selectedTalentModal.role) : ''}
                  {selectedTalentModal.city ? (' • ' + selectedTalentModal.city) : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const url = window.location.origin + '/talents';
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url);
                  }
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2500);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                title="Copy profile link"
              >
                {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>

              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-200 transition"
              >
                <Calendar size={13} />
                <span>Book / Cast</span>
              </Link>

              <button
                type="button"
                onClick={() => setSelectedTalentModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition ml-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* MODAL TABS */}
          <div className="flex border-b border-slate-100 px-6 gap-6 bg-white text-xs font-bold text-slate-500 overflow-x-auto">
            <button
              onClick={() => setModalTab('portfolio')}
              className={modalTab === 'portfolio' ? 'py-3.5 border-b-2 transition whitespace-nowrap cursor-pointer border-violet-600 text-violet-600' : 'py-3.5 border-b-2 transition whitespace-nowrap cursor-pointer border-transparent hover:text-slate-900'}
            >
              Photo Gallery ({selectedTalentModal.photos?.length || (selectedTalentModal.image ? 1 : 0)})
            </button>
            <button
              onClick={() => setModalTab('about')}
              className={modalTab === 'about' ? 'py-3.5 border-b-2 transition whitespace-nowrap cursor-pointer border-violet-600 text-violet-600' : 'py-3.5 border-b-2 transition whitespace-nowrap cursor-pointer border-transparent hover:text-slate-900'}
            >
              About & Performance Skills
            </button>
            <button
              onClick={() => setModalTab('specs')}
              className={modalTab === 'specs' ? 'py-3.5 border-b-2 transition whitespace-nowrap cursor-pointer border-violet-600 text-violet-600' : 'py-3.5 border-b-2 transition whitespace-nowrap cursor-pointer border-transparent hover:text-slate-900'}
            >
              Physical Sedcard & Stats
            </button>
            <button
              onClick={() => setModalTab('rates')}
              className={modalTab === 'rates' ? 'py-3.5 border-b-2 transition whitespace-nowrap cursor-pointer border-violet-600 text-violet-600' : 'py-3.5 border-b-2 transition whitespace-nowrap cursor-pointer border-transparent hover:text-slate-900'}
            >
              Rates & Credits
            </button>
          </div>

          {/* MODAL BODY (SCROLLABLE) */}
          <div className="p-5 sm:p-7 overflow-y-auto max-h-[65vh] space-y-6">

            {/* TAB 1: ALL PHOTOS & PORTFOLIO */}
            {modalTab === 'portfolio' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    High-Resolution Portfolio Photos ({selectedTalentModal.photos?.length || 1})
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Click any image to preview in full resolution</p>
                </div>

                {selectedTalentModal.photos && selectedTalentModal.photos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedTalentModal.photos.map((photo, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => setLightboxImage(mediaUrl(photo))}
                        className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer shadow-xs hover:shadow-md transition"
                      >
                        <img
                          src={mediaUrl(photo)}
                          alt={selectedTalentModal.name + ' portfolio ' + (pIdx + 1)}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Maximize2 size={20} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : selectedTalentModal.image ? (
                  <div className="max-w-xs">
                    <div
                      onClick={() => setLightboxImage(mediaUrl(selectedTalentModal.image))}
                      className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer shadow-xs hover:shadow-md transition"
                    >
                      <img
                        src={mediaUrl(selectedTalentModal.image)}
                        alt={selectedTalentModal.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Maximize2 size={20} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Camera size={28} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-semibold">No additional portfolio photos uploaded yet</p>
                  </div>
                )}

                {/* Showreel Videos */}
                {selectedTalentModal.videos && selectedTalentModal.videos.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Film size={14} className="text-violet-600" /> Showreel & Audition Reels
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedTalentModal.videos.map((vid, vIdx) => (
                        <div key={vIdx} className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-4 text-white flex items-center justify-between">
                          <div className="truncate pr-3">
                            <p className="text-xs font-bold truncate">{'Reel / Video #' + (vIdx + 1)}</p>
                            <p className="text-[11px] text-slate-400 truncate">{vid}</p>
                          </div>
                          <a
                            href={vid.startsWith('http') ? vid : ('https://' + vid)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition flex items-center gap-1 shrink-0"
                          >
                            Watch <ExternalLink size={12} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ABOUT & SKILLS */}
            {modalTab === 'about' && (
              <div className="space-y-6">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About the Creator</h4>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {selectedTalentModal.bio || (selectedTalentModal.name + ' is a verified ' + (selectedTalentModal.role || selectedTalentModal.category) + ' available for films, OTT, commercials, and brand campaigns.')}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Special Skills & Talents</h4>
                  {selectedTalentModal.skills && selectedTalentModal.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedTalentModal.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-3 py-1.5 rounded-xl bg-violet-50 text-violet-700 border border-violet-100 text-xs font-bold flex items-center gap-1.5"
                        >
                          <Sparkles size={12} className="text-violet-500" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Standard skills listed in primary category.</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Languages Known</span>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {selectedTalentModal.languages && selectedTalentModal.languages.length > 0 ? selectedTalentModal.languages.join(', ') : 'Hindi, English'}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Service Cities / Relocation</span>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {selectedTalentModal.serviceArea && selectedTalentModal.serviceArea.length > 0 ? selectedTalentModal.serviceArea.join(', ') : (selectedTalentModal.city || 'Pan India')}
                    </p>
                  </div>
                </div>

                {selectedTalentModal.socialLinks && Object.values(selectedTalentModal.socialLinks).some(Boolean) && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Social & Web Links</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTalentModal.socialLinks.instagram && (
                        <a
                          href={selectedTalentModal.socialLinks.instagram.startsWith('http') ? selectedTalentModal.socialLinks.instagram : ('https://instagram.com/' + selectedTalentModal.socialLinks.instagram.replace('@', ''))}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-pink-50 border border-pink-100 text-pink-700 text-xs font-bold hover:bg-pink-100 transition flex items-center gap-1.5"
                        >
                          <ExternalLink size={12} /> Instagram
                        </a>
                      )}
                      {selectedTalentModal.socialLinks.youtube && (
                        <a
                          href={selectedTalentModal.socialLinks.youtube.startsWith('http') ? selectedTalentModal.socialLinks.youtube : ('https://youtube.com/' + selectedTalentModal.socialLinks.youtube)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-bold hover:bg-red-100 transition flex items-center gap-1.5"
                        >
                          <ExternalLink size={12} /> YouTube
                        </a>
                      )}
                      {selectedTalentModal.socialLinks.website && (
                        <a
                          href={selectedTalentModal.socialLinks.website.startsWith('http') ? selectedTalentModal.socialLinks.website : ('https://' + selectedTalentModal.socialLinks.website)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-200 transition flex items-center gap-1.5"
                        >
                          <Globe size={12} /> Website
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PHYSICAL SEDCARD & MEASUREMENTS */}
            {modalTab === 'specs' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Official Modeling Sedcard & Physical Stats
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Verified measurements for costume sizing and role matching</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Height', value: selectedTalentModal.height || selectedTalentModal.physicalDetails?.height || "5'9\"" },
                    { label: 'Weight', value: selectedTalentModal.weight || selectedTalentModal.physicalDetails?.weight || "65 kg" },
                    { label: 'Chest / Bust', value: selectedTalentModal.chest || selectedTalentModal.physicalDetails?.chest || '38"' },
                    { label: 'Waist', value: selectedTalentModal.waist || selectedTalentModal.physicalDetails?.waist || '32"' },
                    { label: 'Hips', value: selectedTalentModal.hips || selectedTalentModal.physicalDetails?.hips || '36"' },
                    { label: 'Eye Color', value: selectedTalentModal.eyeColor || selectedTalentModal.physicalDetails?.eyeColor || 'Brown' },
                    { label: 'Hair Color', value: selectedTalentModal.hairColor || selectedTalentModal.physicalDetails?.hairColor || 'Black' },
                    { label: 'Complexion', value: selectedTalentModal.complexion || selectedTalentModal.physicalDetails?.complexion || 'Fair' },
                    { label: 'Shoe Size', value: selectedTalentModal.shoeSize || selectedTalentModal.physicalDetails?.shoeSize || '9 UK' },
                    { label: 'Gender', value: selectedTalentModal.gender || 'Not specified' },
                    { label: 'Experience', value: selectedTalentModal.experience || '2+ Years' },
                    { label: 'Availability', value: selectedTalentModal.availability || 'Available' }
                  ].map((stat, sIdx) => (
                    <div key={sIdx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{stat.label}</span>
                      <span className="text-sm font-black text-slate-900 mt-1 block">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: RATES & CREDITS */}
            {modalTab === 'rates' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Booking Rates & Commercial Pricing
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Platform escrow protected payments</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 block">Full Day Shoot Rate (8 hrs)</span>
                    <span className="text-xl font-black text-violet-900 mt-1 block">
                      {selectedTalentModal.dayRate || (selectedTalentModal.pricing?.dayRate ? ('₹' + Number(selectedTalentModal.pricing.dayRate).toLocaleString('en-IN')) : '₹15,000 / day')}
                    </span>
                    <span className="text-[11px] text-violet-600 mt-1 block">Includes standard makeup prep time</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Hourly Rate</span>
                    <span className="text-xl font-black text-slate-900 mt-1 block">
                      {selectedTalentModal.hourlyRate || (selectedTalentModal.pricing?.hourlyRate ? ('₹' + Number(selectedTalentModal.pricing.hourlyRate).toLocaleString('en-IN')) : '₹2,000 / hr')}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">Min. 2 hours booking</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Project / Campaign Rate</span>
                    <span className="text-xl font-black text-slate-900 mt-1 block">
                      {selectedTalentModal.projectRate || (selectedTalentModal.pricing?.projectRate ? ('₹' + Number(selectedTalentModal.pricing.projectRate).toLocaleString('en-IN')) : 'Available on Request')}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">Commercial digital buyout</span>
                  </div>
                </div>

                {/* Past Work Credits */}
                {((selectedTalentModal.credits && selectedTalentModal.credits.length > 0) || (selectedTalentModal.previousProjects && selectedTalentModal.previousProjects.length > 0)) && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Past Film & OTT Projects / Credits
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[...(selectedTalentModal.credits || []), ...(selectedTalentModal.previousProjects || [])].filter(Boolean).map((credit, cIdx) => (
                        <span key={cIdx} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                          🎬 {credit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Brand Campaigns */}
                {selectedTalentModal.previousBrands && selectedTalentModal.previousBrands.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Previous Brand Associations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTalentModal.previousBrands.map((brand, bIdx) => (
                        <span key={bIdx} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                          🏷️ {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* MODAL FOOTER */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Escrow Protected • 100% Verified Identity
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedTalentModal(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                Close
              </button>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar size={13} />
                Direct Book / Request Audition
              </Link>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* LIGHTBOX FOR FULL-RESOLUTION IMAGE PREVIEW */}
    {lightboxImage && (
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 cursor-zoom-out"
        onClick={() => setLightboxImage(null)}
      >
        <button
          type="button"
          onClick={() => setLightboxImage(null)}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
        >
          <X size={24} />
        </button>
        <img
          src={lightboxImage}
          alt="Preview"
          className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    )}
  </PublicLayout>;
}