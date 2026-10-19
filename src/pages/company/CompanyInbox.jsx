import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  MessageSquare, Send, Search, Check, CheckCheck,
  MapPin, Sparkles, RefreshCw, ArrowLeft, Calendar, WifiOff
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import useChatSocket from '../../hooks/useChatSocket';

const API = import.meta.env.VITE_API_URL;
const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

const QUICK_REPLIES = [
  'Can we schedule a look-test / audition this week?',
  'Please share your latest self-tape or showreel link.',
  'We reviewed your portfolio and would like to confirm your dates.',
  'Could you confirm your day rate for a 2-day brand shoot?',
  'Looking forward to working together on the upcoming project!'
];

const sid = (v) => (v && typeof v === 'object' ? String(v._id || v.id) : String(v ?? ''));

const formatTime = (d) => (d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');

const listTime = (d) => {
  if (!d) return '';
  const date = new Date(d);
  return date.toDateString() === new Date().toDateString()
    ? formatTime(d)
    : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const dayLabel = (d) => {
  const date = new Date(d);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });
};

const nameOf = (c = {}) => c.basicDetails?.fullName || c.name || 'Creator';
const photoOf = (c = {}) => c.basicDetails?.profilePhoto || c.portfolio?.photos?.[0] || FALLBACK_PHOTO;

