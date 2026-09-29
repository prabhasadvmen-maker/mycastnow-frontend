import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCompanyAuth } from '../../context/CompanyAuthContext';
import {
  HelpCircle, Search, MessageSquare, Phone, Mail, ShieldCheck,
  ChevronDown, ChevronRight, Send, CheckCircle2, AlertCircle,
  FileText, Clock, ExternalLink, Sparkles, RefreshCw, LifeBuoy,
  CreditCard, Video, Users, Check
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const CompanyHelp = () => {
  const { companyUser } = useCompanyAuth();

  const [activeTab, setActiveTab] = useState('faq'); // 'faq' | 'tickets' | 'new-ticket'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openFaq, setOpenFaq] = useState(null);

  // Tickets state
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState('');
  const [ticketError, setTicketError] = useState('');

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'General Query',
    priority: 'Medium',
    message: ''
  });

  // Fetch Tickets from Database
  const fetchTickets = async () => {
    setTicketsLoading(true);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API}/company/profile/tickets`, { headers });
      if (res.data?.success && Array.isArray(res.data.tickets)) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      console.error('Fetch tickets error:', err);
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Submit New Support Ticket
  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setSubmittingTicket(true);
    setTicketSuccess('');
    setTicketError('');

    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(`${API}/company/profile/tickets`, ticketForm, { headers });
      if (res.data?.success) {
        setTicketSuccess('Support ticket submitted successfully! Ticket ID: ' + (res.data.ticket?.ticketId || 'TKT-PENDING'));
        setTicketForm({
          subject: '',
          category: 'General Query',
          priority: 'Medium',
          message: ''
        });
        fetchTickets();
        setTimeout(() => {
          setActiveTab('tickets');
          setTicketSuccess('');
        }, 2000);
      } else {
        setTicketError(res.data?.message || 'Failed to submit ticket');
      }
    } catch (err) {
      console.error('Submit ticket error:', err);
      setTicketError(err.response?.data?.message || 'Failed to submit ticket. Please try again.');
    } finally {
      setSubmittingTicket(false);
    }
  };

  const faqs = [
    {
      category: 'Casting Calls',
      q: 'How long does Super Admin review take for newly posted casting calls?',
      a: 'All casting calls posted by verified production houses are typically reviewed and approved within 1 to 2 hours during business hours (9 AM - 8 PM IST). Once approved, they immediately go live to 25,000+ verified actors and models across India.'
    },
    {
      category: 'Casting Calls',
      q: 'Can we upload custom audition scripts and private scene sides?',
      a: 'Yes! When posting or editing a casting call in your Casting dashboard, you can upload confidential script sides (PDF/DOC) and specify exact self-tape instructions (lighting, angles, dialogue cues).'
    },
    {
      category: 'Escrow & Payments',
      q: 'How does the Escrow Wallet system protect our production budget?',
      a: 'When you confirm a booking, the shoot fee is placed into a secured MyCastNow Escrow holding account. The talent cannot withdraw the money until the shoot day is completed and you authorize milestone release. If an artist cancels or no-shows, 100% of the funds are refunded instantly to your company wallet.'
    },
    {
      category: 'Escrow & Payments',
      q: 'Can we get official GST invoices for tax deduction?',
      a: 'Yes. Every booking and wallet deposit generates an automated GST-compliant tax invoice displaying your registered GSTIN, CIN, and studio address. Invoices are downloadable anytime from your Wallet / Payments section.'
    },
    {
      category: 'Shortlists & Talent',
      q: 'How do we use the Talent Cart to share shortlisted actors with our directors?',
      a: 'You can add multiple actors, models, and dancers to a project-specific Talent Cart. From the Talent Cart page, click "Share Shortlist" to generate a private, read-only link or PDF package for your Director, Producer, or Client to review side-by-side.'
    },
    {
      category: 'Account & Security',
      q: 'How can we invite associate casting directors or assistants to this account?',
      a: 'Contact your dedicated account manager or open a ticket in the Support tab. We can provision multi-seat access under your production license with customized permissions.'
    }
  ];

  const filteredFaqs = faqs.filter(f => {
    if (selectedCategory !== 'All' && f.category !== selectedCategory) return false;
    if (searchQuery && !f.q.toLowerCase().includes(searchQuery.toLowerCase()) && !f.a.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
        <div className="relative z-[1] max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-3">
            <LifeBuoy size={14} /> PRODUCTION DESK SUPPORT
          </div>
          <h1 className="text-2xl sm:text-4xl font-black leading-tight">How can our casting team assist your shoot today?</h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-2">
            Find immediate answers regarding audition workflows, escrow guarantees, talent contracts, or connect directly with our support specialists.
          </p>

          {/* Quick Search */}
          <div className="mt-6 relative">
            <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics (e.g. escrow refund, script upload, talent cart, GST invoice)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-gray-900 text-sm font-medium placeholder-gray-400 shadow-md outline-none focus:ring-4 focus:ring-white/30"
            />
          </div>
        </div>
      </div>

      {/* 4 Quick Support Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2 hover:border-blue-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Phone size={20} />
          </div>
          <p className="font-bold text-gray-900 text-sm">Priority Hotline</p>
          <p className="text-xs text-gray-500">Shoot-day emergencies & immediate callback</p>
          <a href="tel:+919820145892" className="text-xs font-extrabold text-blue-600 hover:underline block pt-1">
            +91 98201 45892 →
          </a>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2 hover:border-emerald-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
          <p className="font-bold text-gray-900 text-sm">WhatsApp Casting Desk</p>
          <p className="text-xs text-gray-500">Direct coordinator chat for candidate coordination</p>
          <a href="https://wa.me/919820145892" target="_blank" rel="noreferrer" className="text-xs font-extrabold text-emerald-600 hover:underline block pt-1">
            Chat on WhatsApp →
          </a>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2 hover:border-purple-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Mail size={20} />
          </div>
          <p className="font-bold text-gray-900 text-sm">Email Support</p>
          <p className="text-xs text-gray-500">2-hour guaranteed SLA response for companies</p>
          <a href="mailto:support@mycastnow.com" className="text-xs font-extrabold text-purple-600 hover:underline block pt-1">
            support@mycastnow.com →
          </a>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2 hover:border-amber-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <p className="font-bold text-gray-900 text-sm">Escrow Protection</p>
          <p className="text-xs text-gray-500">Bank payouts, milestone verification & safety</p>
          <span className="text-xs font-extrabold text-amber-600 block pt-1">
            100% Escrow Guaranteed
          </span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-gray-200/80 flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'faq'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <HelpCircle size={16} />
          <span>Production FAQ & Guidelines</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'tickets'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Clock size={16} />
          <span>My Support Tickets ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('new-ticket')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'new-ticket'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Send size={16} />
          <span>Submit New Support Ticket</span>
        </button>
      </div>

      {/* ────────────────── TAB 1: FAQ ACCORDION ────────────────── */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Casting Calls', 'Escrow & Payments', 'Shortlists & Talent', 'Account & Security'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-xs hover:border-blue-300 transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-gray-900 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>{faq.q}</span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform duration-200 shrink-0 ${openFaq === idx ? 'rotate-180 text-blue-600' : ''}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────── TAB 2: MY TICKETS LIST ────────────────── */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
          <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-gray-900">Your Support Ticket History</h3>
              <p className="text-xs text-gray-500 mt-0.5">Track resolution status and communications from Super Admin.</p>
            </div>
            <button
              onClick={fetchTickets}
              className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw size={13} className={ticketsLoading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>

          {ticketsLoading ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-blue-600" />
              Loading your tickets...
            </div>
          ) : tickets.length === 0 ? (
            <div className="py-16 text-center text-gray-400 space-y-3">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto text-gray-400">
                <FileText size={28} />
              </div>
              <p className="font-bold text-gray-700 text-base">No support tickets found</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Have a question or need assistance with talent booking or payments? Create your first ticket!
              </p>
              <button
                onClick={() => setActiveTab('new-ticket')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 transition-all cursor-pointer"
              >
                + Open New Support Ticket
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((t) => (
                <div key={t._id} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-md">
                        {t.ticketId || 'TKT-000000'}
                      </span>
                      <span className="text-xs font-semibold text-gray-400">
                        {new Date(t.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        t.status === 'In Progress' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        {t.status}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 px-2 py-0.5 rounded-md bg-white border border-gray-200">
                        {t.category}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-extrabold text-gray-900 text-base">{t.subject}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">{t.message}</p>

                  {t.response && (
                    <div className="mt-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm">
                      <p className="font-bold text-emerald-800 mb-1 flex items-center gap-1.5">
                        <CheckCircle2 size={15} className="text-emerald-600" /> Response from Super Admin Team:
                      </p>
                      <p className="leading-relaxed">{t.response}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ────────────────── TAB 3: SUBMIT NEW TICKET ────────────────── */}
      {activeTab === 'new-ticket' && (
        <form onSubmit={handleSubmitTicket} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Send size={20} className="text-blue-600" />
              Open a New Support Ticket
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Submit your request directly to the MyCastNow Super Admin and casting coordination desk.</p>
          </div>

          {ticketSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-bold animate-in fade-in">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>{ticketSuccess}</span>
            </div>
          )}
          {ticketError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-sm font-bold animate-in fade-in">
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
              <span>{ticketError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Ticket Subject *</label>
              <input
                type="text"
                required
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                placeholder="e.g. Issue releasing escrow for Shoot #482"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Category</label>
              <select
                value={ticketForm.category}
                onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all cursor-pointer"
              >
                <option value="General Query">General Query</option>
                <option value="Castings & Bookings">Castings & Bookings</option>
                <option value="Payment & Wallet">Payment & Wallet</option>
                <option value="Escrow & Invoicing">Escrow & Invoicing</option>
                <option value="Talent Cart Support">Talent Cart Support</option>
                <option value="Account & Security">Account & Security</option>
                <option value="Bug Report">Bug Report</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Priority Level</label>
              <select
                value={ticketForm.priority}
                onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all cursor-pointer"
              >
                <option value="Low">Low - General inquiry</option>
                <option value="Medium">Medium - Regular shoot support</option>
                <option value="High">High - Urgent callback or booking issue</option>
                <option value="Critical">Critical - Immediate shoot day blocker</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Detailed Message / Description *</label>
              <textarea
                rows={5}
                required
                value={ticketForm.message}
                onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                placeholder="Explain the issue in detail, including casting title, booking ID, or transaction reference if applicable..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all resize-y"
              ></textarea>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('faq')}
              className="px-6 py-3 rounded-xl text-gray-600 hover:text-gray-900 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingTicket || !ticketForm.subject || !ticketForm.message}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submittingTicket ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Submitting to Database...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit Support Ticket
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CompanyHelp;
