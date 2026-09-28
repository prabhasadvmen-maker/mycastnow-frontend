import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Building2, MapPin, Globe, Mail, Phone, ShieldCheck, Check,
  Camera, Film, Save, RefreshCw, AlertCircle, FileText, UserCheck,
  ExternalLink, Share2, Video
} from 'lucide-react';

const InstagramIcon = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const API = import.meta.env.VITE_API_URL;

const CompanyProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'contact' | 'legal' | 'social'

  const [form, setForm] = useState({
    name: 'Advmen Technologies',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=400&q=80',
    email: 'prabhas.advmen@gmail.com',
    phone: '+91 98201 45892',
    industry: 'Film & Commercial Media Production',
    website: 'https://advmen.tech',
    location: 'Mumbai, Maharashtra',
    tagline: 'Premium OTT & Advertising Production House',
    description: 'Advmen Technologies is a premier media & film production house based in Mumbai. We specialize in OTT series production, pan-India commercial ad films, celebrity brand shoots, and high-impact digital music videos.',
    address: 'Plot 42, Lotus Grandeur, Veera Desai Industrial Estate, Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    gst: '27AABCA1234F1Z8',
    cin: 'U74999MH2021PTC367890',
    pan: 'AABCA1234F',
    contactPerson: {
      name: 'Prabhas Sharma',
      designation: 'Head of Casting & Talent Operations',
      phone: '+91 98201 45892',
      email: 'prabhas.advmen@gmail.com'
    },
    socialLinks: {
      instagram: 'https://instagram.com/advmentech',
      linkedin: 'https://linkedin.com/company/advmen-technologies',
      imdb: 'https://imdb.com/company/advmen',
      youtube: 'https://youtube.com/@advmentv'
    }
  });

  // Fetch Company Profile
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API}/company/profile`, { headers });
      if (res.data?.success && res.data.company) {
        const c = res.data.company;
        setForm(prev => ({
          ...prev,
          name: c.name || prev.name,
          logo: c.logo || prev.logo,
          email: c.email || prev.email,
          phone: c.phone || prev.phone,
          industry: c.industry || prev.industry,
          website: c.website || prev.website,
          location: c.location || prev.location,
          tagline: c.tagline || prev.tagline,
          description: c.description || prev.description,
          address: c.address || prev.address,
          city: c.city || prev.city,
          state: c.state || prev.state,
          pincode: c.pincode || prev.pincode,
          gst: c.gst || prev.gst,
          cin: c.cin || prev.cin,
          pan: c.pan || prev.pan,
          contactPerson: { ...prev.contactPerson, ...(c.contactPerson || {}) },
          socialLinks: { ...prev.socialLinks, ...(c.socialLinks || {}) }
        }));
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle Save
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.put(`${API}/company/profile`, form, { headers });
      if (res.data?.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Save error:', err);
      alert(err.response?.data?.message || 'Failed to update company profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header Profile Cover Banner */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Cover image */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              Verified Production House
            </span>
          </div>
        </div>

        {/* Profile Card Overlay */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-14">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-white p-1 shadow-xl shrink-0 border-4 border-white relative group">
              <img
                src={form.logo || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=400&q=80'}
                alt={form.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-gray-900 leading-tight">{form.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                  {form.industry}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">{form.tagline}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400 pt-0.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {form.city || form.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe size={12} /> {form.website ? new URL(form.website).hostname : 'advmen.tech'}
                </span>
              </div>
            </div>
          </div>

          {/* Save Action Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition active:scale-95 self-start sm:self-auto shrink-0"
          >
            {saving ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check size={14} className="text-emerald-300" />
                <span>Saved to Database!</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-t border-gray-100 flex items-center gap-2 overflow-x-auto text-xs font-bold text-gray-500">
          {[
            { id: 'general', label: 'Studio & General', icon: Building2 },
            { id: 'contact', label: 'Contact & Location', icon: MapPin },
            { id: 'legal', label: 'Legal & Tax Details', icon: FileText },
            { id: 'social', label: 'Showreel & Links', icon: Film }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-3 border-b-2 transition flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'border-indigo-600 text-indigo-700 font-black'
                    : 'border-transparent hover:text-gray-900'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content Form ── */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6 text-xs">

        {/* TAB 1: GENERAL */}
        {activeTab === 'general' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-gray-900">Studio & General Information</h3>
              <p className="text-gray-400">Basic brand identity and public studio presentation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Company / Studio Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Primary Industry Focus</label>
                <select
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Film & Commercial Media Production">Film & Commercial Media Production</option>
                  <option value="OTT & Web Series Studio">OTT & Web Series Studio</option>
                  <option value="Advertising & TVC Agency">Advertising & TVC Agency</option>
                  <option value="Modeling & Talent Agency">Modeling & Talent Agency</option>
                  <option value="Music Video & Digital Media">Music Video & Digital Media</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Official Website</label>
                <input
                  type="url"
                  placeholder="https://yourstudio.com"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Studio Logo Image URL</label>
              <input
                type="url"
                value={form.logo}
                onChange={(e) => setForm({ ...form, logo: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">About Production House & Past Projects</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your studio, flagship projects, directors, and production achievements..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* TAB 2: CONTACT & LOCATION */}
        {activeTab === 'contact' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-gray-900">Contact & Head Office Location</h3>
              <p className="text-gray-400">Official correspondence and studio shoot premises</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Official Contact Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Direct Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Registered Studio / Office Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Postal Pincode</label>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LEGAL & TAX */}
        {activeTab === 'legal' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-gray-900">Legal, Tax & Authorized Signatory</h3>
              <p className="text-gray-400">Corporate verification and contracting credentials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  placeholder="e.g. 27AABCA1234F1Z8"
                  value={form.gst}
                  onChange={(e) => setForm({ ...form, gst: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">CIN / Registration No.</label>
                <input
                  type="text"
                  placeholder="e.g. U74999MH2021PTC367890"
                  value={form.cin}
                  onChange={(e) => setForm({ ...form, cin: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">PAN Card Number</label>
                <input
                  type="text"
                  placeholder="e.g. AABCA1234F"
                  value={form.pan}
                  onChange={(e) => setForm({ ...form, pan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 mt-4">
              <h4 className="text-xs font-bold text-gray-900">Authorized Casting Coordinator / Lead</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Contact Person Name</label>
                  <input
                    type="text"
                    value={form.contactPerson?.name || ''}
                    onChange={(e) => setForm({
                      ...form,
                      contactPerson: { ...form.contactPerson, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Designation</label>
                  <input
                    type="text"
                    value={form.contactPerson?.designation || ''}
                    onChange={(e) => setForm({
                      ...form,
                      contactPerson: { ...form.contactPerson, designation: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SHOWREEL & SOCIAL */}
        {activeTab === 'social' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-gray-900">Showreels & Social Media Links</h3>
              <p className="text-gray-400">Share your creative portfolio reels with talent</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Video size={13} className="text-red-600" />
                  YouTube / Vimeo Showreel Link
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={form.socialLinks?.youtube || ''}
                  onChange={(e) => setForm({
                    ...form,
                    socialLinks: { ...form.socialLinks, youtube: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Film size={13} className="text-amber-600" />
                  IMDb Pro Company Profile
                </label>
                <input
                  type="url"
                  placeholder="https://imdb.com/company/..."
                  value={form.socialLinks?.imdb || ''}
                  onChange={(e) => setForm({
                    ...form,
                    socialLinks: { ...form.socialLinks, imdb: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <InstagramIcon size={13} className="text-pink-600" />
                    Instagram Handle / URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/..."
                    value={form.socialLinks?.instagram || ''}
                    onChange={(e) => setForm({
                      ...form,
                      socialLinks: { ...form.socialLinks, instagram: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <LinkedinIcon size={13} className="text-blue-600" />
                    LinkedIn Company Page
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/company/..."
                    value={form.socialLinks?.linkedin || ''}
                    onChange={(e) => setForm({
                      ...form,
                      socialLinks: { ...form.socialLinks, linkedin: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Submit Button */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-gray-400 text-[11px]">
            Changes are saved directly to your MongoDB database profile.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition active:scale-95"
          >
            {saving ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check size={13} className="text-emerald-300" />
                <span>Changes Saved!</span>
              </>
            ) : (
              <>
                <Save size={13} />
                <span>Save Company Profile</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};

export default CompanyProfile;
