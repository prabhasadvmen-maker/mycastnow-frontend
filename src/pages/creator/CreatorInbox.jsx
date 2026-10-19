import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import useChatSocket from '../../hooks/useChatSocket';
import {
  MessageSquare, Send, Search, Building2, Check,
  CheckCheck, RefreshCw, ArrowLeft, WifiOff
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;
const FALLBACK_LOGO = 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=150&q=80';

const QUICK_REPLIES = [
  'Yes, I am available on these shoot dates! 🎬',
  'Sounds great! Please share the audition sides/script.',
  'Could you confirm the call-sheet and studio location?',
  'I have updated my portfolio measurements.',
  'Looking forward to working with your team!'
];

const sid = (v) => (v && typeof v === 'object' ? String(v._id || v.id) : String(v ?? ''));

const formatTime = (d) => (d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');

const dayLabel = (d) => {
  const date = new Date(d);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });
};

const listTime = (d) => {
  if (!d) return '';
  const date = new Date(d);
  return date.toDateString() === new Date().toDateString()
    ? formatTime(d)
    : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const CreatorInbox = () => {
  const [searchParams] = useSearchParams();
  const targetCompanyId = searchParams.get('companyId');
  const token = localStorage.getItem('creatorToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const [conversations, setConversations] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(targetCompanyId || null);
  const [messages, setMessages] = useState([]);
  const [activeCompany, setActiveCompany] = useState(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileChatOpen, setMobileChatOpen] = useState(!!targetCompanyId);
  const [onlineIds, setOnlineIds] = useState(() => new Set());
  const [typingFrom, setTypingFrom] = useState(null); // companyId that is typing
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);
  const selectedRef = useRef(selectedCompanyId);
  const typingTimerRef = useRef(null);
  const typingSentRef = useRef(false);
  selectedRef.current = selectedCompanyId;

  const scrollToBottom = (smooth = true) => {
    requestAnimationFrame(() => messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' }));
  };

  // ── Data loading ───────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/creator/portal/messages/conversations`, { headers });
      if (res.data?.success) {
        const convs = res.data.conversations || [];
        setConversations(convs);
        setSelectedCompanyId(prev => prev || (convs[0]?.companyId ?? null));
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchThread = useCallback(async (compId) => {
    if (!compId) return;
    setThreadLoading(true);
    try {
      const res = await axios.get(`${API}/creator/portal/messages/thread/${compId}`, { headers });
      if (res.data?.success && selectedRef.current === compId) {
        setMessages(res.data.messages || []);
        setActiveCompany(res.data.company || null);
        setConversations(prev => prev.map(c => (c.companyId === compId ? { ...c, unreadCount: 0 } : c)));
        scrollToBottom(false);
      }
    } catch (err) {
      console.error('Error fetching thread:', err);
    } finally {
      setThreadLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  useEffect(() => {
    setMessages([]);
    setActiveCompany(null);
    setTypingFrom(null);
    if (selectedCompanyId) fetchThread(selectedCompanyId);
  }, [selectedCompanyId, fetchThread]);

  useEffect(() => { scrollToBottom(); }, [messages.length, typingFrom]);

  // ── Real-time ──────────────────────────────────────────────
  const { socketRef, connected } = useChatSocket(token, {
    connect: () => {
      // Re-sync anything missed while offline, then ask who is online
      fetchConversations();
      if (selectedRef.current) fetchThread(selectedRef.current);
    },

    'message:new': (msg) => {
      const compId = sid(msg.company);
      const fromCompany = msg.senderType === 'Company';
      const isOpen = selectedRef.current === compId;

      if (isOpen) {
        setMessages(prev => (prev.some(m => sid(m) === sid(msg)) ? prev : [...prev, msg]));
        if (fromCompany) socketRef.current?.emit('messages:mark-read', { peerId: compId });
        setTypingFrom(null);
      }

      setConversations(prev => {
        const exists = prev.some(c => c.companyId === compId);
        if (!exists) { fetchConversations(); return prev; }
        const updated = prev.map(c => c.companyId === compId ? {
          ...c,
          lastMessage: { text: msg.text, senderType: msg.senderType, createdAt: msg.createdAt },
          totalMessages: (c.totalMessages || 0) + 1,
          unreadCount: fromCompany && !isOpen ? (c.unreadCount || 0) + 1 : c.unreadCount
        } : c);
        // newest conversation first
        return updated.sort((a, b) => new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0));
      });
    },

    // The company opened the chat: my messages are now "seen"
    'messages:read': ({ id }) => {
      if (sid(id) === selectedRef.current) {
        setMessages(prev => prev.map(m => (m.senderType === 'Creator' ? { ...m, read: true } : m)));
      }
    },

    typing: ({ id, typing }) => {
      setTypingFrom(prev => (typing ? sid(id) : prev === sid(id) ? null : prev));
    },

    presence: ({ role, id, online }) => {
      if (role !== 'company') return;
      setOnlineIds(prev => {
        const next = new Set(prev);
        online ? next.add(sid(id)) : next.delete(sid(id));
        return next;
      });
    }
  });

  // Ask server which of my companies are online whenever the list/connection changes
  useEffect(() => {
    const socket = socketRef.current;
    if (!connected || !socket) return;
    const ids = [...new Set([...conversations.map(c => c.companyId), selectedCompanyId].filter(Boolean))];
    if (ids.length === 0) return;
    socket.emit('presence:check', ids, (onlineList = []) => {
      setOnlineIds(prev => new Set([...prev, ...onlineList.map(String)]));
    });
  }, [connected, conversations.length, selectedCompanyId, socketRef]);

  // Mark as read when I open a thread (or it loads) while connected
  useEffect(() => {
    if (connected && selectedCompanyId && messages.some(m => m.senderType === 'Company' && !m.read)) {
      socketRef.current?.emit('messages:mark-read', { peerId: selectedCompanyId });
      setMessages(prev => prev.map(m => (m.senderType === 'Company' ? { ...m, read: true } : m)));
    }
  }, [connected, selectedCompanyId, messages.length, socketRef]);

  // Safety net: if the socket is down, poll slowly so chat still works
  useEffect(() => {
    if (connected) return undefined;
    const t = setInterval(() => {
      fetchConversations();
      if (selectedRef.current) fetchThread(selectedRef.current);
    }, 10000);
    return () => clearInterval(t);
  }, [connected, fetchConversations, fetchThread]);

  // ── Typing indicator (outgoing) ────────────────────────────
  const emitTyping = (typing) => {
    if (!selectedCompanyId || typingSentRef.current === typing) return;
    typingSentRef.current = typing;
    socketRef.current?.emit('typing', { to: selectedCompanyId, typing });
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    emitTyping(true);
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => emitTyping(false), 1800);
  };

  useEffect(() => () => clearTimeout(typingTimerRef.current), []);

  // ── Sending ────────────────────────────────────────────────
  const handleSendMessage = async (textToSend) => {
    const msg = (typeof textToSend === 'string' ? textToSend : inputText).trim();
    if (!msg || !selectedCompanyId || sending) return;

    setSending(true);
    setError('');
    emitTyping(false);
    clearTimeout(typingTimerRef.current);
    try {
      const res = await axios.post(`${API}/creator/portal/messages/send`, {
        companyId: selectedCompanyId,
        text: msg
      }, { headers });

      if (res.data?.success && res.data?.chatMessage) {
        const sent = res.data.chatMessage;
        setMessages(prev => (prev.some(m => sid(m) === sid(sent)) ? prev : [...prev, sent]));
        setInputText('');
        setConversations(prev => {
          const exists = prev.some(c => c.companyId === selectedCompanyId);
          if (!exists && activeCompany) {
            return [{
              companyId: selectedCompanyId,
              company: activeCompany,
              lastMessage: { text: sent.text, senderType: 'Creator', createdAt: sent.createdAt },
              unreadCount: 0,
              totalMessages: 1,
              projectReference: ''
            }, ...prev];
          }
          return prev.map(c => c.companyId === selectedCompanyId
            ? { ...c, lastMessage: { text: sent.text, senderType: 'Creator', createdAt: sent.createdAt } }
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
  const filteredConversations = conversations.filter(c =>
    c.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage?.text?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalUnread = conversations.reduce((n, c) => n + (c.unreadCount || 0), 0);
  const isCompanyOnline = selectedCompanyId && onlineIds.has(selectedCompanyId);
  const isTyping = typingFrom && typingFrom === selectedCompanyId;

  const openConversation = (companyId) => {
    setSelectedCompanyId(companyId);
    setMobileChatOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-12">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#0B2A4A] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-purple-800/30">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <MessageSquare size={24} className="text-fuchsia-400" />
            <span>Talent & Studio Messenger</span>
            {totalUnread > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-fuchsia-500 text-white text-xs font-bold">{totalUnread} new</span>
            )}
          </h1>
          <p className="text-purple-200 text-xs md:text-sm mt-1">
            Direct real-time communication between you and verified production houses.
          </p>
        </div>

        <div className={`flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-xl  border ${
          connected ? 'text-purple-200 bg-white/10 border-white/10' : 'text-amber-200 bg-amber-500/10 border-amber-400/30'
        }`}>
          {connected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live — messages arrive instantly</span>
            </>
          ) : (
            <>
              <WifiOff size={13} />
              <span>Reconnecting…</span>
            </>
          )}
        </div>
      </div>

      {/* MESSENGER MAIN SPLIT VIEW */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[640px]">
        {/* LEFT COLUMN: CONVERSATIONS */}
        <div className={`md:col-span-4 border-r border-gray-100 flex-col bg-gray-50/30 min-h-0 ${mobileChatOpen ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100 shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search studios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 min-h-0">
            {loading ? (
              <div className="p-8 text-center text-gray-400 text-xs flex flex-col items-center justify-center">
                <RefreshCw size={20} className="animate-spin text-purple-600 mb-2" />
                <span>Loading conversations...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs space-y-2">
                <Building2 size={24} className="mx-auto text-gray-300" />
                <p>No active conversations yet.</p>
                <p className="text-[11px] text-gray-400">
                  When a production house messages you or hires you, chats will appear here instantly. You can also message a studio from your Applications or Bookings.
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = selectedCompanyId === conv.companyId;
                const online = onlineIds.has(conv.companyId);
                return (
                  <button
                    key={conv.companyId}
                    onClick={() => openConversation(conv.companyId)}
                    className={`w-full text-left p-4 transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected ? 'bg-purple-50/70 border-l-4 border-purple-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.company?.logo || FALLBACK_LOGO}
                        alt={conv.company?.name}
                        className="w-11 h-11 rounded-2xl object-cover border border-gray-200"
                      />
                      {online && <span className="w-3 h-3 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white" />}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-black text-gray-900' : 'font-bold text-gray-900'}`}>
                          {conv.company?.name || 'Production House'}
                        </h4>
                        <span className="text-[10px] text-gray-400 shrink-0">{listTime(conv.lastMessage?.createdAt)}</span>
                      </div>

                      <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-gray-800 font-semibold' : 'text-gray-500 font-medium'}`}>
                        {typingFrom === conv.companyId
                          ? <span className="text-purple-600 italic">typing…</span>
                          : <>{conv.lastMessage?.senderType === 'Creator' ? 'You: ' : ''}{conv.lastMessage?.text || 'No messages yet'}</>}
                      </p>

                      {conv.projectReference && (
                        <span className="inline-block text-[10px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded">
                          {conv.projectReference}
                        </span>
                      )}
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="min-w-5 h-5 px-1 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CHAT THREAD */}
        <div className={`md:col-span-8 flex-col min-h-0 ${mobileChatOpen ? 'flex' : 'hidden md:flex'}`}>
          {selectedCompanyId ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setMobileChatOpen(false)}
                    className="md:hidden p-1.5 -ml-1 rounded-lg text-gray-500 hover:bg-gray-100"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <img
                    src={activeCompany?.logo || FALLBACK_LOGO}
                    alt={activeCompany?.name}
                    className="w-10 h-10 rounded-2xl object-cover border border-gray-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-sm text-gray-900 truncate">{activeCompany?.name || 'Production House'}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-700 shrink-0">Verified Studio</span>
                    </div>
                    <p className="text-[11px] text-gray-400 truncate">
                      {isTyping
                        ? <span className="text-purple-600 font-semibold">typing…</span>
                        : [activeCompany?.city, activeCompany?.email].filter(Boolean).join(' • ')}
                    </p>
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                  isCompanyOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCompanyOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                  {isCompanyOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-[#F8FAFC] min-h-0">
                {threadLoading && messages.length === 0 ? (
                  <div className="py-16 text-center text-gray-400 text-xs">
                    <RefreshCw size={20} className="animate-spin text-purple-600 mx-auto mb-2" />
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-16 text-center text-gray-400 space-y-2">
                    <MessageSquare size={32} className="mx-auto text-gray-300" />
                    <p className="text-xs">Start a conversation with the casting director.</p>
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isMe = m.senderType === 'Creator';
                    const showDay = idx === 0 || new Date(messages[idx - 1].createdAt).toDateString() !== new Date(m.createdAt).toDateString();
                    return (
                      <React.Fragment key={sid(m) || idx}>
                        {showDay && (
                          <div className="flex justify-center my-2">
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{dayLabel(m.createdAt)}</span>
                          </div>
                        )}
                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`max-w-[80%] md:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm whitespace-pre-wrap break-words ${
                              isMe ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                            }`}
                          >
                            {m.text}
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1 px-1 flex items-center gap-1">
                            {formatTime(m.createdAt)}
                            {isMe && (m.read
                              ? <CheckCheck size={12} className="text-sky-500" />
                              : <Check size={12} className="text-gray-400" />)}
                          </span>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}

                {isTyping && (
                  <div className="flex items-start">
                    <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-white border border-gray-100 shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick replies */}
              <div className="px-4 py-2 border-t border-gray-100 bg-white flex items-center gap-1.5 overflow-x-auto shrink-0">
                <span className="text-[10px] font-bold text-gray-400 shrink-0">Quick reply:</span>
                {QUICK_REPLIES.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(reply)}
                    disabled={sending}
                    className="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-medium shrink-0 transition cursor-pointer disabled:opacity-50"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                {error && <p className="text-[11px] text-rose-600 font-semibold mb-2">{error}</p>}
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Type your message to the studio director..."
                    value={inputText}
                    maxLength={2000}
                    onChange={handleInputChange}
                    onBlur={() => emitTyping(false)}
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputText.trim()}
                    className="p-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white shadow-md disabled:opacity-50 transition cursor-pointer"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400 space-y-2">
              <MessageSquare size={36} className="text-purple-200" />
              <h3 className="font-bold text-gray-700 text-sm">Select a Conversation</h3>
              <p className="text-xs max-w-xs">
                Pick a studio from the list on the left to discuss shoot requirements and confirm project dates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorInbox;
