import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import {
  MessageSquare, Send, Search, Building2, Check,
  CheckCheck, Sparkles, Clock, RefreshCw, AlertCircle,
  FileText, ExternalLink, UserCheck
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const QUICK_REPLIES = [
  'Yes, I am available on these shoot dates! 🎬',
  'Sounds great! Please share the audition sides/script.',
  'Could you confirm the call-sheet and studio location?',
  'I have updated my portfolio measurements.',
  'Looking forward to working with your team!'
];

const CreatorInbox = () => {
  const { creatorUser } = useCreatorAuth();
  const [searchParams] = useSearchParams();
  const targetCompanyId = searchParams.get('companyId');

  const [conversations, setConversations] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(targetCompanyId || null);
  const [messages, setMessages] = useState([]);
  const [activeCompany, setActiveCompany] = useState(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Fetch all conversations for Creator
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API}/creator/portal/messages/conversations`, { headers });
      if (res.data?.success) {
        const convs = res.data.conversations || [];
        setConversations(convs);

        // Auto select first conversation or targetCompanyId if none selected
        if (!selectedCompanyId && convs.length > 0) {
          setSelectedCompanyId(targetCompanyId || convs[0].companyId);
        } else if (targetCompanyId && !selectedCompanyId) {
          setSelectedCompanyId(targetCompanyId);
        }
      }
    } catch (err) {
      console.error('Error fetching creator conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch thread messages when selectedCompanyId changes
  const fetchThread = async (compId) => {
    if (!compId) return;
    try {
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API}/creator/portal/messages/thread/${compId}`, { headers });
      if (res.data?.success) {
        setMessages(res.data.messages || []);
        if (res.data.company) {
          setActiveCompany(res.data.company);
        }
        scrollToBottom();
      }
    } catch (err) {
      console.error('Error fetching thread:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [targetCompanyId]);

  useEffect(() => {
    if (selectedCompanyId) {
      fetchThread(selectedCompanyId);
    }
  }, [selectedCompanyId]);

  // Real-time synchronization poll every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedCompanyId) {
        fetchThread(selectedCompanyId);
      }
      fetchConversations();
    }, 3500);
    return () => clearInterval(interval);
  }, [selectedCompanyId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 3. Send Message
  const handleSendMessage = async (textToSend) => {
    const msg = textToSend || inputText;
    if (!msg.trim() || !selectedCompanyId) return;

    try {
      setSending(true);
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(`${API}/creator/portal/messages/send`, {
        companyId: selectedCompanyId,
        text: msg.trim()
      }, { headers });

      if (res.data?.success && res.data?.chatMessage) {
        setMessages(prev => [...prev, res.data.chatMessage]);
        setInputText('');
        scrollToBottom();
        fetchConversations();
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage?.text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-12">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#180a22] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-purple-800/30">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <MessageSquare size={24} className="text-fuchsia-400" />
            <span>Talent & Studio Messenger</span>
          </h1>
          <p className="text-purple-200 text-xs md:text-sm mt-1">
            Direct real-time communication between you and verified production houses.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-purple-200 bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Live Chat Synchronization Active</span>
        </div>
      </div>

      {/* MESSENGER MAIN SPLIT VIEW */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
        {/* LEFT COLUMN: CONVERSATIONS (4 cols) */}
        <div className="md:col-span-4 border-r border-gray-100 flex flex-col bg-gray-50/30">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search studios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
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
                  When a production house hires you or replies to your casting application, chats will appear here.
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = selectedCompanyId === conv.companyId;
                return (
                  <button
                    key={conv.companyId}
                    onClick={() => setSelectedCompanyId(conv.companyId)}
                    className={`w-full text-left p-4 transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-purple-50/70 border-l-4 border-purple-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={
                        conv.company?.logo ||
                        'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={conv.company?.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-gray-200 shrink-0"
                    />

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-gray-900 truncate">
                          {conv.company?.name || 'Production House'}
                        </h4>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {conv.lastMessage?.createdAt
                            ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : ''}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 truncate font-medium">
                        {conv.lastMessage?.senderType === 'Creator' ? 'You: ' : ''}
                        {conv.lastMessage?.text || 'No messages yet'}
                      </p>

                      {conv.projectReference && (
                        <span className="inline-block text-[10px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded">
                          {conv.projectReference}
                        </span>
                      )}
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CHAT THREAD (8 cols) */}
        <div className="md:col-span-8 flex flex-col h-[620px]">
          {selectedCompanyId ? (
            <>
              {/* Top Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      activeCompany?.logo ||
                      'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=150&q=80'
                    }
                    alt={activeCompany?.name}
                    className="w-10 h-10 rounded-2xl object-cover border border-gray-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-sm text-gray-900">
                        {activeCompany?.name || 'Advmen Technologies'}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-700">
                        Verified Studio
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      {activeCompany?.city || 'Mumbai'} • {activeCompany?.email || 'casting@production.com'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-[#fbfbfe]">
                {messages.length === 0 ? (
                  <div className="py-16 text-center text-gray-400 space-y-2">
                    <MessageSquare size={32} className="mx-auto text-gray-300" />
                    <p className="text-xs">Start a conversation with the casting director.</p>
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isMe = m.senderType === 'Creator';
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                            isMe
                              ? 'bg-purple-600 text-white rounded-br-none'
                              : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                          }`}
                        >
                          <p>{m.text}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-1 flex items-center gap-1">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMe && <CheckCheck size={11} className="text-purple-400" />}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Chips */}
              <div className="px-4 py-2 border-t border-gray-100 bg-white flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
                <span className="text-[10px] font-bold text-gray-400 shrink-0">Quick reply:</span>
                {QUICK_REPLIES.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(reply)}
                    className="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-medium shrink-0 transition cursor-pointer"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Message Input Bar */}
              <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Type your message to the studio director..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
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
