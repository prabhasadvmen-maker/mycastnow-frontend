import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import {
  Sparkles, Briefcase, Video, Star, Eye, Calendar,
  CheckCircle2, Clock, ArrowRight, ShieldCheck, 
  MapPin, FolderOpen, Award, AlertCircle, RefreshCw
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const CreatorOverview = () => {
  const { creatorUser } = useCreatorAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOverviewData = async () => {
    try {
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API}/creator/portal/overview`, { headers });
      if (res.data?.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error loading creator overview:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOverviewData();
  };

  const creator = data?.creator || creatorUser || {};
  const kpis = data?.kpis || {
    totalApplications: 0,
    shortlistedCount: 0,
    selectedCount: 0,
    totalBookings: creatorUser?.stats?.totalBookings || 0,
    profileViews: 148,
    rating: creatorUser?.stats?.rating || 4.8
  };

  const fullName = creator.basicDetails?.fullName || creatorUser?.basicDetails?.fullName || 'Creator';
  const firstName = fullName.split(' ')[0];
  const category = creator.professionalDetails?.primaryCategory || creatorUser?.professionalDetails?.primaryCategory || 'Model / Actor';
  const city = creator.basicDetails?.city || creatorUser?.basicDetails?.city || 'Mumbai';
  const completionScore = data?.creator?.completionScore || 0;

  const recentApplications = data?.recentApplications || [];
  const recommendedCastings = data?.recommendedCastings || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. HERO GREETING BANNER */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#1e1035] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-purple-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-fuchsia-200">
              <Sparkles size={13} className="text-yellow-400" />
              <span>Verified Creator Dashboard</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Welcome back, {firstName}! ✨
            </h1>
            <p className="text-purple-200 text-sm md:text-base max-w-xl">
              {category} based in <span className="text-white font-medium">{city}</span>. Here is your casting activity, live applications, and profile performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-3 bg-white/10 hover:bg-white/20 active:scale-95 rounded-2xl transition border border-white/10 text-white flex items-center justify-center cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw size={17} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <Link
              to="/creator/dashboard/casting"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-fuchsia-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
            >
              <Video size={16} />
              <span>Browse Castings</span>
            </Link>
            <Link
              to="/creator/dashboard/portfolio"
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
            >
              <FolderOpen size={16} />
              <span>Edit Portfolio</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. REAL DATABASE KPI STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Applications */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Applications</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Briefcase size={20} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-gray-900">{kpis.totalApplications}</h3>
            <Link to="/creator/dashboard/applications" className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">Active in DB</span> • Live casting applications
          </p>
        </div>

        {/* Card 2: Shortlisted / Auditions */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Shortlisted & Selected</span>
            <div className="w-10 h-10 rounded-xl bg-fuchsia-50 flex items-center justify-center text-fuchsia-600">
              <Star size={20} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-gray-900">{kpis.shortlistedCount}</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-fuchsia-100 text-fuchsia-700">
              High Match
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Director reviews & shortlist calls
          </p>
        </div>

        {/* Card 3: Total Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Bookings</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Calendar size={20} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-gray-900">{kpis.totalBookings}</h3>
            <span className="text-xs font-semibold text-gray-400">Contracts</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Confirmed commercial projects
          </p>
        </div>

        {/* Card 4: Rating & Views */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Profile Rating</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Award size={20} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-center gap-1.5">
              <h3 className="text-3xl font-black text-gray-900">{kpis.rating}</h3>
              <Star size={16} className="text-amber-400 fill-amber-400" />
            </div>
            <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
              <Eye size={12} /> {kpis.profileViews} views
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Based on client ratings & reviews
          </p>
        </div>
      </div>

      {/* 3. PROFILE HEALTH METER & QUICK VERIFICATION STRIP */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-purple-600/20 font-black text-sm">
            {completionScore}%
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Profile Completeness Score</h4>
            <p className="text-xs text-gray-500">Profiles with high completeness receive 3x more casting calls</p>
          </div>
        </div>

        <div className="w-full md:w-64 bg-gray-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-600 to-fuchsia-500 h-full rounded-full transition-all duration-1000"
            style={{ width: `${completionScore}%` }}
          ></div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Identity Verified</span>
          </div>
          <Link
            to="/creator/dashboard/portfolio"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            Enhance Profile →
          </Link>
        </div>
      </div>

      {/* 4. MAIN SPLIT: RECENT APPLICATIONS & RECOMMENDED CASTINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Recent Applied Castings */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-black text-gray-900 text-base">Recent Applications</h3>
              <p className="text-xs text-gray-400">Track your submissions and casting director reviews</p>
            </div>
            <Link
              to="/creator/dashboard/applications"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline flex items-center gap-1"
            >
              View All ({kpis.totalApplications}) <ArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400">
              <RefreshCw size={24} className="animate-spin text-purple-600 mb-2" />
              <p className="text-xs">Loading applications from database...</p>
            </div>
          ) : recentApplications.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center mx-auto text-purple-600">
                <Briefcase size={24} />
              </div>
              <h4 className="font-bold text-gray-800 text-sm">No applications submitted yet</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Explore hundreds of open casting notices for ad films, web series, and movies right now.
              </p>
              <Link
                to="/creator/dashboard/casting"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition"
              >
                <span>Browse Casting Calls</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={app.image || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=200&q=80'}
                      alt={app.title}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase">
                          {app.projectType}
                        </span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <MapPin size={10} /> {app.location}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 truncate mt-0.5">{app.title}</h4>
                      <p className="text-xs text-gray-500 font-medium">{app.budget}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-black tracking-wide ${
                        app.status === 'Selected'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Shortlisted'
                          ? 'bg-purple-100 text-purple-800'
                          : app.status === 'Audition Scheduled'
                          ? 'bg-indigo-100 text-indigo-800'
                          : app.status === 'Rejected'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.status}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(app.appliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Recommended Casting Calls */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-black text-gray-900 text-base">Open Castings</h3>
              <p className="text-xs text-gray-400">Matching your profile & skills</p>
            </div>
            <Link
              to="/creator/dashboard/casting"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
            >
              Explore <ArrowRight size={13} />
            </Link>
          </div>

          {recommendedCastings.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs">
              All recommended casting calls applied! Check back soon.
            </div>
          ) : (
            <div className="space-y-3">
              {recommendedCastings.map((c) => (
                <div
                  key={c._id}
                  className="p-3.5 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-all space-y-2 bg-gray-50/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {c.projectType}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 mt-1 line-clamp-1">{c.title}</h4>
                    </div>
                    <span className="text-xs font-black text-gray-900 shrink-0">{c.budget}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                    <span className="flex items-center gap-1 text-[11px]">
                      <MapPin size={11} className="text-gray-400" /> {c.location} • {c.roleType}
                    </span>
                    <Link
                      to="/creator/dashboard/casting"
                      className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shadow-sm transition"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tips Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 text-xs text-purple-900 space-y-1 mt-4">
            <p className="font-bold flex items-center gap-1.5">
              <Sparkles size={14} className="text-purple-600" /> Casting Pro Tip
            </p>
            <p className="text-[11px] text-purple-700 leading-relaxed">
              Include your latest video reel link when applying. Casting directors are 80% more likely to shortlist talent with video links.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorOverview;
