import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, Sparkles, Film, Star, User, ShieldCheck, ArrowRight, X, Clapperboard, Eye, MapPin, ChevronRight, BadgeCheck } from 'lucide-react';
import PublicLayout from '../../components/public/PublicLayout';

const FEATURED_REELS = [
  {
    id: 'reel-1',
    title: 'Dramatic Monologue & Emotional Audition',
    artistName: 'Aarav Malhotra',
    category: 'Acting Reel',
    role: 'Lead Drama Actor',
    city: 'Mumbai',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    verified: true,
    views: '12.4K'
  },
  {
    id: 'reel-2',
    title: 'High Fashion Runway Walk & Print Reel',
    artistName: 'Rhea Sharma',
    category: 'Modeling Walk',
    role: 'Fashion Model',
    city: 'Delhi',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
    rating: 5.0,
    verified: true,
    views: '18.9K'
  },
  {
    id: 'reel-3',
    title: 'Bollywood & Contemporary Dance Routine',
    artistName: 'Kabir & Choreographers',
    category: 'Dance Audition',
    role: 'Lead Dancer',
    city: 'Mumbai',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    verified: true,
    views: '9.2K'
  },
  {
    id: 'reel-4',
    title: 'Hindi Voice Over & Dubbing Demo',
    artistName: 'Priya Nambiar',
    category: 'Voice Over',
    role: 'Voice Artist',
    city: 'Bangalore',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    verified: true,
    views: '15.1K'
  },
  {
    id: 'reel-5',
    title: 'Action Stunt & Combat Audition Reel',
    artistName: 'Vikram Singh',
    category: 'Acting Reel',
    role: 'Action & Stunt Actor',
    city: 'Mumbai',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    verified: true,
    views: '22.3K'
  },
  {
    id: 'reel-6',
    title: 'Commercial Brand Campaign Shoot',
    artistName: 'Ananya Roy',
    category: 'Modeling Walk',
    role: 'Commercial Model',
    city: 'Kolkata',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
    rating: 4.7,
    verified: true,
    views: '11.8K'
  },
  {
    id: 'reel-7',
    title: 'Classical Kathak Performance Reel',
    artistName: 'Meera Iyer',
    category: 'Dance Audition',
    role: 'Kathak Dancer',
    city: 'Chennai',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
    rating: 5.0,
    verified: true,
    views: '14.6K'
  },
  {
    id: 'reel-8',
    title: 'Radio Jockey & English VO Audition',
    artistName: 'Rohan Mehta',
    category: 'Voice Over',
    role: 'RJ & Voice Artist',
    city: 'Pune',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    verified: true,
    views: '8.7K'
  }
];

const REEL_CATEGORIES = ['All Reels', 'Acting Reel', 'Modeling Walk', 'Dance Audition', 'Voice Over'];

export default function WatchReelPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Reels');
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  const filteredReels = selectedCategory === 'All Reels'
    ? FEATURED_REELS
    : FEATURED_REELS.filter(r => r.category === selectedCategory);

  return (
    <PublicLayout>
      {/* ────────────────── HERO BANNER ────────────────── */}
      <section className="bg-slate-950 text-white py-16 md:py-20 border-b border-slate-800/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-950 pointer-events-none"></div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-xs font-bold text-purple-300 mb-6 backdrop-blur-md">
            <Play size={14} className="fill-purple-300 text-purple-300 animate-pulse" />
            <span>HD ARTIST SHOWREELS & AUDITION VIDEOS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Watch Live <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-300">Audition Showreels</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Explore monologue performances, high-fashion walks, dance choreography & voice samples from India's top verified talent.
          </p>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap mt-10">
            {REEL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                    : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── 4x4 NEAT & CLEAN VIDEO GRID ────────────────── */}
      <section className="py-12 md:py-16 bg-slate-950 min-h-screen text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
            <p className="text-xs sm:text-sm font-bold text-slate-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Showing <span className="text-white font-extrabold">{filteredReels.length}</span> Showreels & Audition Videos
            </p>
            <span className="text-xs text-purple-400 font-bold bg-purple-950/60 border border-purple-800/60 px-3 py-1 rounded-full">
              4 Column Grid View
            </span>
          </div>

          {/* 4-COLUMN GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredReels.map((reel) => (
              <div
                key={reel.id}
                className="bg-slate-900/90 rounded-3xl border border-slate-800/90 overflow-hidden hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-900/20 transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Thumbnail Header */}
                <div
                  className="relative aspect-[4/3] bg-black overflow-hidden cursor-pointer"
                  onClick={() => setActiveVideoModal(reel)}
                >
                  <img
                    src={reel.thumbnail}
                    alt={reel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                  
                  {/* Hover Play Icon Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-purple-600/95 text-white flex items-center justify-center shadow-xl shadow-purple-600/50 group-hover:scale-110 group-hover:bg-purple-500 transition-all cursor-pointer ring-4 ring-white/20">
                      <Play size={24} className="fill-white translate-x-0.5" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-[10px] font-extrabold uppercase tracking-wide">
                      {reel.category}
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 text-purple-300 text-[10px] font-bold backdrop-blur-md border border-purple-800/50">
                      <Eye size={11} /> {reel.views}
                    </span>
                  </div>
                </div>

                {/* Neat & Clean Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                      {reel.title}
                    </h3>
                    
                    {/* Artist Chip */}
                    <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-slate-800/80">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 text-white ring-2 ring-slate-800">
                        {reel.artistName[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-200 truncate flex items-center gap-1">
                          <span>{reel.artistName}</span>
                          {reel.verified && <BadgeCheck size={13} className="text-emerald-400 shrink-0" />}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate font-medium">{reel.role} • {reel.city}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <span className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                      <Star size={12} className="fill-amber-400" /> {reel.rating}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveVideoModal(reel)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-[11px] font-bold transition-all border border-purple-700/50 hover:border-purple-600 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Watch Reel</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── VIDEO MODAL ────────────────── */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-800 shadow-2xl overflow-hidden relative my-auto">
            {/* Modal Top Bar */}
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600/30 text-purple-400 flex items-center justify-center">
                  <Clapperboard size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">{activeVideoModal.title}</h3>
                  <p className="text-[11px] text-purple-300">{activeVideoModal.artistName} • {activeVideoModal.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video bg-black relative">
              <video
                src={activeVideoModal.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
