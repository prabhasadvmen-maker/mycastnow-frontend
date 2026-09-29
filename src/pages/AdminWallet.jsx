import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, ArrowDownLeft, ArrowUpRight, CheckCircle, Clock,
  XCircle, Building2, UserCircle, Eye, Zap, Sparkles,
  Maximize2, Minimize2, Radio, Rocket, Download,
  CheckCircle2, CreditCard, ChevronRight, AlertCircle,
  ShieldCheck, Send, RefreshCw, X, Edit3, Landmark
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

// ─── Holographic Terminal Showcase Component ──────────────────────
const HolographicTerminalShowcase = ({ onSelectModule }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nodes = [
    { id: 'profiles', label: 'Creator Profiles', path: '/admin/profiles' },
    { id: 'casting', label: 'Casting', path: '/admin/casting' },
    { id: 'bookings', label: 'Bookings', path: '/admin/bookings' },
    { id: 'payments', label: 'Payments', path: '/admin/payments' },
    { id: 'subscriptions', label: 'Subscriptions', path: '/admin/subscriptions' },
    { id: 'wallet', label: 'Wallet [Active Node]', path: '/admin/wallet', isCurrent: true },
    { id: 'boost', label: 'Boost (Ion Active)', path: '/admin/boost', hasIon: true },
    { id: 'reviews', label: 'Reviews', path: '/admin/reviews' },
    { id: 'analytics', label: 'Analytics', path: '/admin/analytics' },
    { id: 'cms', label: 'CMS', path: '/admin/cms' },
    { id: 'settings', label: 'Settings', path: '/admin/settings' },
    { id: 'help', label: 'Help', path: '/admin/help' }
  ];

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-cyan-500/30 shadow-2xl transition-all duration-500 ${
      isFullscreen ? 'fixed inset-4 z-50 bg-[#030712]/95 backdrop-blur-2xl flex flex-col' : 'bg-[#030712] text-white p-5'
    }`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-[#030712] to-black -z-10 pointer-events-none" />

      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-white/10 relative z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-pulse">
            <Radio size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                Antigravity Holographic Terminal
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                QUANTUM GRAVITY LINK ONLINE
              </span>
            </div>
            <h2 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 tracking-wide">
              Materialized Constellation Navigation & Superadmin Payout Core
            </h2>
          </div>
        </div>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-all shadow"
        >
          {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          {isFullscreen ? 'Exit Fullscreen' : 'Expand Cinematic View'}
        </button>
      </div>

      {/* Main Terminal Display Area */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 bg-black/60 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] flex-1 min-h-[340px] max-h-[500px] flex items-center justify-center group">
        <img
          src="/holographic_terminal.jpg"
          alt="Futuristic Antigravity Holographic Terminal"
          className="w-full h-full object-cover object-center filter brightness-105 contrast-110 group-hover:scale-[1.01] transition-transform duration-700"
        />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,6px_100%] pointer-events-none opacity-40" />

        <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 bg-black/85 backdrop-blur-xl p-2.5 rounded-2xl border border-white/15">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-[11px] font-mono text-cyan-200 font-bold">
              Autonomous Nodes:
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto custom-scrollbar py-1">
            {nodes.map(n => (
              <button
                key={n.id}
                onClick={() => onSelectModule && onSelectModule(n)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border transition-all flex items-center gap-1 ${
                  n.isCurrent
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                    : n.hasIon
                    ? 'bg-rose-500/20 border-rose-400/50 text-rose-300'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/15 hover:text-white'
                }`}
              >
                {n.hasIon && <Rocket size={10} className="text-rose-400 animate-bounce" />}
                {n.isCurrent && <Wallet size={10} className="text-amber-400" />}
                {n.label}
              </button>
            ))}
          </div>

          <div className="text-[10px] font-mono text-white/50">
            ION: <span className="text-rose-400 font-bold">ONLINE</span> | LENSING: <span className="text-cyan-400 font-bold">LOCKED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Admin Wallet Component ──────────────────────────────────────────────
