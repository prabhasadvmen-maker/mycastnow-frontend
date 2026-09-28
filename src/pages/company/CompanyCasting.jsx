import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Film, Video, Plus, Search, Filter, Calendar, MapPin,
  DollarSign, Users, CheckCircle, Clock, Eye, Sparkles,
  ChevronRight, X, Check, AlertCircle, RefreshCw, Send,
  SlidersHorizontal, Briefcase, FileText, ArrowRight, UserCheck,
  Trash2, Upload, Image as ImageIcon, ExternalLink, AlertTriangle, Tag
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const POSTER_PRESETS = [
  { label: '🎬 Movie / Cinema', url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80' },
  { label: '📺 Web Series', url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80' },
  { label: '💄 Fashion Shoot', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80' },
  { label: '📢 Commercial / TVC', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80' },
  { label: '🎙️ Voice / Studio', url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80' }
];

const CompanyCasting = () => {
  const [castings, setCastings] = useState([]);
  const [stats, setStats] = useState({ totalCastings: 0, openCastings: 0, totalApplicants: 0, shortlistedCount: 0 });
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Open' | 'Closed'
  const [search, setSearch] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reviewModalCasting, setReviewModalCasting] = useState(null);
  const [viewModalCasting, setViewModalCasting] = useState(null);
  const [deleteModalCasting, setDeleteModalCasting] = useState(null);
  const [applicantFilter, setApplicantFilter] = useState('All');

  // Image Upload State
  const [imageUploading, setImageUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  // Create Form State
  const [formData, setFormData] = useState({
    title: '',
    projectType: 'Web Series',
    roleType: 'Actor',
    gender: 'Any',
    ageRange: '20-28 Years',
    location: 'Mumbai',
    shootDates: '',
    budget: '₹25,000 / day',
    deadline: '',
    description: '',
    requirements: '',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80'
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch Company Castings
  const fetchCastings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await axios.get(`${API}/company/casting?${params.toString()}`, { headers });
      if (res.data?.success) {
        setCastings(res.data.castings || []);
        if (res.data.stats) setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Fetch castings error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCastings();
  }, [statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCastings();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle Create Casting Call
  const handleCreateCasting = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Project title is required');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(`${API}/company/casting`, formData, { headers });
      if (res.data?.success) {
        setCreateModalOpen(false);
        setFormData({
          title: '',
          projectType: 'Web Series',
          roleType: 'Actor',
          gender: 'Any',
          ageRange: '20-28 Years',
          location: 'Mumbai',
          shootDates: '',
          budget: '₹25,000 / day',
          deadline: '',
          description: '',
          requirements: '',
          image: ''
        });
        fetchCastings();
      }
    } catch (err) {
      console.error('Create error:', err);
      setFormError(err.response?.data?.message || 'Failed to create casting notice');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Image Upload from Local Device
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      // Immediate local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);

      // Upload to server
      const uploadData = new FormData();
      uploadData.append('files', file);
      const res = await axios.post(`${API}/upload/portfolio`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success && res.data.files?.[0]?.url) {
        setFormData(prev => ({ ...prev, image: res.data.files[0].url }));
      }
    } catch (err) {
      console.log('Upload fallback to local DataURL preview:', err);
    } finally {
      setImageUploading(false);
    }
  };

  // Delete Casting Notice
  const handleDeleteCasting = async (castingId) => {
    setDeleting(true);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.delete(`${API}/company/casting/${castingId}`, { headers });
      if (res.data?.success) {
        setCastings(prev => prev.filter(c => (c.id || c._id) !== castingId));
        setDeleteModalCasting(null);
        if (viewModalCasting && (viewModalCasting.id || viewModalCasting._id) === castingId) {
          setViewModalCasting(null);
        }
        fetchCastings();
      }
    } catch (err) {
      console.error('Delete casting error:', err);
      alert(err.response?.data?.message || 'Failed to delete casting notice');
    } finally {
      setDeleting(false);
    }
  };

  // Toggle Casting Status (Open/Closed)
  const handleToggleStatus = async (castingId, currentStatus) => {
    const newStatus = currentStatus === 'Open' ? 'Closed' : 'Open';
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.put(`${API}/company/casting/${castingId}/status`, { status: newStatus }, { headers });
      if (res.data?.success) {
        setCastings(prev => prev.map(c => c.id === castingId ? { ...c, status: newStatus } : c));
        fetchCastings();
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  // Update Applicant Status
  const handleUpdateApplicantStatus = async (castingId, creatorId, newStatus) => {
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.put(`${API}/company/casting/${castingId}/applicant/status`, {
        creatorId,
        status: newStatus
      }, { headers });

      if (res.data?.success) {
        // Update local modal state
        setReviewModalCasting(prev => {
          if (!prev) return null;
          const updatedApps = prev.applicants.map(a => {
            const appCreatorId = a.creator?._id || a.creator?.id || a.creator;
            if (appCreatorId?.toString() === creatorId?.toString()) {
              return { ...a, status: newStatus };
            }
            return a;
          });
          return { ...prev, applicants: updatedApps };
        });
        fetchCastings();
      }
    } catch (err) {
      console.error('Update applicant status error:', err);
    }
  };

  // Filtered applicants in modal
  const modalApplicants = (reviewModalCasting?.applicants || []).filter(app => {
    if (applicantFilter === 'All') return true;
    return app.status === applicantFilter;
  });

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="bg-gradient-to-r from-[#0b1120] via-[#121c33] to-[#1e1b4b] rounded-3xl p-6 text-white shadow-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1">
              <Film size={12} className="text-indigo-400" />
              Auditions & Casting Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Live Company Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Casting Calls & Audition Notices
          </h1>
          <p className="text-xs text-gray-300 max-w-2xl">
            Post casting notices for movies, commercials, OTT series, and brand campaigns. Receive auditions and shortlist top creators.
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-black text-xs shadow-xl shadow-indigo-600/30 transition active:scale-95 shrink-0 self-start md:self-auto"
        >
          <Plus size={16} />
          <span>Post Casting Call</span>
        </button>
      </div>

      {/* ── Top 4 Performance KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Notices</span>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{stats.totalCastings}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Film size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Active Open Calls</span>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{stats.openCastings}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Auditions</span>
            <p className="text-2xl font-black text-purple-600 mt-0.5">{stats.totalApplicants}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Shortlisted Talent</span>
            <p className="text-2xl font-black text-indigo-600 mt-0.5">{stats.shortlistedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <UserCheck size={18} />
          </div>
        </div>
      </div>

      {/* ── Search & Filter Tabs ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search casting calls by title, role, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Tabs */}
          <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200 text-xs">
            {['All', 'Open', 'Closed'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg font-bold transition capitalize ${
                  statusFilter === s
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={fetchCastings}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── Castings List ── */}
      {loading ? (
        <div className="min-h-[250px] flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-xs font-bold text-gray-600">Loading casting calls...</p>
        </div>
      ) : castings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Film size={26} />
          </div>
          <h3 className="text-base font-bold text-gray-900">No casting calls found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Post your first casting notice to begin receiving audition reels from top actors and models.
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
          >
            Post Casting Call Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {castings.map((c) => {
            const isOpen = c.status === 'Open';
            const applicants = c.applicants || [];
            const shortlisted = applicants.filter(a => a.status === 'Shortlisted' || a.status === 'Selected').length;

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Left Info Area */}
                <div className="flex items-start gap-4">
                  <div
                    onClick={() => setViewModalCasting(c)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-900 shrink-0 relative cursor-pointer group shadow-sm"
                    title="Click to view full casting details"
                  >
                    <img
                      src={c.image || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80'}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Eye size={16} />
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isOpen
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {c.status}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {c.projectType}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                        Role: {c.roleType}
                      </span>
                    </div>

                    <h3
                      onClick={() => setViewModalCasting(c)}
                      className="text-base font-black text-gray-900 leading-tight hover:text-indigo-600 cursor-pointer transition flex items-center gap-2"
                      title="Click to view details"
                    >
                      {c.title}
                    </h3>

                    {/* Metadata line */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-gray-400" />
                        {c.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-gray-700">
                        <DollarSign size={12} className="text-emerald-600" />
                        {c.budget}
                      </span>
                      <span>•</span>
                      <span>Gender: <b>{c.gender}</b> ({c.ageRange})</span>
                      {c.shootDates && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-gray-500">
                            <Calendar size={12} />
                            Shoot: {c.shootDates}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action & Applicant Stats */}
                <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 shrink-0 flex-wrap">
                  {/* Applicants Pill */}
                  <div className="text-left lg:text-right pr-2">
                    <div className="flex items-center gap-1.5 text-xs font-black text-gray-900">
                      <Users size={14} className="text-indigo-600" />
                      <span>{c.applicantsCount} Audition{c.applicantsCount === 1 ? '' : 's'}</span>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold block">
                      {shortlisted} Shortlisted
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* View Details Button */}
                    <button
                      onClick={() => setViewModalCasting(c)}
                      className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition flex items-center gap-1.5"
                      title="View full casting details"
                    >
                      <Eye size={13} />
                      <span>View</span>
                    </button>

                    {/* Review Auditions Button */}
                    <button
                      onClick={() => {
                        setReviewModalCasting(c);
                        setApplicantFilter('All');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                    >
                      <Users size={13} />
                      <span>Auditions</span>
                    </button>

                    {/* Toggle Status Button */}
                    <button
                      onClick={() => handleToggleStatus(c.id, c.status)}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs transition ${
                        isOpen
                          ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {isOpen ? 'Close' : 'Reopen'}
                    </button>

                    {/* Delete Casting Notice Button */}
                    <button
                      onClick={() => setDeleteModalCasting(c)}
                      className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition"
                      title="Delete Casting Notice"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL 1: POST NEW CASTING NOTICE ── */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Film size={16} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Post New Casting Notice</h3>
                  <p className="text-[11px] text-gray-400">Broadcast your audition requirements to verified actors & models</p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCasting} className="p-6 overflow-y-auto space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200">
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-bold text-gray-700 mb-1">Casting / Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Female Actor for Upcoming Netflix Series"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Project Type</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Web Series">Web Series</option>
                    <option value="Ad Film">Ad Film / TVC</option>
                    <option value="Movie">Movie / Feature</option>
                    <option value="Short Film">Short Film</option>
                    <option value="Music Video">Music Video</option>
                    <option value="Brand Shoot">Brand Shoot</option>
                    <option value="Fashion Show">Fashion Show</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Role Type</label>
                  <select
                    value={formData.roleType}
                    onChange={(e) => setFormData({ ...formData, roleType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Actor">Actor</option>
                    <option value="Model">Model</option>
                    <option value="Voice Artist">Voice Artist</option>
                    <option value="Dancer">Dancer</option>
                    <option value="Influencer">Influencer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Any">Any</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Age Range</label>
                  <input
                    type="text"
                    placeholder="e.g. 20-28 Years"
                    value={formData.ageRange}
                    onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Shoot Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai & Goa"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Budget / Compensation</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹25,000 / day"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Estimated Shoot Dates</label>
                  <input
                    type="text"
                    placeholder="e.g. Nov 15 - Nov 22, 2026"
                    value={formData.shootDates}
                    onChange={(e) => setFormData({ ...formData, shootDates: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Audition Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Character Synopsis & Brief</label>
                <textarea
                  rows={3}
                  placeholder="Describe character personality, mood board, scene reference..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Key Requirements (comma separated)</label>
                <input
                  type="text"
                  placeholder="Fluent Hindi, Classical Dance, Expressive Eyes, Look Test Ready"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Cover Image / Poster Selection & Upload */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block font-bold text-gray-700">
                  Casting Poster / Cover Image
                  <span className="text-gray-400 font-normal ml-1.5">(Upload from device, paste URL, or choose preset)</span>
                </label>

                {/* Preview & Upload Bar */}
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-900 shrink-0 border border-gray-200 relative group">
                    <img
                      src={formData.image || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80'}
                      alt="Casting Poster Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={imageUploading}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Upload size={13} />
                        {imageUploading ? 'Uploading...' : 'Upload Image'}
                      </button>

                      {formData.image && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 font-bold text-xs transition"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <input
                      type="url"
                      placeholder="Or paste image URL (https://...)"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[11px] font-bold text-gray-500 block mb-1.5">Or Choose Quick Preset Poster:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {POSTER_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: preset.url })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                          formData.image === preset.url
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-bold'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
                >
                  <Send size={13} />
                  {submitting ? 'Publishing...' : 'Publish Casting Call'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: APPLICANTS & AUDITIONS REVIEW MODAL ── */}
      {reviewModalCasting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-gray-900">{reviewModalCasting.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {reviewModalCasting.projectType}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Audition Submissions ({reviewModalCasting.applicants?.length || 0} candidates)
                </p>
              </div>
              <button
                onClick={() => setReviewModalCasting(null)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Applicant Filter Tabs */}
            <div className="px-5 py-2.5 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto text-xs font-bold text-gray-600">
              {['All', 'Applied', 'Shortlisted', 'Audition Scheduled', 'Selected', 'Rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setApplicantFilter(st)}
                  className={`px-3 py-1 rounded-lg transition whitespace-nowrap ${
                    applicantFilter === st
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Applicants List */}
            <div className="p-5 overflow-y-auto space-y-3 max-h-[55vh]">
              {modalApplicants.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Users size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm font-bold text-gray-700">No applicants in this category</p>
                  <p className="text-xs text-gray-400 mt-0.5">Select "All" to view all incoming submissions.</p>
                </div>
              ) : (
                modalApplicants.map((app, idx) => {
                  const creator = app.creator || {};
                  const fullName = creator.basicDetails?.fullName || 'Audition Candidate';
                  const photo = creator.basicDetails?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                  const creatorId = creator._id || creator.id;

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={photo}
                          alt={fullName}
                          className="w-12 h-12 rounded-2xl object-cover border border-gray-200"
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-900 text-sm">{fullName}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              app.status === 'Shortlisted'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : app.status === 'Audition Scheduled'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : app.status === 'Selected'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : app.status === 'Rejected'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {creator.professionalDetails?.primaryCategory || 'Talent'} • {creator.basicDetails?.city || 'India'} • {creator.professionalDetails?.experience || '1-3 Yrs'}
                          </p>
                          {app.notes && (
                            <p className="text-[11px] text-gray-600 italic mt-0.5 bg-gray-50 px-2 py-0.5 rounded">
                              "{app.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-auto flex-wrap">
                        {app.status !== 'Shortlisted' && (
                          <button
                            onClick={() => handleUpdateApplicantStatus(reviewModalCasting.id, creatorId, 'Shortlisted')}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                          >
                            Shortlist
                          </button>
                        )}

                        {app.status !== 'Audition Scheduled' && (
                          <button
                            onClick={() => handleUpdateApplicantStatus(reviewModalCasting.id, creatorId, 'Audition Scheduled')}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs transition"
                          >
                            Schedule Audition
                          </button>
                        )}

                        {app.status !== 'Selected' && (
                          <button
                            onClick={() => handleUpdateApplicantStatus(reviewModalCasting.id, creatorId, 'Selected')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition"
                          >
                            Select & Hire
                          </button>
                        )}

                        {app.status !== 'Rejected' && (
                          <button
                            onClick={() => handleUpdateApplicantStatus(reviewModalCasting.id, creatorId, 'Rejected')}
                            className="px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition"
                          >
                            Decline
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-semibold">
                Viewing <b>{modalApplicants.length}</b> submissions
              </span>
              <button
                onClick={() => setReviewModalCasting(null)}
                className="px-4 py-1.5 rounded-xl bg-gray-200 font-bold text-gray-700 hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: VIEW FULL CASTING DETAILS ── */}
      {viewModalCasting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Poster Banner Header */}
            <div className="relative h-48 sm:h-56 bg-gray-900 overflow-hidden shrink-0">
              <img
                src={viewModalCasting.image || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=80'}
                alt={viewModalCasting.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

              {/* Close Button */}
              <button
                onClick={() => setViewModalCasting(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-none transition"
              >
                <X size={18} />
              </button>

              {/* Badges & Title in Banner */}
              <div className="absolute bottom-4 left-5 right-5 text-white space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                    viewModalCasting.status === 'Open'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
                    {viewModalCasting.status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/80 text-white">
                    {viewModalCasting.projectType}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/80 text-white">
                    Role: {viewModalCasting.roleType}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {viewModalCasting.title}
                </h2>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                    <DollarSign size={12} className="text-emerald-600" />
                    Budget
                  </span>
                  <p className="text-sm font-black text-gray-900 mt-1">{viewModalCasting.budget || 'Negotiable'}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                    <MapPin size={12} className="text-blue-600" />
                    Location
                  </span>
                  <p className="text-sm font-black text-gray-900 mt-1">{viewModalCasting.location || 'Mumbai'}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                    <Users size={12} className="text-purple-600" />
                    Target
                  </span>
                  <p className="text-sm font-black text-gray-900 mt-1">
                    {viewModalCasting.gender} ({viewModalCasting.ageRange || 'Any age'})
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                    <Calendar size={12} className="text-amber-600" />
                    Deadline
                  </span>
                  <p className="text-sm font-black text-gray-900 mt-1">
                    {viewModalCasting.deadline
                      ? new Date(viewModalCasting.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : 'Open Call'}
                  </p>
                </div>
              </div>

              {/* Shoot Dates if present */}
              {viewModalCasting.shootDates && (
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center gap-2 text-blue-900">
                  <Calendar size={14} className="text-blue-600 shrink-0" />
                  <span className="font-semibold">Estimated Shoot Dates: <b>{viewModalCasting.shootDates}</b></span>
                </div>
              )}

              {/* Character Synopsis & Creative Brief */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <FileText size={15} className="text-indigo-600" />
                  Character Synopsis & Role Brief
                </h4>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {viewModalCasting.description || 'No creative brief or synopsis provided.'}
                </div>
              </div>

              {/* Requirements */}
              {viewModalCasting.requirements && viewModalCasting.requirements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                    <CheckCircle size={15} className="text-emerald-600" />
                    Key Requirements & Skillsets
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    {viewModalCasting.requirements.map((req, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-gray-100 text-gray-800 font-bold border border-gray-200 flex items-center gap-1.5"
                      >
                        <Tag size={11} className="text-indigo-600" />
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Submissions Snapshot Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-black text-gray-900 text-sm">Auditions & Submissions</h4>
                  <p className="text-gray-600 mt-0.5">
                    <b>{viewModalCasting.applicantsCount || 0}</b> actors applied • <b>{
                      (viewModalCasting.applicants || []).filter(a => a.status === 'Shortlisted' || a.status === 'Selected').length
                    }</b> shortlisted
                  </p>
                </div>
                <button
                  onClick={() => {
                    const c = viewModalCasting;
                    setViewModalCasting(null);
                    setReviewModalCasting(c);
                    setApplicantFilter('All');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition flex items-center gap-1.5 shrink-0"
                >
                  <Users size={14} />
                  <span>Review Auditions</span>
                </button>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
              {/* Delete button */}
              <button
                onClick={() => {
                  const toDelete = viewModalCasting;
                  setViewModalCasting(null);
                  setDeleteModalCasting(toDelete);
                }}
                className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold flex items-center gap-1.5 transition text-xs"
              >
                <Trash2 size={13} />
                <span>Delete Notice</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleToggleStatus(viewModalCasting.id, viewModalCasting.status);
                    setViewModalCasting(prev => prev ? {
                      ...prev,
                      status: prev.status === 'Open' ? 'Closed' : 'Open'
                    } : null);
                  }}
                  className={`px-3 py-2 rounded-xl border font-bold text-xs transition ${
                    viewModalCasting.status === 'Open'
                      ? 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {viewModalCasting.status === 'Open' ? 'Close Call' : 'Reopen Call'}
                </button>

                <button
                  onClick={() => setViewModalCasting(null)}
                  className="px-4 py-2 rounded-xl bg-gray-200 font-bold text-gray-700 hover:bg-gray-300 transition text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: DELETE CONFIRMATION MODAL ── */}
      {deleteModalCasting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-gray-900">Delete Casting Notice?</h3>
              <p className="text-xs text-gray-500">
                Are you sure you want to permanently delete:
              </p>
              <p className="text-xs font-bold text-gray-800 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                "{deleteModalCasting.title}"
              </p>
              <p className="text-[11px] text-red-500 font-semibold pt-1">
                This action cannot be undone. All applicant audition submissions for this notice will also be removed.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalCasting(null)}
                className="w-full py-2.5 rounded-xl border border-gray-200 font-bold text-xs text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCasting(deleteModalCasting.id || deleteModalCasting._id)}
                disabled={deleting}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition flex items-center justify-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>{deleting ? 'Deleting...' : 'Delete Forever'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CompanyCasting;
