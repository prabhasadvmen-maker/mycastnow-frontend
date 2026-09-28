import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  MessageSquare, Send, Search, Check, CheckCheck, Clock,
  User, Film, Phone, Mail, MapPin, Sparkles, RefreshCw,
  Paperclip, ArrowLeft, MoreVertical, ExternalLink, Calendar,
  ShieldCheck, AlertCircle
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

const QUICK_REPLIES = [
  'Can we schedule a look-test / audition this week?',
  'Please share your latest self-tape or showreel link.',
  'We reviewed your portfolio and would like to confirm your dates.',
  'Could you confirm your day rate for a 2-day brand shoot?',
  'Looking forward to working together on the upcoming project!'
];

const CompanyInbox = () => {
  const [searchParams] = useSearchParams();
  const preselectedCreatorId = searchParams.get('creatorId');

  const [conversations, setConversations] = useState([]);
  const [activeCreatorId, setActiveCreatorId] = useState(preselectedCreatorId || null);
  const [activeCreator, setActiveCreator] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All'); // 'All' | 'Unread'

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API}/company/messages/conversations`, { headers });
      if (res.data?.success) {
        const convs = res.data.conversations || [];
        setConversations(convs);

        // If no active creator selected, default to first conversation
        if (!activeCreatorId && convs.length > 0) {
          setActiveCreatorId(convs[0].creatorId);
        }
      }
    } catch (err) {
      console.error('Fetch conversations error:', err);
    } finally {
      setLoadingConv(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch thread when active creator changes
  const fetchThread = async (creatorId) => {
    if (!creatorId) return;
    setLoadingThread(true);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API}/company/messages/thread/${creatorId}`, { headers });
      if (res.data?.success) {
        setActiveCreator(res.data.creator);
        setMessages(res.data.messages || []);

        // Decrement unread count locally for this conversation
        setConversations(prev => prev.map(c =>
          c.creatorId === creatorId ? { ...c, unreadCount: 0 } : c
        ));
      }
    } catch (err) {
      console.error('Fetch thread error:', err);
    } finally {
      setLoadingThread(false);
    }
  };

  useEffect(() => {
    if (activeCreatorId) {
      fetchThread(activeCreatorId);
    }
  }, [activeCreatorId]);

  // Handle Send Message
  const handleSendMessage = async (textToSend) => {
    const text = textToSend || newMessage;
    if (!text.trim() || !activeCreatorId || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Match conversation project reference if present
      const currentConv = conversations.find(c => c.creatorId === activeCreatorId);
      const projectRef = currentConv?.projectReference || '';

      const res = await axios.post(`${API}/company/messages/send`, {
        creatorId: activeCreatorId,
        text: text.trim(),
        projectReference: projectRef
      }, { headers });

      if (res.data?.success) {
        const sentMsg = res.data.message;
        setMessages(prev => [...prev, sentMsg]);
        setNewMessage('');

        // Update last message in conversation list
        setConversations(prev => prev.map(c => {
          if (c.creatorId === activeCreatorId) {
            return {
              ...c,
              lastMessage: {
                text: sentMsg.text,
                senderType: 'Company',
                createdAt: sentMsg.createdAt
              }
            };
          }
          return c;
        }));
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setSending(false);
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    const creator = c.creator || {};
    const name = (creator.basicDetails?.fullName || creator.name || '').toLowerCase();
    const project = (c.projectReference || '').toLowerCase();
    const q = search.toLowerCase();

    const matchesSearch = !q || name.includes(q) || project.includes(q);
    const matchesFilter = filter === 'All' || (filter === 'Unread' && c.unreadCount > 0);

    return matchesSearch && matchesFilter;
  });

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = (now - date) / (1000 * 60 * 60);

    if (diffHours < 24 && now.getDate() === date.getDate()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0b1120] via-[#121c33] to-[#1e1b4b] rounded-3xl p-5 text-white shadow-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1 w-fit mb-1.5">
            <MessageSquare size={12} />
            Real-time Talent Messenger
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white">Inbox & Direct Messaging</h1>
          <p className="text-xs text-gray-300">
            Communicate directly with actors, models, and shortlisted creators regarding casting auditions and bookings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/company/dashboard/talent-cart"
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition"
          >
            Talent Cart
          </Link>
          <Link
            to="/company/dashboard/hires"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
          >
            View Contracts
          </Link>
        </div>
      </div>

      {/* Messaging Layout (Split Column) */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px] max-h-[750px]">

        {/* ── LEFT COLUMN: Conversations List (4 cols) ── */}
        <div className="lg:col-span-4 border-r border-gray-100 flex flex-col h-full bg-gray-50/40">

          {/* Search & Tabs */}
          <div className="p-4 border-b border-gray-100 space-y-3 bg-white">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search talent or project..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                {['All', 'Unread'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-3 py-1 rounded-lg font-bold transition text-xs ${
                      filter === tab
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                onClick={fetchConversations}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700"
                title="Refresh Conversations"
              >
                <RefreshCw size={12} className={loadingConv ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Conversations Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {loadingConv ? (
              <div className="p-8 text-center text-xs text-gray-400 space-y-2">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p>Loading messages...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
                  <MessageSquare size={18} />
                </div>
                <p className="text-xs font-bold text-gray-700">No conversations</p>
                <p className="text-[11px] text-gray-400">
                  Select a talent from Talent Cart or Find Talent to start a conversation.
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const c = conv.creator || {};
                const fullName = c.basicDetails?.fullName || c.name || 'Creator';
                const photo = c.basicDetails?.profilePhoto || c.portfolio?.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                const category = c.professionalDetails?.primaryCategory || 'Talent';
                const isSelected = activeCreatorId === conv.creatorId;

                return (
                  <div
                    key={conv.creatorId}
                    onClick={() => setActiveCreatorId(conv.creatorId)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition ${
                      isSelected
                        ? 'bg-indigo-50/80 border-l-4 border-indigo-600'
                        : 'hover:bg-white'
                    }`}
                  >
                    {/* Avatar with status indicator */}
                    <div className="relative shrink-0">
                      <img
                        src={photo}
                        alt={fullName}
                        className="w-11 h-11 rounded-2xl object-cover border border-gray-200"
                      />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white"></span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-black text-gray-900 truncate">{fullName}</h4>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {formatTime(conv.lastMessage?.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50/70 px-1.5 py-0.2 rounded-md">
                          {category}
                        </span>
                        {conv.projectReference && (
                          <span className="text-[10px] text-gray-400 truncate">
                            • {conv.projectReference}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-[11px] text-gray-500 truncate">
                          {conv.lastMessage?.senderType === 'Company' ? 'You: ' : ''}
                          {conv.lastMessage?.text || 'Started a conversation'}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN: Active Chat Thread (8 cols) ── */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white">
          {activeCreatorId && activeCreator ? (
            <>
              {/* Chat Thread Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={activeCreator.basicDetails?.profilePhoto || activeCreator.portfolio?.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={activeCreator.basicDetails?.fullName}
                    className="w-10 h-10 rounded-2xl object-cover border border-gray-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-black text-gray-900">
                        {activeCreator.basicDetails?.fullName || activeCreator.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Verified
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                      <span>{activeCreator.professionalDetails?.primaryCategory || 'Talent'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin size={10} />
                        {activeCreator.basicDetails?.city || 'Mumbai'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-2">
                  <Link
                    to="/company/dashboard/hires"
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition flex items-center gap-1"
                  >
                    <Calendar size={12} />
                    <span>Booking Contract</span>
                  </Link>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]/50">
                {loadingThread ? (
                  <div className="p-12 text-center text-xs text-gray-400">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p>Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-12 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                      <Sparkles size={22} />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">Start the conversation</h4>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                      Send a project brief or schedule an audition. You can also pick from the suggested quick replies below.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isCompany = msg.senderType === 'Company';

                    return (
                      <div
                        key={msg._id || idx}
                        className={`flex flex-col ${isCompany ? 'items-end' : 'items-start'}`}
                      >
                        {msg.projectReference && (
                          <span className="text-[10px] text-gray-400 font-semibold mb-1 px-2">
                            Project: {msg.projectReference}
                          </span>
                        )}

                        <div className={`max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                          isCompany
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-xs'
                        }`}>
                          <p>{msg.text}</p>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 px-1">
                          <span>{formatTime(msg.createdAt)}</span>
                          {isCompany && (
                            <CheckCheck size={12} className={msg.read ? 'text-blue-500' : 'text-gray-400'} />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Chips */}
              <div className="px-4 py-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
                <span className="text-[10px] font-bold uppercase text-gray-400 shrink-0">Quick Reply:</span>
                {QUICK_REPLIES.map((qr, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(qr)}
                    className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 text-[11px] font-medium transition shrink-0 border border-gray-200"
                  >
                    {qr}
                  </button>
                ))}
              </div>

              {/* Message Input Box */}
              <div className="p-3 border-t border-gray-100 bg-white">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Type your message to this creator..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                  >
                    <Send size={13} />
                    <span>{sending ? 'Sending...' : 'Send'}</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-base font-bold text-gray-800">Select a Conversation</h3>
              <p className="text-xs max-w-sm">
                Choose a creator from the left to read messages, send casting updates, or schedule an audition.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default CompanyInbox;
