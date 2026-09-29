import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Film, Users, FolderOpen, Wallet, Plus, Search,
  ArrowRight, CheckCircle, Clock, Calendar, MapPin,
  Sparkles, DollarSign, MessageSquare, TrendingUp, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

const CompanyOverview = () => {
  const [stats, setStats] = useState({
    activeCastings: 0,
    totalAuditions: 0,
    cartCount: 0,
    hiresCount: 0,
    walletBalance: 0,
    escrowLocked: 0
  });
  const [recentCastings, setRecentCastings] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOverviewData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // 1. Fetch Castings
      const castingRes = await axios.get(`${API}/company/casting`, { headers }).catch(() => null);
      // 2. Fetch Cart
      const cartRes = await axios.get(`${API}/company/talent/cart/list`, { headers }).catch(() => null);
      // 3. Fetch Bookings
      const bookingsRes = await axios.get(`${API}/company/talent/bookings`, { headers }).catch(() => null);
      // 4. Fetch Wallet
      const walletRes = await axios.get(`${API}/company/wallet`, { headers }).catch(() => null);

      const castings = castingRes?.data?.castings || [];
      const cStats = castingRes?.data?.stats || {};
      const cartItems = cartRes?.data?.items || [];
      const bookings = bookingsRes?.data?.bookings || [];
      const wData = walletRes?.data?.wallet || {};

      setStats({
        activeCastings: cStats.openCastings || castings.filter(c => c.status === 'Open').length || 0,
        totalAuditions: cStats.totalApplicants || 0,
        cartCount: cartItems.length || 0,
        hiresCount: bookings.filter(b => b.status === 'Confirmed').length || 0,
        walletBalance: wData.balance || 0,
        escrowLocked: wData.escrowBalance || 0
      });

      setRecentCastings(castings.slice(0, 3));
      setRecentBookings(bookings.slice(0, 3));

    } catch (err) {
      console.error('Fetch overview error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">

      {/* ── Welcome Banner ── */}
      <div className="bg-gradient-to-r from-[#0b1120] via-[#121c33] to-[#1e1b4b] rounded-3xl p-6 text-white shadow-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
              <Sparkles size={12} className="text-blue-400" />
              Verified Production Portal
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Live Studio Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome to your company dashboard
          </h1>
          <p className="text-xs text-gray-300 max-w-2xl">
            Broadcast audition requirements, discover top actors & models, review audition reels, and disburse secure contract escrow payments.
          </p>
        </div>

        {/* Quick Primary Actions */}
        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto shrink-0">
          <Link
            to="/company/dashboard/casting"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition active:scale-95"
          >
            <Plus size={14} />
            <span>Post Casting Call</span>
          </Link>

          <Link
            to="/company/dashboard/find-talent"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition active:scale-95"
          >
            <Search size={14} />
            <span>Discover Talent</span>
          </Link>
        </div>
      </div>

      {/* ── 4 Key Metric Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Castings */}
        <Link
          to="/company/dashboard/casting"
          className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Active Castings</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
              <Film size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{stats.activeCastings}</h3>
            <span className="text-[11px] text-indigo-600 font-bold mt-1.5 flex items-center gap-1">
              {stats.totalAuditions} Auditions Received <ArrowRight size={11} />
            </span>
          </div>
        </Link>

        {/* Shortlisted Cart */}
        <Link
          to="/company/dashboard/talent-cart"
          className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Talent Shortlist</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition">
              <Users size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-purple-600 leading-none">{stats.cartCount}</h3>
            <span className="text-[11px] text-gray-400 font-semibold mt-1.5 flex items-center gap-1">
              Ready for Booking <ArrowRight size={11} />
            </span>
          </div>
        </Link>

        {/* Confirmed Contracts */}
        <Link
          to="/company/dashboard/hires"
          className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Confirmed Hires</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
              <FolderOpen size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-emerald-600 leading-none">{stats.hiresCount}</h3>
            <span className="text-[11px] text-gray-400 font-semibold mt-1.5 flex items-center gap-1">
              Active Project Contracts <ArrowRight size={11} />
            </span>
          </div>
        </Link>

        {/* Wallet Balance */}
        <Link
          to="/company/dashboard/wallet"
          className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Wallet Balance</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
              <Wallet size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-none">{fmt(stats.walletBalance)}</h3>
            <span className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
              {fmt(stats.escrowLocked)} in Escrow <ArrowRight size={11} />
            </span>
          </div>
        </Link>
      </div>

      {/* ── 2 Main Grid Sections: Recent Castings & Active Hires ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Casting Calls */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-gray-900">Active Casting Calls</h3>
              <p className="text-xs text-gray-400">Auditions received from top actors and models</p>
            </div>
            <Link
              to="/company/dashboard/casting"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {recentCastings.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 space-y-2">
                <Film size={24} className="mx-auto text-gray-300" />
                <p>No active casting calls yet.</p>
              </div>
            ) : (
              recentCastings.map(c => (
                <div
                  key={c.id || c._id}
                  className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-center justify-between gap-3 hover:bg-gray-100/60 transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={c.image || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=200&q=80'}
                      alt={c.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-black text-gray-900 truncate max-w-xs">{c.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {c.projectType} • Role: <b>{c.roleType}</b>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-indigo-600 block">
                      {c.applicantsCount || 0} Auditions
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">
                      {c.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Hires & Contracts */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-gray-900">Project Hires & Contracts</h3>
              <p className="text-xs text-gray-400">Shoot bookings and talent milestone payments</p>
            </div>
            <Link
              to="/company/dashboard/hires"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {recentBookings.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 space-y-2">
                <FolderOpen size={24} className="mx-auto text-gray-300" />
                <p>No confirmed project contracts yet.</p>
              </div>
            ) : (
              recentBookings.map(b => (
                <div
                  key={b.id || b._id}
                  className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-center justify-between gap-3 hover:bg-gray-100/60 transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={b.creator?.basicDetails?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={b.projectTitle}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-black text-gray-900 truncate max-w-xs">{b.projectTitle}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Talent: <b>{b.creator?.basicDetails?.fullName || 'Creator'}</b>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-emerald-600 block">
                      {fmt(b.amount)}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600">
                      {b.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default CompanyOverview;
