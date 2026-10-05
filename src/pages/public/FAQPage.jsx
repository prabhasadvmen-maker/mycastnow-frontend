import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Search, ChevronDown, Sparkles, MessageSquare, ShieldCheck, CreditCard, User, Building2 } from 'lucide-react';
import PublicLayout from '../../components/public/PublicLayout';

const FAQS = [
  {
    category: 'General',
    q: 'What is MyCastNow and how does it work?',
    a: 'MyCastNow is India\'s premier entertainment casting & talent marketplace connecting verified actors, models, dancers, and voice artists directly with production houses, OTT networks, and ad agencies. No middlemen commissions.'
  },
  {
    category: 'For Artists',
    q: 'Is creating an Artist profile free?',
    a: 'Yes! Artists can register for free and apply to up to 5 open casting calls per month. For unlimited auditions, WhatsApp alerts & blue checkmark verification, you can upgrade to Creator Spotlight Pro.'
  },
  {
    category: 'For Artists',
    q: 'How do I receive payments for bookings?',
    a: 'All project payments are secured in 100% platform Escrow before shooting begins. Once the shoot or project deliverable is completed, funds are transferred directly to your registered bank account.'
  },
  {
    category: 'For Productions',
    q: 'How are production houses verified on MyCastNow?',
    a: 'Our trust & verification team verifies corporate filings, company registration, and past production history before awarding the verified production house blue checkmark.'
  },
  {
    category: 'Payments & Escrow',
    q: 'What is 100% Escrow Payment Protection?',
    a: 'Platform Escrow ensures production houses deposit the full project fee upfront into a safe account. Funds are released to the artist only after the project work is completed as per contract terms.'
  },
  {
    category: 'Safety & Verification',
    q: 'How do I avoid fake casting calls?',
    a: 'Never pay money or share OTPs for any audition. All legitimate casting calls on MyCastNow have verified company badges, transparent budgets, and zero upfront registration fees.'
  }
];

const CATEGORIES = ['All', 'General', 'For Artists', 'For Productions', 'Payments & Escrow', 'Safety & Verification'];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const filteredFaqs = FAQS.filter((f) => {
    const matchCat = selectedCategory === 'All' || f.category === selectedCategory;
    const matchQuery = !searchQuery || f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <PublicLayout>
      {/* ────────────────── HERO BANNER ────────────────── */}
      <section className="bg-slate-950 text-white py-16 md:py-24 text-center relative overflow-hidden border-b border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-xs font-bold text-purple-300 mb-6">
            <HelpCircle size={14} className="text-purple-300" />
            <span>KNOWLEDGEBASE & FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
            Got Questions? We Have <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-300">Answers</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Find everything you need to know about audition submissions, platform escrow, artist subscriptions, and verification.
          </p>

          {/* Search Input */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs sm:text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </section>

      {/* ────────────────── FAQ ACCORDION LIST ────────────────── */}
      <section className="py-16 bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-10 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-purple-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-purple-50/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Card */}
          <div className="mt-16 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-8 text-white text-center shadow-xl">
            <h3 className="text-xl font-black">Still Have Questions?</h3>
            <p className="text-xs text-purple-200 mt-2">Our support desk is available to assist artists and production teams 24/7.</p>
            <Link
              to="/support"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all shadow-md"
            >
              <MessageSquare size={16} /> Contact Support Helpdesk
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
