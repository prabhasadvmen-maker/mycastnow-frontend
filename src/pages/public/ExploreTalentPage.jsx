import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Search, Filter, Star, ShieldCheck, MapPin, Sparkles, User, Briefcase,
  CheckCircle2, X, Eye, Phone, Mail, Award, Film, Play, ExternalLink, ChevronRight, BadgeCheck
} from 'lucide-react';
import PublicLayout from '../../components/public/PublicLayout';
import { useCompanyAuth } from '../../context/CompanyAuthContext';

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

// Fallback Subcategory Mapping per Primary Category
const SUBCATEGORY_MAP = {
  Actor: ['All Subcategories', 'Lead Actor / Lead Actress', 'Method Actor', 'Character Artist', 'Theatre Artist', 'Commercial & TVC Actor', 'Child Artist'],
  Model: ['All Subcategories', 'Fashion & Runway Model', 'Commercial & Print Model', 'Fitness & Bikini Model', 'Parts / Hand Model', 'Plus Size Model'],
  Dancer: ['All Subcategories', 'Bollywood & Commercial', 'Classical / Kathak / Bharatanatyam', 'Hip Hop / Street Dance', 'Contemporary / Modern', 'Salsa / Ballroom'],
  'Voice Artist': ['All Subcategories', 'Dubbing Artist (Films & Series)', 'Commercial Voiceover', 'Audiobook Narrator', 'Radio Jockey (RJ)', 'IVR / Corporate Voice'],
  Influencer: ['All Subcategories', 'Fashion & Lifestyle', 'Fitness & Health', 'Tech & Gaming', 'Travel & Food', 'Beauty & Makeup'],
  Photographer: ['All Subcategories', 'Fashion & Editorial', 'Commercial & Product', 'Event & Concert', 'Portrait & Headshots'],
  'Makeup Artist': ['All Subcategories', 'SFX & Prosthetics', 'Bridal & High Fashion', 'Film & TV Makeup', 'Hair Stylist'],
  Singer: ['All Subcategories', 'Playback Singer', 'Classical / Semi-Classical', 'Indie & Pop', 'Live Band / Gig Lead', 'Rapper / Hip Hop']
};

