import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import {
  Briefcase, Search, Filter, MapPin, Calendar, Clock,
  CheckCircle2, Star, AlertCircle, Trash2, Eye, 
  ExternalLink, ArrowRight, RefreshCw, X, Video
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const STATUS_TABS = [
  { id: 'all', label: 'All Applications' },
  { id: 'Applied', label: 'Applied / In Review' },
  { id: 'Shortlisted', label: 'Shortlisted' },
  { id: 'Audition Scheduled', label: 'Audition Scheduled' },
  { id: 'Selected', label: 'Selected' },
  { id: 'Rejected', label: 'Rejected' }
];

const CreatorApplications = () => {
  const { creatorUser } = useCreatorAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState(null); // Details modal
  const [toast, setToast] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API}/creator/portal/applications`, { headers });
      if (res.data?.success) {
        setApplications(res.data.applications || []);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Withdraw Application
  const handleWithdraw = async (castingId, title) => {
    if (!window.confirm(`Are you sure you want to withdraw your application for "${title}"?`)) return;

    try {
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.delete(`${API}/creator/portal/applications/${castingId}`, { headers });
      if (res.data?.success) {
        setApplications(prev => prev.filter(a => a.castingId !== castingId));
        if (selectedApp?.castingId === castingId) setSelectedApp(null);
        showToast('Application withdrawn successfully');
      }
    } catch (err) {
      showToast('Failed to withdraw application', 'error');
    }
  };

  // Filter applications
  const filteredApps = applications.filter(app => {
    const matchesTab = activeTab === 'all' || app.status === activeTab;
    const matchesSearch = !search.trim() ||
      app.title?.toLowerCase().includes(search.toLowerCase()) ||
      app.projectType?.toLowerCase().includes(search.toLowerCase()) ||
      app.location?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-600" /> Selected
          </span>
        );
      case 'Shortlisted':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-800 flex items-center gap-1">
            <Star size={12} className="text-purple-600" /> Shortlisted
          </span>
        );
      case 'Audition Scheduled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-800 flex items-center gap-1">
            <Calendar size={12} className="text-indigo-600" /> Audition Scheduled
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-red-50 text-red-700 flex items-center gap-1">
            <X size={12} className="text-red-500" /> Not Selected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 flex items-center gap-1">
            <Clock size={12} className="text-amber-600" /> Under Review
          </span>
        );
    }
  };

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

      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#180a22] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-purple-800/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black text-white">
              My Casting Applications
            </h1>
            <p className="text-purple-200 text-xs md:text-sm max-w-xl">
              Real-time tracker of all your audition submissions, director shortlists, and scheduled screen tests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchApplications}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition border border-white/10"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <Link
              to="/creator/dashboard/casting"
              className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <Video size={16} />
              <span>Find More Castings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* STATUS TABS & SEARCH */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
            {STATUS_TABS.map(tab => {
              const count = tab.id === 'all'
                ? applications.length
                : applications.filter(a => a.status === tab.id).length;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Search input */}
          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* APPLICATIONS LIST */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-xs font-medium">Loading applications from database...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
          <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto text-purple-600">
            <Briefcase size={28} />
          </div>
          <h3 className="font-black text-gray-900 text-base">No applications found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {activeTab === 'all'
              ? 'You have not submitted any applications yet. Explore our open casting calls to apply!'
              : `No applications currently have status "${activeTab}".`}
          </p>
          <Link
            to="/creator/dashboard/casting"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition"
          >
            <span>Browse Active Castings</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              {/* Left: Poster & Info */}
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <img
                  src={app.image || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=200&q=80'}
                  alt={app.title}
                  className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shrink-0 shadow-sm"
                />

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md">
                      {app.projectType}
                    </span>
                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                      <MapPin size={11} /> {app.location}
                    </span>
                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                      <Calendar size={11} /> Applied {new Date(app.appliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-black text-base text-gray-900 truncate">{app.title}</h3>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 pt-0.5">
                    <span>Role: <strong className="font-bold text-gray-800">{app.roleType}</strong></span>
                    <span className="text-gray-300">•</span>
                    <span>Budget: <strong className="font-bold text-emerald-600">{app.budget}</strong></span>
                  </div>

                  {app.notes && (
                    <p className="text-[11px] text-gray-500 italic line-clamp-1 pt-0.5">
                      Pitch note: "{app.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Status badge & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                {getStatusBadge(app.status)}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>Details</span>
                  </button>

                  {app.status === 'Applied' && (
                    <button
                      onClick={() => handleWithdraw(app.castingId, app.title)}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title="Withdraw Application"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* APPLICATION DETAILS MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-purple-100 text-purple-700">
                  {selectedApp.projectType}
                </span>
                <h3 className="font-black text-lg text-gray-900 mt-1">{selectedApp.title}</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Current Review Status</span>
                <div className="mt-1">{getStatusBadge(selectedApp.status)}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Applied Date</span>
                <span className="text-xs font-bold text-gray-800">
                  {new Date(selectedApp.appliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-gray-700">Role & Character: </span>
                <span className="text-gray-600">{selectedApp.roleType}</span>
              </div>
              <div>
                <span className="font-bold text-gray-700">Compensation: </span>
                <span className="font-bold text-emerald-600">{selectedApp.budget}</span>
              </div>
              <div>
                <span className="font-bold text-gray-700">Shoot Location: </span>
                <span className="text-gray-600">{selectedApp.location}</span>
              </div>
              <div>
                <span className="font-bold text-gray-700">Shoot Dates: </span>
                <span className="text-gray-600">{selectedApp.shootDates || 'To be scheduled'}</span>
              </div>
              {selectedApp.notes && (
                <div className="p-3 bg-purple-50/50 rounded-xl mt-2 border border-purple-100">
                  <span className="font-bold text-purple-900 block mb-1">Your Submission Pitch:</span>
                  <p className="text-purple-800 italic">"{selectedApp.notes}"</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              {selectedApp.status === 'Applied' ? (
                <button
                  onClick={() => handleWithdraw(selectedApp.castingId, selectedApp.title)}
                  className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 size={13} /> Withdraw Application
                </button>
              ) : (
                <span className="text-[11px] text-gray-400">Application processed by casting director</span>
              )}

              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorApplications;
