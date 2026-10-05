import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import {
  Wallet, ArrowUpRight, ArrowDownLeft, ShieldCheck,
  Clock, DollarSign, Building2, AlertCircle, CheckCircle2,
  RefreshCw, X, Sparkles, Filter, Search
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const CreatorWallet = () => {
  const { creatorUser } = useCreatorAuth();
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  // Withdraw form state
  const [withdrawForm, setWithdrawForm] = useState({
    amount: 10000,
    method: 'Bank Transfer',
    bankName: 'HDFC Bank',
    accountNumber: '50100492019482',
    ifsc: 'HDFC0001234',
    upiId: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API}/creator/portal/wallet`, { headers });
      if (res.data?.success) {
        setWalletData(res.data);
      }
    } catch (err) {
      console.error('Error fetching creator wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    if (!withdrawForm.amount || withdrawForm.amount < 1000) {
      showToast('Minimum withdrawal amount is ₹1,000', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(`${API}/creator/portal/wallet/withdraw`, withdrawForm, { headers });
      if (res.data?.success) {
        setShowWithdrawModal(false);
        showToast(res.data.message || 'Withdrawal submitted successfully!');
        fetchWallet();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit withdrawal', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const transactions = walletData?.transactions || [];

  const filteredTx = transactions.filter(t => {
    const matchesFilter = filterType === 'All' || t.type === filterType;
    const matchesSearch = !search.trim() ||
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.payoutDetails?.utrNumber?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#180a22] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-purple-800/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-fuchsia-200">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Escrow Protected Talent Wallet</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Wallet & Payouts
            </h1>
            <p className="text-purple-200 text-xs md:text-sm max-w-xl">
              All commercial project earnings are deposited directly into your verified bank account with 100% escrow protection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowUpRight size={16} />
              <span>Withdraw to Bank</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Available Balance</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900">
            ₹{Number(walletData?.balance || 0).toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 size={12} /> Ready for instant payout
          </p>
        </div>

        {/* Escrow Locked */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Escrow Locked</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900">
            ₹{Number(walletData?.escrowBalance || 0).toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-gray-500">
            Held in escrow for active shoot
          </p>
        </div>

        {/* Lifetime Withdrawn */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Payouts</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900">
            ₹{Number(walletData?.totalWithdrawn || 0).toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-gray-500">
            Disbursed to bank account
          </p>
        </div>

        {/* Total Earned */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Earnings</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900">
            ₹{Number(walletData?.totalEarned || 0).toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-gray-500">
            Across 2 confirmed projects
          </p>
        </div>
      </div>

      {/* TRANSACTIONS LEDGER */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-black text-gray-900">Transaction History</h3>
            <p className="text-xs text-gray-400">Complete audit ledger of shoot payments and bank withdrawals</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
              {['All', 'Credit', 'Withdrawal'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    filterType === type ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search ledger..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs w-44"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400 text-xs flex flex-col items-center justify-center">
            <RefreshCw size={22} className="animate-spin text-purple-600 mb-2" />
            <span>Loading ledger records...</span>
          </div>
        ) : filteredTx.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-xs">
            No transactions found.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredTx.map((tx) => {
              const isCredit = tx.type === 'Credit';
              return (
                <div key={tx._id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        isCredit
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-purple-50 text-purple-600'
                      }`}
                    >
                      {isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>

                    <div>
                      <h4 className="font-bold text-xs md:text-sm text-gray-900">{tx.description}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                        <span>{new Date(tx.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span>•</span>
                        <span>{tx.referenceType}</span>
                        {tx.payoutDetails?.utrNumber && (
                          <>
                            <span>•</span>
                            <span className="font-mono">UTR: {tx.payoutDetails.utrNumber}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`font-black text-sm md:text-base ${
                        isCredit ? 'text-emerald-600' : 'text-gray-900'
                      }`}
                    >
                      {isCredit ? '+' : '-'}₹{Number(tx.amount || 0).toLocaleString('en-IN')}
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-bold uppercase mt-0.5">
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* WITHDRAW MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleWithdrawSubmit}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-base text-gray-900">Withdraw to Bank / UPI</h3>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Withdrawal Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 font-bold text-gray-400">₹</span>
                <input
                  type="number"
                  min="1000"
                  max={walletData?.balance || 0}
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: Number(e.target.value) })}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-black focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Available withdrawable: ₹{(walletData?.balance || 0).toLocaleString('en-IN')}
              </p>
            </div>

            {/* Quick Amount presets */}
            <div className="flex gap-2">
              {[5000, 10000, 20000, walletData?.balance || 0].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setWithdrawForm({ ...withdrawForm, amount: amt })}
                  className="flex-1 py-1 rounded-lg border border-gray-200 text-xs font-semibold hover:border-purple-600 hover:text-purple-600"
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-800">Bank Account Details</h4>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={withdrawForm.bankName}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, bankName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Account Number</label>
                <input
                  type="text"
                  value={withdrawForm.accountNumber}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, accountNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={withdrawForm.ifsc}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, ifsc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs uppercase"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md disabled:opacity-50"
              >
                {submitting ? 'Processing...' : 'Confirm Withdrawal'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreatorWallet;
