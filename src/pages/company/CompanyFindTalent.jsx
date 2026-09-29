import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search, Star, MapPin, CheckCircle, Sparkles,
  ShoppingBag, Video, Eye, Calendar,
  ChevronRight, ChevronLeft, X, Check,
  Send, RefreshCw, SlidersHorizontal, Camera
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const CompanyFindTalent = () => {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [gender, setGender] = useState('All');
  const [city, setCity] = useState('All');
  const [isBoostedOnly, setIsBoostedOnly] = useState(false);
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);
  const [sort, setSort] = useState('boosted');
  const [metadata, setMetadata] = useState({ categories: [], cities: [] });

  // Modals
  const [selectedTalent, setSelectedTalent] = useState(null); // Detail modal
  const [bookingTalent, setBookingTalent] = useState(null);   // Booking modal
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    projectTitle: '',
    projectType: 'Brand Shoot',
    eventDate: '',
    location: '',
    amount: '',
    description: ''
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Detail Modal Tab
  const [modalTab, setModalTab] = useState('portfolio'); // 'portfolio' | 'specs' | 'bio'

  // Fetch Talents with Server-Side Pagination & Real DB Query
  const fetchTalents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (search) params.append('search', search);
      if (category !== 'All') params.append('category', category);
      if (gender !== 'All') params.append('gender', gender);
      if (city !== 'All') params.append('city', city);
      if (isBoostedOnly) params.append('isBoosted', 'true');
      if (isVerifiedOnly) params.append('isVerified', 'true');
      if (sort) params.append('sort', sort);

      const res = await axios.get(`${API}/company/talent?${params.toString()}`, { headers });
      if (res.data?.success) {
        setTalents(res.data.talents || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
        setCartCount(res.data.cartCount || 0);
        if (res.data.metadata) {
          setMetadata(res.data.metadata);
        }
      }
    } catch (err) {
      console.error('Fetch talents error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalents();
  }, [page, limit, category, gender, city, isBoostedOnly, isVerifiedOnly, sort]);

  // Debounced search (resets page to 1)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchTalents();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when major filters change
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  // Toggle Cart
  const handleToggleCart = async (talent, e) => {
    if (e) e.stopPropagation();
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(`${API}/company/talent/cart/toggle`, {
        creatorId: talent.id
      }, { headers });

      if (res.data?.success) {
        setTalents(prev => prev.map(t => t.id === talent.id ? { ...t, isInCart: res.data.isInCart } : t));
        setCartCount(res.data.cartCount || 0);
        if (selectedTalent && selectedTalent.id === talent.id) {
          setSelectedTalent(prev => ({ ...prev, isInCart: res.data.isInCart }));
        }
      }
    } catch (err) {
      console.error('Cart toggle error:', err);
    }
  };

  // Open Cart Modal
  const openCart = async () => {
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API}/company/talent/cart/list`, { headers });
      if (res.data?.success) {
        setCartItems(res.data.items || []);
      }
      setCartModalOpen(true);
    } catch (err) {
      console.error('Fetch cart error:', err);
    }
  };

  // Open Direct Booking Modal
  const handleOpenBooking = (talent, e) => {
    if (e) e.stopPropagation();
    setBookingTalent(talent);
    setBookingForm({
      projectTitle: '',
      projectType: 'Brand Shoot',
      eventDate: '',
      location: talent.city || 'Mumbai Studio',
      amount: talent.pricing?.dayRate || 15000,
      description: ''
    });
    setBookingError('');
    setBookingSuccess(false);
  };

  // Submit Booking Invitation
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!bookingForm.projectTitle || !bookingForm.eventDate) return;

    setBookingSubmitting(true);
    setBookingError('');
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(`${API}/company/talent/book`, {
        creatorId: bookingTalent.id,
        ...bookingForm
      }, { headers });

      if (res.data?.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          setBookingTalent(null);
          setBookingSuccess(false);
        }, 1600);
      }
    } catch (err) {
      console.error('Booking error:', err);
      setBookingError(err.response?.data?.message || 'Failed to send booking proposal.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  const categoryList = ['All', 'Model', 'Actor', 'Voice Artist', 'Influencer', 'Dancer'];

  return (
    <div className="space-y-5">

      {/* ── Page Header ── */}
      <div className="bg-gradient-to-r from-[#0b1120] via-[#121c33] to-[#1e1b4b] rounded-3xl p-5 sm:p-6 text-white shadow-lg border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1">
              <Sparkles size={11} className="text-indigo-400" />
              Verified Talent Directory
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <CheckCircle size={11} />
              Real MongoDB Data
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Find & Book Creative Talent
          </h1>
          <p className="text-xs text-gray-300">
            Browse verified actors, models, and creators. Inspect portfolios and send direct booking proposals.
          </p>
        </div>

        {/* Talent Cart Trigger Button */}
        <button
          onClick={openCart}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-gray-900 font-bold text-xs shadow-md hover:bg-gray-100 transition active:scale-95 shrink-0 self-start md:self-auto"
        >
          <ShoppingBag size={16} className="text-purple-600" />
          <span>Talent Cart</span>
          <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[11px] flex items-center justify-center font-black">
            {cartCount}
          </span>
        </button>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">

        {/* Search Bar + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by talent name, skill (Ramp, Acting, Voice), city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs">
              <SlidersHorizontal size={13} className="text-gray-400" />
              <span className="font-semibold text-gray-500 text-[11px]">Sort:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent font-bold text-gray-800 text-xs focus:outline-none cursor-pointer"
              >
                <option value="boosted">✨ Spotlight & Top Rated</option>
                <option value="rating">★ Highest Rating</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="experience">Experience Level</option>
              </select>
            </div>

            <button
              onClick={fetchTalents}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categoryList.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                category === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filter Chips */}
        <div className="flex items-center gap-2.5 pt-2 border-t border-gray-100 flex-wrap text-xs">
          <button
            onClick={() => {
              setIsBoostedOnly(!isBoostedOnly);
              setPage(1);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition border text-[11px] ${
              isBoostedOnly
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Sparkles size={11} className={isBoostedOnly ? 'text-amber-600 fill-amber-500' : 'text-gray-400'} />
            Spotlight Only
          </button>

          <button
            onClick={() => {
              setIsVerifiedOnly(!isVerifiedOnly);
              setPage(1);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition border text-[11px] ${
              isVerifiedOnly
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <CheckCircle size={11} className={isVerifiedOnly ? 'text-emerald-600' : 'text-gray-400'} />
            Verified Only
          </button>

          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-0.5 text-[11px]">
            <span className="text-gray-400 font-medium">Gender:</span>
            <select
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-bold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-0.5 text-[11px]">
            <span className="text-gray-400 font-medium">City:</span>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-bold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Cities</option>
              {metadata.cities?.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <span className="ml-auto text-gray-400 text-[11px] font-semibold">
            Total Database: <b className="text-gray-900">{total}</b> verified creators
          </span>
        </div>

      </div>

      {/* ── Compact Talents Grid ── */}
      {loading ? (
        <div className="min-h-[280px] flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-xs font-bold text-gray-600">Loading talents from database...</p>
        </div>
      ) : talents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Search size={22} />
          </div>
          <h3 className="text-base font-bold text-gray-900">No talents match your criteria</h3>
          <p className="text-xs text-gray-400">
            Try adjusting your search keywords, clear category filters, or select "All".
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setGender('All');
              setCity('All');
              setIsBoostedOnly(false);
              setIsVerifiedOnly(false);
              setPage(1);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {talents.map((talent) => (
            <div
              key={talent.id}
              onClick={() => setSelectedTalent(talent)}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between group cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ${
                talent.isBoosted
                  ? 'border-amber-300 ring-1 ring-amber-400/40 shadow-xs'
                  : 'border-gray-100 shadow-xs'
              }`}
            >
              <div>
                {/* Compact Photo Area (Height: 52 = 208px) */}
                <div className="relative h-52 w-full bg-gray-900 overflow-hidden">
                  <img
                    src={talent.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                    alt={talent.fullName}
                    className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1 flex-wrap">
                      {talent.isBoosted && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm flex items-center gap-1">
                          <Sparkles size={10} className="fill-white" />
                          {talent.boostBadge || 'Spotlight'}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white border border-white/20">
                        {talent.category}
                      </span>
                    </div>

                    {/* Shortlist Cart Toggle Button */}
                    <button
                      onClick={(e) => handleToggleCart(talent, e)}
                      title={talent.isInCart ? 'Remove from Cart' : 'Shortlist'}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition shadow-md ${
                        talent.isInCart
                          ? 'bg-purple-600 text-white'
                          : 'bg-black/50 text-white hover:bg-black/80'
                      }`}
                    >
                      <ShoppingBag size={13} className={talent.isInCart ? 'fill-white' : ''} />
                    </button>
                  </div>

                  {/* Bottom details on image */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <div className="flex items-center gap-1">
                      <h3 className="text-sm font-black tracking-tight leading-tight truncate">{talent.fullName}</h3>
                      {talent.isVerified && (
                        <CheckCircle size={13} className="text-blue-400 fill-blue-400 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-300 mt-0.5">
                      <span className="flex items-center gap-0.5">
                        <MapPin size={10} className="text-gray-400" />
                        {talent.city}
                      </span>
                      <span>•</span>
                      <span>{talent.experience}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body (Compact padding: 3) */}
                <div className="p-3 space-y-2">

                  {/* Rating & Physical Specs Snippet */}
                  <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-gray-100">
                    <div className="flex items-center gap-1 font-bold text-gray-800">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span>{talent.rating}</span>
                      <span className="text-gray-400 font-normal">({talent.reviewsCount})</span>
                    </div>
                    <div className="text-gray-500 font-medium text-[10px]">
                      Height: <b>{talent.physicalDetails?.height || "5'9\""}</b>
                    </div>
                  </div>

                  {/* Skills Pills (Compact 1-2 pills) */}
                  <div className="flex flex-wrap gap-1 h-6 overflow-hidden">
                    {(talent.skills || []).slice(0, 2).map((skill, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-gray-100 text-gray-700 truncate max-w-[120px]"
                      >
                        {skill}
                      </span>
                    ))}
                    {(talent.skills || []).length > 2 && (
                      <span className="px-1 py-0.5 rounded text-[9px] font-medium bg-gray-50 text-gray-400">
                        +{talent.skills.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Pricing row */}
                  <div className="pt-1 flex items-baseline justify-between">
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase font-bold block leading-none">Day Rate</span>
                      <span className="text-sm font-black text-gray-900">{fmt(talent.pricing.dayRate)}</span>
                      <span className="text-[9px] text-gray-400"> /day</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-gray-400 uppercase font-bold block leading-none">Hourly</span>
                      <span className="text-[11px] font-bold text-gray-700">{fmt(talent.pricing.hourlyRate)}/hr</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 pt-0 grid grid-cols-2 gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTalent(talent);
                  }}
                  className="py-1.5 px-2 rounded-lg border border-gray-200 text-gray-700 font-bold text-[11px] hover:bg-gray-50 transition flex items-center justify-center gap-1"
                >
                  <Eye size={12} />
                  Portfolio
                </button>
                <button
                  onClick={(e) => handleOpenBooking(talent, e)}
                  className="py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-xs transition flex items-center justify-center gap-1"
                >
                  <Calendar size={12} />
                  Direct Book
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ── Pagination Controls Bar ── */}
      {total > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-gray-500">
            <span>
              Showing <b className="text-gray-900">{Math.min((page - 1) * limit + 1, total)}</b> to{' '}
              <b className="text-gray-900">{Math.min(page * limit, total)}</b> of{' '}
              <b className="text-gray-900">{total}</b> verified talents
            </span>

            {/* Limit Selector */}
            <div className="flex items-center gap-1 ml-2">
              <span className="text-[11px] text-gray-400">Per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 font-bold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
              </select>
            </div>
          </div>

          {/* Page Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={`p-2 rounded-xl border flex items-center justify-center transition ${
                page <= 1
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pNum) => (
              <button
                key={pNum}
                onClick={() => setPage(pNum)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                  page === pNum
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {pNum}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className={`p-2 rounded-xl border flex items-center justify-center transition ${
                page >= totalPages
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL 1: TALENT PORTFOLIO & DETAILS ── */}
      {selectedTalent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTalent.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                  alt={selectedTalent.fullName}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-gray-900">{selectedTalent.fullName}</h3>
                    {selectedTalent.isVerified && (
                      <CheckCircle size={15} className="text-blue-500 fill-blue-500" />
                    )}
                    {selectedTalent.isBoosted && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500 text-white">
                        {selectedTalent.boostBadge || 'Spotlight'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {selectedTalent.category} • {selectedTalent.city} • {selectedTalent.experience}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleCart(selectedTalent)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                    selectedTalent.isInCart
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ShoppingBag size={14} />
                  {selectedTalent.isInCart ? 'In Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => {
                    const t = selectedTalent;
                    setSelectedTalent(null);
                    handleOpenBooking(t);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition flex items-center gap-1"
                >
                  <Calendar size={13} />
                  Book
                </button>
                <button
                  onClick={() => setSelectedTalent(null)}
                  className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Tabs Bar */}
            <div className="flex border-b border-gray-100 px-6 gap-6 bg-white text-xs font-bold text-gray-500">
              <button
                onClick={() => setModalTab('portfolio')}
                className={`py-3 border-b-2 transition ${
                  modalTab === 'portfolio'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent hover:text-gray-800'
                }`}
              >
                Photo Gallery ({selectedTalent.photos?.length || 0})
              </button>
              <button
                onClick={() => setModalTab('specs')}
                className={`py-3 border-b-2 transition ${
                  modalTab === 'specs'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent hover:text-gray-800'
                }`}
              >
                Measurements & Specs
              </button>
              <button
                onClick={() => setModalTab('bio')}
                className={`py-3 border-b-2 transition ${
                  modalTab === 'bio'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent hover:text-gray-800'
                }`}
              >
                Bio, Skills & Rates
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto max-h-[60vh] space-y-5">

              {modalTab === 'portfolio' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    High Resolution Headshots & Portfolio
                  </h4>
                  {selectedTalent.photos && selectedTalent.photos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedTalent.photos.map((imgUrl, i) => (
                        <div key={i} className="aspect-3/4 rounded-2xl overflow-hidden bg-gray-100 group relative">
                          <img
                            src={imgUrl}
                            alt={`Portfolio ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-400 bg-gray-50 rounded-2xl">
                      <Camera size={24} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-xs font-medium">Headshots available on verified file profile</p>
                    </div>
                  )}

                  {selectedTalent.videos && selectedTalent.videos.length > 0 && (
                    <div className="pt-3 space-y-2">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Video size={13} className="text-purple-600" />
                        Showreel Videos
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedTalent.videos.map((vid, idx) => (
                          <div key={idx} className="rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                            <video src={vid} controls className="w-full h-full object-contain" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {modalTab === 'specs' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Physical Measurements & Casting Specs
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-[10px] text-gray-400 block font-medium">Height</span>
                      <p className="text-base font-black text-gray-900 mt-0.5">{selectedTalent.physicalDetails?.height || "5'9\""}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-[10px] text-gray-400 block font-medium">Weight</span>
                      <p className="text-base font-black text-gray-900 mt-0.5">{selectedTalent.physicalDetails?.weight || "65 kg"}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-[10px] text-gray-400 block font-medium">Chest / Bust</span>
                      <p className="text-base font-black text-gray-900 mt-0.5">{selectedTalent.physicalDetails?.chest || '38"'}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-[10px] text-gray-400 block font-medium">Waist</span>
                      <p className="text-base font-black text-gray-900 mt-0.5">{selectedTalent.physicalDetails?.waist || '30"'}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-[10px] text-gray-400 block font-medium">Eye Color</span>
                      <p className="text-base font-black text-gray-900 mt-0.5">{selectedTalent.physicalDetails?.eyeColor || 'Brown'}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-[10px] text-gray-400 block font-medium">Hair Color</span>
                      <p className="text-base font-black text-gray-900 mt-0.5">{selectedTalent.physicalDetails?.hairColor || 'Black'}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-[10px] text-gray-400 block font-medium">Complexion</span>
                      <p className="text-base font-black text-gray-900 mt-0.5">{selectedTalent.physicalDetails?.complexion || 'Fair'}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-[10px] text-gray-400 block font-medium">Status</span>
                      <p className="text-base font-black text-emerald-600 mt-0.5">{selectedTalent.availability || 'Available'}</p>
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'bio' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Professional Bio</h4>
                    <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                      {selectedTalent.bio}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                      <span className="text-xs font-bold text-gray-500 uppercase">Languages</span>
                      <div className="flex flex-wrap gap-1">
                        {(selectedTalent.languages || []).map((l, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white border border-gray-200 text-xs font-bold text-gray-800">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                      <span className="text-xs font-bold text-gray-500 uppercase">Skills</span>
                      <div className="flex flex-wrap gap-1">
                        {(selectedTalent.skills || []).map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Standard Tariffs</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-center">
                        <span className="text-[9px] uppercase font-bold text-indigo-600">Hourly</span>
                        <p className="text-base font-black text-gray-900 mt-0.5">{fmt(selectedTalent.pricing?.hourlyRate)}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-center">
                        <span className="text-[9px] uppercase font-bold text-indigo-600">Full Day</span>
                        <p className="text-base font-black text-gray-900 mt-0.5">{fmt(selectedTalent.pricing?.dayRate)}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-center">
                        <span className="text-[9px] uppercase font-bold text-indigo-600">Campaign</span>
                        <p className="text-base font-black text-gray-900 mt-0.5">{fmt(selectedTalent.pricing?.projectRate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: DIRECT BOOKING INVITATION (FIXED) ── */}
      {bookingTalent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-base font-black text-gray-900">Direct Booking Proposal</h3>
                <p className="text-[11px] text-gray-500">Send casting booking to {bookingTalent.fullName}</p>
              </div>
              <button
                onClick={() => setBookingTalent(null)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <h4 className="text-base font-bold text-gray-900">Booking Proposal Sent!</h4>
                <p className="text-xs text-gray-500">
                  {bookingTalent.fullName} has been notified and you can track this in Hires / Projects.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="space-y-3 text-xs">
                {bookingError && (
                  <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                    {bookingError}
                  </div>
                )}

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Commercial TVC Shoot"
                    value={bookingForm.projectTitle}
                    onChange={(e) => setBookingForm({ ...bookingForm, projectTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Project Type</label>
                    <select
                      value={bookingForm.projectType}
                      onChange={(e) => setBookingForm({ ...bookingForm, projectType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Brand Shoot">Brand Shoot</option>
                      <option value="Ad Film">Ad Film / TVC</option>
                      <option value="Web Series">Web Series</option>
                      <option value="Movie">Movie / Feature</option>
                      <option value="Music Video">Music Video</option>
                      <option value="Event">Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Shoot Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.eventDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, eventDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Shoot Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai Studio"
                      value={bookingForm.location}
                      onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Offered Budget (₹)</label>
                    <input
                      type="number"
                      required
                      value={bookingForm.amount}
                      onChange={(e) => setBookingForm({ ...bookingForm, amount: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Role Brief / Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of requirements..."
                    value={bookingForm.description}
                    onChange={(e) => setBookingForm({ ...bookingForm, description: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingTalent(null)}
                    className="px-3.5 py-2 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
                  >
                    <Send size={12} />
                    {bookingSubmitting ? 'Sending...' : 'Send Proposal'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL 3: TALENT CART SHORTLIST MODAL ── */}
      {cartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl p-5 space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ShoppingBag size={15} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">Talent Cart & Shortlist</h3>
                  <p className="text-[10px] text-gray-400">Creators bookmarked for upcoming auditions and projects</p>
                </div>
              </div>
              <button
                onClick={() => setCartModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[50vh] space-y-2">
              {cartItems.length === 0 ? (
                <div className="py-8 text-center text-gray-400">
                  <ShoppingBag size={28} className="mx-auto text-gray-300 mb-1.5" />
                  <p className="text-xs font-bold text-gray-700">Your Talent Cart is empty</p>
                  <p className="text-[11px] text-gray-400">Click the bag icon on any talent card to shortlist them.</p>
                </div>
              ) : (
                cartItems.map((item) => {
                  const c = item.creator || {};
                  const fullName = c.basicDetails?.fullName || c.name || 'Talent';
                  const photo = c.basicDetails?.profilePhoto || c.portfolio?.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                  const dayRate = c.pricing?.dayRate || 12000;

                  return (
                    <div key={item._id} className="p-3 rounded-xl border border-gray-100 flex items-center justify-between gap-3 hover:bg-gray-50/50 transition">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={photo}
                          alt={fullName}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900 text-xs">{fullName}</h4>
                          <span className="text-[10px] text-gray-400">
                            {c.professionalDetails?.primaryCategory || 'Model'} • {c.basicDetails?.city || 'India'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs font-black text-gray-900 font-mono">{fmt(dayRate)}</span>
                          <span className="text-[9px] text-gray-400 block">/day</span>
                        </div>
                        <button
                          onClick={() => {
                            setCartModalOpen(false);
                            handleOpenBooking({ id: c._id, fullName, pricing: { dayRate } });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-[11px] hover:bg-indigo-700 transition"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-500 text-[11px]">
                Total Shortlisted: <b>{cartItems.length} Talents</b>
              </span>
              <button
                onClick={() => setCartModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-gray-100 font-bold text-gray-700 hover:bg-gray-200 transition"
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

export default CompanyFindTalent;
