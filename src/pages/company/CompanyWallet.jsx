import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Wallet, ArrowDownLeft, ArrowUpRight, Plus, RefreshCw, Search,
  ShieldCheck, CheckCircle2, Clock, DollarSign, Download, Filter,
  Building, CreditCard, QrCode, FileText, Check, X, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

const QUICK_AMOUNTS = [25000, 50000, 100000, 250000];

const CompanyWallet = () => {
  const [wallet, setWallet] = useState({
    balance: 0,
    escrowBalance: 0,
    totalDeposited: 0,
    totalSpent: 0,
    totalTransactions: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // 'All' | 'Credit' | 'Debit' | 'Withdrawal'
  const [search, setSearch] = useState('');

  // Modals
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(50000);
  const [paymentMethod, setPaymentMethod] = useState('Corporate NetBanking (HDFC/ICICI)');
  const [refNumber, setRefNumber] = useState('');
  const [submittingDeposit, setSubmittingDeposit] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifsc: ''
  });
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Fetch Wallet Data
  const fetchWallet = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API}/company/wallet`, { headers });
      if (res.data?.success) {
        if (res.data.wallet) setWallet(res.data.wallet);
        setTransactions(res.data.transactions || []);
      }
    } catch (err) {
      console.error('Fetch wallet error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  // Handle Deposit
  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!depositAmount || Number(depositAmount) <= 0) return;

    setSubmittingDeposit(true);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(`${API}/company/wallet/deposit`, {
        amount: Number(depositAmount),
        paymentMethod,
        referenceNumber: refNumber || `DEP-${Date.now().toString().slice(-6)}`
      }, { headers });

      if (res.data?.success) {
        setDepositSuccess(true);
        setTimeout(() => {
          setDepositSuccess(false);
          setDepositModalOpen(false);
          setRefNumber('');
          fetchWallet();
        }, 1200);
      }
    } catch (err) {
      console.error('Deposit error:', err);
      alert(err.response?.data?.message || 'Failed to deposit funds');
    } finally {
      setSubmittingDeposit(false);
    }
  };

  // Handle Withdraw
  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return;

    setSubmittingWithdraw(true);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(`${API}/company/wallet/withdraw`, {
        amount: Number(withdrawAmount),
        ...bankDetails
      }, { headers });

      if (res.data?.success) {
        setWithdrawSuccess(true);
        setTimeout(() => {
          setWithdrawSuccess(false);
          setWithdrawModalOpen(false);
          setWithdrawAmount('');
          fetchWallet();
        }, 1200);
      }
    } catch (err) {
      console.error('Withdraw error:', err);
      alert(err.response?.data?.message || 'Failed to process withdrawal');
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filter === 'All' || t.type === filter;
    const q = search.toLowerCase();
    const desc = (t.description || '').toLowerCase();
    const ref = (t.referenceId || '').toLowerCase();
    return matchesFilter && (!q || desc.includes(q) || ref.includes(q));
  });

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0b1120] via-[#121c33] to-[#1e1b4b] rounded-3xl p-6 text-white shadow-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-400" />
              100% Escrow Protected Payments
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Instant Talent Settlements
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Company Wallet & Escrow Payments
          </h1>
          <p className="text-xs text-gray-300 max-w-2xl">
            Manage your casting budgets, milestone escrows for confirmed talent shoots, and corporate bank fund transfers.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setWithdrawModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition active:scale-95"
          >
            <ArrowUpRight size={14} />
            <span>Withdraw</span>
          </button>

          <button
            onClick={() => setDepositModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs shadow-xl shadow-teal-600/30 transition active:scale-95"
          >
            <Plus size={15} />
            <span>Add Funds</span>
          </button>
        </div>
      </div>

      {/* ── 4 KPI Financial Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Available Balance</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-none">
              {fmt(wallet.balance)}
            </h3>
            <span className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
              <CheckCircle2 size={12} /> Ready for Talent Bookings
            </span>
          </div>
        </div>

        {/* Locked Escrow */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Locked in Escrow</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-blue-600 leading-none">
              {fmt(wallet.escrowBalance)}
            </h3>
            <span className="text-[11px] text-gray-400 font-semibold mt-1.5 block">
              Held for Confirmed Shoot Milestones
            </span>
          </div>
        </div>

        {/* Total Deposited */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Deposited</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ArrowDownLeft size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-none">
              {fmt(wallet.totalDeposited)}
            </h3>
            <span className="text-[11px] text-gray-400 font-semibold mt-1.5 block">
              Lifetime Corporate Fundings
            </span>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Disbursed</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-none">
              {fmt(wallet.totalSpent)}
            </h3>
            <span className="text-[11px] text-gray-400 font-semibold mt-1.5 block">
              Paid to Creators & Subscriptions
            </span>
          </div>
        </div>
      </div>

      {/* ── Transaction History Table & Filters ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-gray-900">Transaction History</h3>
            <p className="text-xs text-gray-400">All deposits, talent milestone releases, and withdrawals</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Tabs */}
            <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 text-xs">
              {['All', 'Credit', 'Debit', 'Withdrawal'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    filter === tab
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab === 'Credit' ? 'Deposits' : tab === 'Debit' ? 'Payments' : tab}
                </button>
              ))}
            </div>

            <button
              onClick={fetchWallet}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700"
              title="Refresh"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by transaction reference ID or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400">
            <div className="w-7 h-7 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p>Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-14 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto">
              <FileText size={20} />
            </div>
            <p className="text-xs font-bold text-gray-700">No transactions recorded yet</p>
            <p className="text-[11px] text-gray-400">Top up your wallet to make instant direct talent bookings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] uppercase font-bold text-gray-400">
                  <th className="pb-3 font-bold">Transaction / Description</th>
                  <th className="pb-3 font-bold">Type</th>
                  <th className="pb-3 font-bold">Date & Time</th>
                  <th className="pb-3 font-bold">Reference ID</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTransactions.map(t => {
                  const isCredit = t.type === 'Credit';
                  const isWithdrawal = t.type === 'Withdrawal';

                  return (
                    <tr key={t.id || t._id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isCredit
                              ? 'bg-emerald-50 text-emerald-600'
                              : isWithdrawal
                              ? 'bg-purple-50 text-purple-600'
                              : 'bg-red-50 text-red-600'
                          }`}>
                            {isCredit ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block leading-tight">{t.description}</span>
                            <span className="text-[10px] text-gray-400">Balance After: {fmt(t.balanceAfter)}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 pr-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isCredit
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isWithdrawal
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {t.type}
                        </span>
                      </td>

                      <td className="py-3.5 pr-4 text-gray-500 text-[11px]">
                        {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        <span className="text-gray-400 text-[10px] block">
                          {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="py-3.5 pr-4 text-gray-600 font-mono text-[11px]">
                        {t.referenceId || 'N/A'}
                      </td>

                      <td className="py-3.5 pr-4">
                        <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                          <CheckCircle2 size={12} />
                          {t.status || 'Completed'}
                        </span>
                      </td>

                      <td className="py-3.5 text-right font-black text-sm">
                        <span className={isCredit ? 'text-emerald-600' : 'text-gray-900'}>
                          {isCredit ? '+' : '-'}{fmt(t.amount)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL 1: ADD FUNDS / RECHARGE WALLET ── */}
      {depositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Wallet size={16} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Add Funds to Wallet</h3>
                  <p className="text-[11px] text-gray-400">Instant credit for project bookings and contracts</p>
                </div>
              </div>
              <button
                onClick={() => setDepositModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {depositSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <h4 className="text-base font-bold text-gray-900">Funds Added Successfully!</h4>
                <p className="text-xs text-gray-500">Your wallet balance has been updated in real-time.</p>
              </div>
            ) : (
              <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs">
                {/* Amount input */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Deposit Amount (₹) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 font-bold text-gray-400 text-sm">₹</span>
                    <input
                      type="number"
                      required
                      min={1000}
                      step={1000}
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Quick Amount Chips */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {QUICK_AMOUNTS.map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmount(amt)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border transition ${
                          Number(depositAmount) === amt
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        +{fmt(amt)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Corporate NetBanking (HDFC/ICICI)">Corporate NetBanking (HDFC / ICICI / SBI)</option>
                    <option value="Instant UPI Transfer">Instant Corporate UPI</option>
                    <option value="Corporate Credit Card">Corporate Credit / Debit Card</option>
                    <option value="RTGS / NEFT Direct Bank Transfer">RTGS / NEFT Direct Bank Transfer</option>
                  </select>
                </div>

                {/* Optional UTR / Reference */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Payment UTR / Reference Number</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC99281726 (Optional)"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDepositModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingDeposit}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
                  >
                    <Plus size={13} />
                    <span>{submittingDeposit ? 'Processing...' : 'Deposit Funds'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL 2: WITHDRAW FUNDS ── */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Building size={16} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Withdraw Unallocated Funds</h3>
                  <p className="text-[11px] text-gray-400">Transfer available wallet balance to company bank account</p>
                </div>
              </div>
              <button
                onClick={() => setWithdrawModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <h4 className="text-base font-bold text-gray-900">Withdrawal Initiated!</h4>
                <p className="text-xs text-gray-500">Funds will be credited to your registered bank account within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Withdrawal Amount (Max: {fmt(wallet.balance)}) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 font-bold text-gray-400 text-sm">₹</span>
                    <input
                      type="number"
                      required
                      min={1000}
                      max={wallet.balance}
                      placeholder="Enter amount to withdraw"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Registered Bank Account</span>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-gray-900">{bankDetails.accountHolder}</p>
                    <p className="text-gray-500">{bankDetails.bankName} • A/C: {bankDetails.accountNumber}</p>
                    <p className="text-gray-400 font-mono text-[10px]">IFSC: {bankDetails.ifsc}</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingWithdraw || !withdrawAmount || Number(withdrawAmount) > wallet.balance}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20 transition flex items-center gap-1.5"
                  >
                    <ArrowUpRight size={13} />
                    <span>{submittingWithdraw ? 'Processing...' : 'Withdraw to Bank'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default CompanyWallet;
