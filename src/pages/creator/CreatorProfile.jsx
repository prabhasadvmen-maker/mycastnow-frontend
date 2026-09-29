import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import {
  User, Mail, Phone, MapPin, Calendar, Camera,
  Save, CheckCircle2, ShieldCheck, Sparkles, AlertCircle,
  Eye, Edit3, Globe, Share2, Download, Printer, Video,
  Check, RefreshCw, ExternalLink, Star, Layers, Award,
  Heart, Zap, Info, ChevronRight, Play, Plus, Trash2
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const InstagramIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const CreatorProfile = () => {
  const { creatorUser, updateProfile } = useCreatorAuth();
  const [searchParams] = useSearchParams();

  // Active Tab: 'view' | 'edit' | 'compcard' | 'reels'
  const [activeTab, setActiveTab] = useState(() => {
    const tab = new URLSearchParams(window.location.search).get('tab');
    return tab && ['view', 'edit', 'compcard', 'reels'].includes(tab) ? tab : 'view';
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['view', 'edit', 'compcard', 'reels'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Form State
  const [form, setForm] = useState({
    // Basic Details
    fullName: '',
    email: '',
    phone: '',
    profilePhoto: '',
    dob: '',
    gender: 'Male',
    city: 'Mumbai',
    serviceArea: 'Pan-India',
    bio: '',
    languages: 'English, Hindi',

    // Professional Details
    primaryCategory: 'Model',
    subCategory: 'Fashion & Runway',
    skills: 'Runway Walk, Method Acting, Editorial Posing, Voiceover',
    experience: '3+ Years',
    previousProjects: 'Lakme Fashion Week, Amazon Brand Shoot, Netflix Web Series',
    previousBrands: 'Zara, FabIndia, Tanishq, Boat',

    // Physical Details
    height: '5\'11" (180 cm)',
    weight: '68 kg',
    chest: '38 inches',
    waist: '30 inches',
    hips: '36 inches',
    eyeColor: 'Dark Brown',
    hairColor: 'Black',
    shoeSize: '9 UK / 43 EU',
    complexion: 'Wheatish',

    // Rates & Availability
    status: 'Available',
    dayRate: '15000',
    hourlyRate: '2500',
    projectRate: '45000',

    // Social Links
    instagram: '',
    linkedin: '',
    youtube: '',
    imdb: '',
    website: '',

    // Showreels / Self-tapes
    videos: [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    ]
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // Populate data from creatorUser
  useEffect(() => {
    if (creatorUser) {
      const b = creatorUser.basicDetails || {};
      const p = creatorUser.professionalDetails || {};
      const ph = creatorUser.physicalDetails || {};
      const pr = creatorUser.pricing || {};
      const av = creatorUser.availability || {};
      const soc = creatorUser.socialLinks || {};
      const port = creatorUser.portfolio || {};

      setForm({
        fullName: b.fullName || 'Arvind Kumar',
        email: creatorUser.email || 'arvind.model@gmail.com',
        phone: creatorUser.phone || '7599847194',
        profilePhoto: b.profilePhoto || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
        dob: b.dob ? new Date(b.dob).toISOString().split('T')[0] : '1998-05-14',
        gender: b.gender || 'Male',
        city: b.city || 'Mumbai',
        serviceArea: Array.isArray(b.serviceArea) ? b.serviceArea.join(', ') : (b.serviceArea || 'Mumbai, Delhi NCR, Bangalore'),
        bio: b.bio || 'High-fashion editorial and ramp model based in Mumbai. Experienced in ethnic wear, western formals, luxury campaigns and OTT series.',
        languages: Array.isArray(b.languages) ? b.languages.join(', ') : (b.languages || 'English, Hindi, Punjabi'),

        primaryCategory: p.primaryCategory || 'Model',
        subCategory: p.subCategory || 'Ramp & Commercial Print',
        skills: Array.isArray(p.skills) ? p.skills.join(', ') : (p.skills || 'Ramp Walk, High-Fashion Posing, Dialogue Delivery, Swimming'),
        experience: p.experience || '4+ Years',
        previousProjects: Array.isArray(p.previousProjects) ? p.previousProjects.join(', ') : (p.previousProjects || 'Lakme Fashion Week 2025, Myntra Big Fashion Festival, Manyavar Campaign'),
        previousBrands: Array.isArray(p.previousBrands) ? p.previousBrands.join(', ') : (p.previousBrands || 'Raymond, Manyavar, Wrogn, Titan'),

        height: ph.height || '6\'0" (183 cm)',
        weight: ph.weight || '72 kg',
        chest: ph.chest || '40 inches',
        waist: ph.waist || '31 inches',
        hips: ph.hips || '37 inches',
        eyeColor: ph.eyeColor || 'Dark Brown',
        hairColor: ph.hairColor || 'Natural Black',
        shoeSize: ph.shoeSize || '10 UK',
        complexion: ph.complexion || 'Dusk / Wheatish',

        status: av.status || 'Available',
        dayRate: pr.dayRate ? String(pr.dayRate) : '18000',
        hourlyRate: pr.hourlyRate ? String(pr.hourlyRate) : '3000',
        projectRate: pr.projectRate ? String(pr.projectRate) : '50000',

        instagram: soc.instagram || 'https://instagram.com/arvind_kumar_official',
        linkedin: soc.linkedin || '',
        youtube: soc.youtube || 'https://youtube.com/@arvindkumar_model',
        imdb: soc.imdb || '',
        website: soc.website || 'https://arvindkumar.portfolio.io',

        videos: port.videos && port.videos.length > 0 ? port.videos : [
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        ]
      });
    }
  }, [creatorUser]);

  // Profile Completeness calculation
  const calculateCompleteness = () => {
    let score = 20; // default for approved phone
    if (form.fullName) score += 10;
    if (form.email) score += 10;
    if (form.bio && form.bio.length > 20) score += 15;
    if (form.profilePhoto) score += 15;
    if (form.height && form.chest) score += 15;
    if (form.skills) score += 10;
    if (form.instagram || form.youtube) score += 5;
    return Math.min(score, 100);
  };

  const completeness = calculateCompleteness();

  // Save changes to database
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const updatePayload = {
        email: form.email,
        basicDetails: {
          fullName: form.fullName,
          profilePhoto: form.profilePhoto,
          dob: form.dob ? new Date(form.dob) : undefined,
          gender: form.gender,
          city: form.city,
          serviceArea: form.serviceArea.split(',').map(s => s.trim()).filter(Boolean),
          bio: form.bio,
          languages: form.languages.split(',').map(s => s.trim()).filter(Boolean)
        },
        professionalDetails: {
          primaryCategory: form.primaryCategory,
          subCategory: form.subCategory,
          skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
          experience: form.experience,
          previousProjects: form.previousProjects.split(',').map(s => s.trim()).filter(Boolean),
          previousBrands: form.previousBrands.split(',').map(s => s.trim()).filter(Boolean)
        },
        physicalDetails: {
          height: form.height,
          weight: form.weight,
          chest: form.chest,
          waist: form.waist,
          hips: form.hips,
          eyeColor: form.eyeColor,
          hairColor: form.hairColor,
          shoeSize: form.shoeSize,
          complexion: form.complexion
        },
        pricing: {
          hourlyRate: Number(form.hourlyRate) || 0,
          dayRate: Number(form.dayRate) || 0,
          projectRate: Number(form.projectRate) || 0
        },
        availability: {
          status: form.status
        },
        socialLinks: {
          instagram: form.instagram,
          linkedin: form.linkedin,
          youtube: form.youtube,
          imdb: form.imdb,
          website: form.website
        },
        portfolio: {
          ...(creatorUser?.portfolio || {}),
          videos: form.videos
        }
      };

      await updateProfile(updatePayload);
      setToast('Talent profile successfully updated and live in director search!');
      setTimeout(() => setToast(null), 4000);
      setActiveTab('view');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setToast('Failed to save profile. Please check connection.');
      setTimeout(() => setToast(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyProfile = () => {
    navigator.clipboard.writeText(`${window.location.origin}/talent/${creatorUser?._id || 'arvind-kumar'}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddVideo = () => {
    if (!newVideoUrl.trim()) return;
    setForm(prev => ({
      ...prev,
      videos: [...prev.videos, newVideoUrl.trim()]
    }));
    setNewVideoUrl('');
  };

  const handleRemoveVideo = (index) => {
    setForm(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Toast alert */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-gray-900 text-white text-xs font-bold flex items-center gap-3 shadow-2xl border border-gray-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#170529] via-[#2a0e44] to-[#0c0926] p-6 md:p-8 text-white shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-[1] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-blue-600 p-1 shadow-lg shrink-0">
              <img
                src={form.profilePhoto || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"}
                alt={form.fullName}
                className="w-full h-full object-cover rounded-xl"
              />
              <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md" title="Verified Talent">
                <ShieldCheck size={16} />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-black">{form.fullName || 'Talent Profile'}</h1>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                  {form.primaryCategory}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {form.status}
                </span>
              </div>
              <p className="text-xs text-gray-300 max-w-xl line-clamp-2">
                {form.bio || 'Professional talent profile on MyCastNow.'}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-2 font-medium">
                <span className="flex items-center gap-1"><MapPin size={13} className="text-fuchsia-400" /> {form.city}</span>
                <span className="flex items-center gap-1"><Award size={13} className="text-amber-400" /> {form.experience}</span>
                <span className="flex items-center gap-1"><Zap size={13} className="text-blue-400" /> Day Rate: ₹{Number(form.dayRate).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyProfile}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition flex items-center gap-2 cursor-pointer border border-white/10"
            >
              <Share2 size={14} />
              {copiedLink ? 'Link Copied!' : 'Share Profile'}
            </button>

            <button
              onClick={() => setActiveTab(activeTab === 'edit' ? 'view' : 'edit')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-fuchsia-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              {activeTab === 'edit' ? <Eye size={15} /> : <Edit3 size={15} />}
              {activeTab === 'edit' ? 'Preview Profile' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Profile Completeness Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-fuchsia-400 border border-white/10">
              {completeness}%
            </div>
            <div>
              <p className="font-bold text-gray-200">Casting Readiness Score</p>
              <p className="text-[11px] text-gray-400">Profiles above 85% receive 3.5x more audition calls from directors.</p>
            </div>
          </div>

          <div className="w-full sm:w-48 bg-white/10 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-fuchsia-500 to-emerald-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${completeness}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1">
        {[
          { id: 'view', label: 'Talent Card & Overview', icon: Eye },
          { id: 'edit', label: 'Edit Full Profile', icon: Edit3 },
          { id: 'compcard', label: 'Digital Comp Card (Sedcard)', icon: Sparkles },
          { id: 'reels', label: 'Showreels & Audition Tapes', icon: Video },
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
      {/* TAB 1: VIEW PROFILE OVERVIEW                                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'view' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {/* Left Column: Stats & Physical Measurements */}
          <div className="space-y-6">
            {/* Physical Attributes Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <User size={16} className="text-fuchsia-600" /> Physical Measurements
                </h3>
                <span className="text-[11px] font-semibold text-gray-400">Model Stats</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Height</span>
                  <span className="font-bold text-gray-800 text-sm mt-0.5 block">{form.height || 'N/A'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Weight</span>
                  <span className="font-bold text-gray-800 text-sm mt-0.5 block">{form.weight || 'N/A'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Chest / Bust</span>
                  <span className="font-bold text-gray-800 text-sm mt-0.5 block">{form.chest || 'N/A'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Waist</span>
                  <span className="font-bold text-gray-800 text-sm mt-0.5 block">{form.waist || 'N/A'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Hips</span>
                  <span className="font-bold text-gray-800 text-sm mt-0.5 block">{form.hips || 'N/A'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Shoe Size</span>
                  <span className="font-bold text-gray-800 text-sm mt-0.5 block">{form.shoeSize || 'N/A'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Eye Color</span>
                  <span className="font-bold text-gray-800 text-sm mt-0.5 block">{form.eyeColor || 'N/A'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Complexion</span>
                  <span className="font-bold text-gray-800 text-sm mt-0.5 block">{form.complexion || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Rates & Direct Contact Info */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
                <Zap size={16} className="text-amber-500" /> Commercial Rates & Booking
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
                  <div>
                    <span className="text-[11px] font-bold text-purple-700 uppercase">Day Rate (8 Hours)</span>
                    <p className="text-base font-extrabold text-gray-900 mt-0.5">₹{Number(form.dayRate).toLocaleString('en-IN')}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-200/60 text-purple-800 text-[10px] font-bold">Standard</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase">Hourly Rate</span>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">₹{Number(form.hourlyRate).toLocaleString('en-IN')}</p>
                  </div>
                  <span className="text-xs text-gray-400">Min 3 Hours</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase">Campaign / Project</span>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">₹{Number(form.projectRate).toLocaleString('en-IN')}</p>
                  </div>
                  <span className="text-xs text-gray-400">Custom Scope</span>
                </div>
              </div>
            </div>

            {/* Social & External Profiles */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                <Globe size={16} className="text-blue-500" /> Social Links & Portfolios
              </h3>

              <div className="space-y-2 text-xs">
                {form.instagram && (
                  <a
                    href={form.instagram.startsWith('http') ? form.instagram : `https://${form.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-fuchsia-50 text-gray-700 hover:text-fuchsia-600 transition"
                  >
                    <span className="flex items-center gap-2 font-semibold">
                      <InstagramIcon className="text-fuchsia-600" /> Instagram
                    </span>
                    <ExternalLink size={14} className="text-gray-400" />
                  </a>
                )}

                {form.youtube && (
                  <a
                    href={form.youtube.startsWith('http') ? form.youtube : `https://${form.youtube}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition"
                  >
                    <span className="flex items-center gap-2 font-semibold">
                      <YoutubeIcon className="text-red-600" /> YouTube Reel
                    </span>
                    <ExternalLink size={14} className="text-gray-400" />
                  </a>
                )}

                {form.website && (
                  <a
                    href={form.website.startsWith('http') ? form.website : `https://${form.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition"
                  >
                    <span className="flex items-center gap-2 font-semibold">
                      <Globe size={15} className="text-blue-600" /> Official Website
                    </span>
                    <ExternalLink size={14} className="text-gray-400" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Center & Right Column: Experience, Bio, Skills, Portfolio */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio & Intro */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Info size={16} className="text-purple-600" /> Professional Bio & Artistic Profile
              </h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-normal">
                {form.bio}
              </p>

              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                <span className="text-xs font-bold text-gray-700 mr-2 self-center">Languages:</span>
                {form.languages.split(',').map((lang, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    {lang.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills & Talents */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Sparkles size={16} className="text-fuchsia-600" /> Verified Skills & Casting Tags
              </h3>

              <div className="flex flex-wrap gap-2">
                {form.skills.split(',').map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-100"
                  >
                    ✦ {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Work Campaigns & Past Projects */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Award size={16} className="text-amber-500" /> Brand Campaigns & Notable Projects
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold text-purple-700 uppercase">Selected Projects</span>
                  <p className="text-xs text-gray-700 font-medium mt-1 leading-relaxed">{form.previousProjects}</p>
                </div>

                <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold text-blue-700 uppercase">Brands Endorsed / Shot For</span>
                  <p className="text-xs text-gray-700 font-medium mt-1 leading-relaxed">{form.previousBrands}</p>
                </div>
              </div>
            </div>

            {/* Featured Audition Self-Tapes */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Video size={16} className="text-red-500" /> Audition Self-Tapes & Demo Reels
                </h3>
                <button
                  onClick={() => setActiveTab('reels')}
                  className="text-xs text-fuchsia-600 font-bold hover:underline cursor-pointer"
                >
                  Manage Videos ({form.videos.length})
                </button>
              </div>

              {form.videos.length > 0 ? (
                <div className="space-y-2">
                  {form.videos.slice(0, 2).map((vid, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                          <Play size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate">Audition Reel #{idx + 1}</p>
                          <p className="text-[11px] text-gray-400 truncate">{vid}</p>
                        </div>
                      </div>
                      <a
                        href={vid}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs transition shrink-0"
                      >
                        Watch
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No audition reels uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: EDIT FULL PROFILE                                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'edit' && (
        <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-300">
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
              <User size={16} className="text-fuchsia-600" /> Basic Artist Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Legal / Stage Name *</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Verified Mobile (Primary)</label>
                <input
                  type="text"
                  disabled
                  value={form.phone}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Profile Photo / Headshot URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={form.profilePhoto}
                  onChange={(e) => setForm({ ...form, profilePhoto: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Base City (Primary Market)</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Service & Travel Area</label>
                <input
                  type="text"
                  placeholder="Mumbai, Delhi NCR, Pan-India"
                  value={form.serviceArea}
                  onChange={(e) => setForm({ ...form, serviceArea: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Languages Spoken (comma separated)</label>
                <input
                  type="text"
                  placeholder="English, Hindi, Marathi"
                  value={form.languages}
                  onChange={(e) => setForm({ ...form, languages: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block font-bold text-gray-700 mb-1">Professional Casting Bio</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell casting directors about your acting/modeling style, special talents, training and standout campaigns..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Professional & Casting Categories */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
              <Award size={16} className="text-purple-600" /> Professional Discipline & Casting Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Primary Discipline / Category</label>
                <select
                  value={form.primaryCategory}
                  onChange={(e) => setForm({ ...form, primaryCategory: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                >
                  <option value="Model">Model (Ramp / Print / Commercial)</option>
                  <option value="Actor">Actor (Screen / Theatre / OTT)</option>
                  <option value="Voice Artist">Voice Artist / Dubbing</option>
                  <option value="Dancer">Dancer / Choreographer</option>
                  <option value="Influencer">Influencer / Content Creator</option>
                  <option value="Stylist">Fashion Stylist</option>
                  <option value="Singer">Singer / Musician</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Sub-Category</label>
                <input
                  type="text"
                  placeholder="e.g. Ramp Model, Method Acting"
                  value={form.subCategory}
                  onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Total Experience</label>
                <input
                  type="text"
                  placeholder="e.g. 3+ Years"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block font-bold text-gray-700 mb-1">Special Skills & Talents (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Runway Walk, Stunt Acting, Horse Riding, Martial Arts, Classical Dance"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block font-bold text-gray-700 mb-1">Notable Projects & Past Campaigns</label>
                <input
                  type="text"
                  placeholder="e.g. Lakme Fashion Week, Amazon Ad, Netflix OTT series"
                  value={form.previousProjects}
                  onChange={(e) => setForm({ ...form, previousProjects: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Physical Measurements */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
              <User size={16} className="text-amber-500" /> Physical Measurements (For Casting Fit)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Height</label>
                <input
                  type="text"
                  placeholder="5 ft 11 in (180 cm)"
                  value={form.height}
                  onChange={(e) => setForm({ ...form, height: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Weight</label>
                <input
                  type="text"
                  placeholder="68 kg"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Chest / Bust</label>
                <input
                  type="text"
                  placeholder="38 inches"
                  value={form.chest}
                  onChange={(e) => setForm({ ...form, chest: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Waist</label>
                <input
                  type="text"
                  placeholder="30 inches"
                  value={form.waist}
                  onChange={(e) => setForm({ ...form, waist: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Hips</label>
                <input
                  type="text"
                  placeholder="36 inches"
                  value={form.hips}
                  onChange={(e) => setForm({ ...form, hips: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Shoe Size</label>
                <input
                  type="text"
                  placeholder="9 UK / 43 EU"
                  value={form.shoeSize}
                  onChange={(e) => setForm({ ...form, shoeSize: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Eye Color</label>
                <input
                  type="text"
                  placeholder="Dark Brown / Hazel"
                  value={form.eyeColor}
                  onChange={(e) => setForm({ ...form, eyeColor: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Complexion</label>
                <input
                  type="text"
                  placeholder="Fair, Wheatish, Dusk"
                  value={form.complexion}
                  onChange={(e) => setForm({ ...form, complexion: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Rates & Booking */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
              <Zap size={16} className="text-emerald-500" /> Commercial Rates & Availability Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Current Availability</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                >
                  <option value="Available">Available for Shoots</option>
                  <option value="Busy">Busy (Limited Dates)</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Day Rate (₹)</label>
                <input
                  type="number"
                  placeholder="15000"
                  value={form.dayRate}
                  onChange={(e) => setForm({ ...form, dayRate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Hourly Rate (₹)</label>
                <input
                  type="number"
                  placeholder="2500"
                  value={form.hourlyRate}
                  onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Project Rate (₹)</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={form.projectRate}
                  onChange={(e) => setForm({ ...form, projectRate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Social Profiles */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
              <Globe size={16} className="text-blue-500" /> Social Links & Portfolios
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Instagram URL</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/username"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">YouTube Channel / Reel</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/@username"
                  value={form.youtube}
                  onChange={(e) => setForm({ ...form, youtube: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Website / Linktree</label>
                <input
                  type="url"
                  placeholder="https://mywebsite.com"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-lg flex items-center justify-between sticky bottom-4 z-20">
            <button
              type="button"
              onClick={() => setActiveTab('view')}
              className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-fuchsia-600/30 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw size={15} className="animate-spin" /> Saving to Database...
                </>
              ) : (
                <>
                  <Save size={15} /> Save & Publish Profile
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 3: DIGITAL COMP CARD (SEDCARD)                               */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'compcard' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-purple-50 p-5 rounded-3xl border border-purple-100">
            <div>
              <h3 className="font-extrabold text-sm text-purple-950 flex items-center gap-2">
                <Sparkles size={16} className="text-purple-600" /> Digital Casting Comp Card (Sedcard)
              </h3>
              <p className="text-xs text-purple-700 mt-0.5">
                Standard 4-up digital composite card for modeling agencies, casting directors, and international scouts.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Printer size={15} /> Print / Save PDF
              </button>

              <button
                onClick={handleCopyProfile}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs border border-gray-200 shadow-sm transition flex items-center gap-2 cursor-pointer"
              >
                <Share2 size={15} /> Share Digital Sedcard
              </button>
            </div>
          </div>

          {/* Physical Comp Card Preview */}
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border-2 border-gray-900 shadow-2xl space-y-6 print:border-none print:shadow-none">
            {/* Header info */}
            <div className="flex items-end justify-between border-b-2 border-gray-900 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400">MyCastNow Official Talent Sedcard</span>
                <h2 className="text-3xl font-black uppercase text-gray-900 tracking-wide mt-1">{form.fullName}</h2>
                <p className="text-xs font-bold text-fuchsia-600 uppercase tracking-widest mt-0.5">{form.primaryCategory} • {form.city}</p>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-full bg-gray-900 text-white font-extrabold text-[11px] tracking-wider uppercase">
                  Verified Talent
                </span>
                <p className="text-[10px] text-gray-500 mt-1 font-mono">{form.phone}</p>
              </div>
            </div>

            {/* 4-Up Photo Grid */}
            <div className="grid grid-cols-3 gap-3">
              {/* Primary Headshot (2 Cols) */}
              <div className="col-span-2 h-96 rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                <img
                  src={form.profilePhoto || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"}
                  alt={form.fullName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 2 Side Editorial Looks */}
              <div className="flex flex-col gap-3 h-96">
                <div className="flex-1 rounded-2xl overflow-hidden bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
                    alt="Side Profile Look"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 rounded-2xl overflow-hidden bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80"
                    alt="Ramp Walk Look"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Stats Footer Grid */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs">
              <div>
                <span className="block text-[9px] uppercase font-bold text-gray-400">Height</span>
                <span className="font-extrabold text-gray-900 text-xs mt-0.5 block">{form.height || '6\'0"'}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-gray-400">Chest</span>
                <span className="font-extrabold text-gray-900 text-xs mt-0.5 block">{form.chest || '40"'}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-gray-400">Waist</span>
                <span className="font-extrabold text-gray-900 text-xs mt-0.5 block">{form.waist || '31"'}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-gray-400">Hips</span>
                <span className="font-extrabold text-gray-900 text-xs mt-0.5 block">{form.hips || '37"'}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-gray-400">Shoes</span>
                <span className="font-extrabold text-gray-900 text-xs mt-0.5 block">{form.shoeSize || '10 UK'}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-gray-400">Eyes</span>
                <span className="font-extrabold text-gray-900 text-xs mt-0.5 block">{form.eyeColor || 'Brown'}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-gray-400">Hair</span>
                <span className="font-extrabold text-gray-900 text-xs mt-0.5 block">{form.hairColor || 'Black'}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-gray-400">Suit</span>
                <span className="font-extrabold text-gray-900 text-xs mt-0.5 block">40R</span>
              </div>
            </div>

            {/* Direct Contact representation */}
            <div className="flex items-center justify-between pt-2 text-[11px] text-gray-500 font-medium">
              <span>Bookings: <strong>castings@mycastnow.com</strong></span>
              <span>Direct Link: <strong>mycastnow.com/talent/{creatorUser?.phone || '7599847194'}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 4: SHOWREELS & AUDITION TAPES                                */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'reels' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Video size={18} className="text-red-500" /> Audition Self-Tapes & Video Showreels
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Add YouTube, Vimeo, or Google Drive audition reel links. Casting directors evaluate self-tapes before scheduling physical call-backs.
              </p>
            </div>

            {/* Add Reel Input */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="url"
                placeholder="Paste YouTube or Vimeo audition video URL..."
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-fuchsia-500 font-medium"
              />
              <button
                type="button"
                onClick={handleAddVideo}
                className="w-full sm:w-auto px-6 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus size={15} /> Add Audition Tape
              </button>
            </div>

            {/* Videos List */}
            <div className="space-y-3 pt-3">
              {form.videos.map((vid, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <Play size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900">Audition Self-Tape #{idx + 1}</p>
                      <a href={vid} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 hover:underline truncate block">
                        {vid}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={vid}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs transition"
                    >
                      Watch
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(idx)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Videos to Profile'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorProfile;
