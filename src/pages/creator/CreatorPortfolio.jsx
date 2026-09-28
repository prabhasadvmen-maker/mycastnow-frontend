import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import {
  FolderOpen, Camera, Film, Award, Ruler, DollarSign,
  Plus, Trash2, Eye, Save, CheckCircle2, AlertCircle,
  ExternalLink, Sparkles, RefreshCw, X, Tag
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const SAMPLE_PRESETS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
];

const CreatorPortfolio = () => {
  const { creatorUser, setCreatorUser } = useCreatorAuth();
  const [activeTab, setActiveTab] = useState('photos'); // 'photos' | 'videos' | 'campaigns' | 'physical' | 'skills'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(null);

  // Creator state
  const [creatorData, setCreatorData] = useState(null);

  // Modals state
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
  const [campaignForm, setCampaignForm] = useState({ title: '', brand: '', role: '', supportingDocs: '' });

  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  // Physical details local form
  const [physicalForm, setPhysicalForm] = useState({
    height: '6 ft 0 in',
    weight: '74 kg',
    chest: '40 in',
    waist: '32 in',
    hips: '38 in',
    shoeSize: '10 UK',
    eyeColor: 'Dark Brown',
    hairColor: 'Black',
    complexion: 'Wheatish'
  });

  // Skills & Pricing local form
  const [professionalForm, setProfessionalForm] = useState({
    primaryCategory: 'Model / Actor',
    subCategory: 'Commercial & Fashion',
    experience: '4+ Years',
    skills: ['Runway Walk', 'Commercial Acting', 'Fitness Modeling', 'Print Shoots', 'Voiceover'],
    newSkillInput: '',
    languages: ['Hindi', 'English', 'Punjabi'],
    newLangInput: ''
  });

  const [pricingForm, setPricingForm] = useState({
    hourlyRate: 5000,
    dayRate: 25000,
    projectRate: 75000,
    minimumBooking: 'Half Day (4 hrs)',
    travelCharges: 'Extra as actuals outside Mumbai'
  });

  // Fetch portfolio data from database
  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API}/creator/portal/portfolio`, { headers });
      if (res.data?.success && res.data?.creator) {
        const c = res.data.creator;
        setCreatorData(c);
        if (c.physicalDetails) setPhysicalForm(prev => ({ ...prev, ...c.physicalDetails }));
        if (c.professionalDetails) {
          setProfessionalForm(prev => ({
            ...prev,
            ...c.professionalDetails,
            skills: c.professionalDetails.skills?.length ? c.professionalDetails.skills : prev.skills,
            languages: c.basicDetails?.languages?.length ? c.basicDetails.languages : prev.languages
          }));
        }
        if (c.pricing) setPricingForm(prev => ({ ...prev, ...c.pricing }));
      }
    } catch (err) {
      console.error('Error fetching portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const showNotification = (msg, type = 'success') => {
    setSaveToast({ msg, type });
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Add Photo
  const handleAddPhoto = async (urlToAdd) => {
    const photo = urlToAdd || newPhotoUrl;
    if (!photo || !photo.trim()) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(`${API}/creator/portal/photo`, { photoUrl: photo.trim() }, { headers });
      if (res.data?.success) {
        setCreatorData(prev => ({
          ...prev,
          portfolio: { ...prev.portfolio, photos: res.data.photos }
        }));
        setNewPhotoUrl('');
        setShowAddPhotoModal(false);
        showNotification('Photo added to portfolio gallery!');
      }
    } catch (err) {
      showNotification('Failed to add photo', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Photo
  const handleDeletePhoto = async (index, photoUrl) => {
    if (!window.confirm('Are you sure you want to remove this photo from your portfolio?')) return;
    try {
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.delete(`${API}/creator/portal/photo`, {
        headers,
        data: { index, photoUrl }
      });
      if (res.data?.success) {
        setCreatorData(prev => ({
          ...prev,
          portfolio: { ...prev.portfolio, photos: res.data.photos }
        }));
        showNotification('Photo removed from portfolio');
      }
    } catch (err) {
      showNotification('Failed to remove photo', 'error');
    }
  };

  // Add Video
  const handleAddVideo = async () => {
    if (!videoUrl.trim()) return;
    try {
      setSaving(true);
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const updatedVideos = [...(creatorData?.portfolio?.videos || []), videoUrl.trim()];
      const res = await axios.put(`${API}/creator/portal`, {
        portfolio: { ...creatorData?.portfolio, videos: updatedVideos }
      }, { headers });
      if (res.data?.success) {
        setCreatorData(prev => ({
          ...prev,
          portfolio: { ...prev.portfolio, videos: updatedVideos }
        }));
        setVideoUrl('');
        setShowAddVideoModal(false);
        showNotification('Showreel video link added!');
      }
    } catch (err) {
      showNotification('Failed to add video', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Video
  const handleDeleteVideo = async (index) => {
    if (!window.confirm('Remove this video reel?')) return;
    try {
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const updatedVideos = (creatorData?.portfolio?.videos || []).filter((_, i) => i !== index);
      const res = await axios.put(`${API}/creator/portal`, {
        portfolio: { ...creatorData?.portfolio, videos: updatedVideos }
      }, { headers });
      if (res.data?.success) {
        setCreatorData(prev => ({
          ...prev,
          portfolio: { ...prev.portfolio, videos: updatedVideos }
        }));
        showNotification('Video reel removed');
      }
    } catch (err) {
      showNotification('Failed to delete video', 'error');
    }
  };

  // Add Campaign
  const handleAddCampaign = async (e) => {
    e.preventDefault();
    if (!campaignForm.title || !campaignForm.brand) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(`${API}/creator/portal/campaign`, {
        title: campaignForm.title,
        brand: campaignForm.brand,
        supportingDocs: campaignForm.supportingDocs ? [campaignForm.supportingDocs] : []
      }, { headers });
      if (res.data?.success) {
        setCreatorData(prev => ({
          ...prev,
          portfolio: { ...prev.portfolio, campaigns: res.data.campaigns }
        }));
        setCampaignForm({ title: '', brand: '', role: '', supportingDocs: '' });
        setShowAddCampaignModal(false);
        showNotification('Brand campaign saved to portfolio!');
      }
    } catch (err) {
      showNotification('Failed to add campaign', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Campaign
  const handleDeleteCampaign = async (index) => {
    if (!window.confirm('Delete this brand campaign?')) return;
    try {
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.delete(`${API}/creator/portal/campaign/${index}`, { headers });
      if (res.data?.success) {
        setCreatorData(prev => ({
          ...prev,
          portfolio: { ...prev.portfolio, campaigns: res.data.campaigns }
        }));
        showNotification('Campaign removed');
      }
    } catch (err) {
      showNotification('Failed to delete campaign', 'error');
    }
  };

  // Save Physical Details
  const handleSavePhysical = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.put(`${API}/creator/portal`, { physicalDetails: physicalForm }, { headers });
      if (res.data?.success) {
        showNotification('Physical stats updated in database!');
      }
    } catch (err) {
      showNotification('Failed to save physical stats', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Save Professional & Pricing
  const handleSaveSkillsAndPricing = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.put(`${API}/creator/portal`, {
        professionalDetails: {
          primaryCategory: professionalForm.primaryCategory,
          subCategory: professionalForm.subCategory,
          experience: professionalForm.experience,
          skills: professionalForm.skills
        },
        basicDetails: {
          languages: professionalForm.languages
        },
        pricing: pricingForm
      }, { headers });
      if (res.data?.success) {
        showNotification('Skills, categories and pricing rates saved!');
      }
    } catch (err) {
      showNotification('Failed to update skills and pricing', 'error');
    } finally {
      setSaving(false);
    }
  };

  const photos = creatorData?.portfolio?.photos || [];
  const videos = creatorData?.portfolio?.videos || [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ];
  const campaigns = creatorData?.portfolio?.campaigns || [
    { title: 'Zara Autumn Festive Lookbook', brand: 'Zara Men', supportingDocs: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'] },
    { title: 'Titan Edge Commercial Campaign', brand: 'Titan Watches', supportingDocs: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'] }
  ];

  const fullName = creatorData?.basicDetails?.fullName || creatorUser?.basicDetails?.fullName || 'Arvind Kumar';
  const avatar = photos[0] || creatorData?.basicDetails?.profilePhoto || creatorUser?.basicDetails?.profilePhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {saveToast && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200 ${
            saveToast.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {saveToast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} className="text-emerald-600" />}
          <span>{saveToast.msg}</span>
        </div>
      )}

      {/* HEADER PROFILE HERO CARD */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <img
                src={avatar}
                alt={fullName}
                className="w-20 h-20 md:w-24 md:md:h-24 rounded-2xl object-cover border-2 border-purple-500/20 shadow-md"
              />
              <button
                onClick={() => setShowAddPhotoModal(true)}
                className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow-md transition"
                title="Add New Photo"
              >
                <Camera size={14} />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-900">{fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-700">
                  Approved Talent
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-600">
                {professionalForm.primaryCategory} • {creatorData?.basicDetails?.city || 'Mumbai, Maharashtra'}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-500">
                <span className="font-semibold text-gray-800">Height:</span> {physicalForm.height}
                <span className="text-gray-300">•</span>
                <span className="font-semibold text-gray-800">Chest:</span> {physicalForm.chest}
                <span className="text-gray-300">•</span>
                <span className="font-semibold text-gray-800">Shoe:</span> {physicalForm.shoeSize}
                <span className="text-gray-300">•</span>
                <span className="font-semibold text-gray-800">Eyes:</span> {physicalForm.eyeColor}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddPhotoModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Plus size={15} />
              <span>Add Photos</span>
            </button>
            <button
              onClick={() => setShowAddCampaignModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Award size={15} />
              <span>Add Campaign</span>
            </button>
          </div>
        </div>
      </div>

      {/* PORTFOLIO TABS */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'photos', label: `Photos Gallery (${photos.length})`, icon: Camera },
          { id: 'videos', label: `Showreels (${videos.length})`, icon: Film },
          { id: 'campaigns', label: `Campaigns (${campaigns.length})`, icon: Award },
          { id: 'physical', label: 'Physical Measurements', icon: Ruler },
          { id: 'skills', label: 'Skills & Pricing', icon: DollarSign }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PHOTO GALLERY */}
      {activeTab === 'photos' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-gray-900">Headshots & Fashion Portfolio</h3>
              <p className="text-xs text-gray-400">High-resolution modeling pictures shown directly to casting directors</p>
            </div>
            <button
              onClick={() => setShowAddPhotoModal(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus size={14} /> Add Headshot
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((url, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-100 border border-gray-200 shadow-sm hover:shadow-lg transition-all"
              >
                <img
                  src={url}
                  alt={`Portfolio ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDeletePhoto(idx, url)}
                      className="p-2 rounded-xl bg-red-600/90 text-white hover:bg-red-600 transition"
                      title="Remove Photo"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-white text-[11px]">
                    <span className="font-semibold">Photo #{idx + 1}</span>
                    <button
                      onClick={() => setLightboxPhoto(url)}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition"
                      title="Preview Full Size"
                    >
                      <Eye size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Photo Card placeholder */}
            <button
              onClick={() => setShowAddPhotoModal(true)}
              className="rounded-2xl border-2 border-dashed border-gray-200 hover:border-purple-400 aspect-[3/4] flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50/20 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                <Plus size={22} />
              </div>
              <span className="text-xs font-bold">Add Photo</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: SHOWREELS & VIDEOS */}
      {activeTab === 'videos' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-gray-900">Acting & Runway Showreels</h3>
              <p className="text-xs text-gray-400">Attach YouTube, Vimeo, or cloud video links of your performance auditions</p>
            </div>
            <button
              onClick={() => setShowAddVideoModal(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus size={14} /> Add Showreel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((vid, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                      <Film size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">Showreel Reel #{idx + 1}</h4>
                      <p className="text-[11px] text-gray-400 truncate max-w-xs">{vid}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteVideo(idx)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="aspect-video rounded-xl bg-gray-900 overflow-hidden flex items-center justify-center text-white text-xs relative">
                  <span className="flex items-center gap-2">
                    <Film size={20} className="text-red-500" />
                    <a
                      href={vid}
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-bold hover:text-purple-300 flex items-center gap-1"
                    >
                      Open Video Player <ExternalLink size={12} />
                    </a>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BRAND CAMPAIGNS */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-gray-900">Brand Endorsements & Projects</h3>
              <p className="text-xs text-gray-400">Past commercial campaigns, TV ads, and major fashion shoots</p>
            </div>
            <button
              onClick={() => setShowAddCampaignModal(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus size={14} /> Add Campaign
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((camp, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3 relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      {camp.brand || 'Commercial'}
                    </span>
                    <h4 className="font-bold text-base text-gray-900 mt-1">{camp.title}</h4>
                  </div>
                  <button
                    onClick={() => handleDeleteCampaign(idx)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {camp.supportingDocs && camp.supportingDocs[0] && (
                  <div className="h-32 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={camp.supportingDocs[0]}
                      alt={camp.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-50">
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <CheckCircle2 size={13} /> Verified Project
                  </span>
                  <span className="text-[11px] text-gray-400">Production Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PHYSICAL MEASUREMENTS */}
      {activeTab === 'physical' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-black text-gray-900">Physical Measurements & Specs</h3>
              <p className="text-xs text-gray-400">Accurate dimensions needed by costume designers and casting directors</p>
            </div>
            <button
              onClick={handleSavePhysical}
              disabled={saving}
              className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition cursor-pointer"
            >
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save Physical Stats'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Height</label>
              <input
                type="text"
                value={physicalForm.height}
                onChange={(e) => setPhysicalForm({ ...physicalForm, height: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Weight</label>
              <input
                type="text"
                value={physicalForm.weight}
                onChange={(e) => setPhysicalForm({ ...physicalForm, weight: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Chest / Bust</label>
              <input
                type="text"
                value={physicalForm.chest}
                onChange={(e) => setPhysicalForm({ ...physicalForm, chest: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Waist</label>
              <input
                type="text"
                value={physicalForm.waist}
                onChange={(e) => setPhysicalForm({ ...physicalForm, waist: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Hips</label>
              <input
                type="text"
                value={physicalForm.hips}
                onChange={(e) => setPhysicalForm({ ...physicalForm, hips: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Shoe Size</label>
              <input
                type="text"
                value={physicalForm.shoeSize}
                onChange={(e) => setPhysicalForm({ ...physicalForm, shoeSize: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Eye Color</label>
              <input
                type="text"
                value={physicalForm.eyeColor}
                onChange={(e) => setPhysicalForm({ ...physicalForm, eyeColor: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Hair Color</label>
              <input
                type="text"
                value={physicalForm.hairColor}
                onChange={(e) => setPhysicalForm({ ...physicalForm, hairColor: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Complexion</label>
              <input
                type="text"
                value={physicalForm.complexion}
                onChange={(e) => setPhysicalForm({ ...physicalForm, complexion: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SKILLS & PRICING */}
      {activeTab === 'skills' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-black text-gray-900">Skills, Categories & Booking Rates</h3>
              <p className="text-xs text-gray-400">Control your primary talent categories, performance skills, and daily rates</p>
            </div>
            <button
              onClick={handleSaveSkillsAndPricing}
              disabled={saving}
              className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition cursor-pointer"
            >
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save Skills & Rates'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Categories & Skills */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-gray-900">Primary Categories</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Category</label>
                  <input
                    type="text"
                    value={professionalForm.primaryCategory}
                    onChange={(e) => setProfessionalForm({ ...professionalForm, primaryCategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Experience</label>
                  <input
                    type="text"
                    value={professionalForm.experience}
                    onChange={(e) => setProfessionalForm({ ...professionalForm, experience: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Skills tags */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1.5">Specialized Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {professionalForm.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold"
                    >
                      {skill}
                      <button
                        onClick={() => {
                          const updated = professionalForm.skills.filter((_, idx) => idx !== i);
                          setProfessionalForm({ ...professionalForm, skills: updated });
                        }}
                        className="text-purple-400 hover:text-purple-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add skill (e.g. Martial Arts, Kathak)"
                    value={professionalForm.newSkillInput}
                    onChange={(e) => setProfessionalForm({ ...professionalForm, newSkillInput: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && professionalForm.newSkillInput.trim()) {
                        e.preventDefault();
                        setProfessionalForm({
                          ...professionalForm,
                          skills: [...professionalForm.skills, professionalForm.newSkillInput.trim()],
                          newSkillInput: ''
                        });
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (professionalForm.newSkillInput.trim()) {
                        setProfessionalForm({
                          ...professionalForm,
                          skills: [...professionalForm.skills, professionalForm.newSkillInput.trim()],
                          newSkillInput: ''
                        });
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Booking Rates (INR) */}
            <div className="space-y-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <DollarSign size={16} className="text-emerald-600" /> Commercial Rates (₹ INR)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Half Day / Hourly Rate</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-gray-400">₹</span>
                    <input
                      type="number"
                      value={pricingForm.hourlyRate}
                      onChange={(e) => setPricingForm({ ...pricingForm, hourlyRate: Number(e.target.value) })}
                      className="w-full pl-7 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Full Day Shoot Rate</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-gray-400">₹</span>
                    <input
                      type="number"
                      value={pricingForm.dayRate}
                      onChange={(e) => setPricingForm({ ...pricingForm, dayRate: Number(e.target.value) })}
                      className="w-full pl-7 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Commercial Project Package</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-gray-400">₹</span>
                    <input
                      type="number"
                      value={pricingForm.projectRate}
                      onChange={(e) => setPricingForm({ ...pricingForm, projectRate: Number(e.target.value) })}
                      className="w-full pl-7 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD PHOTO MODAL */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-base text-gray-900">Add Portfolio Photo</h3>
              <button
                onClick={() => setShowAddPhotoModal(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <p className="text-[11px] font-bold text-gray-500 mb-2">Or select from curated portfolio presets:</p>
              <div className="grid grid-cols-6 gap-2">
                {SAMPLE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddPhoto(preset)}
                    className="aspect-square rounded-xl overflow-hidden border border-gray-200 hover:border-purple-600 hover:scale-105 transition cursor-pointer"
                  >
                    <img src={preset} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddPhotoModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAddPhoto()}
                disabled={saving || !newPhotoUrl.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Save to Portfolio'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CAMPAIGN MODAL */}
      {showAddCampaignModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddCampaign}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-base text-gray-900">Add Brand Campaign</h3>
              <button
                type="button"
                onClick={() => setShowAddCampaignModal(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Campaign Title *</label>
              <input
                type="text"
                placeholder="e.g. Myntra Big Fashion Festival Lookbook"
                required
                value={campaignForm.title}
                onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Brand Name *</label>
              <input
                type="text"
                placeholder="e.g. Myntra / Levi's / Titan"
                required
                value={campaignForm.brand}
                onChange={(e) => setCampaignForm({ ...campaignForm, brand: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Poster / Photo Link</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={campaignForm.supportingDocs}
                onChange={(e) => setCampaignForm({ ...campaignForm, supportingDocs: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddCampaignModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Add Campaign'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: ADD SHOWREEL MODAL */}
      {showAddVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-base text-gray-900">Add Video Showreel</h3>
              <button
                onClick={() => setShowAddVideoModal(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">YouTube / Vimeo / MP4 Link</label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowAddVideoModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVideo}
                disabled={saving || !videoUrl.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add Video Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX PHOTO MODAL */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxPhoto(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl">
            <img src={lightboxPhoto} alt="Full preview" className="w-full h-full object-contain" />
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorPortfolio;
