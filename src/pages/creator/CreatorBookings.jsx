import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import {
  Calendar, Clock, MapPin, DollarSign, CheckCircle2,
  XCircle, MessageSquare, AlertCircle, FileText, Search,
  Filter, Building2, ExternalLink, RefreshCw, X, Sparkles
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const STATUS_TABS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

const CreatorBookings = () => {
  const { creatorUser } = useCreatorAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API}/creator/portal/bookings`, { headers });
      if (res.data?.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.put(`${API}/creator/portal/bookings/${bookingId}/status`, {
        status: newStatus
      }, { headers });

      if (res.data?.success) {
        setBookings(prev => prev.map(b => (b._id === bookingId ? { ...b, status: newStatus } : b)));
        if (selectedBooking?._id === bookingId) {
          setSelectedBooking(prev => ({ ...prev, status: newStatus }));
        }
        showToast(`Booking ${newStatus.toLowerCase()} successfully!`);
      }
    } catch (err) {
      showToast('Failed to update booking status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenChat = (company) => {
    if (company?._id) {
      navigate(`/creator/dashboard/inbox?companyId=${company._id}`);
    } else {
      navigate('/creator/dashboard/inbox');
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesTab = activeTab === 'All' || b.status === activeTab;
    const matchesSearch = !search.trim() ||
      b.projectTitle?.toLowerCase().includes(search.toLowerCase()) ||
      b.company?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.projectType?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalValue = bookings
    .filter(b => b.status !== 'Cancelled')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

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

      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#180a22] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-purple-800/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-fuchsia-200">
              <Sparkles size={13} className="text-yellow-400" />
              <span>Direct Commercial Contracts</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Hires & Project Bookings
            </h1>
            <p className="text-purple-200 text-xs md:text-sm max-w-xl">
              Manage client shoot offers, accept production contracts, and chat directly with verified casting directors.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-purple-200">Total Contract Value</p>
              <h3 className="text-2xl font-black text-white">₹{totalValue.toLocaleString('en-IN')}</h3>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-purple-200">Total Hires</p>
              <h3 className="text-2xl font-black text-fuchsia-300">{bookings.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
            {STATUS_TABS.map(tab => {
              const count = tab === 'All'
                ? bookings.length
                : bookings.filter(b => b.status === tab).length;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab} ({count})
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by project or studio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* BOOKINGS LIST */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-xs font-medium">Loading commercial bookings from database...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
          <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto text-purple-600">
            <Calendar size={28} />
          </div>
          <h3 className="font-black text-gray-900 text-base">No bookings found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {activeTab === 'All'
              ? 'When production houses hire you directly, their booking contracts will appear here.'
              : `No bookings with status "${activeTab}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Left details */}
              <div className="space-y-3 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-700">
                    {b.projectType || 'Brand Shoot'}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md ${
                      b.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'Completed'
                        ? 'bg-blue-100 text-blue-800'
                        : b.status === 'Cancelled'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {b.status}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      b.paymentStatus === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Payment: {b.paymentStatus || 'Unpaid'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-gray-900">{b.projectTitle}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <Building2 size={13} className="text-gray-400" />
                    <span className="font-bold text-gray-700">{b.company?.name || 'Advmen Technologies'}</span>
                    <span className="text-gray-300">•</span>
                    <span>{b.company?.city || 'Mumbai'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar size={13} className="text-purple-600" />
                    {new Date(b.eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin size={13} className="text-purple-600" />
                    {b.location || 'Mumbai Studio'}
                  </span>
                  <span className="font-black text-emerald-600 text-sm">
                    ₹{Number(b.amount || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                {b.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 max-w-2xl bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    {b.description}
                  </p>
                )}
              </div>

              {/* Right actions */}
              <div className="flex flex-wrap lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                <div className="flex items-center gap-2 w-full lg:w-auto">
                  <button
                    onClick={() => handleOpenChat(b.company)}
                    className="flex-1 lg:flex-initial px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <MessageSquare size={14} />
                    <span>Chat with Studio</span>
                  </button>

                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                    title="View Contract Details"
                  >
                    <FileText size={16} />
                  </button>
                </div>

                {/* Conditional Status Action Buttons */}
                {b.status === 'Pending' && (
                  <div className="flex items-center gap-2 w-full lg:w-auto pt-1">
                    <button
                      onClick={() => handleUpdateStatus(b._id, 'Confirmed')}
                      disabled={updatingId === b._id}
                      className="flex-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
                    >
                      {updatingId === b._id ? 'Updating...' : 'Accept Offer'}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(b._id, 'Cancelled')}
                      disabled={updatingId === b._id}
                      className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {b.status === 'Confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus(b._id, 'Completed')}
                    disabled={updatingId === b._id}
                    className="w-full lg:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    {updatingId === b._id ? 'Updating...' : 'Mark Shoot Completed'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONTRACT MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-600 uppercase">Commercial Talent Contract</span>
                <h3 className="font-black text-lg text-gray-900">{selectedBooking.projectTitle}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-2xl text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] font-bold uppercase">Client Studio</span>
                <span className="font-bold text-gray-800">{selectedBooking.company?.name || 'Advmen Technologies'}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] font-bold uppercase">Agreed Fee</span>
                <span className="font-black text-emerald-600 text-sm">₹{Number(selectedBooking.amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] font-bold uppercase">Shoot Date</span>
                <span className="font-bold text-gray-800">
                  {new Date(selectedBooking.eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] font-bold uppercase">Location</span>
                <span className="font-bold text-gray-800">{selectedBooking.location || 'Mumbai'}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs text-gray-900 mb-1">Contract Scope & Producer Terms</h4>
              <p className="text-xs text-gray-600 leading-relaxed bg-purple-50/30 p-3 rounded-xl border border-purple-100">
                {selectedBooking.description || 'Full day commercial shoot for digital release and television broadcast. Food, makeup, and costumes provided on set.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <button
                onClick={() => {
                  const comp = selectedBooking.company;
                  setSelectedBooking(null);
                  handleOpenChat(comp);
                }}
                className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
              >
                <MessageSquare size={13} /> Chat with Casting Director
              </button>

              <button
                onClick={() => setSelectedBooking(null)}
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

export default CreatorBookings;
