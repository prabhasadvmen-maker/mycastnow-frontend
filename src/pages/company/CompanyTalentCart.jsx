import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShoppingBag, Trash2, Calendar, MapPin, Star, Eye,
  ArrowRight, Search, CheckCircle, RefreshCw, X, Send, Check,
  MessageSquare, User, Sparkles, DollarSign, Film, ShieldCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

const CompanyTalentCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Booking Modal
  const [bookingTalent, setBookingTalent] = useState(null);
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

  // Profile Preview Modal
  const [previewCreator, setPreviewCreator] = useState(null);

  // Fetch Cart Items
  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API}/company/talent/cart/list`, { headers });
      if (res.data?.success) {
        setCartItems(res.data.items || []);
      }
    } catch (err) {
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Remove single talent from Cart
  const handleRemove = async (creatorId) => {
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.post(`${API}/company/talent/cart/toggle`, { creatorId }, { headers });
      setCartItems(prev => prev.filter(i => {
        const cId = i.creator?._id || i.creator?.id || i.creator;
        return cId?.toString() !== creatorId.toString();
      }));
    } catch (err) {
      console.error('Remove error:', err);
    }
  };

  // Clear all cart
  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear all talents from your cart?')) return;
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.post(`${API}/company/talent/cart/clear`, {}, { headers });
      setCartItems([]);
    } catch (err) {
      console.error('Clear cart error:', err);
    }
  };

  // Open Direct Booking Modal
  const handleOpenBooking = (creator) => {
    const fullName = creator.basicDetails?.fullName || creator.name || 'Talent';
    const dayRate = creator.pricing?.dayRate || 15000;

    setBookingTalent({ id: creator._id || creator.id, fullName });
    setBookingForm({
      projectTitle: '',
      projectType: 'Brand Shoot',
      eventDate: '',
      location: creator.basicDetails?.city || 'Mumbai Studio',
      amount: dayRate,
      description: ''
    });
    setBookingSuccess(false);
  };

  // Submit Booking
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!bookingForm.projectTitle || !bookingForm.eventDate) return;

    setBookingSubmitting(true);
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
          navigate('/company/dashboard/hires');
        }, 1200);
      }
    } catch (err) {
      console.error('Booking error:', err);
    } finally {
      setBookingSubmitting(false);
    }
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  // KPI Calculations
  const totalDayRate = cartItems.reduce((acc, item) => {
    const r = item.creator?.pricing?.dayRate || 10000;
    return acc + Number(r);
  }, 0);

  const avgDayRate = cartItems.length > 0 ? Math.round(totalDayRate / cartItems.length) : 0;

  const categories = ['All', ...new Set(cartItems.map(i => i.creator?.professionalDetails?.primaryCategory).filter(Boolean))];

  const filteredItems = cartItems.filter(item => {
    const creator = item.creator || {};
    const name = (creator.basicDetails?.fullName || creator.name || '').toLowerCase();
    const cat = (creator.professionalDetails?.primaryCategory || '').toLowerCase();
    const city = (creator.basicDetails?.city || '').toLowerCase();
    const q = search.toLowerCase();

    const matchesCategory = categoryFilter === 'All' || cat === categoryFilter.toLowerCase();
    const matchesSearch = !q || name.includes(q) || cat.includes(q) || city.includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#0b1120] via-[#121c33] to-[#1e1b4b] rounded-3xl p-6 text-white shadow-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center gap-1 w-fit mb-1.5">
            <ShoppingBag size={12} />
            Shortlist & Bookings
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white">Talent Cart & Shortlist</h1>
          <p className="text-xs text-gray-300">
            Bookmarked creative talent ready for direct booking and project proposals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-red-500/20 text-gray-300 hover:text-red-300 font-bold text-xs border border-white/10 transition"
            >
              Clear Cart
            </button>
          )}

          <Link
            to="/company/dashboard/find-talent"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white text-gray-900 font-bold text-xs hover:bg-gray-100 transition shadow-md"
          >
            <span>Browse More Talent</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Shortlisted Talents</span>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{cartItems.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShoppingBag size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Estimated Pool Value / Day</span>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{fmt(totalDayRate)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Average Day Rate</span>
            <p className="text-2xl font-black text-blue-600 mt-0.5">{fmt(avgDayRate)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sparkles size={18} />
          </div>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search shortlisted talent by name, city, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition shrink-0 ${
                categoryFilter === cat
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}

          <button
            onClick={fetchCart}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 shrink-0"
            title="Refresh"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Cart Grid */}
      {loading ? (
        <div className="min-h-[250px] flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100">
          <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-xs font-bold text-gray-600">Loading your talent cart...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <ShoppingBag size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-900">Your Talent Cart is empty</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Browse our verified talent pool and click "Add to Cart" to shortlist actors, models, and creators here.
          </p>
          <Link
            to="/company/dashboard/find-talent"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-sm hover:bg-purple-700 transition"
          >
            Discover Talents Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const c = item.creator || {};
            const fullName = c.basicDetails?.fullName || c.name || 'Creative Talent';
            const photo = c.basicDetails?.profilePhoto || c.portfolio?.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
            const category = c.professionalDetails?.primaryCategory || 'Model';
            const city = c.basicDetails?.city || 'India';
            const dayRate = c.pricing?.dayRate || 12000;
            const creatorId = c._id || c.id;

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between space-y-4 hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <img
                      src={photo}
                      alt={fullName}
                      onClick={() => setPreviewCreator(c)}
                      className="w-18 h-18 rounded-2xl object-cover border border-gray-100 shrink-0 cursor-pointer hover:opacity-90 transition"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                          {category}
                        </span>

                        <button
                          onClick={() => handleRemove(creatorId)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Remove from Cart"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <h3
                        onClick={() => setPreviewCreator(c)}
                        className="text-sm font-black text-gray-900 truncate mt-1 cursor-pointer hover:text-purple-600 transition"
                      >
                        {fullName}
                      </h3>

                      <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={11} />
                        {city}
                      </p>

                      <p className="text-xs font-black text-emerald-600 mt-1">
                        {fmt(dayRate)} <span className="text-[10px] font-normal text-gray-400">/ day</span>
                      </p>
                    </div>
                  </div>

                  {/* Role interest & notes if present */}
                  <div className="mt-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-[11px] space-y-1">
                    {item.roleInterest && (
                      <p className="font-semibold text-gray-700">
                        <span className="text-gray-400">Target Role:</span> {item.roleInterest}
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-gray-500 italic">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setPreviewCreator(c)}
                    className="py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition flex items-center justify-center gap-1"
                  >
                    <Eye size={12} />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => navigate(`/company/dashboard/inbox?creatorId=${creatorId}`)}
                    className="py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition flex items-center justify-center gap-1"
                  >
                    <MessageSquare size={12} />
                    <span>Chat</span>
                  </button>

                  <button
                    onClick={() => handleOpenBooking(c)}
                    className="py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1"
                  >
                    <Calendar size={12} />
                    <span>Book</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL 1: DIRECT BOOKING ── */}
      {bookingTalent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-black text-gray-900">Direct Booking Proposal</h3>
                <p className="text-xs text-gray-500">Hire <b>{bookingTalent.fullName}</b> for your project</p>
              </div>
              <button
                onClick={() => setBookingTalent(null)}
                className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <h4 className="text-base font-bold text-gray-900">Booking Proposal Sent!</h4>
                <p className="text-xs text-gray-500">Redirecting to your Project Hires dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Autumn / Winter Fashion Catalog Shoot"
                    value={bookingForm.projectTitle}
                    onChange={(e) => setBookingForm({ ...bookingForm, projectTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Project Type</label>
                    <select
                      value={bookingForm.projectType}
                      onChange={(e) => setBookingForm({ ...bookingForm, projectType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Brand Shoot">Brand Shoot</option>
                      <option value="Ad Film">Ad Film</option>
                      <option value="Web Series">Web Series</option>
                      <option value="Movie">Movie</option>
                      <option value="Music Video">Music Video</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Shoot Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.eventDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, eventDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Andheri Studio, Mumbai"
                      value={bookingForm.location}
                      onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Agreed Amount (₹)</label>
                    <input
                      type="number"
                      value={bookingForm.amount}
                      onChange={(e) => setBookingForm({ ...bookingForm, amount: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Project Brief / Scope</label>
                  <textarea
                    rows={2}
                    placeholder="Specific requirements, wardrobe, call time details..."
                    value={bookingForm.description}
                    onChange={(e) => setBookingForm({ ...bookingForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingTalent(null)}
                    className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md transition flex items-center gap-1.5"
                  >
                    <Send size={13} />
                    <span>{bookingSubmitting ? 'Sending...' : 'Send Hire Proposal'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL 2: CREATOR PROFILE PREVIEW ── */}
      {previewCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header banner */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <img
                  src={previewCreator.basicDetails?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={previewCreator.basicDetails?.fullName}
                  className="w-12 h-12 rounded-2xl object-cover border border-gray-200"
                />
                <div>
                  <h3 className="text-base font-black text-gray-900">{previewCreator.basicDetails?.fullName}</h3>
                  <p className="text-xs text-gray-500">{previewCreator.professionalDetails?.primaryCategory} • {previewCreator.basicDetails?.city}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewCreator(null)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">About & Bio</span>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  {previewCreator.basicDetails?.bio || 'Professional creative talent registered on MyCastNow platform.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Experience</span>
                  <p className="font-bold text-gray-900 mt-0.5">{previewCreator.professionalDetails?.experience || '2+ Years'}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Pricing</span>
                  <p className="font-bold text-emerald-600 mt-0.5">{fmt(previewCreator.pricing?.dayRate || 10000)} / day</p>
                </div>
              </div>

              {/* Photos Gallery */}
              {previewCreator.portfolio?.photos && previewCreator.portfolio.photos.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Portfolio Gallery</span>
                  <div className="grid grid-cols-3 gap-2">
                    {previewCreator.portfolio.photos.slice(0, 6).map((imgUrl, i) => (
                      <div key={i} className="h-28 rounded-xl overflow-hidden bg-gray-900">
                        <img src={imgUrl} alt="Portfolio" className="w-full h-full object-cover hover:scale-105 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <button
                onClick={() => {
                  const c = previewCreator;
                  setPreviewCreator(null);
                  handleOpenBooking(c);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition flex items-center gap-1.5"
              >
                <Calendar size={13} />
                <span>Book This Talent</span>
              </button>

              <button
                onClick={() => setPreviewCreator(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 transition"
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

export default CompanyTalentCart;