export default function ExploreTalentPage() {
  const { companyUser } = useCompanyAuth();
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All Subcategories');
  const [selectedLocation, setSelectedLocation] = useState('All Cities');
  const [selectedGender, setSelectedGender] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedTalentModal, setSelectedTalentModal] = useState(null);
  const [modalTab, setModalTab] = useState('portfolio');
  const [lightboxImage, setLightboxImage] = useState(null);

  // Dynamic Metadata state from database
  const [dynamicMetadata, setDynamicMetadata] = useState({
    categories: ['Actor', 'Model', 'Dancer', 'Voice Artist', 'Influencer', 'Singer', 'Photographer', 'Makeup Artist'],
    subCategories: [],
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Goa', 'Jaipur', 'Chennai', 'Kolkata'],
    genders: ['Male', 'Female', 'Non-Binary']
  });

  // Fetch real talent data & DB metadata
  useEffect(() => {
    let active = true;
    axios.get(`${API}/public/talents`)
      .then(({ data }) => {
        if (active && data?.success && Array.isArray(data.talents)) {
          setTalents(data.talents);
          if (data.meta) {
            setDynamicMetadata((prev) => ({
              categories: Array.from(new Set([...(data.meta.categories || []), ...prev.categories])),
              subCategories: Array.from(new Set([...(data.meta.subCategories || []), ...prev.subCategories])),
              cities: Array.from(new Set([...(data.meta.cities || []), ...prev.cities])),
              genders: Array.from(new Set([...(data.meta.genders || []), ...prev.genders]))
            }));
          }
        }
      })
      .catch(() => {
        // Fallback to /public/landing if /public/talents is unavailable
        axios.get(`${API}/public/landing`).then(({ data }) => {
          if (active && data?.success && Array.isArray(data.talents)) {
            setTalents(data.talents);
          }
        }).catch((err) => console.error('Error fetching talent directory:', err));
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  // Compute available subcategories based on selected primary category
  const availableSubCategories = useMemo(() => {
    if (selectedCategory === 'All') {
      const dbSubs = dynamicMetadata.subCategories.filter(Boolean);
      return ['All Subcategories', ...dbSubs];
    }
    const mapped = SUBCATEGORY_MAP[selectedCategory] || ['All Subcategories'];
    const dbSubs = dynamicMetadata.subCategories.filter(s => s && s.toLowerCase().includes(selectedCategory.toLowerCase()));
    return Array.from(new Set([...mapped, ...dbSubs]));
  }, [selectedCategory, dynamicMetadata.subCategories]);

  // Filter talents based on all criteria
  const filteredTalents = useMemo(() => {
    return talents.filter((t) => {
      // Primary Category Match
      const matchCat = selectedCategory === 'All' ||
        t.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        t.role?.toLowerCase().includes(selectedCategory.toLowerCase());
      
      // Subcategory Match
      const matchSubCat = selectedSubCategory === 'All Subcategories' ||
        t.subCategory?.toLowerCase() === selectedSubCategory.toLowerCase() ||
        t.role?.toLowerCase().includes(selectedSubCategory.toLowerCase()) ||
        t.skills?.some(s => s.toLowerCase().includes(selectedSubCategory.toLowerCase()));
      
      // Location / City Match
      const matchLoc = selectedLocation === 'All Cities' ||
        t.city?.toLowerCase().includes(selectedLocation.toLowerCase());
      
      // Gender Match
      const matchGender = selectedGender === 'All' ||
        t.gender?.toLowerCase() === selectedGender.toLowerCase();

      // Verified Badge Match
      const matchVerified = !verifiedOnly || t.verified;

      // Free Search Query Match
      const q = searchQuery.trim().toLowerCase();
      const matchQuery = !q ||
        t.name?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q) ||
        t.subCategory?.toLowerCase().includes(q) ||
        t.city?.toLowerCase().includes(q) ||
        t.skills?.some(s => s.toLowerCase().includes(q));

      return matchCat && matchSubCat && matchLoc && matchGender && matchVerified && matchQuery;
    });
  }, [talents, selectedCategory, selectedSubCategory, selectedLocation, selectedGender, verifiedOnly, searchQuery]);

  // Reset all filters helper
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSubCategory('All Subcategories');
    setSelectedLocation('All Cities');
    setSelectedGender('All');
    setVerifiedOnly(false);
  };

  return (
    <PublicLayout>
      {/* ────────────────── HERO BANNER WITH CINEMATIC BACKGROUND ────────────────── */}
      <section className="relative bg-slate-950 text-white py-16 md:py-24 overflow-hidden border-b border-purple-900/30">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 transform scale-102"
          style={{ backgroundImage: `url('/talent_hero_bg.png'), url('https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1920&auto=format&fit=crop')` }}
        ></div>
        {/* Dark Gradient Overlay for optimal contrast & high luxury readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/85 via-slate-950/80 to-slate-950 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-xs font-bold text-purple-300 mb-6 backdrop-blur-md">
            <Sparkles size={14} className="text-yellow-400 animate-pulse" />
            <span>VERIFIED INDIAN TALENT DIRECTORY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Discover & Hire Top <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-300">Indian Artists</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Browse thousands of verified actors, fashion models, dancers, voice artists & creators. Direct booking contracts with zero agency markup.
          </p>

          {/* DYNAMIC SEARCH & MULTI-FILTER BAR */}
          <div className="mt-10 max-w-6xl mx-auto bg-white/10 backdrop-blur-xl p-3 sm:p-5 rounded-3xl border border-white/20 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Keyword Search */}
              <div className="sm:col-span-4 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name, category, skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/95 border border-white/40 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
                />
              </div>

              {/* Dynamic Primary Category Select */}
              <div className="sm:col-span-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubCategory('All Subcategories');
                  }}
                  className="w-full px-3 py-3 bg-white/95 border border-white/40 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="All" className="text-slate-900">Category: All</option>
                  {dynamicMetadata.categories.map(cat => (
                    <option key={cat} value={cat} className="text-slate-900">{cat}</option>
                  ))}
                </select>
              </div>

              {/* Dynamic SubCategory Select */}
              <div className="sm:col-span-2">
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="w-full px-3 py-3 bg-white/95 border border-white/40 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {availableSubCategories.map(sub => (
                    <option key={sub} value={sub} className="text-slate-900">{sub}</option>
                  ))}
                </select>
              </div>

              {/* Dynamic City / Location Select */}
              <div className="sm:col-span-2">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-3 bg-white/95 border border-white/40 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="All Cities" className="text-slate-900">City: All</option>
                  {dynamicMetadata.cities.map(loc => (
                    <option key={loc} value={loc} className="text-slate-900">{loc}</option>
                  ))}
                </select>
              </div>

              {/* Gender & Verified Buttons */}
              <div className="sm:col-span-2 flex items-center gap-2">
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-1/2 px-2 py-3 bg-white/95 border border-white/40 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="All" className="text-slate-900">All</option>
                  {dynamicMetadata.genders.map(g => (
                    <option key={g} value={g} className="text-slate-900">{g}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`w-1/2 py-3 px-2 rounded-2xl text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    verifiedOnly
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                      : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                  }`}
                  title="Filter Blue Checkmark Verified Artists"
                >
                  <ShieldCheck size={14} />
                  <span>{verifiedOnly ? 'Verified' : 'Badges'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── MAIN CONTAINER ────────────────── */}
      <section className="py-12 bg-slate-50 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* Category Tabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedSubCategory('All Subcategories');
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-950/20 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200/80'
              }`}
            >
              All Talent
            </button>
            {dynamicMetadata.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedSubCategory('All Subcategories');
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-950/20 scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Subcategory Pills Bar (shown when Category is selected) */}
          {selectedCategory !== 'All' && availableSubCategories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8 bg-purple-50/60 p-3 rounded-2xl border border-purple-100">
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider shrink-0 px-2">Subcategories:</span>
              {availableSubCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCategory(sub)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedSubCategory === sub
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white text-purple-900 hover:bg-purple-100 border border-purple-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Results Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-xs sm:text-sm font-bold text-slate-700">
                Showing <span className="text-purple-700 font-extrabold">{filteredTalents.length}</span> Artists
                {selectedCategory !== 'All' && <span className="text-slate-500 font-normal"> in <span className="font-bold text-slate-900">{selectedCategory}</span></span>}
                {selectedSubCategory !== 'All Subcategories' && <span className="text-slate-500 font-normal"> • <span className="font-bold text-purple-700">{selectedSubCategory}</span></span>}
              </p>
            </div>
            {(searchQuery || selectedCategory !== 'All' || selectedSubCategory !== 'All Subcategories' || selectedLocation !== 'All Cities' || selectedGender !== 'All' || verifiedOnly) && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 underline cursor-pointer"
              >
                <X size={14} /> Clear all filters
              </button>
            )}
          </div>

          {/* Grid Loading / Empty State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-white rounded-3xl p-4 border border-slate-200 animate-pulse space-y-4">
                  <div className="w-full h-64 bg-slate-200 rounded-2xl"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredTalents.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto my-12">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
                <User size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Matching Artists Found</h3>
              <p className="text-xs text-slate-500 mt-2">Try selecting another subcategory or clear search filters to explore available talents.</p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md shadow-purple-600/20 hover:bg-purple-700 transition-all cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredTalents.map((artist) => (
                <div
                  key={artist.id}
                  className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Image Header */}
                  <div className="relative aspect-[3/4] bg-slate-900 overflow-hidden cursor-pointer" onClick={() => setSelectedTalentModal(artist)}>
                    {artist.image ? (
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-slate-900 text-white p-4">
                        <User size={48} className="text-purple-300/40 mb-2" />
                        <span className="text-xs font-bold text-purple-200">{artist.name}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 opacity-90"></div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-wide uppercase">
                        {artist.category}
                      </span>
                      {artist.verified && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold backdrop-blur-md shadow-sm">
                          <BadgeCheck size={12} /> Verified
                        </span>
                      )}
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-base font-black truncate group-hover:text-purple-300 transition-colors">
                        {artist.name}
                      </h3>
                      <p className="text-[11px] font-bold text-purple-300 truncate">
                        {artist.subCategory || artist.role}
                      </p>
                      <div className="flex items-center justify-between text-xs mt-1 text-slate-300 font-medium">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin size={12} className="text-purple-400 shrink-0" /> {artist.city || 'India'}
                        </span>
                        <span className="flex items-center gap-1 text-amber-300 font-bold shrink-0">
                          <Star size={12} className="fill-amber-300" /> {artist.rating} ({artist.reviews})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                    <div className="space-y-2">
                      {artist.skills && artist.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {artist.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 font-bold text-slate-800">
                        <span className="text-slate-500 font-medium text-[11px]">Day Rate:</span>
                        <span className="text-purple-700 font-black">{artist.dayRate || '₹5,000 / day'}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedTalentModal(artist)}
                      className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs group/btn"
                    >
                      <span>View Full Profile</span>
                      <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ────────────────── ARTIST DETAILS MODAL ────────────────── */}
      {selectedTalentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col relative">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-purple-900 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-400 shrink-0 bg-slate-800">
                  {selectedTalentModal.image ? (
                    <img src={selectedTalentModal.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-lg">{selectedTalentModal.name?.[0]}</div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    {selectedTalentModal.name}
                    {selectedTalentModal.verified && <BadgeCheck size={18} className="text-emerald-400" />}
                  </h3>
                  <p className="text-xs text-purple-300 font-medium">
                    {selectedTalentModal.category} {selectedTalentModal.subCategory ? `• ${selectedTalentModal.subCategory}` : ''} • {selectedTalentModal.city || 'India'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTalentModal(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tabs Bar */}
            <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 gap-6 text-xs font-bold text-slate-600 shrink-0">
              <button
                onClick={() => setModalTab('portfolio')}
                className={`py-3.5 border-b-2 transition-colors cursor-pointer ${modalTab === 'portfolio' ? 'border-purple-600 text-purple-700' : 'border-transparent hover:text-slate-900'}`}
              >
                Portfolio & Photos
              </button>
              <button
                onClick={() => setModalTab('details')}
                className={`py-3.5 border-b-2 transition-colors cursor-pointer ${modalTab === 'details' ? 'border-purple-600 text-purple-700' : 'border-transparent hover:text-slate-900'}`}
              >
                Physical & Stats
              </button>
              <button
                onClick={() => setModalTab('contact')}
                className={`py-3.5 border-b-2 transition-colors cursor-pointer ${modalTab === 'contact' ? 'border-purple-600 text-purple-700' : 'border-transparent hover:text-slate-900'}`}
              >
                Book / Hire Artist
              </button>
            </div>

            {/* Modal Content Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
              {modalTab === 'portfolio' && (
                <div className="space-y-6">
                  {selectedTalentModal.bio && (
                    <div>
                      <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-2">Artist Bio</h4>
                      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">{selectedTalentModal.bio}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-3">Portfolio Photo Gallery</h4>
                    {selectedTalentModal.photos && selectedTalentModal.photos.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {selectedTalentModal.photos.map((photo, i) => (
                          <div
                            key={i}
                            onClick={() => setLightboxImage(photo)}
                            className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group relative"
                          >
                            <img src={photo} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye size={20} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No additional portfolio photos uploaded yet.</p>
                    )}
                  </div>
                </div>
              )}

              {modalTab === 'details' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Category</span>
                    <span className="text-sm font-black text-slate-800">{selectedTalentModal.category}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Subcategory / Role</span>
                    <span className="text-sm font-black text-purple-700">{selectedTalentModal.subCategory || selectedTalentModal.role || 'General'}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Height</span>
                    <span className="text-sm font-black text-slate-800">{selectedTalentModal.height || '5\' 8"'}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Gender</span>
                    <span className="text-sm font-black text-slate-800">{selectedTalentModal.gender || 'Not specified'}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Experience</span>
                    <span className="text-sm font-black text-slate-800">{selectedTalentModal.experience || '3+ Years'}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Day Rate</span>
                    <span className="text-sm font-black text-purple-700">{selectedTalentModal.dayRate || '₹5,000 / day'}</span>
                  </div>
                </div>
              )}

              {modalTab === 'contact' && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-3xl border border-purple-200 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <Briefcase size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Direct Audition & Booking Request</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Sign in as a Production House or Studio to send direct script auditions, manage escrow contracts, and hire {selectedTalentModal.name}.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <Link
                      to="/company/signup"
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:from-purple-700 hover:to-indigo-700 transition-all"
                    >
                      Register Production House to Hire
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
          <img src={lightboxImage} alt="" className="max-w-full max-h-full rounded-2xl object-contain" />
        </div>
      )}
    </PublicLayout>
  );
}
