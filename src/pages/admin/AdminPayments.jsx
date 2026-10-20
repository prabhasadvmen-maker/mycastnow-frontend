import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CreditCard, Search, IndianRupee, Users, RefreshCcw, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import { getMediaUrl } from '../../utils/mediaUtils';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

export default function AdminPayments() {
  const [tab, setTab] = useState('creator'); // 'creator' or 'company'
  
  // Creator Payments State
  const [creatorPayments, setCreatorPayments] = useState([]);
  const [creatorTotal, setCreatorTotal] = useState(0);
  const [creatorPaidCount, setCreatorPaidCount] = useState(0);
  const [creatorFreeCount, setCreatorFreeCount] = useState(0);
  const [creatorTotalRevenue, setCreatorTotalRevenue] = useState(0);
  const [creatorFee, setCreatorFee] = useState(99);
  
  // Company Payments State
  const [companyPayments, setCompanyPayments] = useState([]);
  const [companyTotal, setCompanyTotal] = useState(0);
  const [companyPaidCount, setCompanyPaidCount] = useState(0);
  const [companyTotalRevenue, setCompanyTotalRevenue] = useState(0);
  const [companyFee, setCompanyFee] = useState(199);
  
  // Common State
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const token = localStorage.getItem('token');

  // Fetch Creator Payments
  const fetchCreatorPayments = async (q = search, p = page) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/payments/admin/all`, {
        params: { search: q, page: p, limit },
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setCreatorPayments(res.data.payments || []);
        setCreatorTotal(res.data.total || 0);
        setCreatorTotalRevenue(res.data.totalRevenue ?? 0);
        setCreatorPaidCount(typeof res.data.paidCount === 'number' ? res.data.paidCount : 0);
        setCreatorFreeCount(typeof res.data.freeCount === 'number' ? res.data.freeCount : 0);
        setCreatorFee(res.data.fee ?? 99);
      }
    } catch (err) {
      console.error('Creator payments error:', err);
    }
    setLoading(false);
  };

  // Fetch Company Payments
  const fetchCompanyPayments = async (q = search, p = page) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/payments/admin/companies`, {
        params: { search: q, page: p, limit },
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setCompanyPayments(res.data.payments || []);
        setCompanyTotal(res.data.total || 0);
        setCompanyTotalRevenue(res.data.totalRevenue ?? 0);
        setCompanyPaidCount(typeof res.data.paidCount === 'number' ? res.data.paidCount : 0);
        setCompanyFee(res.data.fee ?? 199);
      }
    } catch (err) {
      console.error('Company payments error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (tab === 'creator') {
      fetchCreatorPayments();
    } else {
      fetchCompanyPayments();
    }
  }, [page, tab]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    if (tab === 'creator') {
      fetchCreatorPayments(search, 1);
    } else {
      fetchCompanyPayments(search, 1);
    }
  };

  const handleRefresh = () => {
    if (tab === 'creator') {
      fetchCreatorPayments();
    } else {
      fetchCompanyPayments();
    }
  };

  // Get current tab data
  const isCreatorTab = tab === 'creator';
  const payments = isCreatorTab ? creatorPayments : companyPayments;
  const total = isCreatorTab ? creatorTotal : companyTotal;
  const paidCount = isCreatorTab ? creatorPaidCount : companyPaidCount;
  const totalRevenue = isCreatorTab ? creatorTotalRevenue : companyTotalRevenue;
  const fee = isCreatorTab ? creatorFee : companyFee;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Payments & Transactions</h1>
          <p className="text-sm text-slate-500 mt-1">
            {isCreatorTab ? 'Creator onboarding fee collections' : 'Company registration fee collections'} · Active Fee: <span className="font-bold text-violet-600">₹{fee}</span>
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => { setTab('creator'); setPage(1); }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            tab === 'creator'
              ? 'border-violet-600 text-violet-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users size={18} />
          Creator Onboarding
        </button>
        <button
          onClick={() => { setTab('company'); setPage(1); }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            tab === 'company'
              ? 'border-violet-600 text-violet-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 size={18} />
          Company Registration
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mb-4">
            <Users size={22} className="text-violet-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{total}</p>
          <p className="text-sm font-bold text-slate-600 mt-1">{isCreatorTab ? 'Total Onboarded' : 'Total Registered'}</p>
          <p className="text-xs text-slate-400 mt-1">{isCreatorTab ? 'All creators in ledger' : 'All companies in ledger'}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle2 size={22} className="text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{paidCount}</p>
          <p className="text-sm font-bold text-slate-600 mt-1">Paid {isCreatorTab ? 'Creators' : 'Companies'}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">₹{fee} per {isCreatorTab ? 'onboarding' : 'registration'}</p>
        </div>

        {isCreatorTab && (
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <Sparkles size={22} className="text-blue-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{creatorFreeCount}</p>
            <p className="text-sm font-bold text-slate-600 mt-1">Free Onboarded</p>
            <p className="text-xs text-blue-600 font-semibold mt-1">₹0 Activation</p>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
            <IndianRupee size={22} className="text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-sm font-bold text-slate-600 mt-1">Total Revenue Collected</p>
          <p className="text-xs text-slate-400 mt-1">Verified actual collections</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isCreatorTab ? "Search by name, phone or payment ID..." : "Search by company name, email or payment ID..."}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-400"
          />
        </div>
        <button type="submit" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors cursor-pointer">
          Search
        </button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <CreditCard size={40} className="mb-3 opacity-30" />
            <p className="font-medium">No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 font-bold text-slate-600">#</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-600">{isCreatorTab ? 'Creator' : 'Company'}</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-600">{isCreatorTab ? 'Phone' : 'Email'}</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-600">Amount</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-600">Payment ID</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-600">Date</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payments.map((p, i) => {
                  if (isCreatorTab) {
                    const photo = getMediaUrl(p.profilePhoto);
                    const name = p.creatorName || 'N/A';
                    const phone = p.phone || '—';
                    const paymentId = p.paymentId || '—';
                    const paidDate = p.paidAt;
                    const isFree = p.amount === 0 || paymentId.startsWith('free_');
                    const amount = isFree ? 0 : (typeof p.amount === 'number' ? p.amount : (fee || 0));

                    return (
                      <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-400 font-medium">{(page - 1) * limit + i + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {photo ? (
                              <img src={photo} className="w-8 h-8 rounded-full object-cover" alt="" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs">
                                {name?.[0] || '?'}
                              </div>
                            )}
                            <span className="font-semibold text-slate-800">{name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{phone}</td>
                        <td className="px-6 py-4 font-bold">
                          {isFree ? (
                            <span className="text-slate-500 font-semibold">₹0</span>
                          ) : (
                            <span className="text-emerald-600 font-bold">₹{amount}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{paymentId}</td>
                        <td className="px-6 py-4 text-slate-500">
                          {paidDate ? new Date(paidDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td className="px-6 py-4">
                          {isFree ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full text-xs font-bold">
                              <CheckCircle2 size={12} /> Free Onboarding
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-xs font-bold">
                              <CheckCircle2 size={12} /> Paid
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  } else {
                    // Company tab
                    const name = p.companyName || 'N/A';
                    const email = p.email || '—';
                    const paymentId = p.paymentId || '—';
                    const paidDate = p.paidAt;
                    const isFree = p.amount === 0 || paymentId.startsWith('free_');
                    const amount = isFree ? 0 : (typeof p.amount === 'number' ? p.amount : (fee || 0));

                    return (
                      <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-400 font-medium">{(page - 1) * limit + i + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                              {name?.[0] || '?'}
                            </div>
                            <span className="font-semibold text-slate-800">{name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-sm">{email}</td>
                        <td className="px-6 py-4 font-bold">
                          {isFree ? (
                            <span className="text-slate-500 font-semibold">₹0</span>
                          ) : (
                            <span className="text-emerald-600 font-bold">₹{amount}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{paymentId}</td>
                        <td className="px-6 py-4 text-slate-500">
                          {paidDate ? new Date(paidDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td className="px-6 py-4">
                          {isFree ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full text-xs font-bold">
                              <CheckCircle2 size={12} /> Free Registration
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-xs font-bold">
                              <CheckCircle2 size={12} /> Paid
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold disabled:opacity-40 hover:bg-slate-50 cursor-pointer">Prev</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold disabled:opacity-40 hover:bg-slate-50 cursor-pointer">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
