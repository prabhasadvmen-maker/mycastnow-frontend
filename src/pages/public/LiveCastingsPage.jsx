import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Clapperboard, Search, MapPin, Calendar, DollarSign,
  Sparkles, ShieldCheck, ArrowRight, ArrowUpRight, Building2,
  Filter, CheckCircle2, ChevronRight
} from 'lucide-react';
import PublicLayout from '../../components/public/PublicLayout';
import { useCreatorAuth } from '../../context/CreatorAuthContext';

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

const LiveCastingsPage = () => {
  const { creatorUser } = useCreatorAuth();
  const [castings, setCastings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCasting, setSelectedCasting] = useState(null);

  useEffect(() => {
    const fetchCastings = async () => {
      try {
        const res = await axios.get(`${API}/public/landing`);
        if (res.data?.success && res.data.castings?.length > 0) {
          setCastings(res.data.castings);
        }
      } catch (err) {
        console.error('Failed to load castings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCastings();
  }, []);

  const roles = ['All', 'Actor', 'Model', 'Dancer', 'Voice Artist'];
  const locations = ['All', 'Mumbai', 'Delhi', 'Goa', 'Jaipur', 'Bangalore'];

  const filtered = castings.filter((c) => {
    const matchRole = selectedRole === 'All' || c.roleType?.toLowerCase() === selectedRole.toLowerCase();
    const matchLoc = selectedLocation === 'All' || (c.location && c.location.toLowerCase().includes(selectedLocation.toLowerCase()));
    const matchQuery = !searchQuery || 
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.projectType?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchLoc && matchQuery;
  });

  return (
    <PublicLayout>
      {/* ────────────────── HERO BANNER ────────────────── */}
      <section className="bg-gradient-to-b from-purple-50/80 via-white to-[#f8fafc] py-14 md:py-20 border-b border-purple-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-800 mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>VERIFIED LIVE AUDITION CALLS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Live Casting Calls Awaiting Applications
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Explore verified auditions for Bollywood movies, top OTT web series, TV commercials & runway campaigns. Direct submissions with zero middleman commissions.
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-8 max-w-4xl mx-auto bg-white p-3 sm:p-4 rounded-3xl shadow-xl shadow-purple-900/5 border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-5 relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search project, character, brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-600"
                >
                  {roles.map(r => <option key={r} value={r}>Role: {r}</option>)}
                </select>
              </div>

              <div className="sm:col-span-4">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-600"
                >
                  {locations.map(loc => <option key={loc} value={loc}>Location: {loc}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── CASTINGS GRID (4 CARDS PER ROW) ────────────────── */}
      <section className="py-16 max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm font-bold text-slate-700">
            Showing <span className="text-purple-600">{filtered.length}</span> active live castings
          </p>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span> Real-time Verified
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
            <Clapperboard size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No active castings matched</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing your filters or search keywords.</p>
            <button
              onClick={() => { setSelectedRole('All'); setSelectedLocation('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-purple-50 text-purple-700 text-xs font-bold rounded-xl hover:bg-purple-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((c) => (
              <div
                key={c._id}
                onClick={() => setSelectedCasting(c)}
                className="group bg-white border border-slate-200 hover:border-purple-400 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Poster Thumbnail */}
                  <div className="w-full h-48 rounded-2xl bg-slate-900 border border-slate-200 overflow-hidden relative mb-4">
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                        <Clapperboard size={36} className="text-purple-400 mb-1" />
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Live Casting</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-slate-950/80 text-white backdrop-blur-md flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      {c.projectType || 'Casting'}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 text-white backdrop-blur-md shadow-xs">
                      {c.budget || 'Competitive'}
                    </span>
                  </div>

                  {/* Title & Role */}
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-700 mb-1">
                    <span>Role: {c.roleType || 'Actor'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500 font-semibold truncate">
                      <MapPin size={11} /> {c.location || 'Mumbai'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-purple-700 transition-colors">
                    {c.title}
                  </h3>

                  {c.description && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  )}
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-600 flex items-center gap-1.5 truncate max-w-[130px]">
                    <Building2 size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate font-semibold">{c.company?.name || 'Verified Production'}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedCasting(c); }}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white text-xs font-bold transition-all border border-purple-200 flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    Apply Now <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ────────────────── CASTING DETAIL MODAL ────────────────── */}
      {selectedCasting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl my-auto text-slate-800">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100 flex items-start justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 mb-2 inline-block">
                  {selectedCasting.projectType || 'Audition'} • Role: {selectedCasting.roleType || 'Actor'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {selectedCasting.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <Building2 size={13} className="text-slate-400" />
                  <span>Posted by <strong className="text-slate-700">{selectedCasting.company?.name || 'Verified Production'}</strong></span>
                </p>
              </div>
              <button
                onClick={() => setSelectedCasting(null)}
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer shadow-xs shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] text-slate-400 font-bold uppercase">Budget / Payout</p>
                  <p className="font-extrabold text-emerald-700 text-sm mt-0.5">{selectedCasting.budget || 'Competitive'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] text-slate-400 font-bold uppercase">Location</p>
                  <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    <MapPin size={13} className="text-purple-600" /> {selectedCasting.location || 'Mumbai'}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <p className="text-[11px] text-slate-400 font-bold uppercase">Deadline</p>
                  <p className="font-bold text-amber-600 mt-0.5">
                    {selectedCasting.deadline ? new Date(selectedCasting.deadline).toLocaleDateString() : 'Open'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Project & Role Details:</p>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {selectedCasting.description || 'Verified casting call posted by registered company on MyCastNow.'}
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-center gap-3">
                <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
                <span>100% Verified Project with guaranteed escrow payout upon selection and shoot completion.</span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4 shrink-0">
              <button
                onClick={() => setSelectedCasting(null)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              {creatorUser ? (
                <Link
                  to="/creator/dashboard"
                  onClick={() => setSelectedCasting(null)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Clapperboard size={14} /> Submit via Creator Dashboard
                </Link>
              ) : (
                <Link
                  to="/creator/login"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Clapperboard size={14} /> Login to Submit Audition
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
};

export default LiveCastingsPage;
