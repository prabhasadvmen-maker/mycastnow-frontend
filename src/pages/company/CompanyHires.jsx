import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FolderOpen, Calendar, MapPin, DollarSign, CheckCircle2,
  Clock, XCircle, Search, RefreshCw, Film, User, AlertCircle,
  MessageSquare, Phone, Mail, ArrowRight, ShieldCheck, X,
  Check, FileText, ChevronRight, Plus
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

const CompanyHires = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // 'All' | 'Pending' | 'Confirmed' | 'Completed'
  const [search, setSearch] = useState('');

  // Selected Booking for Contract View Modal
  const [viewBooking, setViewBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch Bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API}/company/talent/bookings`, { headers });
      if (res.data?.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      console.error('Fetch bookings error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Update Status
  const handleUpdateStatus = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.put(`${API}/company/talent/bookings/${bookingId}/status`, {
        status: newStatus
      }, { headers });

      if (res.data?.success) {
        setBookings(prev => prev.map(b => (b.id === bookingId || b._id === bookingId) ? res.data.booking : b));
        if (viewBooking && (viewBooking.id === bookingId || viewBooking._id === bookingId)) {
          setViewBooking(res.data.booking);
        }
      }
    } catch (err) {
      console.error('Update status error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Update Payment Status
  const handleUpdatePayment = async (bookingId, newPaymentStatus) => {
    setUpdatingId(bookingId);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.put(`${API}/company/talent/bookings/${bookingId}/payment`, {
        paymentStatus: newPaymentStatus
      }, { headers });

      if (res.data?.success) {
        setBookings(prev => prev.map(b => (b.id === bookingId || b._id === bookingId) ? res.data.booking : b));
        if (viewBooking && (viewBooking.id === bookingId || viewBooking._id === bookingId)) {
          setViewBooking(res.data.booking);
        }
      }
    } catch (err) {
      console.error('Update payment error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Compute stats
  const totalValue = bookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = filter === 'All' || b.status === filter;
    const q = search.toLowerCase();
    const creatorName = (b.creator?.basicDetails?.fullName || '').toLowerCase();
    const title = (b.projectTitle || '').toLowerCase();
    return matchesFilter && (!q || creatorName.includes(q) || title.includes(q));
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#0b1120] via-[#121c33] to-[#1e1b4b] rounded-3xl p-6 text-white shadow-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1 w-fit mb-1.5">
            <FolderOpen size={12} />
            Direct Bookings & Contracts
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white">Project Hires & Contracts</h1>
          <p className="text-xs text-gray-300">
            Track confirmed bookings, shoot dates, project proposals, and payment disbursements from live database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/company/dashboard/find-talent"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white text-gray-900 font-bold text-xs hover:bg-gray-100 transition shadow-md self-start md:self-auto"
          >
            <Plus size={13} />
            <span>Book New Talent</span>
          </Link>
        </div>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Contracts</span>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{bookings.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FolderOpen size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Confirmed Hires</span>
            <p className="text-2xl font-black text-indigo-600 mt-0.5">{confirmedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Completed Projects</span>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{completedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Film size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Contract Value</span>
            <p className="text-xl font-black text-purple-600 mt-0.5">{fmt(totalValue)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <DollarSign size={18} />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookings by project or creator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200 text-xs">
            {['All', 'Pending', 'Confirmed', 'Completed'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1 rounded-lg font-bold transition capitalize ${
                  filter === s
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={fetchBookings}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700"
            title="Refresh"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="min-h-[250px] flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-xs font-bold text-gray-600">Loading project hires...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FolderOpen size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-900">No project hires found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Directly book creators from the "Find Talent" or "Talent Cart" section to see your contracts here.
          </p>
          <Link
            to="/company/dashboard/find-talent"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition"
          >
            Discover Talents Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const bookingId = b.id || b._id;
            const creator = b.creator || {};
            const creatorName = creator.basicDetails?.fullName || creator.name || 'Creative Professional';
            const creatorPhoto = creator.basicDetails?.profilePhoto || creator.portfolio?.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
            const category = creator.professionalDetails?.primaryCategory || 'Talent';
            const creatorId = creator._id || creator.id;

            return (
              <div
                key={bookingId}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Left Area: Creator + Project info */}
                <div className="flex items-start gap-4">
                  <img
                    src={creatorPhoto}
                    alt={creatorName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-gray-100 shrink-0"
                  />

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        b.status === 'Confirmed'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : b.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {b.status}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {b.projectType || 'Brand Shoot'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : b.paymentStatus === 'Partially Paid'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {b.paymentStatus || 'Unpaid'}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-gray-900 leading-tight">
                      {b.projectTitle}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="font-bold text-gray-900">{creatorName}</span>
                      <span>({category})</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-gray-400" />
                        {new Date(b.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-gray-400" />
                        {b.location || 'Studio'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-black text-emerald-600">
                        <DollarSign size={12} />
                        {fmt(b.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Area: Action Buttons */}
                <div className="flex items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 flex-wrap">
                  {/* View Contract Button */}
                  <button
                    onClick={() => setViewBooking(b)}
                    className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <FileText size={13} />
                    <span>Contract</span>
                  </button>

                  {/* Message Button */}
                  {creatorId && (
                    <button
                      onClick={() => navigate(`/company/dashboard/inbox?creatorId=${creatorId}`)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition flex items-center gap-1.5"
                    >
                      <MessageSquare size={13} />
                      <span>Chat</span>
                    </button>
                  )}

                  {/* Status Toggle Buttons */}
                  {b.status === 'Pending' && (
                    <button
                      onClick={() => handleUpdateStatus(bookingId, 'Confirmed')}
                      disabled={updatingId === bookingId}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      Confirm
                    </button>
                  )}

                  {b.status === 'Confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(bookingId, 'Completed')}
                      disabled={updatingId === bookingId}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      Complete
                    </button>
                  )}

                  {b.paymentStatus !== 'Paid' && (
                    <button
                      onClick={() => handleUpdatePayment(bookingId, 'Paid')}
                      disabled={updatingId === bookingId}
                      className="px-3 py-2 rounded-xl border border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-bold text-xs transition"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL: VIEW CONTRACT DETAILS ── */}
      {viewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <FileText size={16} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Project Hire Contract</h3>
                  <p className="text-[11px] text-gray-400">Verified booking agreement and shoot details</p>
                </div>
              </div>
              <button
                onClick={() => setViewBooking(null)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Project Title</span>
                  <h4 className="text-sm font-black text-gray-900 mt-0.5">{viewBooking.projectTitle}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Compensation</span>
                  <p className="text-sm font-black text-emerald-600 mt-0.5">{fmt(viewBooking.amount)}</p>
                </div>
              </div>

              {/* Creator Info */}
              <div className="p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={viewBooking.creator?.basicDetails?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt="Creator"
                    className="w-12 h-12 rounded-xl object-cover border border-indigo-200"
                  />
                  <div>
                    <h5 className="font-bold text-gray-900">{viewBooking.creator?.basicDetails?.fullName}</h5>
                    <p className="text-gray-500 text-[11px]">{viewBooking.creator?.professionalDetails?.primaryCategory}</p>
                    <p className="text-gray-400 text-[10px]">{viewBooking.creator?.phone || 'Contact via Portal'}</p>
                  </div>
                </div>

                {viewBooking.creator?._id && (
                  <button
                    onClick={() => {
                      const cId = viewBooking.creator._id;
                      setViewBooking(null);
                      navigate(`/company/dashboard/inbox?creatorId=${cId}`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
                  >
                    <MessageSquare size={12} />
                    <span>Chat</span>
                  </button>
                )}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Shoot / Event Date</span>
                  <p className="font-bold text-gray-800 mt-1">
                    {new Date(viewBooking.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Location</span>
                  <p className="font-bold text-gray-800 mt-1">{viewBooking.location || 'Mumbai Studio'}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Contract Status</span>
                  <p className="font-bold text-indigo-700 mt-1">{viewBooking.status}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Payment Disbursement</span>
                  <p className="font-bold text-emerald-700 mt-1">{viewBooking.paymentStatus}</p>
                </div>
              </div>

              {/* Scope & Description */}
              {viewBooking.description && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Project Brief & Scope</span>
                  <p className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 leading-relaxed">
                    {viewBooking.description}
                  </p>
                </div>
              )}

              {/* Notes */}
              {viewBooking.notes && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Contract Terms & Notes</span>
                  <p className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-amber-900 leading-relaxed">
                    {viewBooking.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <span className="text-gray-400 text-[11px]">Contract Protected by MyCastNow Escrow</span>
              <button
                onClick={() => setViewBooking(null)}
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

export default CompanyHires;
