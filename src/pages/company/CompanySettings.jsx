import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCompanyAuth } from '../../context/CompanyAuthContext';
import {
  Building2, Lock, ShieldCheck, Mail, Phone, Globe, MapPin,
  Save, RefreshCw, CheckCircle2, AlertCircle, Eye, EyeOff,
  Bell, KeyRound, User, FileText, Check, Sparkles, Building,
  CreditCard, ExternalLink, Camera
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const CompanySettings = () => {
  const { companyUser, setCompanyUser } = useCompanyAuth();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = new URLSearchParams(window.location.search).get('tab');
    return tabParam && ['profile', 'security', 'notifications', 'billing'].includes(tabParam) ? tabParam : 'profile';
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'security', 'notifications', 'billing'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Notification toggles
  const [notifications, setNotifications] = useState({
    emailAuditions: true,
    emailMessages: true,
    emailEscrow: true,
    emailShortlists: true,
    smsAlerts: false
  });
  const [notifSaved, setNotifSaved] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    industry: '',
    website: '',
    location: '',
    tagline: '',
    description: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    logo: '',
    gst: '',
    cin: '',
    pan: '',
    contactPerson: {
      name: '',
      designation: '',
      phone: '',
      email: ''
    },
    socialLinks: {
      instagram: '',
      linkedin: '',
      imdb: '',
      youtube: ''
    }
  });

  // Fetch Company Details from Database
  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('companyToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await axios.get(`${API}/company/profile`, { headers });
        if (res.data?.success && res.data.company) {
          const c = res.data.company;
          setProfileForm({
            name: c.name || '',
            email: c.email || '',
            phone: c.phone || '',
            industry: c.industry || 'Film & Media Production',
            website: c.website || '',
            location: c.location || 'Mumbai',
            tagline: c.tagline || '',
            description: c.description || '',
            address: c.address || '',
            city: c.city || 'Mumbai',
            state: c.state || 'Maharashtra',
            pincode: c.pincode || '',
            logo: c.logo || '',
            gst: c.gst || '',
            cin: c.cin || '',
            pan: c.pan || '',
            contactPerson: {
              name: c.contactPerson?.name || '',
              designation: c.contactPerson?.designation || 'Casting Director',
              phone: c.contactPerson?.phone || '',
              email: c.contactPerson?.email || ''
            },
            socialLinks: {
              instagram: c.socialLinks?.instagram || '',
              linkedin: c.socialLinks?.linkedin || '',
              imdb: c.socialLinks?.imdb || '',
              youtube: c.socialLinks?.youtube || ''
            }
          });
        }
      } catch (err) {
        console.error('Error fetching company settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  // Save Profile Changes to Database
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.put(`${API}/company/profile`, profileForm, { headers });
      if (res.data?.success) {
        setProfileSuccess('Company profile details saved successfully to database!');
        if (res.data.company) {
          setCompanyUser(prev => ({ ...prev, ...res.data.company }));
        }
        setTimeout(() => setProfileSuccess(''), 4000);
      } else {
        setProfileError(res.data?.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setProfileError(err.response?.data?.message || 'Failed to save changes. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const token = localStorage.getItem('companyToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.put(
        `${API}/companyAuth/change-password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        { headers }
      );

      if (res.data?.success) {
        setPasswordSuccess('Password changed successfully! Keep your new password secure.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordSuccess(''), 5000);
      } else {
        setPasswordError(res.data?.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Password change error:', err);
      setPasswordError(err.response?.data?.message || 'Failed to change password. Please verify your current password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-500">Loading company settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
        <div className="relative z-[1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-2">
              <Sparkles size={13} /> PRODUCTION HOUSE SETTINGS
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Account & Production Settings</h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
              Manage your company information, team contact details, login credentials, and notification preferences.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 self-start sm:self-auto">
            <Building2 size={24} className="text-blue-200" />
            <div>
              <p className="text-xs text-blue-200 font-medium">Logged in as</p>
              <p className="text-sm font-extrabold text-white truncate max-w-[180px]">{companyUser?.name || profileForm.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-gray-200/80 flex flex-wrap gap-1">
        {[
          { id: 'profile', label: 'Company Profile & Details', icon: Building2 },
          { id: 'security', label: 'Security & Change Password', icon: KeyRound },
          { id: 'notifications', label: 'Notification Preferences', icon: Bell },
          { id: 'billing', label: 'Subscription & Account Overview', icon: CreditCard }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ────────────────── TAB 1: COMPANY PROFILE EDIT ────────────────── */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {profileSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-bold animate-in fade-in">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}
          {profileError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-sm font-bold animate-in fade-in">
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          {/* Primary Company Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Building2 size={20} className="text-blue-600" />
                  Primary Company Information
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">This information is shown to verified actors and talent on casting notices.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Company / Studio Name *</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="e.g. Lotus Motion Pictures"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Industry / Sector</label>
                <input
                  type="text"
                  value={profileForm.industry}
                  onChange={(e) => setProfileForm({ ...profileForm, industry: e.target.value })}
                  placeholder="e.g. Film, OTT & Advertising Production"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Official Email (Login ID)</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    disabled
                    value={profileForm.email}
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 text-sm font-medium cursor-not-allowed"
                    title="Email is tied to your account login. Contact admin to change."
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Contact super admin to update your primary login email address.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone / Contact Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+91 98201 00000"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Official Website</label>
                <div className="relative">
                  <Globe size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="url"
                    value={profileForm.website}
                    onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                    placeholder="https://yourstudio.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Company Logo URL</label>
                <div className="relative">
                  <Camera size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="url"
                    value={profileForm.logo}
                    onChange={(e) => setProfileForm({ ...profileForm, logo: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Company Tagline / One-Liner</label>
                <input
                  type="text"
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  placeholder="e.g. India's Leading Feature Film & Web Series Production Studio"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">About Production House / Bio</label>
                <textarea
                  rows={3}
                  value={profileForm.description}
                  onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                  placeholder="Describe your production company, recent film/OTT/ad projects, and creative casting focus..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all resize-y"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Location & Physical Studio Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <MapPin size={20} className="text-purple-600" />
                Office & Studio Location
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Where your registered studio and audition stages are based.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Street Address</label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  placeholder="Studio Floor / Building / Road / Area"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">City</label>
                <input
                  type="text"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value, location: `${e.target.value}, ${profileForm.state}` })}
                  placeholder="e.g. Mumbai"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">State</label>
                <input
                  type="text"
                  value={profileForm.state}
                  onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value, location: `${profileForm.city}, ${e.target.value}` })}
                  placeholder="e.g. Maharashtra"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Pincode</label>
                <input
                  type="text"
                  value={profileForm.pincode}
                  onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                  placeholder="e.g. 400053"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                />
              </div>
            </div>
          </div>

          {/* Contact Person Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <User size={20} className="text-emerald-600" />
                Casting Director / Contact Person
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Primary representative handling talent bookings and auditions on MyCastNow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileForm.contactPerson.name}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    contactPerson: { ...profileForm.contactPerson, name: e.target.value }
                  })}
                  placeholder="e.g. Arvind Kumar"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Designation / Role</label>
                <input
                  type="text"
                  value={profileForm.contactPerson.designation}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    contactPerson: { ...profileForm.contactPerson, designation: e.target.value }
                  })}
                  placeholder="e.g. Head Casting Director / Producer"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Direct Phone</label>
                <input
                  type="text"
                  value={profileForm.contactPerson.phone}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    contactPerson: { ...profileForm.contactPerson, phone: e.target.value }
                  })}
                  placeholder="+91 98201 00000"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Direct Email</label>
                <input
                  type="email"
                  value={profileForm.contactPerson.email}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    contactPerson: { ...profileForm.contactPerson, email: e.target.value }
                  })}
                  placeholder="casting@studio.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Globe size={20} className="text-pink-600" />
                Social Profiles & IMDb
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Build trust with talent by showing your verified production social presence.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Instagram Profile URL</label>
                <input
                  type="url"
                  value={profileForm.socialLinks.instagram}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    socialLinks: { ...profileForm.socialLinks, instagram: e.target.value }
                  })}
                  placeholder="https://instagram.com/yourproduction"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">LinkedIn Company Page</label>
                <input
                  type="url"
                  value={profileForm.socialLinks.linkedin}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    socialLinks: { ...profileForm.socialLinks, linkedin: e.target.value }
                  })}
                  placeholder="https://linkedin.com/company/yourstudio"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">IMDb Company URL</label>
                <input
                  type="url"
                  value={profileForm.socialLinks.imdb}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    socialLinks: { ...profileForm.socialLinks, imdb: e.target.value }
                  })}
                  placeholder="https://imdb.com/company/co000000"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">YouTube Showreel Channel</label>
                <input
                  type="url"
                  value={profileForm.socialLinks.youtube}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    socialLinks: { ...profileForm.socialLinks, youtube: e.target.value }
                  })}
                  placeholder="https://youtube.com/@yourstudio"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {savingProfile ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Saving to Database...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Company Profile
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ────────────────── TAB 2: SECURITY & CHANGE PASSWORD ────────────────── */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <KeyRound size={20} className="text-blue-600" />
                Change Account Password
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Ensure your production account uses a strong, unique password to protect talent submissions and contract documents.
              </p>
            </div>

            {passwordSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-bold animate-in fade-in">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}
            {passwordError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-sm font-bold animate-in fade-in">
                <AlertCircle size={18} className="text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="space-y-4 max-w-lg">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Current Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="Enter your current password"
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">New Password (Min. 6 characters)</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="Enter new strong password"
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingPassword || !passwordForm.newPassword}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingPassword ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Account Security Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-bold text-gray-900 text-base">Super Admin Verification</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Your production house account is verified by MyCastNow administration team. You have full access to direct artist booking and escrow operations.
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check size={13} /> Verified Studio License
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Lock size={20} />
              </div>
              <h4 className="font-bold text-gray-900 text-base">Two-Factor Security</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Audition videos, contracts, and payment transactions are secured with end-to-end encryption.
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                  256-Bit SSL Protected
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── TAB 3: NOTIFICATION PREFERENCES ────────────────── */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveNotifications} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Bell size={20} className="text-amber-500" />
              Email & Alert Notifications
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Customize when and how you receive alerts about talent submissions and bookings.</p>
          </div>

          {notifSaved && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-bold animate-in fade-in">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>Notification preferences updated successfully!</span>
            </div>
          )}

          <div className="space-y-4 max-w-2xl">
            {[
              {
                id: 'emailAuditions',
                title: 'New Audition Applications',
                desc: 'Receive immediate email alerts when talent applies to your active casting calls.'
              },
              {
                id: 'emailMessages',
                title: 'Direct Artist Messages',
                desc: 'Get notified when shortlisted actors or models respond in the messaging inbox.'
              },
              {
                id: 'emailEscrow',
                title: 'Escrow & Wallet Milestones',
                desc: 'Alerts when shoot milestone payments are deposited, verified, or released.'
              },
              {
                id: 'emailShortlists',
                title: 'Candidate Shortlist Updates',
                desc: 'Weekly digests of new verified actors and models matching your casting criteria.'
              },
              {
                id: 'smsAlerts',
                title: 'Urgent Shoot Day SMS Alerts',
                desc: 'Receive instant SMS notifications on your registered phone for shoot-day callbacks.'
              }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="pr-4">
                  <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={notifications[item.id]}
                    onChange={(e) => setNotifications({ ...notifications, [item.id]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save size={16} /> Save Notification Preferences
            </button>
          </div>
        </form>
      )}

      {/* ────────────────── TAB 4: BILLING & SUBSCRIPTION ────────────────── */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <CreditCard size={20} className="text-emerald-600" />
                  Subscription & Agency Plan
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Your current production tier and platform privileges.</p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-auto">
                ● ACTIVE PRODUCTION LICENSE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <p className="text-[11px] font-bold text-gray-400 uppercase">Current Tier</p>
                <p className="text-lg font-extrabold text-gray-900 mt-1">Casting Agency Studio</p>
                <p className="text-xs text-blue-600 font-semibold mt-1">₹1,999 / month</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <p className="text-[11px] font-bold text-gray-400 uppercase">Audition Calls</p>
                <p className="text-lg font-extrabold text-emerald-700 mt-1">Unlimited</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">Direct video self-tape submissions</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <p className="text-[11px] font-bold text-gray-400 uppercase">Talent Cart Access</p>
                <p className="text-lg font-extrabold text-purple-700 mt-1">25,000+ Verified Artists</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">Pan-India contact numbers unlocked</p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="/company/dashboard/subscription"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                Manage Subscription Plan <ExternalLink size={14} />
              </a>
              <a
                href="/company/dashboard/wallet"
                className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs border border-gray-200 transition-all flex items-center gap-2"
              >
                View Wallet & Escrow Balance <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySettings;
