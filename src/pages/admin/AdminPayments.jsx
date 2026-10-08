import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CreditCard, Search, IndianRupee, Users, RefreshCcw, CheckCircle2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [fee, setFee] = useState(499);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchPayments = async (q = search, p = page) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/payments/admin/all`, {
        params: { search: q, page: p, limit },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) {
        setPayments(res.data.payments);
        setTotal(res.data.total);
        setTotalRevenue(res.data.totalRevenue);
        setFee(res.data.fee);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPayments(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPayments(search, 1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Payments</h1>
          <p className="text-sm text-slate-500 mt-1">Creator onboarding fee collections</p>
        </div>
        <button
          onClick={() => fetchPayments()}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all"
        >
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mb-4">
            <Users size={22} className="text-violet-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{total}</p>
          <p className="text-sm font-bold text-slate-600 mt-1">Total Paid Creators</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
            <IndianRupee size={22} className="text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-sm font-bold text-slate-600 mt-1">Total Revenue Collected</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
            <CreditCard size={22} className="text-blue-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">₹{fee}</p>
          <p className="text-sm font-bold text-slate-600 mt-1">Onboarding Fee Per Creator</p>
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
            placeholder="Search by name or phone..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-400"
          />
        </div>
        <button type="submit" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors">
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
                  <th className="text-left px-6 py-4 font-bold text-slate-600">Creator</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-600">Phone</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-600">Amount</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-600">Payment ID</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-600">Date</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payments.map((p, i) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-medium">{(page - 1) * limit + i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.basicDetails?.profilePhoto ? (
                          <img src={p.basicDetails.profilePhoto} className="w-8 h-8 rounded-full object-cover" alt="" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs">
                            {p.basicDetails?.fullName?.[0] || '?'}
                          </div>
                        )}
                        <span className="font-semibold text-slate-800">{p.basicDetails?.fullName || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.phone}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">₹{fee}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{p.onboardingPaymentId || '—'}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {p.onboardingPaidAt ? new Date(p.onboardingPaidAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                        <CheckCircle2 size={12} /> Paid
                      </span>
                    </td>
                  </tr>
                ))}
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
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold disabled:opacity-40 hover:bg-slate-50">Prev</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold disabled:opacity-40 hover:bg-slate-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
