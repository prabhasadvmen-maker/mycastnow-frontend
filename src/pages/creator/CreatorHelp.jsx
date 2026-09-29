import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import {
  HelpCircle, Search, MessageSquare, Phone, Mail, ShieldCheck,
  ChevronDown, ChevronRight, Send, CheckCircle2, AlertCircle,
  FileText, Clock, ExternalLink, Sparkles, RefreshCw, LifeBuoy,
  CreditCard, Video, Users, Check, AlertTriangle
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const CreatorHelp = () => {
  const { creatorUser } = useCreatorAuth();

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
    category: 'Castings & Bookings',
    priority: 'Medium',
    message: ''
  });

  // Fetch Tickets from Database
  const fetchTickets = async () => {
    setTicketsLoading(true);
    try {
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      let res;
      try {
        res = await axios.get(`${API}/creatorAuth/tickets`, { headers });
      } catch (e) {
        res = await axios.get(`${API}/admin/help/tickets`);
      }

      if (res.data?.success && res.data.tickets) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'tickets') {
      fetchTickets();
    }
  }, [activeTab]);

  // Submit Ticket
  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setTicketError('');
    setTicketSuccess('');

    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      setTicketError('Please provide both subject and detailed message.');
      return;
    }

    setSubmittingTicket(true);
    try {
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      let res;
      try {
        res = await axios.post(`${API}/creatorAuth/tickets`, {
          subject: ticketForm.subject,
          category: ticketForm.category,
          priority: ticketForm.priority,
          message: ticketForm.message
        }, { headers });
      } catch (e) {
        res = await axios.post(`${API}/admin/help/tickets`, {
          subject: ticketForm.subject,
          category: ticketForm.category,
          priority: ticketForm.priority,
          message: ticketForm.message,
          adminEmail: 'superadmin@mycastnow.com'
        });
      }

      if (res.data?.success) {
        setTicketSuccess('Ticket submitted successfully! Our talent helpdesk will respond shortly.');
        setTicketForm({
          subject: '',
          category: 'Castings & Bookings',
          priority: 'Medium',
          message: ''
        });
        setTimeout(() => {
          setActiveTab('tickets');
          setTicketSuccess('');
          fetchTickets();
        }, 1500);
      } else {
        setTicketError(res.data?.message || 'Failed to submit ticket.');
      }
    } catch (err) {
      console.error('Submit ticket error:', err);
      setTicketError(err.response?.data?.message || 'Failed to submit ticket. Please check connection.');
    } finally {
      setSubmittingTicket(false);
    }
  };

  // Creator FAQs
  const faqs = [
    {
      q: 'How do I apply for casting calls on MyCastNow?',
      a: 'Navigate to the "Casting" section from your sidebar. Browse active auditions filtered by category (Model, Actor, Dancer), location, and compensation. Click on any role to view detailed character requirements, script sides, and click "Apply with Profile" to submit your application and self-tape.',
      category: 'Castings'
    },
    {
      q: 'What should I include in an Audition Self-Tape?',
      a: 'Follow the director\'s script sides. Record in a well-lit room in 1080p horizontal (landscape) orientation. Begin with a 10-second slate stating your full name, height, city, and agency representation. Upload your video as an unlisted link on YouTube or Vimeo, and paste it into your application.',
      category: 'Castings'
    },
    {
      q: 'How does the Escrow Payment Guarantee work for creators?',
      a: 'When a production studio books you, they must deposit 100% of your agreed fee into platform Escrow BEFORE the shoot starts. Once you complete the shoot and both parties confirm wrap, the funds are released into your MyCastNow Wallet for instant withdrawal.',
      category: 'Payments'
    },
    {
      q: 'How do I withdraw funds from my Wallet to my Bank Account?',
      a: 'Go to "Wallet" in your sidebar, enter the amount you wish to withdraw, specify your verified UPI ID or Bank Account (NEFT/IMPS), and click "Withdraw Funds". Withdrawals are processed within 2-4 banking hours.',
      category: 'Payments'
    },
    {
      q: 'What is the difference between "Shortlisted" and "Selected"?',
      a: '"Shortlisted" means the casting team liked your self-tape and you are in the top 5-10 finalists for the role. "Selected" means the studio has officially chosen you for the role and will send shoot contracts and call sheets.',
      category: 'Bookings'
    },
    {
      q: 'How do I increase my visibility to top casting directors?',
      a: '1. Keep your Casting Readiness Score above 85% with complete physical measurements.\n2. Add at least 4 high-resolution editorial photos to your Portfolio.\n3. Link your active Instagram and showreel video.\n4. Apply within the first 24 hours of a casting call being published.',
      category: 'Profile'
    },
    {
      q: 'Can I decline an audition call if shoot dates clash?',
      a: 'Yes, if you receive a callback or booking request for dates when you are unavailable, you can click "Decline with Note" and provide your availability dates. This will not negatively impact your platform rating.',
      category: 'Bookings'
    }
  ];

  const categories = ['All', 'Castings', 'Payments', 'Bookings', 'Profile'];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesQuery = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-[#260f38] to-[#0c0824] p-6 md:p-8 text-white shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-[1] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30">
                <LifeBuoy size={20} />
              </span>
              <h1 className="text-2xl md:text-3xl font-black">Creator Support & Talent Helpdesk</h1>
            </div>
            <p className="text-xs text-purple-200 mt-1 max-w-xl">
              24/7 dedicated assistance for audition disputes, casting agreements, contract verification, and instant shoot payouts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('new-ticket')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-fuchsia-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <Send size={15} /> Raise Support Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Priority Support Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2 hover:border-purple-200 transition">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Phone size={18} />
          </div>
          <h3 className="font-bold text-sm text-gray-900">Talent Hotline</h3>
          <p className="text-xs font-mono font-bold text-gray-700">+91 98201 45892</p>
          <span className="text-[11px] text-gray-400 block">Mon-Sat (10am - 8pm)</span>
        </div>

        <a
          href="https://wa.me/919820145892?text=Hi%20MyCastNow%20Team%2C%20I%20am%20a%20Creator%20seeking%20support"
          target="_blank"
          rel="noreferrer"
          className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2 hover:border-emerald-200 transition group block"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare size={18} />
          </div>
          <h3 className="font-bold text-sm text-gray-900">WhatsApp Desk</h3>
          <p className="text-xs font-bold text-emerald-600">Chat with Helpdesk ↗</p>
          <span className="text-[11px] text-gray-400 block">Typical reply &lt; 5 mins</span>
        </a>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2 hover:border-blue-200 transition">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <h3 className="font-bold text-sm text-gray-900">Escrow Safety Desk</h3>
          <p className="text-xs font-mono font-bold text-gray-700">escrow@mycastnow.com</p>
          <span className="text-[11px] text-gray-400 block">100% Payment Guarantee</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2 hover:border-fuchsia-200 transition">
          <div className="w-10 h-10 rounded-2xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center">
            <Mail size={18} />
          </div>
          <h3 className="font-bold text-sm text-gray-900">General Support</h3>
          <p className="text-xs font-mono font-bold text-gray-700">support@mycastnow.com</p>
          <span className="text-[11px] text-gray-400 block">Official ticketing helpdesk</span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1">
        {[
          { id: 'faq', label: 'Talent Knowledgebase & FAQs', icon: HelpCircle },
          { id: 'tickets', label: `My Support Tickets (${tickets.length})`, icon: FileText },
          { id: 'new-ticket', label: 'Submit New Ticket', icon: Send },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/20'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: FAQS & KNOWLEDGEBASE                                      */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'faq' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Search & Categories */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions on auditions, payments, escrow, or bookings..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 text-xs focus:ring-2 focus:ring-fuchsia-500 font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-gray-500 mr-2">Filter Category:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-fuchsia-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* FAQs List */}
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden transition"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50"
                    >
                      <span className="font-bold text-xs sm:text-sm text-gray-800 flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-black shrink-0">
                          ?
                        </span>
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform shrink-0 ${isOpen ? 'rotate-180 text-fuchsia-600' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-50 whitespace-pre-line animate-in fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
                <p className="text-sm font-bold text-gray-600">No matching questions found.</p>
                <p className="text-xs text-gray-400 mt-1">Try another keyword or submit a direct support ticket.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: MY TICKETS LIST                                           */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'tickets' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-800">Your Submitted Helpdesk Tickets</h3>
            <button
              onClick={fetchTickets}
              className="text-xs text-fuchsia-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={13} className={ticketsLoading ? 'animate-spin' : ''} /> Refresh Status
            </button>
          </div>

          {ticketsLoading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-100">
              <RefreshCw size={24} className="animate-spin text-fuchsia-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500 font-medium">Fetching support tickets from database...</p>
            </div>
          ) : tickets.length > 0 ? (
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                        {t.ticketId}
                      </span>
                      <span className="font-bold text-sm text-gray-900">{t.subject}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                        t.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status}
                      </span>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                        {t.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed font-normal">{t.message}</p>

                  {/* Admin Reply */}
                  {t.response ? (
                    <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                        <CheckCircle2 size={15} className="text-emerald-600" />
                        <span>Support Desk Response ({t.adminEmail || 'Talent Lead'}):</span>
                      </div>
                      <p className="text-xs text-emerald-800 leading-relaxed pl-5">{t.response}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                      <Clock size={13} />
                      <span>Awaiting admin response • Submitted on {new Date(t.createdAt).toLocaleDateString('en-GB')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <FileText size={24} />
              </div>
              <h4 className="font-bold text-sm text-gray-800">No Support Tickets Yet</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Need help with a casting application, dispute, or payment? Submit your first support ticket anytime.
              </p>
              <button
                onClick={() => setActiveTab('new-ticket')}
                className="px-5 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Create New Ticket
              </button>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 3: SUBMIT NEW TICKET                                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'new-ticket' && (
        <form onSubmit={handleSubmitTicket} className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5 animate-in fade-in duration-300">
          <div>
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Send size={16} className="text-fuchsia-600" /> Submit a New Talent Support Ticket
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Our dedicated artist operations desk typically responds within 2-4 hours.
            </p>
          </div>

          {ticketSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{ticketSuccess}</span>
            </div>
          )}

          {ticketError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{ticketError}</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Ticket Subject *</label>
              <input
                type="text"
                required
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                placeholder="e.g. Escrow release delayed for Raymond Commercial shoot..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Issue Category *</label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                >
                  <option value="Castings & Bookings">Castings & Audition Calls</option>
                  <option value="Payment & Wallet">Payment, Wallet & Bank Withdrawals</option>
                  <option value="Account & Security">Account & Profile Verification</option>
                  <option value="Bug Report">Technical Bug or Error</option>
                  <option value="General Query">General Talent Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Priority Level</label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                >
                  <option value="Low">Low - General query</option>
                  <option value="Medium">Medium - Standard inquiry</option>
                  <option value="High">High - Shoot issue or payment delay</option>
                  <option value="Critical">Critical - Urgent contract dispute</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Detailed Explanation *</label>
              <textarea
                rows={5}
                required
                value={ticketForm.message}
                onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                placeholder="Please describe your issue in detail. If related to a specific casting or studio, mention the Casting Title or Director Name..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submittingTicket || !ticketForm.subject || !ticketForm.message}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-fuchsia-600/30 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submittingTicket ? (
                <>
                  <RefreshCw size={15} className="animate-spin" /> Submitting Ticket...
                </>
              ) : (
                <>
                  <Send size={15} /> Submit Support Ticket
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreatorHelp;