const AdminWallet = () => {
  const navigate = useNavigate();

  // State
  const [overview, setOverview]         = useState(null);
  const [withdrawals, setWithdrawals]   = useState([]);
  const [allTxns, setAllTxns]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState('withdrawals'); // 'withdrawals' | 'transactions' | 'bankSettings'
  const [showHologram, setShowHologram] = useState(false);

  // Withdrawal Modal State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount]           = useState('');
  const [payoutMethod, setPayoutMethod]               = useState('Bank Transfer'); // 'Bank Transfer' | 'UPI'
  const [bankDetails, setBankDetails]                 = useState({
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifsc: '',
    accountType: 'Current',
    upiId: ''
  });
  const [withdrawNotes, setWithdrawNotes]             = useState('');
  const [submittingWithdraw, setSubmittingWithdraw]   = useState(false);
  const [successReceipt, setSuccessReceipt]           = useState(null);

  // Bank Edit Modal State
  const [isBankModalOpen, setIsBankModalOpen]         = useState(false);
  const [bankEditForm, setBankEditForm]               = useState({
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    accountType: 'Current',
    upiId: ''
  });
  const [savingBank, setSavingBank]                   = useState(false);

  // Formatters
  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : '—';

  // Fetch Overview and Withdrawals
  const fetchData = async () => {
    setLoading(true);
    try {
      const [overRes, withRes, txRes] = await Promise.all([
        axios.get(`${API}/admin/wallet/overview`),
        axios.get(`${API}/admin/wallet/withdrawals`),
        axios.get(`${API}/admin/wallet/transactions?limit=50`)
      ]);

      setOverview(overRes.data);
      setWithdrawals(withRes.data || []);
      setAllTxns(txRes.data || []);

      if (overRes.data?.savedBank) {
        const sb = overRes.data.savedBank;
        setBankDetails({
          accountHolder: sb.accountHolder || '',
          bankName: sb.bankName || '',
          accountNumber: sb.accountNumber || '',
          confirmAccountNumber: sb.accountNumber || '',
          ifsc: sb.ifsc || '',
          accountType: sb.accountType || 'Current',
          upiId: sb.upiId || ''
        });
        setBankEditForm({
          accountHolder: sb.accountHolder || '',
          bankName: sb.bankName || '',
          accountNumber: sb.accountNumber || '',
          ifsc: sb.ifsc || '',
          accountType: sb.accountType || 'Current',
          upiId: sb.upiId || ''
        });
      }
    } catch (err) {
      console.error('Fetch wallet error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Quick Amount Selectors
  const setPercentageAmount = (pct) => {
    if (!overview?.availableBalance) return;
    const amt = Math.floor((overview.availableBalance * pct) / 100);
    setWithdrawAmount(amt > 0 ? amt.toString() : '');
  };

  // Submit Withdrawal to Account
  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    const numAmt = Number(withdrawAmount);

    if (!numAmt || numAmt <= 0) {
      alert('Please enter a valid amount to withdraw.');
      return;
    }

    if (numAmt > (overview?.availableBalance || 0)) {
      alert(`Amount exceeds available balance of ${fmt(overview?.availableBalance || 0)}.`);
      return;
    }

    if (payoutMethod === 'Bank Transfer') {
      if (!bankDetails.accountHolder || !bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.ifsc) {
        alert('Please fill all bank details: Account Holder, Bank Name, Account Number, and IFSC.');
        return;
      }
      if (bankDetails.confirmAccountNumber && bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
        alert('Account numbers do not match. Please verify.');
        return;
      }
    } else {
      if (!bankDetails.upiId || !bankDetails.upiId.includes('@')) {
        alert('Please enter a valid UPI ID (e.g. name@okhdfcbank).');
        return;
      }
    }

    setSubmittingWithdraw(true);
    try {
      const res = await axios.post(`${API}/admin/wallet/withdraw`, {
        amount: numAmt,
        payoutMethod,
        bankDetails,
        saveAccount: true,
        notes: withdrawNotes
      });

      setSuccessReceipt(res.data.withdrawal);
      setIsWithdrawModalOpen(false);
      setWithdrawAmount('');
      setWithdrawNotes('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Withdrawal failed. Please try again.');
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  // Save Bank Account Details
  const handleSaveBank = async (e) => {
    e.preventDefault();
    setSavingBank(true);
    try {
      await axios.post(`${API}/admin/wallet/bank-account`, bankEditForm);
      alert('Bank details updated successfully!');
      setIsBankModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save bank details');
    } finally {
      setSavingBank(false);
    }
  };

  const available = overview?.availableBalance || 0;
  const totalInflow = overview?.totalInflow || 0;
  const totalWithdrawn = overview?.totalWithdrawn || 0;

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-xl shadow-teal-500/20">
            <Landmark size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Superadmin Wallet & Bank Payouts
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-600" />
                Live Revenue Withdrawal
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Platform revenue se direct apne bank account ya UPI me instant withdrawal karein.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Hologram Toggle */}
          <button
            onClick={() => setShowHologram(!showHologram)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-semibold text-xs border transition-all ${
              showHologram
                ? 'bg-slate-900 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <Sparkles size={14} className={showHologram ? 'text-cyan-400' : 'text-gray-400'} />
            {showHologram ? 'Hide Holographic View' : 'Holographic Terminal'}
          </button>

          {/* Manage Bank Button */}
          <button
            onClick={() => setIsBankModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition"
          >
            <Building2 size={15} className="text-gray-500" />
            Manage Bank / UPI
          </button>

          {/* PRIMARY WITHDRAW BUTTON */}
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5"
          >
            <Send size={16} />
            Withdraw to My Account
          </button>
        </div>
      </div>

      {/* ── Holographic Terminal (Collapsible) ── */}
      {showHologram && (
        <HolographicTerminalShowcase
          onSelectModule={(node) => {
            if (node.path && node.path !== '/admin/wallet') navigate(node.path);
          }}
        />
      )}

      {/* ── Hero Revenue & Withdrawal Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* 1. MAIN CARD: AVAILABLE FOR WITHDRAWAL */}
        <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-[#042f2e] via-[#064e3b] to-[#022c22] text-white border border-emerald-500/30 shadow-xl shadow-emerald-950/30">
          <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-300/80">
                Available to Withdraw
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <Wallet size={16} />
              </div>
            </div>

            <div>
              <p className="text-3xl font-black text-white tracking-tight">
                {fmt(available)}
              </p>
              <p className="text-[11px] text-emerald-200/60 mt-1">
                Net earnings ready to transfer to bank
              </p>
            </div>

            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="w-full py-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Send size={13} />
              Withdraw Now
            </button>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
        </div>

        {/* 2. TOTAL PLATFORM EARNINGS */}
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Inflow / Revenue</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <ArrowDownLeft size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-800">{fmt(totalInflow)}</p>
            <p className="text-xs text-gray-400 mt-1">All collected platform payments</p>
          </div>
          <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-[11px] text-gray-500">
            <span>Bookings: <b>{fmt(overview?.bookingRevenue || 0)}</b></span>
            <span>Subs: <b>{fmt(overview?.subscriptionRevenue || 0)}</b></span>
          </div>
        </div>

        {/* 3. TOTAL WITHDRAWN TO DATE */}
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Withdrawn</span>
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                <ArrowUpRight size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-800">{fmt(totalWithdrawn)}</p>
            <p className="text-xs text-gray-400 mt-1">Transferred to your bank account</p>
          </div>
          <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-[11px] text-gray-500">
            <span>Withdrawals Count: <b>{withdrawals.length}</b></span>
            <span className="text-emerald-600 font-semibold">100% Settled</span>
          </div>
        </div>

        {/* 4. SAVED BANK ACCOUNT / UPI */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-gray-900 text-white border border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Payout Destination</span>
              <button
                onClick={() => setIsBankModalOpen(true)}
                className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1"
              >
                <Edit3 size={12} /> Edit
              </button>
            </div>
            {overview?.savedBank?.accountNumber ? (
              <div className="space-y-1">
                <p className="text-base font-bold text-white truncate">
                  {overview.savedBank.bankName}
                </p>
                <p className="text-xs font-mono text-cyan-300">
                  A/c: •••• {overview.savedBank.accountNumber.slice(-4)}
                </p>
                <p className="text-[11px] text-gray-400">
                  IFSC: {overview.savedBank.ifsc}
                </p>
              </div>
            ) : (
              <div className="py-2">
                <p className="text-xs text-gray-300">No bank account saved yet.</p>
                <button
                  onClick={() => setIsBankModalOpen(true)}
                  className="mt-2 text-xs text-cyan-300 hover:underline font-bold"
                >
                  + Add Bank Account
                </button>
              </div>
            )}
          </div>
          <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between text-[11px]">
            <span className="text-gray-400">{overview?.savedBank?.accountHolder || 'Super Admin'}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex border-b border-gray-200 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`pb-3 flex items-center gap-2 transition-all ${
            activeTab === 'withdrawals'
              ? 'border-b-2 border-emerald-600 text-emerald-700 font-bold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <ArrowUpRight size={17} />
          My Bank Withdrawals & Payouts ({withdrawals.length})
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 flex items-center gap-2 transition-all ${
            activeTab === 'transactions'
              ? 'border-b-2 border-emerald-600 text-emerald-700 font-bold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Wallet size={17} />
          All Platform Revenue & Transactions ({allTxns.length})
        </button>

        <button
          onClick={() => setActiveTab('bankSettings')}
          className={`pb-3 flex items-center gap-2 transition-all ${
            activeTab === 'bankSettings'
              ? 'border-b-2 border-emerald-600 text-emerald-700 font-bold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Building2 size={17} />
          Saved Bank & UPI Settings
        </button>
      </div>

      {/* ── TAB 1: BANK WITHDRAWALS HISTORY ── */}
      {activeTab === 'withdrawals' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-gray-800 text-base">Withdrawal Payout Records</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Superadmin ke bank account me bheje gaye sabhi payouts aur UTR transaction details.
              </p>
            </div>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Send size={14} /> New Withdrawal
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase">
                <tr>
                  <th className="py-3.5 px-5">Payout ID / UTR</th>
                  <th className="py-3.5 px-5">Amount</th>
                  <th className="py-3.5 px-5">Transfer Method</th>
                  <th className="py-3.5 px-5">Transferred To</th>
                  <th className="py-3.5 px-5">Balance After</th>
                  <th className="py-3.5 px-5">Date & Time</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="8" className="py-16 text-center text-gray-400">Loading withdrawals...</td></tr>
                ) : withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-16 text-center">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Landmark size={22} />
                      </div>
                      <p className="font-bold text-gray-700">Abhi tak koi withdrawal nahi kiya gaya hai.</p>
                      <p className="text-xs text-gray-400 mt-1">Upar diye gaye "Withdraw to My Account" button se withdrawal karein.</p>
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((w) => {
                    const pd = w.payoutDetails || {};
                    return (
                      <tr key={w._id} className="hover:bg-gray-50/80 transition">
                        <td className="py-4 px-5">
                          <p className="font-mono text-xs font-bold text-gray-800">{pd.payoutId || 'PO-' + w._id.slice(-6)}</p>
                          <p className="font-mono text-[10px] text-gray-400">UTR: {pd.utrNumber || w.referenceId || '—'}</p>
                        </td>
                        <td className="py-4 px-5 font-black text-gray-900 text-sm">
                          <span className="text-emerald-700">{fmt(w.amount)}</span>
                        </td>
                        <td className="py-4 px-5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                            {pd.payoutMethod === 'UPI' ? <Zap size={11} /> : <Building2 size={11} />}
                            {pd.payoutMethod || 'Bank Transfer'}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <p className="font-semibold text-gray-800 text-xs">{pd.accountHolder || w.userName}</p>
                          <p className="text-[11px] text-gray-500">
                            {pd.payoutMethod === 'UPI'
                              ? pd.upiId
                              : `${pd.bankName || 'Bank'} (•••• ${pd.accountNumber ? pd.accountNumber.slice(-4) : '—'})`}
                          </p>
                        </td>
                        <td className="py-4 px-5 font-mono text-xs text-gray-500">
                          {fmt(w.balanceAfter)}
                        </td>
                        <td className="py-4 px-5 text-gray-400 text-xs">
                          {fmtDate(w.createdAt)}
                        </td>
                        <td className="py-4 px-5">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-max">
                            <CheckCircle2 size={12} />
                            Completed
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <button
                            onClick={() => setSuccessReceipt(w)}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition"
                            title="View Receipt"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: ALL PLATFORM TRANSACTIONS ── */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-base">All Platform Financial Transactions</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Creator/Company bookings, subscriptions, platform credits, aur admin payouts ka complete ledger.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase">
                <tr>
                  <th className="py-3.5 px-5">User</th>
                  <th className="py-3.5 px-5">Type</th>
                  <th className="py-3.5 px-5">Amount</th>
                  <th className="py-3.5 px-5">Description</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allTxns.length === 0 ? (
                  <tr><td colSpan="6" className="py-12 text-center text-gray-400">No transactions recorded yet.</td></tr>
                ) : (
                  allTxns.map(t => (
                    <tr key={t._id} className="hover:bg-gray-50/80">
                      <td className="py-4 px-5">
                        <p className="font-semibold text-gray-800 text-xs">{t.userName || 'Super Admin'}</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">{t.userType}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          t.type === 'Withdrawal' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-bold text-gray-800">
                        {t.type === 'Withdrawal' ? `-${fmt(t.amount)}` : `+${fmt(t.amount)}`}
                      </td>
                      <td className="py-4 px-5 text-gray-500 text-xs max-w-[200px] truncate">{t.description || '—'}</td>
                      <td className="py-4 px-5 text-gray-400 text-xs">{fmtDate(t.createdAt)}</td>
                      <td className="py-4 px-5">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: BANK & UPI SETTINGS ── */}
      {activeTab === 'bankSettings' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Superadmin Bank & UPI Settings</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Withdrawal payouts isi account me credit honge. Aap ise kabhi bhi update kar sakte hain.
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 size={20} />
            </div>
          </div>

          <form onSubmit={handleSaveBank} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Account Holder Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. MyCastNow Technologies Pvt Ltd / Super Admin"
                value={bankEditForm.accountHolder}
                onChange={e => setBankEditForm(p => ({ ...p, accountHolder: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Bank Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. HDFC Bank, SBI, ICICI"
                  value={bankEditForm.bankName}
                  onChange={e => setBankEditForm(p => ({ ...p, bankName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Account Type</label>
                <select
                  value={bankEditForm.accountType}
                  onChange={e => setBankEditForm(p => ({ ...p, accountType: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="Current">Current Account</option>
                  <option value="Savings">Savings Account</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Bank Account Number *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 50100234918231"
                  value={bankEditForm.accountNumber}
                  onChange={e => setBankEditForm(p => ({ ...p, accountNumber: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">IFSC Code *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. HDFC0001234"
                  value={bankEditForm.ifsc}
                  onChange={e => setBankEditForm(p => ({ ...p, ifsc: e.target.value.toUpperCase() }))}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-mono uppercase focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">UPI ID (Optional for instant UPI payouts)</label>
              <input
                type="text"
                placeholder="e.g. mycastnow@okhdfcbank"
                value={bankEditForm.upiId}
                onChange={e => setBankEditForm(p => ({ ...p, upiId: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingBank}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow transition disabled:opacity-60"
            >
              {savingBank ? 'Saving...' : 'Save Bank Account Details'}
            </button>
          </form>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* ── MODAL: WITHDRAW TO MY ACCOUNT ── */}
      {/* ══════════════════════════════════════════════════════ */}
      {isWithdrawModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
          onClick={() => setIsWithdrawModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-lg w-full p-6 space-y-5 max-h-[95vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Landmark size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Withdraw Funds to Account</h3>
                  <p className="text-xs text-gray-400">Transfer platform earnings directly to your bank</p>
                </div>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-xl hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Available Balance Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Available for Withdrawal</p>
                <p className="text-2xl font-black text-emerald-950 mt-0.5">{fmt(available)}</p>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-white/80 px-2.5 py-1 rounded-xl shadow-xs border border-emerald-200">
                100% Liquid
              </span>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">

              {/* Amount Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">Withdrawal Amount (₹) *</label>
                  <span className="text-xs text-gray-400">Min: ₹100</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">₹</span>
                  <input
                    required
                    type="number"
                    min="1"
                    max={available}
                    placeholder="0"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Quick percentage buttons */}
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[25, 50, 75, 100].map(pct => (
                    <button
                      type="button"
                      key={pct}
                      onClick={() => setPercentageAmount(pct)}
                      className="py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition"
                    >
                      {pct === 100 ? 'Max (100%)' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transfer Method */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Payout Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('Bank Transfer')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      payoutMethod === 'Bank Transfer'
                        ? 'border-emerald-500 bg-emerald-50/60 shadow-sm'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${payoutMethod === 'Bank Transfer' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Building2 size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Direct Bank Transfer</p>
                      <p className="text-[10px] text-gray-500">IMPS / NEFT Settlement</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayoutMethod('UPI')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      payoutMethod === 'UPI'
                        ? 'border-emerald-500 bg-emerald-50/60 shadow-sm'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${payoutMethod === 'UPI' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Zap size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Instant UPI Payout</p>
                      <p className="text-[10px] text-gray-500">GPay, PhonePe, Paytm</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Account Details Form */}
              {payoutMethod === 'Bank Transfer' ? (
                <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Account Holder Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="Name as in bank passbook"
                      value={bankDetails.accountHolder}
                      onChange={e => setBankDetails(p => ({ ...p, accountHolder: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">Bank Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. HDFC Bank"
                        value={bankDetails.bankName}
                        onChange={e => setBankDetails(p => ({ ...p, bankName: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">IFSC Code *</label>
                      <input
                        required
                        type="text"
                        placeholder="HDFC0001234"
                        value={bankDetails.ifsc}
                        onChange={e => setBankDetails(p => ({ ...p, ifsc: e.target.value.toUpperCase() }))}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-mono uppercase focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">Account Number *</label>
                      <input
                        required
                        type="text"
                        placeholder="Account number"
                        value={bankDetails.accountNumber}
                        onChange={e => setBankDetails(p => ({ ...p, accountNumber: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">Confirm Account Number *</label>
                      <input
                        required
                        type="text"
                        placeholder="Re-enter number"
                        value={bankDetails.confirmAccountNumber}
                        onChange={e => setBankDetails(p => ({ ...p, confirmAccountNumber: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">UPI ID *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. yourname@okhdfcbank"
                      value={bankDetails.upiId}
                      onChange={e => setBankDetails(p => ({ ...p, upiId: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Account Holder Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="Your Name"
                      value={bankDetails.accountHolder}
                      onChange={e => setBankDetails(p => ({ ...p, accountHolder: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Remarks (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Platform monthly revenue payout"
                  value={withdrawNotes}
                  onChange={e => setWithdrawNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Breakdown */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1.5">
                <div className="flex justify-between text-gray-500">
                  <span>Transfer Amount:</span>
                  <span className="font-bold text-gray-800">{fmt(withdrawAmount || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Processing Fee:</span>
                  <span className="font-bold text-emerald-600">₹0 (Free)</span>
                </div>
                <div className="flex justify-between text-gray-900 font-black border-t border-gray-200 pt-1.5">
                  <span>Net Credited to Bank:</span>
                  <span className="text-emerald-700">{fmt(withdrawAmount || 0)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingWithdraw || !withdrawAmount || Number(withdrawAmount) <= 0}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50"
                >
                  {submittingWithdraw ? 'Processing Transfer...' : 'Confirm & Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* ── MODAL: EDIT BANK ACCOUNT ── */}
      {/* ══════════════════════════════════════════════════════ */}
      {isBankModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
          onClick={() => setIsBankModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <Building2 className="text-emerald-600" size={20} />
                <h3 className="text-base font-bold text-gray-900">Manage Bank & UPI Account</h3>
              </div>
              <button onClick={() => setIsBankModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBank} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Account Holder Name *</label>
                <input
                  required
                  type="text"
                  value={bankEditForm.accountHolder}
                  onChange={e => setBankEditForm(p => ({ ...p, accountHolder: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Bank Name *</label>
                  <input
                    required
                    type="text"
                    value={bankEditForm.bankName}
                    onChange={e => setBankEditForm(p => ({ ...p, bankName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Account Type</label>
                  <select
                    value={bankEditForm.accountType}
                    onChange={e => setBankEditForm(p => ({ ...p, accountType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="Current">Current</option>
                    <option value="Savings">Savings</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Bank Account Number *</label>
                <input
                  required
                  type="text"
                  value={bankEditForm.accountNumber}
                  onChange={e => setBankEditForm(p => ({ ...p, accountNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">IFSC Code *</label>
                <input
                  required
                  type="text"
                  value={bankEditForm.ifsc}
                  onChange={e => setBankEditForm(p => ({ ...p, ifsc: e.target.value.toUpperCase() }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">UPI ID (Optional)</label>
                <input
                  type="text"
                  value={bankEditForm.upiId}
                  onChange={e => setBankEditForm(p => ({ ...p, upiId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBank}
                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                >
                  {savingBank ? 'Saving...' : 'Save Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* ── MODAL: PAYOUT SUCCESS RECEIPT ── */}
      {/* ══════════════════════════════════════════════════════ */}
      {successReceipt && (
        <div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
          onClick={() => setSuccessReceipt(null)}
        >
          <div
            className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full p-6 text-center space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Payout Transferred Successfully
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-1">
                {fmt(successReceipt.amount)}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Funds have been transferred to your destination account
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Payout ID:</span>
                <span className="font-mono font-bold text-gray-800">{successReceipt.payoutDetails?.payoutId || successReceipt._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">UTR / Ref:</span>
                <span className="font-mono font-bold text-emerald-700">{successReceipt.payoutDetails?.utrNumber || successReceipt.referenceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account:</span>
                <span className="font-semibold text-gray-800">
                  {successReceipt.payoutDetails?.payoutMethod === 'UPI'
                    ? successReceipt.payoutDetails.upiId
                    : `${successReceipt.payoutDetails?.bankName} (•••• ${successReceipt.payoutDetails?.accountNumber?.slice(-4) || '—'})`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Holder:</span>
                <span className="font-semibold text-gray-800">{successReceipt.payoutDetails?.accountHolder || successReceipt.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date & Time:</span>
                <span className="text-gray-800">{fmtDate(successReceipt.createdAt)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-gray-500">Remaining Balance:</span>
                <span className="font-bold text-gray-900">{fmt(successReceipt.balanceAfter)}</span>
              </div>
            </div>

            <button
              onClick={() => setSuccessReceipt(null)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminWallet;
