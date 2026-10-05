import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  HelpCircle, Search, Server, Database, Activity, 
  Cpu, Clock, ShieldCheck, ChevronDown, ChevronUp, 
  Send, AlertCircle, CheckCircle2, FileText, Phone, 
  Mail, MessageSquare, LifeBuoy, ExternalLink, RefreshCw 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminHelp = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Diagnostics State
  const [diagnostics, setDiagnostics] = useState(null);
  const [diagLoading, setDiagLoading] = useState(false);

  // FAQs State
  const [faqs, setFaqs] = useState([]);

  // Ticket Form State
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'General Query',
    priority: 'Medium',
    message: ''
  });
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketMsg, setTicketMsg] = useState({ type: '', text: '' });
  const [recentTickets, setRecentTickets] = useState([]);

  useEffect(() => {
    fetchDiagnostics();
    fetchFaqs();
    fetchTickets();
  }, []);

  const fetchDiagnostics = async () => {
    setDiagLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/help/diagnostics`);
      if (res.data.success) {
        setDiagnostics(res.data.diagnostics);
      }
    } catch (err) {
      console.error('Error fetching diagnostics:', err);
    } finally {
      setDiagLoading(false);
    }
  };

  const fetchFaqs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/help/faqs`);
      if (res.data.success) {
        setFaqs(res.data.faqs);
      }
    } catch (err) {
      console.error('Error fetching FAQs:', err);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/help/tickets`);
      if (res.data.success) {
        setRecentTickets(res.data.tickets || []);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setTicketLoading(true);
    setTicketMsg({ type: '', text: '' });

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/help/tickets`, {
        ...ticketForm,
        adminEmail: user?.email || 'superadmin@mycastnow.com'
      });

      if (res.data.success) {
        setTicketMsg({ type: 'success', text: 'Support inquiry ticket logged successfully!' });
        setTicketForm({
          subject: '',
          category: 'General Query',
          priority: 'Medium',
          message: ''
        });
        fetchTickets();
      }
    } catch (err) {
      setTicketMsg({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to submit ticket. Please try again.' 
      });
    } finally {
      setTicketLoading(false);
    }
  };

  const categories = ['All', 'Profile & Account Security', 'Castings & Bookings', 'Finance & Payments', 'Creators & Verification', 'System Maintenance'];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0b1120] via-[#1e1b4b] to-[#0f172a] rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-[1]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider mb-2">
            <LifeBuoy size={13} />
            Super Admin Help Center
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Support, Knowledge & System Diagnostics</h1>
          <p className="text-gray-300 text-sm mt-1 max-w-xl">
            Access operational guides, verify live server diagnostics, inspect platform FAQs, or log internal maintenance inquiries.
          </p>

          {/* Search Box */}
          <div className="mt-5 max-w-xl relative">
            <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search help questions, bookings, payouts, system..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            />
          </div>
        </div>
      </div>

      {/* Real-time System Diagnostics Dashboard */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Live System Diagnostics</h2>
              <p className="text-xs text-gray-500">Real-time status of backend services and database connections</p>
            </div>
          </div>
          <button
            onClick={fetchDiagnostics}
            disabled={diagLoading}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <RefreshCw size={14} className={diagLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {diagnostics ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-emerald-800">Backend API</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-lg font-bold text-emerald-950">{diagnostics.serverStatus}</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">Port {diagnostics.port} • Node {diagnostics.nodeVersion}</p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-blue-800">Database Status</span>
                <Database size={15} className="text-blue-600" />
              </div>
              <p className="text-lg font-bold text-blue-950">{diagnostics.database?.status}</p>
              <p className="text-[11px] text-blue-700 mt-0.5 truncate">{diagnostics.database?.name} (MongoDB)</p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-purple-800">System Uptime</span>
                <Clock size={15} className="text-purple-600" />
              </div>
              <p className="text-lg font-bold text-purple-950">{diagnostics.uptime}</p>
              <p className="text-[11px] text-purple-700 mt-0.5">Continuous Operation</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-amber-800">Process Memory</span>
                <Cpu size={15} className="text-amber-600" />
              </div>
              <p className="text-lg font-bold text-amber-950">{diagnostics.processMemoryMB} MB</p>
              <p className="text-[11px] text-amber-700 mt-0.5">Host Total: {Math.round(diagnostics.totalMemoryMB / 1024)} GB</p>
            </div>
          </div>
        ) : (
          <div className="py-6 flex justify-center text-sm text-gray-500">
            <RefreshCw size={18} className="animate-spin mr-2 text-blue-600" />
            Loading system diagnostics...
          </div>
        )}
      </div>

      {/* Operational Guides Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <FileText size={20} />
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">Managing Bookings & Popups</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            In the Bookings section, click any booking row to reveal the full modal popup with creator and company contact credentials.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <ShieldCheck size={20} />
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">Admin Profile & Security</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Quickly update your name, email, or password from the top-right header avatar dropdown or via Settings &gt; Security tab.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Server size={20} />
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">Commission & Financials</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Adjust platform deduction percentage and minimum payout thresholds directly under Settings &gt; Platform & Fees.
          </p>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="text-sm text-gray-500 mt-0.5">Quick solutions for common administrative queries</p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="border border-gray-200 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50/80 transition-colors"
                  >
                    <span className="text-sm font-bold text-gray-800 pr-4">{faq.question}</span>
                    <span className="text-gray-400 shrink-0">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-gray-600 border-t border-gray-100 bg-gray-50/50 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-sm text-gray-500">
              No matching questions found for "{searchTerm}".
            </div>
          )}
        </div>
      </div>

      {/* Support & Issue Ticket Submission */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Ticket Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">Submit System Issue / Support Ticket</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Log an internal technical ticket or report platform irregularities directly to the engineering team.
            </p>
          </div>

          {ticketMsg.text && (
            <div className={`mb-5 p-3.5 rounded-xl flex items-center gap-2.5 text-xs ${
              ticketMsg.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {ticketMsg.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> : <AlertCircle size={16} className="text-red-600 shrink-0" />}
              <span>{ticketMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Subject / Title</label>
              <input
                type="text"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                required
                placeholder="e.g. Payment gateway timeout on withdrawal verification"
                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category</label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                >
                  <option value="General Query">General Query</option>
                  <option value="Payment & Wallet">Payment & Wallet</option>
                  <option value="Castings & Bookings">Castings & Bookings</option>
                  <option value="Account & Security">Account & Security</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Request">Feature Request</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Priority Level</label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                >
                  <option value="Low">Low - Informational</option>
                  <option value="Medium">Medium - Regular Issue</option>
                  <option value="High">High - Attention Required</option>
                  <option value="Critical">Critical - Service Impacting</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Detailed Description</label>
              <textarea
                rows={3}
                value={ticketForm.message}
                onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                required
                placeholder="Explain the technical issue or query with any relevant user IDs or steps..."
                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={ticketLoading}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-60 transition-all"
              >
                {ticketLoading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                {ticketLoading ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        </div>

        {/* Support Contacts & Recent Tickets */}
        <div className="space-y-6">
          {/* Direct Contacts Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Direct Support Hotline</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <Mail size={16} className="text-blue-600 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Technical Support</p>
                  <p className="text-gray-500">support@mycastnow.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <Phone size={16} className="text-emerald-600 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Super Admin Hotline</p>
                  <p className="text-gray-500">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tickets List */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Recent Tickets</h3>
            {recentTickets.length > 0 ? (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {recentTickets.slice(0, 5).map((t) => (
                  <div key={t._id} className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold text-blue-600">{t.ticketId}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        t.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                        t.priority === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {t.priority}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-800 truncate">{t.subject}</p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                      <span>{t.category}</span>
                      <span className="font-medium text-emerald-600">{t.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-3 text-center">No submitted tickets yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHelp;