const CompanyInbox = () => {
  const [searchParams] = useSearchParams();
  const preselectedCreatorId = searchParams.get('creatorId');
  const token = localStorage.getItem('companyToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

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
  const [mobileChatOpen, setMobileChatOpen] = useState(!!preselectedCreatorId);
  const [onlineIds, setOnlineIds] = useState(() => new Set());
  const [typingFrom, setTypingFrom] = useState(null);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);
  const activeRef = useRef(activeCreatorId);
  const typingTimerRef = useRef(null);
  const typingSentRef = useRef(false);
  activeRef.current = activeCreatorId;

  const scrollToBottom = (smooth = true) => {
    requestAnimationFrame(() => messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' }));
  };

  // ── Data loading ───────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/company/messages/conversations`, { headers });
      if (res.data?.success) {
        const convs = res.data.conversations || [];
        setConversations(convs);
        setActiveCreatorId(prev => prev || (convs[0]?.creatorId ?? null));
      }
    } catch (err) {
      console.error('Fetch conversations error:', err);
    } finally {
      setLoadingConv(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchThread = useCallback(async (creatorId) => {
    if (!creatorId) return;
    setLoadingThread(true);
    try {
      const res = await axios.get(`${API}/company/messages/thread/${creatorId}`, { headers });
      if (res.data?.success && activeRef.current === creatorId) {
        setActiveCreator(res.data.creator);
        setMessages(res.data.messages || []);
        setConversations(prev => prev.map(c => (c.creatorId === creatorId ? { ...c, unreadCount: 0 } : c)));
        scrollToBottom(false);
      }
    } catch (err) {
      console.error('Fetch thread error:', err);
    } finally {
      setLoadingThread(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  useEffect(() => {
    setMessages([]);
    setActiveCreator(null);
    setTypingFrom(null);
    if (activeCreatorId) fetchThread(activeCreatorId);
  }, [activeCreatorId, fetchThread]);

  useEffect(() => { scrollToBottom(); }, [messages.length, typingFrom]);

  // ── Real-time ──────────────────────────────────────────────
  const { socketRef, connected } = useChatSocket(token, {
    connect: () => {
      fetchConversations();
      if (activeRef.current) fetchThread(activeRef.current);
    },

    'message:new': (msg) => {
      const crId = sid(msg.creator);
      const fromCreator = msg.senderType === 'Creator';
      const isOpen = activeRef.current === crId;

      if (isOpen) {
        setMessages(prev => (prev.some(m => sid(m) === sid(msg)) ? prev : [...prev, msg]));
        if (fromCreator) socketRef.current?.emit('messages:mark-read', { peerId: crId });
        setTypingFrom(null);
      }

      setConversations(prev => {
        const exists = prev.some(c => c.creatorId === crId);
        if (!exists) { fetchConversations(); return prev; }
        const updated = prev.map(c => c.creatorId === crId ? {
          ...c,
          lastMessage: { text: msg.text, senderType: msg.senderType, createdAt: msg.createdAt },
          totalMessages: (c.totalMessages || 0) + 1,
          unreadCount: fromCreator && !isOpen ? (c.unreadCount || 0) + 1 : c.unreadCount
        } : c);
        return updated.sort((a, b) => new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0));
      });
    },

    // The creator opened the chat: my messages are now "seen"
    'messages:read': ({ id }) => {
      if (sid(id) === activeRef.current) {
        setMessages(prev => prev.map(m => (m.senderType === 'Company' ? { ...m, read: true } : m)));
      }
    },

    typing: ({ id, typing }) => {
      setTypingFrom(prev => (typing ? sid(id) : prev === sid(id) ? null : prev));
    },

    presence: ({ role, id, online }) => {
      if (role !== 'creator') return;
      setOnlineIds(prev => {
        const next = new Set(prev);
        online ? next.add(sid(id)) : next.delete(sid(id));
        return next;
      });
    }
  });

  useEffect(() => {
    const socket = socketRef.current;
    if (!connected || !socket) return;
    const ids = [...new Set([...conversations.map(c => c.creatorId), activeCreatorId].filter(Boolean))];
    if (ids.length === 0) return;
    socket.emit('presence:check', ids, (onlineList = []) => {
      setOnlineIds(prev => new Set([...prev, ...onlineList.map(String)]));
    });
  }, [connected, conversations.length, activeCreatorId, socketRef]);

  // Mark creator's messages as read when I have the thread open
  useEffect(() => {
    if (connected && activeCreatorId && messages.some(m => m.senderType === 'Creator' && !m.read)) {
      socketRef.current?.emit('messages:mark-read', { peerId: activeCreatorId });
      setMessages(prev => prev.map(m => (m.senderType === 'Creator' ? { ...m, read: true } : m)));
    }
  }, [connected, activeCreatorId, messages.length, socketRef]);

  // Safety net: slow polling only while the socket is down
  useEffect(() => {
    if (connected) return undefined;
    const t = setInterval(() => {
      fetchConversations();
      if (activeRef.current) fetchThread(activeRef.current);
    }, 10000);
    return () => clearInterval(t);
  }, [connected, fetchConversations, fetchThread]);

  // ── Typing indicator (outgoing) ────────────────────────────
  const emitTyping = (typing) => {
    if (!activeCreatorId || typingSentRef.current === typing) return;
    typingSentRef.current = typing;
    socketRef.current?.emit('typing', { to: activeCreatorId, typing });
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    emitTyping(true);
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => emitTyping(false), 1800);
  };

  useEffect(() => () => clearTimeout(typingTimerRef.current), []);

  // ── Sending ────────────────────────────────────────────────
  const handleSendMessage = async (textToSend) => {
    const text = (typeof textToSend === 'string' ? textToSend : newMessage).trim();
    if (!text || !activeCreatorId || sending) return;

    setSending(true);
    setError('');
    emitTyping(false);
    clearTimeout(typingTimerRef.current);
    try {
      const currentConv = conversations.find(c => c.creatorId === activeCreatorId);
      const res = await axios.post(`${API}/company/messages/send`, {
        creatorId: activeCreatorId,
        text,
        projectReference: currentConv?.projectReference || ''
      }, { headers });

      if (res.data?.success) {
        const sent = res.data.message;
        setMessages(prev => (prev.some(m => sid(m) === sid(sent)) ? prev : [...prev, sent]));
        setNewMessage('');
        setConversations(prev => {
          const exists = prev.some(c => c.creatorId === activeCreatorId);
          if (!exists && activeCreator) {
            return [{
              creatorId: activeCreatorId,
              creator: activeCreator,
              lastMessage: { text: sent.text, senderType: 'Company', createdAt: sent.createdAt },
              projectReference: '',
              unreadCount: 0,
              totalMessages: 1
            }, ...prev];
          }
          return prev.map(c => c.creatorId === activeCreatorId
            ? { ...c, lastMessage: { text: sent.text, senderType: 'Company', createdAt: sent.createdAt } }
            : c);
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Message could not be sent. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // ── Derived ────────────────────────────────────────────────
  const filteredConversations = conversations.filter(c => {
    const q = search.toLowerCase();
    const matchesSearch = !q || nameOf(c.creator).toLowerCase().includes(q) || (c.projectReference || '').toLowerCase().includes(q);
    const matchesFilter = filter === 'All' || (filter === 'Unread' && c.unreadCount > 0);
    return matchesSearch && matchesFilter;
  });
  const totalUnread = conversations.reduce((n, c) => n + (c.unreadCount || 0), 0);
  const isCreatorOnline = activeCreatorId && onlineIds.has(activeCreatorId);
  const isTyping = typingFrom && typingFrom === activeCreatorId;

  const openConversation = (creatorId) => {
    setActiveCreatorId(creatorId);
    setMobileChatOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0b1120] via-[#121c33] to-[#1e1b4b] rounded-3xl p-5 text-white shadow-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 w-fit mb-1.5 ${
            connected
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
              : 'bg-amber-500/15 text-amber-300 border-amber-400/30'
          }`}>
            {connected ? (
              <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live — messages arrive instantly</>
            ) : (
              <><WifiOff size={12} /> Reconnecting…</>
            )}
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Inbox & Direct Messaging
            {totalUnread > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-xs font-bold">{totalUnread} new</span>
            )}
          </h1>
          <p className="text-xs text-gray-300">
            Communicate directly with actors, models, and shortlisted creators regarding casting auditions and bookings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/company/dashboard/talent-cart" className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition">
            Talent Cart
          </Link>
          <Link to="/company/dashboard/hires" className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition">
            View Contracts
          </Link>
        </div>
      </div>

      {/* Messaging Layout */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[680px]">

        {/* LEFT: Conversations */}
        <div className={`lg:col-span-4 border-r border-gray-100 flex-col h-full min-h-0 bg-gray-50/40 ${mobileChatOpen ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100 space-y-3 bg-white shrink-0">
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
                      filter === tab ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {tab}{tab === 'Unread' && totalUnread > 0 ? ` (${totalUnread})` : ''}
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

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 min-h-0">
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
                  Open a creator from Talent Cart, Hires or a casting's applicants and tap Message to start chatting.
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const c = conv.creator || {};
                const isSelected = activeCreatorId === conv.creatorId;
                const online = onlineIds.has(conv.creatorId);
                return (
                  <div
                    key={conv.creatorId}
                    onClick={() => openConversation(conv.creatorId)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition ${
                      isSelected ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-white'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img src={photoOf(c)} alt={nameOf(c)} className="w-11 h-11 rounded-2xl object-cover border border-gray-200" />
                      {online && <span className="w-3 h-3 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-black text-gray-900 truncate">{nameOf(c)}</h4>
                        <span className="text-[10px] text-gray-400 shrink-0">{listTime(conv.lastMessage?.createdAt)}</span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50/70 px-1.5 rounded-md">
                          {c.professionalDetails?.primaryCategory || 'Talent'}
                        </span>
                        {conv.projectReference && (
                          <span className="text-[10px] text-gray-400 truncate">• {conv.projectReference}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className={`text-[11px] truncate ${conv.unreadCount > 0 ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
                          {typingFrom === conv.creatorId
                            ? <span className="text-indigo-600 italic">typing…</span>
                            : <>{conv.lastMessage?.senderType === 'Company' ? 'You: ' : ''}{conv.lastMessage?.text || 'Started a conversation'}</>}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="min-w-4 h-4 px-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
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

        {/* RIGHT: Active Thread */}
        <div className={`lg:col-span-8 flex-col h-full min-h-0 bg-white ${mobileChatOpen ? 'flex' : 'hidden lg:flex'}`}>
          {activeCreatorId && activeCreator ? (
            <>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setMobileChatOpen(false)}
                    className="lg:hidden p-1.5 -ml-1 rounded-lg text-gray-500 hover:bg-gray-100"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <img src={photoOf(activeCreator)} alt={nameOf(activeCreator)} className="w-10 h-10 rounded-2xl object-cover border border-gray-200 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-black text-gray-900 truncate">{nameOf(activeCreator)}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        isCreatorOnline ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isCreatorOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                        {isCreatorOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                      {isTyping ? (
                        <span className="text-indigo-600 font-semibold">typing…</span>
                      ) : (
                        <>
                          <span>{activeCreator.professionalDetails?.primaryCategory || 'Talent'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5"><MapPin size={10} />{activeCreator.basicDetails?.city || 'India'}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Link
                  to="/company/dashboard/hires"
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition flex items-center gap-1 shrink-0"
                >
                  <Calendar size={12} />
                  <span className="hidden sm:inline">Booking Contract</span>
                </Link>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]/50 min-h-0">
                {loadingThread && messages.length === 0 ? (
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
                    const showDay = idx === 0 || new Date(messages[idx - 1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString();
                    return (
                      <React.Fragment key={sid(msg) || idx}>
                        {showDay && (
                          <div className="flex justify-center my-2">
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{dayLabel(msg.createdAt)}</span>
                          </div>
                        )}
                        <div className={`flex flex-col ${isCompany ? 'items-end' : 'items-start'}`}>
                          {msg.projectReference && (
                            <span className="text-[10px] text-gray-400 font-semibold mb-1 px-2">Project: {msg.projectReference}</span>
                          )}
                          <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs whitespace-pre-wrap break-words ${
                            isCompany
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm'
                              : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                          }`}>
                            {msg.text}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 px-1">
                            <span>{formatTime(msg.createdAt)}</span>
                            {isCompany && (msg.read
                              ? <CheckCheck size={12} className="text-sky-500" />
                              : <Check size={12} className="text-gray-400" />)}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}

                {isTyping && (
                  <div className="flex items-start">
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-gray-100 shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick replies */}
              <div className="px-4 py-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
                <span className="text-[10px] font-bold uppercase text-gray-400 shrink-0">Quick Reply:</span>
                {QUICK_REPLIES.map((qr, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(qr)}
                    disabled={sending}
                    className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 text-[11px] font-medium transition shrink-0 border border-gray-200 disabled:opacity-50"
                  >
                    {qr}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-100 bg-white shrink-0">
                {error && <p className="text-[11px] text-rose-600 font-semibold mb-2 px-1">{error}</p>}
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type your message to this creator..."
                    value={newMessage}
                    maxLength={2000}
                    onChange={handleInputChange}
                    onBlur={() => emitTyping(false)}
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
