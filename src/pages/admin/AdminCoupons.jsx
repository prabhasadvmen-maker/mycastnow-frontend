import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Tag, Plus, Edit2, Trash2, Copy, Check, X, Calendar,
  ToggleRight, ToggleLeft, Percent, Users, TrendingUp,
  AlertCircle, CheckCircle, XCircle, Eye, MoreVertical, Lock, Unlock
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [viewCoupon, setViewCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    maxUses: '',
    applicableTo: 'Both',
    minAmount: '',
    expiryDate: '',
    isActive: true
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/coupons`, { headers: getAuthHeaders() });
      setCoupons(res.data);
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreate = () => {
    setEditCoupon(null);
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      maxUses: '',
      applicableTo: 'Both',
      minAmount: '',
      expiryDate: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxUses: coupon.maxUses,
      applicableTo: coupon.applicableTo,
      minAmount: coupon.minAmount,
      expiryDate: coupon.expiryDate.split('T')[0],
      isActive: coupon.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue),
        maxUses: Number(formData.maxUses),
        minAmount: Number(formData.minAmount) || 0
      };

      if (editCoupon) {
        await axios.put(`${API}/admin/coupons/${editCoupon._id}`, payload, { headers: getAuthHeaders() });
        toast.success('Coupon updated successfully');
      } else {
        await axios.post(`${API}/admin/coupons`, payload, { headers: getAuthHeaders() });
        toast.success('Coupon created successfully');
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save coupon');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (window.confirm(`Delete coupon "${code}"?`)) {
      try {
        await axios.delete(`${API}/admin/coupons/${id}`, { headers: getAuthHeaders() });
        setCoupons(prev => prev.filter(c => c._id !== id));
        toast.success('Coupon deleted successfully');
      } catch (err) {
        toast.error('Failed to delete coupon');
      }
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await axios.put(`${API}/admin/coupons/${id}/toggle`, {}, { headers: getAuthHeaders() });
      setCoupons(prev => prev.map(c => c._id === id ? res.data : c));
      toast.success('Coupon status updated');
    } catch (err) {
      toast.error('Failed to update coupon');
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isExpired = (date) => new Date(date) < new Date();
  const getUsagePercent = (used, max) => max > 0 ? Math.round((used / max) * 100) : 0;

  const filteredCoupons = coupons.filter(c => {
    if (activeTab === 'active') return c.isActive && !isExpired(c.expiryDate);
    if (activeTab === 'expired') return isExpired(c.expiryDate) || !c.isActive;
    return true;
  });

  const stats = {
    total: coupons.length,
    active: coupons.filter(c => c.isActive && !isExpired(c.expiryDate)).length,
    expired: coupons.filter(c => isExpired(c.expiryDate) || !c.isActive).length,
    totalUsed: coupons.reduce((sum, c) => sum + c.usedCount, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Tag className="text-purple-600" size={26} />
            Coupon Codes
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage discount coupons and promotional codes</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:opacity-90 transition"
        >
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Coupons', value: stats.total, icon: Tag, color: 'bg-blue-50 text-blue-600' },
          { label: 'Active', value: stats.active, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
          { label: 'Expired/Inactive', value: stats.expired, icon: XCircle, color: 'bg-red-50 text-red-600' },
          { label: 'Total Used', value: stats.totalUsed, icon: TrendingUp, color: 'bg-purple-50 text-purple-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { key: 'active', label: 'Active', count: stats.active },
          { key: 'expired', label: 'Expired/Inactive', count: stats.expired },
          { key: 'all', label: 'All Coupons', count: stats.total }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              activeTab === tab.key
                ? 'bg-purple-100 text-purple-600'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      {filteredCoupons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag size={28} className="text-purple-300" />
          </div>
          <p className="text-gray-600 font-bold text-lg">No Coupons Found</p>
          <p className="text-gray-400 text-sm mt-1 mb-5">
            {activeTab === 'active' && 'No active coupons. Create one to get started!'}
            {activeTab === 'expired' && 'No expired or inactive coupons.'}
            {activeTab === 'all' && 'Create your first coupon to get started.'}
          </p>
          <button
            onClick={openCreate}
            className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition inline-flex items-center gap-2"
          >
            <Plus size={16} /> Create Coupon
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-gray-500 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">
                  <th className="py-3.5 px-3">Code</th>
                  <th className="py-3.5 px-3">Description</th>
                  <th className="py-3.5 px-3">Discount</th>
                  <th className="py-3.5 px-3">Applicable To</th>
                  <th className="py-3.5 px-3">Usage</th>
                  <th className="py-3.5 px-3">Expires</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCoupons.map((coupon) => {
                  const expired = isExpired(coupon.expiryDate);
                  const usagePercent = getUsagePercent(coupon.usedCount, coupon.maxUses);
                  const isAlmostExpired = !expired && (new Date(coupon.expiryDate) - new Date()) / (1000 * 60 * 60 * 24) < 7;

                  return (
                    <tr key={coupon._id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Code */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <code className="font-black text-xs text-gray-800 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 whitespace-nowrap">
                            {coupon.code}
                          </code>
                          <button
                            onClick={() => copyToClipboard(coupon.code)}
                            className="p-1 hover:bg-gray-100 rounded transition text-gray-400 hover:text-gray-600"
                            title="Copy code"
                          >
                            {copiedCode === coupon.code ? (
                              <Check size={14} className="text-green-500" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-3">
                        <p className="text-gray-600 truncate max-w-[150px]" title={coupon.description}>{coupon.description || '—'}</p>
                      </td>

                      {/* Discount */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <Percent size={14} className="text-purple-600" />
                          <span className="font-bold text-gray-800">
                            {coupon.discountType === 'percentage'
                              ? `${coupon.discountValue}%`
                              : `₹${coupon.discountValue}`}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5 whitespace-nowrap">
                          {coupon.minAmount > 0 ? `Min ₹${coupon.minAmount.toLocaleString('en-IN')}` : 'No minimum'}
                        </p>
                      </td>

                      {/* Applicable To */}
                      <td className="py-3.5 px-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                          coupon.applicableTo === 'Both'
                            ? 'bg-green-100 text-green-700'
                            : coupon.applicableTo === 'Creator'
                            ? 'bg-fuchsia-100 text-fuchsia-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {coupon.applicableTo}
                        </span>
                      </td>

                      {/* Usage */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <div className="w-14 h-2 shrink-0 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                usagePercent > 80 ? 'bg-red-500' : usagePercent > 50 ? 'bg-amber-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(usagePercent, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-700 whitespace-nowrap">
                            {coupon.usedCount}/{coupon.maxUses}
                          </span>
                        </div>
                      </td>

                      {/* Expires */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <Calendar size={14} className={expired ? 'text-red-400' : isAlmostExpired ? 'text-amber-400' : 'text-gray-400'} />
                          <span className={`font-semibold ${
                            expired ? 'text-red-600' : isAlmostExpired ? 'text-amber-600' : 'text-gray-800'
                          }`}>
                            {new Date(coupon.expiryDate).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          {expired ? (
                            <>
                              <XCircle size={14} className="text-red-500" />
                              <span className="text-xs font-bold text-red-600">Expired</span>
                            </>
                          ) : !coupon.isActive ? (
                            <>
                              <AlertCircle size={14} className="text-gray-500" />
                              <span className="text-xs font-bold text-gray-600">Inactive</span>
                            </>
                          ) : isAlmostExpired ? (
                            <>
                              <AlertCircle size={14} className="text-amber-500" />
                              <span className="text-xs font-bold text-amber-600">Expiring</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle size={14} className="text-green-500" />
                              <span className="text-xs font-bold text-green-600">Active</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Actions Dropdown */}
                      <td className="py-3.5 px-3">
                        <div className="flex justify-center">
                          <button
                            onClick={(e) => {
                              if (openDropdown?.id === coupon._id) return setOpenDropdown(null);
                              const r = e.currentTarget.getBoundingClientRect();
                              const openUp = window.innerHeight - r.bottom < 220;
                              setOpenDropdown({
                                id: coupon._id,
                                right: window.innerWidth - r.right,
                                ...(openUp ? { bottom: window.innerHeight - r.top + 4 } : { top: r.bottom + 4 })
                              });
                            }}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                            title="More actions"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {/* Dropdown Menu */}
                          {openDropdown?.id === coupon._id && (
                            <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                            <div
                              className="fixed w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
                              style={{ top: openDropdown.top, bottom: openDropdown.bottom, right: openDropdown.right }}
                            >
                              <button
                                onClick={() => {
                                  openEdit(coupon);
                                  setOpenDropdown(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition border-b border-gray-100"
                              >
                                <Edit2 size={16} className="text-blue-500" />
                                <span>Edit Coupon</span>
                              </button>

                              <button
                                onClick={() => {
                                  handleToggle(coupon._id);
                                  setOpenDropdown(null);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition border-b border-gray-100 ${
                                  coupon.isActive
                                    ? 'text-orange-700 hover:bg-orange-50'
                                    : 'text-green-700 hover:bg-green-50'
                                }`}
                              >
                                {coupon.isActive ? (
                                  <>
                                    <Lock size={16} className="text-orange-500" />
                                    <span>Disable Coupon</span>
                                  </>
                                ) : (
                                  <>
                                    <Unlock size={16} className="text-green-500" />
                                    <span>Enable Coupon</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => {
                                  setViewCoupon(coupon);
                                  setOpenDropdown(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 transition border-b border-gray-100"
                              >
                                <Eye size={16} className="text-purple-500" />
                                <span>View Details</span>
                              </button>

                              <button
                                onClick={() => {
                                  handleDelete(coupon._id, coupon.code);
                                  setOpenDropdown(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-700 hover:bg-red-50 transition"
                              >
                                <Trash2 size={16} className="text-red-500" />
                                <span>Delete Coupon</span>
                              </button>
                            </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewCoupon && (() => {
        const c = viewCoupon;
        const expired = isExpired(c.expiryDate);
        const pct = getUsagePercent(c.usedCount, c.maxUses);
        const status = expired
          ? ['Expired', 'bg-red-100 text-red-700', XCircle]
          : !c.isActive
          ? ['Inactive', 'bg-gray-100 text-gray-600', AlertCircle]
          : ['Active', 'bg-green-100 text-green-700', CheckCircle];
        const StatusIcon = status[2];
        const discountText = c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`;
        const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const info = [
          { label: 'Applicable To', value: c.applicableTo, icon: Users },
          { label: 'Min Amount', value: c.minAmount > 0 ? `₹${c.minAmount.toLocaleString('en-IN')}` : 'No minimum', icon: Tag },
          { label: 'Expires On', value: fmt(c.expiryDate), icon: Calendar, danger: expired },
          { label: 'Created On', value: c.createdAt ? fmt(c.createdAt) : '—', icon: Calendar }
        ];
        return (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setViewCoupon(null)}>
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[92vh] overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
              {/* Hero */}
              <div className="relative bg-gradient-to-br from-purple-600 to-fuchsia-600 px-6 pt-5 pb-6 text-white shrink-0">
                <button onClick={() => setViewCoupon(null)} className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition">
                  <X size={18} />
                </button>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                  <Eye size={14} /> Coupon Details
                </p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black tracking-wide break-all">{c.code}</h2>
                      <button onClick={() => copyToClipboard(c.code)} className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition shrink-0" title="Copy code">
                        {copiedCode === c.code ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                    <span className={`mt-2 inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${status[1]}`}>
                      <StatusIcon size={12} /> {status[0]}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-4xl font-black leading-none">{discountText}</p>
                    <p className="text-xs text-white/70 mt-1">{c.discountType === 'percentage' ? 'Percentage off' : 'Flat discount'}</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase mb-1">Description</p>
                  <p className="text-sm text-gray-700 break-words">{c.description || '—'}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {info.map(({ label, value, icon: Icon, danger }) => (
                    <div key={label} className="flex items-center gap-3 border border-gray-100 rounded-xl px-3 py-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Icon size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase">{label}</p>
                        <p className={`text-sm font-bold truncate ${danger ? 'text-red-600' : 'text-gray-800'}`}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border border-gray-100 rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase">Usage</p>
                    <p className="text-sm font-bold text-gray-800">
                      {c.usedCount} <span className="text-gray-400 font-semibold">/ {c.maxUses}</span>
                      <span className="text-xs text-gray-400 font-semibold ml-1">({pct}%)</span>
                    </p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-white shrink-0">
                <button onClick={() => setViewCoupon(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition">Close</button>
                <button onClick={() => { const x = c; setViewCoupon(null); openEdit(x); }} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2">
                  <Edit2 size={16} /> Edit Coupon
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  {editCoupon ? <Edit2 className="text-purple-600" size={20} /> : <Plus className="text-purple-600" size={20} />}
                  {editCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editCoupon ? 'Update coupon details' : 'Create a new discount coupon code'}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Code */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Coupon Code *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. WELCOME50"
                  value={formData.code}
                  onChange={e => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of this coupon..."
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Discount Type *</label>
                  <select
                    value={formData.discountType}
                    onChange={e => setFormData(p => ({ ...p, discountType: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'} *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.discountValue}
                    onChange={e => setFormData(p => ({ ...p, discountValue: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Applicable To */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Applicable To *</label>
                <select
                  value={formData.applicableTo}
                  onChange={e => setFormData(p => ({ ...p, applicableTo: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Both">Both (Creators & Companies)</option>
                  <option value="Creator">Creators Only</option>
                  <option value="Company">Companies Only</option>
                </select>
              </div>

              {/* Min Amount & Max Uses */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Min. Purchase Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 = No minimum"
                    value={formData.minAmount}
                    onChange={e => setFormData(p => ({ ...p, minAmount: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Max Uses *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="e.g. 100"
                    value={formData.maxUses}
                    onChange={e => setFormData(p => ({ ...p, maxUses: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Expiry Date *</label>
                <input
                  required
                  type="date"
                  value={formData.expiryDate}
                  onChange={e => setFormData(p => ({ ...p, expiryDate: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div className={`relative w-12 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-purple-600' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${formData.isActive ? 'left-6' : 'left-0.5'}`} />
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={e => setFormData(p => ({ ...p, isActive: e.target.checked }))}
                  className="hidden"
                />
                <span className="text-sm font-semibold text-gray-700">
                  {formData.isActive ? 'Coupon is Active' : 'Coupon is Inactive'}
                </span>
              </label>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-60"
                >
                  {formLoading ? 'Saving...' : editCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
