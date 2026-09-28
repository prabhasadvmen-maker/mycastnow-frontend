import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import {
  Video, Search, Filter, MapPin, Calendar, DollarSign,
  Briefcase, CheckCircle2, Clock, Sparkles, AlertCircle,
  ExternalLink, ArrowRight, UserCheck, X, Film, Info
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const PROJECT_TYPES = ['All', 'Ad Film', 'Web Series', 'Movie', 'Short Film', 'Music Video', 'Brand Shoot', 'Fashion Show'];
const LOCATIONS = ['All', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pan-India'];

const CreatorCasting = () => {
  const { creatorUser } = useCreatorAuth();
  const [castings, setCastings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedGender, setSelectedGender] = useState('Any');

  // Modals
  const [selectedCasting, setSelectedCasting] = useState(null); // For details modal
  const [applyCasting, setApplyCasting] = useState(null); // For apply modal
  const [pitchNotes, setPitchNotes] = useState('');
  const [showreelUrl, setShowreelUrl] = useState('');
  const [applying, setApplying] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchCastings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const params = {};
      if (selectedType !== 'All') params.projectType = selectedType;
      if (selectedLocation !== 'All') params.location = selectedLocation;
      if (selectedGender !== 'Any') params.gender = selectedGender;
      if (search.trim()) params.search = search.trim();

      const res = await axios.get(`${API}/creator/portal/castings`, { headers, params });
      if (res.data?.success) {
        setCastings(res.data.castings || []);
      }
    } catch (err) {
      console.error('Error fetching castings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCastings();
  }, [selectedType, selectedLocation, selectedGender]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCastings();
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Submit Application
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyCasting) return;

    try {
      setApplying(true);
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(`${API}/creator/portal/castings/${applyCasting._id}/apply`, {
        notes: pitchNotes,
        showreelUrl
      }, { headers });

      if (res.data?.success) {
        // Update local state
        setCastings(prev => prev.map(c => {
          if (c._id === applyCasting._id) {
            return {
              ...c,
              hasApplied: true,
              myApplicationStatus: 'Applied',
              applicantsCount: (c.applicantsCount || 0) + 1
            };
          }
          return c;
        }));

        setApplyCasting(null);
        setPitchNotes('');
        setShowreelUrl('');
        showToast('Application submitted successfully! Casting director will review your profile.');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit application', 'error');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Alert */}
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

      {/* HEADER RIBBON */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#180a22] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-purple-800/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-fuchsia-200">
              <Sparkles size={13} className="text-yellow-400" />
              <span>Live Verified Casting Calls</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Casting Calls & Auditions
            </h1>
            <p className="text-purple-200 text-xs md:text-sm max-w-xl">
              Apply to active audition notices for OTT series, commercial TV ads, feature films, and pan-India print campaigns.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-purple-200">Available Roles</p>
              <h3 className="text-2xl font-black text-white">{castings.length}</h3>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-purple-200">Applied</p>
              <h3 className="text-2xl font-black text-fuchsia-300">
                {castings.filter(c => c.hasApplied).length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by role title, director, keyword, or character..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>Location: {loc}</option>
              ))}
            </select>

            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="Any">Gender: Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition shrink-0 cursor-pointer"
            >
              Filter
            </button>
          </div>
        </form>

        {/* Project Type Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none">
          <span className="text-xs font-bold text-gray-400 shrink-0">Type:</span>
          {PROJECT_TYPES.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedType === type
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* CASTINGS LIST GRID */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-xs font-medium">Fetching casting calls from database...</p>
        </div>
      ) : castings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
          <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto text-purple-600">
            <Video size={28} />
          </div>
          <h3 className="font-black text-gray-900 text-base">No casting calls found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try resetting your filters or search keywords to see all live auditions.
          </p>
          <button
            onClick={() => {
              setSelectedType('All');
              setSelectedLocation('All');
              setSelectedGender('Any');
              setSearch('');
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {castings.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Poster & Badges */}
                <div className="relative h-48 bg-gray-900 overflow-hidden">
                  <img
                    src={c.image || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80'}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent"></div>

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wide uppercase bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {c.projectType}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-600/90 text-white backdrop-blur-md">
                      {c.roleType}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/90 text-gray-800 backdrop-blur-md">
                      {c.gender}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-bold flex items-center gap-1">
                      <MapPin size={12} className="text-purple-400" /> {c.location}
                    </span>
                    <span className="font-black text-amber-300 text-sm">
                      {c.budget}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-black text-base text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                      {c.description || 'Prominent commercial campaign audition for pan-India OTT release and television broadcast.'}
                    </p>
                  </div>

                  {/* Requirements Tags */}
                  {c.requirements && c.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {c.requirements.slice(0, 3).map((req, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-gray-50 text-[10px] font-semibold text-gray-600 border border-gray-100"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Dates & Company info */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {c.shootDates || 'Next Month'}
                    </span>
                    <span>
                      {c.applicantsCount || 0} applicants
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  onClick={() => setSelectedCasting(c)}
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                  title="View Full Details"
                >
                  <Info size={16} />
                </button>

                {c.hasApplied ? (
                  <div className="flex-1 py-2.5 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-purple-200">
                    <CheckCircle2 size={14} className="text-purple-600" />
                    <span>Applied ({c.myApplicationStatus || 'Under Review'})</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setApplyCasting(c);
                      setPitchNotes('');
                      setShowreelUrl('');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Apply Now</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: CASTING DETAILS MODAL */}
      {selectedCasting && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-purple-100 text-purple-700">
                  {selectedCasting.projectType}
                </span>
                <h3 className="font-black text-lg text-gray-900 mt-1">{selectedCasting.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCasting(null)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-gray-50 rounded-2xl text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Role Type</span>
                <span className="font-bold text-gray-800">{selectedCasting.roleType} ({selectedCasting.gender})</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Compensation</span>
                <span className="font-black text-emerald-600">{selectedCasting.budget}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Shoot Location</span>
                <span className="font-bold text-gray-800">{selectedCasting.location}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Shoot Dates</span>
                <span className="font-bold text-gray-800">{selectedCasting.shootDates || 'To be scheduled'}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs text-gray-900 mb-1">Project Synopsis & Description</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {selectedCasting.description || 'Full casting details, costume requirements, and audition sides will be provided upon profile shortlisting.'}
              </p>
            </div>

            {selectedCasting.requirements && selectedCasting.requirements.length > 0 && (
              <div>
                <h4 className="font-bold text-xs text-gray-900 mb-1.5">Key Requirements</h4>
                <ul className="list-disc pl-4 space-y-1 text-xs text-gray-600">
                  {selectedCasting.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedCasting(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>

              {!selectedCasting.hasApplied && (
                <button
                  onClick={() => {
                    const c = selectedCasting;
                    setSelectedCasting(null);
                    setApplyCasting(c);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                >
                  Proceed to Apply
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: APPLY NOW MODAL */}
      {applyCasting && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleApplySubmit}
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-600 uppercase">Apply for role</span>
                <h3 className="font-black text-base text-gray-900">{applyCasting.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setApplyCasting(null)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-purple-50/60 rounded-xl text-xs text-purple-900 flex items-center justify-between">
              <span>Role: <strong className="font-bold">{applyCasting.roleType}</strong></span>
              <span>Budget: <strong className="font-bold text-emerald-700">{applyCasting.budget}</strong></span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Audition Note / Pitch to Director
              </label>
              <textarea
                rows={3}
                placeholder="Mention your relevant experience, commercial brands worked with, or why you are ideal for this role..."
                value={pitchNotes}
                onChange={(e) => setPitchNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Audition Tape / Showreel Link (Optional)
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=... or Google Drive link"
                value={showreelUrl}
                onChange={(e) => setShowreelUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <p className="text-[11px] text-gray-400 leading-normal">
              Your verified profile, physical measurements, and high-res portfolio photos will be automatically shared with the casting team.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setApplyCasting(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={applying}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md disabled:opacity-50"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreatorCasting;
