import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Star, MessageSquare, ThumbsUp, Building2, UserCircle,
  Search, Filter, CheckCircle2, AlertTriangle, Eye, Trash2,
  Calendar, Award, ArrowRight, ShieldCheck, X, RefreshCw,
  Sparkles, CheckCheck, TrendingUp
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const AdminReviews = () => {
  const [stats, setStats]               = useState(null);
  const [reviews, setReviews]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [filterType, setFilterType]     = useState('All'); // 'All' | 'CompanyToCreator' | 'CreatorToCompany'
  const [filterRating, setFilterRating] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedReview, setSelectedReview] = useState(null);

  // Fetch Stats and Reviews
  const fetchAll = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType !== 'All') params.type = filterType;
      if (filterRating !== 'All') params.rating = filterRating;
      if (filterStatus !== 'All') params.status = filterStatus;
      if (search.trim()) params.search = search.trim();

      const [statsRes, revRes] = await Promise.all([
        axios.get(`${API}/admin/reviews/stats`),
        axios.get(`${API}/admin/reviews`, { params })
      ]);

      setStats(statsRes.data?.stats || null);
      setReviews(revRes.data?.data || []);
    } catch (err) {
      console.error('Fetch reviews error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [filterType, filterRating, filterStatus]);

  useEffect(() => {
    const t = setTimeout(fetchAll, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Status moderation (Published, Flagged, Hidden)
  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${API}/admin/reviews/${id}/status`, { status });
      setReviews(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      if (selectedReview?._id === id) setSelectedReview(prev => ({ ...prev, status }));
    } catch {
      alert('Failed to update review status');
    }
  };

  // Delete review
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await axios.delete(`${API}/admin/reviews/${id}`);
      setReviews(prev => prev.filter(r => r._id !== id));
      if (selectedReview?._id === id) setSelectedReview(null);
      fetchAll();
    } catch {
      alert('Failed to delete review');
    }
  };

  // Date Formatter
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : '—';

  // Render Stars
  const renderStars = (rating) => (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-100'}
        />
      ))}
      <span className="ml-1 text-xs font-bold text-gray-700">{rating}.0</span>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
            <Star size={24} className="fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Reviews & Ratings
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center gap-1">
                <ShieldCheck size={12} className="text-amber-600" />
                Bilateral Feedback
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Companies aur Creators ke aapas me diye gaye sabhi ratings aur detailed reviews ka central record.
            </p>
          </div>
        </div>

        <button
          onClick={fetchAll}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-xs border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      {/* ── KPI Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* 1. Overall Average Rating */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#1a1202] to-[#2e1d00] text-white border border-amber-500/30 shadow-lg shadow-amber-950/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300/80">Platform Rating</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Star size={16} className="fill-amber-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-white">{stats?.averageRating || 0}</p>
              <span className="text-xs text-amber-200/60 font-medium">/ 5.0</span>
            </div>
            <p className="text-xs text-amber-200/70 mt-1">Based on {stats?.totalReviews || 0} reviews</p>
          </div>
          <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between text-[11px] text-amber-200">
            <span>Customer Satisfaction</span>
            <span className="font-bold text-amber-300">96% Positive</span>
          </div>
        </div>

        {/* 2. Total Reviews */}
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Reviews</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <MessageSquare size={16} />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900">{stats?.totalReviews || 0}</p>
            <p className="text-xs text-gray-400 mt-1">100% Verified post-project reviews</p>
          </div>
          <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-[11px] text-gray-500">
            <span>Verified Bookings</span>
            <span className="text-emerald-600 font-bold">100% Genuine</span>
          </div>
        </div>

        {/* 3. Company -> Creator */}
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Company ➔ Creator</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Building2 size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-gray-900">{stats?.companyToCreatorCount || 0}</p>
              <span className="text-xs font-bold text-indigo-600">Avg {stats?.avgCompanyToCreator || 0}★</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Companies evaluating talent</p>
          </div>
          <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-[11px] text-gray-500">
            <span>Client Feedback</span>
            <span className="text-indigo-600 font-semibold">Quality Verified</span>
          </div>
        </div>

        {/* 4. Creator -> Company */}
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Creator ➔ Company</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <UserCircle size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-gray-900">{stats?.creatorToCompanyCount || 0}</p>
              <span className="text-xs font-bold text-purple-600">Avg {stats?.avgCreatorToCompany || 0}★</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Talent evaluating companies</p>
          </div>
          <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-[11px] text-gray-500">
            <span>Creator Experience</span>
            <span className="text-purple-600 font-semibold">Payment & Set Safety</span>
          </div>
        </div>

      </div>

      {/* ── Filters & Quick Switcher ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
        {/* Top Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap border-b border-gray-100 pb-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Feedback Direction:</span>
          {[
            { id: 'All', label: `All Reviews (${stats?.totalReviews || 0})` },
            { id: 'CompanyToCreator', label: `🏢 Company ➔ Creator (${stats?.companyToCreatorCount || 0})` },
            { id: 'CreatorToCompany', label: `👤 Creator ➔ Company (${stats?.creatorToCompanyCount || 0})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === tab.id
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Select dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by reviewer, reviewee name, project, or review feedback..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="text-gray-400 w-4 h-4 shrink-0" />
            <select
              value={filterRating}
              onChange={e => setFilterRating(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 bg-white"
            >
              <option value="All">All Star Ratings</option>
              <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
              <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
              <option value="3">⭐⭐⭐ (3 Stars)</option>
              <option value="2">⭐⭐ (2 Stars)</option>
              <option value="1">⭐ (1 Star)</option>
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published Only</option>
              <option value="Flagged">Flagged</option>
              <option value="Hidden">Hidden</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Reviews Cards Feed ── */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl p-16 text-center text-gray-400 border border-gray-100 shadow-sm">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading reviews data...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center text-gray-400 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star size={24} className="fill-amber-400 text-amber-400" />
            </div>
            <p className="font-bold text-gray-700 text-base">Koi review nahi mila</p>
            <p className="text-xs text-gray-400 mt-1">Filters change karein ya live reviews ka wait karein.</p>
          </div>
        ) : (
          reviews.map(r => {
            const isCompanyReviewer = r.reviewType === 'CompanyToCreator';

            return (
              <div
                key={r._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-amber-200 transition space-y-4"
              >
                {/* Review Header: Reviewer ➔ Target */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    {/* Direction Badge */}
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                      isCompanyReviewer
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}>
                      {isCompanyReviewer ? <Building2 size={13} /> : <UserCircle size={13} />}
                      {isCompanyReviewer ? 'Company ➔ Creator' : 'Creator ➔ Company'}
                    </span>

                    {/* Parties */}
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800 flex-wrap">
                      <span className="text-gray-900 font-extrabold">{r.reviewerName}</span>
                      <ArrowRight size={13} className="text-gray-400" />
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        {r.targetName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-medium">
                      {fmtDate(r.createdAt)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                      r.status === 'Published'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : r.status === 'Flagged'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                </div>

                {/* Rating & Project Title */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {renderStars(r.rating)}
                    {r.title && (
                      <h4 className="text-sm font-black text-gray-900">
                        "{r.title}"
                      </h4>
                    )}
                  </div>

                  {r.projectTitle && (
                    <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-xl border border-gray-200 font-medium">
                      🎬 Project: <b className="text-gray-700">{r.projectTitle}</b>
                    </span>
                  )}
                </div>

                {/* Review Comment Text */}
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                  {r.comment}
                </p>

                {/* Criteria Ratings Breakdown */}
                {r.criteria && (
                  <div className="flex flex-wrap gap-2 pt-1 text-xs">
                    {r.criteria.professionalism && (
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 font-medium">
                        Professionalism: <b>{r.criteria.professionalism}/5</b>
                      </span>
                    )}
                    {r.criteria.communication && (
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 font-medium">
                        Communication: <b>{r.criteria.communication}/5</b>
                      </span>
                    )}
                    {r.criteria.punctuality && (
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 font-medium">
                        Punctuality: <b>{r.criteria.punctuality}/5</b>
                      </span>
                    )}
                    {r.criteria.workQuality && (
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 font-medium">
                        Work Quality: <b>{r.criteria.workQuality}/5</b>
                      </span>
                    )}
                  </div>
                )}

                {/* Moderation Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-semibold">Moderation:</span>
                    {r.status !== 'Published' && (
                      <button
                        onClick={() => handleStatusChange(r._id, 'Published')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold transition"
                      >
                        Publish
                      </button>
                    )}
                    {r.status !== 'Flagged' && (
                      <button
                        onClick={() => handleStatusChange(r._id, 'Flagged')}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold transition"
                      >
                        Flag Review
                      </button>
                    )}
                    {r.status !== 'Hidden' && (
                      <button
                        onClick={() => handleStatusChange(r._id, 'Hidden')}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold transition"
                      >
                        Hide
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedReview(r)}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition flex items-center gap-1"
                    >
                      <Eye size={13} /> Full Details
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete Review"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* ── MODAL: FULL REVIEW DETAIL ── */}
      {/* ══════════════════════════════════════════════════════ */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[95vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Star size={20} className="fill-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Review Details</h3>
                  <p className="text-xs text-gray-400">ID: {selectedReview._id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedReview(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={18} />
              </button>
            </div>

            {/* Direction & Rating */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                  {selectedReview.reviewType === 'CompanyToCreator' ? '🏢 Company ➔ Creator Review' : '👤 Creator ➔ Company Review'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-emerald-700 border border-emerald-200">
                  {selectedReview.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {renderStars(selectedReview.rating)}
                <span className="text-xs text-gray-500">({selectedReview.rating} out of 5 Stars)</span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Reviewer:</span>
                <span className="font-bold text-gray-900">{selectedReview.reviewerName} ({selectedReview.reviewerType})</span>
              </div>
              {selectedReview.reviewerEmail && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Reviewer Email:</span>
                  <span className="font-mono text-gray-700">{selectedReview.reviewerEmail}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Reviewed Person / Entity:</span>
                <span className="font-bold text-amber-800">{selectedReview.targetName} ({selectedReview.targetType})</span>
              </div>
              {selectedReview.projectTitle && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Associated Project:</span>
                  <span className="font-semibold text-gray-800">{selectedReview.projectTitle}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Submitted On:</span>
                <span className="text-gray-700">{fmtDate(selectedReview.createdAt)}</span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <p className="text-xs font-bold text-gray-700 mb-1.5">Feedback / Comments:</p>
              {selectedReview.title && (
                <p className="text-xs font-black text-gray-900 mb-1">"{selectedReview.title}"</p>
              )}
              <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
                {selectedReview.comment}
              </p>
            </div>

            <button
              onClick={() => setSelectedReview(null)}
              className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminReviews;
