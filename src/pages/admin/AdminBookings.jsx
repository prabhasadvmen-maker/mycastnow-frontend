import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  CalendarCheck, Building2, UserCircle, Search, Filter, Eye,
  X, CheckCircle, Clock, XCircle, IndianRupee,
  MapPin, Tag, Phone, Trash2,
  TrendingUp, Calendar, Star
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Pending:   { color: 'bg-amber-100 text-amber-700 border-amber-200',  dot: 'bg-amber-500',  icon: Clock },
  Confirmed: { color: 'bg-blue-100 text-blue-700 border-blue-200',    dot: 'bg-blue-500',   icon: CheckCircle },
  Completed: { color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500',  icon: Star },
  Cancelled: { color: 'bg-red-100 text-red-700 border-red-200',       dot: 'bg-red-500',    icon: XCircle },
};

const PAYMENT_CONFIG = {
  Unpaid:           { color: 'bg-gray-100 text-gray-600' },
  'Partially Paid': { color: 'bg-orange-100 text-orange-600' },
  Paid:             { color: 'bg-green-100 text-green-700' },
  Refunded:         { color: 'bg-purple-100 text-purple-700' },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>}
    </div>
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
      <Icon size={12} />
      {status}
    </span>
  );
};

// ─── Info Row helper ──────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="flex items-center gap-1.5 text-gray-400 font-medium text-xs">
      <Icon size={12} /> {label}
    </span>
    <span className="text-gray-700 font-semibold text-xs text-right max-w-[55%] truncate">{value}</span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminBookings = () => {
  const [bookings, setBookings]               = useState([]);
  const [stats, setStats]                     = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [search, setSearch]                   = useState('');
  const [filterStatus, setFilterStatus]       = useState('All');
  const [filterPayment, setFilterPayment]     = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // ── Fetch all bookings + stats ─────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus !== 'All') params.status = filterStatus;
      if (filterPayment !== 'All') params.paymentStatus = filterPayment;
      if (search.trim()) params.search = search.trim();

      const [bookRes, statsRes] = await Promise.all([
        axios.get(`${API}/admin/bookings`, { params }),
        axios.get(`${API}/admin/bookings/stats`)
      ]);
      setBookings(bookRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPayment, search]);

  useEffect(() => { fetchAll(); }, [filterStatus, filterPayment]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchAll(), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Status Update ───────────────────────────────────────────────────────────
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const updated = await axios.put(`${API}/admin/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(prev => prev.map(b => b._id === bookingId ? updated.data : b));
      if (selectedBooking?._id === bookingId) setSelectedBooking(updated.data);
    } catch {
      alert('Failed to update status');
    }
  };

  // ── Payment Status Update ───────────────────────────────────────────────────
  const handlePaymentChange = async (bookingId, newPayment) => {
    try {
      const updated = await axios.put(`${API}/admin/bookings/${bookingId}/status`, { paymentStatus: newPayment });
      setBookings(prev => prev.map(b => b._id === bookingId ? updated.data : b));
      if (selectedBooking?._id === bookingId) setSelectedBooking(updated.data);
    } catch {
      alert('Failed to update payment status');
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await axios.delete(`${API}/admin/bookings/${bookingId}`);
      setBookings(prev => prev.filter(b => b._id !== bookingId));
      if (selectedBooking?._id === bookingId) setSelectedBooking(null);
    } catch {
      alert('Failed to delete booking');
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const formatDate   = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const formatAmount = (n) => n ? `₹${Number(n).toLocaleString('en-IN')}` : '₹0';
  const getCreatorName  = (b) => b.creator?.basicDetails?.fullName || 'Unknown Creator';
  const getCreatorPhoto = (b) => b.creator?.basicDetails?.profilePhoto;
  const getCompanyName  = (b) => b.company?.name || 'Unknown Company';
  const getCompanyLogo  = (b) => b.company?.logo;

  // ── Client-side filter ──────────────────────────────────────────────────────
  const filtered = bookings.filter(b => {
    if (filterStatus !== 'All' && b.status !== filterStatus) return false;
    if (filterPayment !== 'All' && b.paymentStatus !== filterPayment) return false;
    return true;
  });

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Header (NO Add Booking button) ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarCheck className="text-blue-600" size={26} />
          Bookings Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View all bookings — which Company booked which Creator, project details, and payment status.
        </p>
      </div>

      {/* ── Stats Cards ── */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard title="Total"     value={stats.total}     icon={CalendarCheck} color="bg-blue-50 text-blue-600" />
          <StatCard title="Pending"   value={stats.pending}   icon={Clock}         color="bg-amber-50 text-amber-500" />
          <StatCard title="Confirmed" value={stats.confirmed} icon={CheckCircle}   color="bg-blue-50 text-blue-600" />
          <StatCard title="Completed" value={stats.completed} icon={Star}          color="bg-green-50 text-green-600" />
          <StatCard title="Cancelled" value={stats.cancelled} icon={XCircle}       color="bg-red-50 text-red-500" />
          <StatCard title="Revenue"   value={formatAmount(stats.totalRevenue)} icon={IndianRupee} color="bg-purple-50 text-purple-600" subtext="Paid bookings" />
        </div>
      )}

      {/* ── Filters ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by company, creator, project..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-4 h-4 shrink-0" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select
            value={filterPayment}
            onChange={e => setFilterPayment(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
          >
            <option value="All">All Payments</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Paid">Paid</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* ── Main: Full Width Table ── */}
      <div className="w-full">

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-gray-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-4 px-5">#</th>
                  <th className="py-4 px-5">Company</th>
                  <th className="py-4 px-5">Creator</th>
                  <th className="py-4 px-5">Project</th>
                  <th className="py-4 px-5">Event Date</th>
                  <th className="py-4 px-5">Amount</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-16 text-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">Loading bookings...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-20 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarCheck size={28} className="text-gray-300" />
                      </div>
                      <p className="text-gray-500 font-semibold">No Bookings Found</p>
                      <p className="text-gray-400 text-xs mt-1">Bookings will appear here once companies book creators</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((b, idx) => (
                    <tr
                      key={b._id}
                      onClick={() => setSelectedBooking(selectedBooking?._id === b._id ? null : b)}
                      className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${selectedBooking?._id === b._id ? 'bg-blue-50/60 border-l-4 border-blue-500' : ''}`}
                    >
                      <td className="py-4 px-5 text-gray-400 font-medium">{idx + 1}</td>

                      {/* Company */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                            {getCompanyLogo(b)
                              ? <img src={getCompanyLogo(b)} alt="" className="w-full h-full object-cover" />
                              : <Building2 size={16} className="text-blue-500" />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm leading-tight">{getCompanyName(b)}</p>
                            <p className="text-xs text-gray-400">{b.company?.industry || 'Company'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Creator */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-fuchsia-100 flex items-center justify-center overflow-hidden shrink-0">
                            {getCreatorPhoto(b)
                              ? <img src={getCreatorPhoto(b)} alt="" className="w-full h-full object-cover" />
                              : <UserCircle size={16} className="text-fuchsia-500" />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm leading-tight">{getCreatorName(b)}</p>
                            <p className="text-xs text-gray-400">{b.creator?.professionalDetails?.primaryCategory || 'Creator'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Project */}
                      <td className="py-4 px-5">
                        <p className="font-semibold text-gray-800 max-w-[140px] truncate">{b.projectTitle}</p>
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <Tag size={10} /> {b.projectType}
                        </span>
                      </td>

                      {/* Event Date */}
                      <td className="py-4 px-5 text-gray-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-gray-400" />
                          {formatDate(b.eventDate)}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-5">
                        <p className="font-bold text-gray-800">{formatAmount(b.amount)}</p>
                        <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${PAYMENT_CONFIG[b.paymentStatus]?.color || 'bg-gray-100 text-gray-600'}`}>
                          {b.paymentStatus}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <StatusBadge status={b.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-center" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedBooking(selectedBooking?._id === b._id ? null : b)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(b._id)}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"
                            title="Delete Booking"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          {!loading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
              Showing <span className="font-bold text-gray-700">{filtered.length}</span> booking{filtered.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Front Modal Popup ── */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 p-6 text-white relative shrink-0">
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-5 right-5 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
                title="Close"
              >
                <X size={20} />
              </button>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">Booking Detail</p>
              <h3 className="font-black text-xl leading-tight pr-8">{selectedBooking.projectTitle}</h3>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <StatusBadge status={selectedBooking.status} />
                <span className={`inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full ${PAYMENT_CONFIG[selectedBooking.paymentStatus]?.color || 'bg-white/20 text-white'}`}>
                  {selectedBooking.paymentStatus}
                </span>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Company */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Company (Client)</p>
                <div className="flex items-center gap-3 bg-blue-50 p-3.5 rounded-2xl border border-blue-100">
                  <div className="w-11 h-11 bg-blue-100 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                    {getCompanyLogo(selectedBooking)
                      ? <img src={getCompanyLogo(selectedBooking)} alt="" className="w-full h-full object-cover" />
                      : <Building2 size={20} className="text-blue-500" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{getCompanyName(selectedBooking)}</p>
                    <p className="text-xs text-blue-600 font-medium">{selectedBooking.company?.industry || 'Production House'}</p>
                    {selectedBooking.company?.email && (
                      <p className="text-xs text-gray-400">{selectedBooking.company.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Creator */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Creator (Talent)</p>
                <div className="flex items-center gap-3 bg-fuchsia-50 p-3.5 rounded-2xl border border-fuchsia-100">
                  <div className="w-11 h-11 bg-fuchsia-100 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                    {getCreatorPhoto(selectedBooking)
                      ? <img src={getCreatorPhoto(selectedBooking)} alt="" className="w-full h-full object-cover" />
                      : <UserCircle size={20} className="text-fuchsia-500" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{getCreatorName(selectedBooking)}</p>
                    <p className="text-xs text-fuchsia-600 font-medium">{selectedBooking.creator?.professionalDetails?.primaryCategory || 'Talent'}</p>
                    {selectedBooking.creator?.phone && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Phone size={11} /> {selectedBooking.creator.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Project Info</p>
                <div className="space-y-2.5 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <InfoRow icon={Tag}      label="Type"       value={selectedBooking.projectType} />
                  <InfoRow icon={Calendar} label="Event Date" value={formatDate(selectedBooking.eventDate)} />
                  {selectedBooking.eventEndDate && (
                    <InfoRow icon={Calendar} label="End Date" value={formatDate(selectedBooking.eventEndDate)} />
                  )}
                  <InfoRow icon={MapPin}   label="Location"   value={selectedBooking.location || '—'} />
                  <InfoRow icon={Clock}    label="Duration"   value={selectedBooking.duration || '—'} />
                </div>
              </div>

              {/* Description */}
              {selectedBooking.description && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Description</p>
                  <p className="text-xs text-gray-600 bg-gray-50 rounded-2xl p-3.5 border border-gray-100 leading-relaxed">{selectedBooking.description}</p>
                </div>
              )}

              {/* Financials */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Financials</p>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2.5">
                  <InfoRow icon={IndianRupee} label="Amount"  value={formatAmount(selectedBooking.amount)} />
                  <InfoRow icon={TrendingUp}  label="Payment" value={selectedBooking.paymentStatus} />
                </div>
              </div>

              {/* Admin Status Controls */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Update Booking Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selectedBooking._id, s)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedBooking.status === s
                          ? STATUS_CONFIG[s].color + ' shadow-sm'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Payment Controls */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Update Payment Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Unpaid', 'Partially Paid', 'Paid', 'Refunded'].map(p => (
                    <button
                      key={p}
                      onClick={() => handlePaymentChange(selectedBooking._id, p)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedBooking.paymentStatus === p
                          ? PAYMENT_CONFIG[p].color + ' shadow-sm border-transparent'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Admin Notes</p>
                  <p className="text-xs text-gray-600 bg-amber-50 border border-amber-100 rounded-2xl p-3.5 leading-relaxed">{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0">
              <p className="text-[11px] text-gray-400">
                Created: {formatDate(selectedBooking.createdAt)}
              </p>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-sm transition cursor-pointer"
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

export default AdminBookings;
