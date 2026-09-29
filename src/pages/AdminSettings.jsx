import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { 
  User, Shield, Key, Sliders, Bell, CheckCircle2, 
  AlertTriangle, Eye, EyeOff, Save, RefreshCw, 
  Lock, Mail, Phone, Building, Percent, DollarSign,
  AlertCircle, ShieldAlert, Cpu, ToggleLeft, ToggleRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSettings = () => {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'profile';

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  // Profile State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar: '',
    notificationPreferences: {
      emailAlerts: true,
      bookingAlerts: true,
      securityAlerts: true,
      systemUpdates: true
    }
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Password Update State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  // Platform & System Settings State
  const [systemSettings, setSystemSettings] = useState({
    platformName: 'MyCastNow',
    supportEmail: 'support@mycastnow.com',
    supportPhone: '+91 98765 43210',
    platformCommissionPercent: 10,
    boostCommissionPercent: 15,
    minWithdrawalAmount: 500,
    currency: 'INR',
    maintenanceMode: false,
    allowNewRegistrations: true,
    autoApproveCreators: false,
    autoApproveCastings: true,
    emailNotifications: true,
    smsNotifications: false,
    systemNotice: 'Platform is operating normally. All services active.'
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState({ type: '', text: '' });

  // Initialize Admin Data
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || 'Super Admin',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || 'Platform Super Administrator with full privileges.',
        avatar: user.avatar || '',
        notificationPreferences: user.notificationPreferences || {
          emailAlerts: true,
          bookingAlerts: true,
          securityAlerts: true,
          systemUpdates: true
        }
      });
    }
  }, [user]);

  // Fetch System Settings from Backend
  useEffect(() => {
    fetchSystemSettings();
  }, []);

  const fetchSystemSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/settings`);
      if (res.data.success && res.data.settings) {
        setSystemSettings(res.data.settings);
      }
    } catch (err) {
      console.error('Failed to load system settings', err);
    } finally {
      setSettingsLoading(false);
    }
  };

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg({ type: '', text: '' });

    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/auth/profile`, profileData);
      if (res.data.success) {
        setProfileMsg({ type: 'success', text: 'Admin profile updated successfully!' });
        if (updateUser) {
          updateUser(res.data.user);
        }
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      setProfileMsg({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to update profile.' 
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMsg({ type: '', text: '' });

    if (passwordData.newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirm password do not match.' });
      setPasswordLoading(false);
      return;
    }

    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/auth/change-password`, passwordData);
      if (res.data.success) {
        setPasswordMsg({ type: 'success', text: 'Password has been updated successfully!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      console.error('Password change error:', err);
      setPasswordMsg({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to update password. Please check your current password.' 
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle System Settings Update
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsMsg({ type: '', text: '' });

    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/admin/settings`, systemSettings);
      if (res.data.success) {
        setSettingsMsg({ type: 'success', text: 'Platform settings saved successfully!' });
        setSystemSettings(res.data.settings);
      }
    } catch (err) {
      console.error('Settings update error:', err);
      setSettingsMsg({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to save settings.' 
      });
    } finally {
      setSettingsSaving(false);
    }
  };

  // Avatar Upload Helper
  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setProfileMsg({ type: 'error', text: 'Image size must be under 2MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0b1120] via-[#1e1b4b] to-[#0f172a] rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-[1] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold uppercase tracking-wider mb-2">
              <Shield size={13} />
              Super Admin Settings
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">System & Account Management</h1>
            <p className="text-gray-300 text-sm mt-1 max-w-xl">
              Configure your administrator profile, update security credentials, manage platform commission fees, and control system availability.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-right">
              <p className="text-xs text-gray-300">Admin Account</p>
              <p className="text-sm font-bold text-white truncate max-w-[200px]">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-px">
        <button
          onClick={() => setTab('profile')}
          className={`flex items-center gap-2.5 px-5 py-3 text-sm font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            currentTab === 'profile'
              ? 'border-blue-600 text-blue-600 bg-white shadow-sm'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/60'
          }`}
        >
          <User size={18} />
          Profile & Identity
        </button>

        <button
          onClick={() => setTab('security')}
          className={`flex items-center gap-2.5 px-5 py-3 text-sm font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            currentTab === 'security'
              ? 'border-blue-600 text-blue-600 bg-white shadow-sm'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/60'
          }`}
        >
          <Key size={18} />
          Security & Password
        </button>

        <button
          onClick={() => setTab('platform')}
          className={`flex items-center gap-2.5 px-5 py-3 text-sm font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            currentTab === 'platform'
              ? 'border-blue-600 text-blue-600 bg-white shadow-sm'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/60'
          }`}
        >
          <Sliders size={18} />
          Platform & Fees
        </button>

        <button
          onClick={() => setTab('system')}
          className={`flex items-center gap-2.5 px-5 py-3 text-sm font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            currentTab === 'system'
              ? 'border-blue-600 text-blue-600 bg-white shadow-sm'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/60'
          }`}
        >
          <ShieldAlert size={18} />
          System & Maintenance
        </button>
      </div>

      {/* TAB 1: PROFILE & IDENTITY */}
      {currentTab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 animate-in fade-in">
          <div className="max-w-3xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Administrator Profile Details</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Update your identity details, email contact, and notification preferences.
              </p>
            </div>

            {profileMsg.text && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm ${
                profileMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {profileMsg.type === 'success' ? <CheckCircle2 size={18} className="shrink-0 text-emerald-600" /> : <AlertCircle size={18} className="shrink-0 text-red-600" />}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Avatar & Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-xl bg-gray-50/70 border border-gray-100">
                <div className="relative group w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-fuchsia-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden shadow-md">
                  {profileData.avatar ? (
                    <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{profileData.name ? profileData.name.charAt(0).toUpperCase() : 'A'}</span>
                  )}
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-semibold">
                    Change
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
                  </label>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{profileData.name || 'Super Admin'}</h3>
                  <p className="text-xs text-gray-500">{profileData.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      <Shield size={11} /> {user?.role || 'Super Admin'}
                    </span>
                    <span className="text-xs text-gray-400">Full System Control</span>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Admin Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                      placeholder="Admin Name"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Admin Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      required
                      placeholder="superadmin@mycastnow.com"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Direct Phone / Hotline</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Role / Designation</label>
                  <div className="relative">
                    <Shield size={16} className="absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={user?.role || 'Super Admin'}
                      disabled
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Admin Bio & Responsibilities</label>
                <textarea
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Primary executive duties, security oversight, etc."
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Notification Toggles */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Notification Preferences</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={profileData.notificationPreferences?.emailAlerts}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        notificationPreferences: {
                          ...profileData.notificationPreferences,
                          emailAlerts: e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Email System Alerts</p>
                      <p className="text-[11px] text-gray-500">Receive notifications on new registrations</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={profileData.notificationPreferences?.bookingAlerts}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        notificationPreferences: {
                          ...profileData.notificationPreferences,
                          bookingAlerts: e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">High-Value Booking Alerts</p>
                      <p className="text-[11px] text-gray-500">Alerts when new large contracts are booked</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-60 transition-all"
                >
                  {profileLoading ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                  {profileLoading ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: SECURITY & PASSWORD UPDATE */}
      {currentTab === 'security' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 animate-in fade-in">
          <div className="max-w-2xl">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold mb-2">
                <Key size={13} />
                Security Credentials
              </div>
              <h2 className="text-xl font-bold text-gray-900">Update Super Admin Password</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Ensure your account uses a strong, unique password to prevent unauthorized administrative access.
              </p>
            </div>

            {passwordMsg.text && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm ${
                passwordMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {passwordMsg.type === 'success' ? <CheckCircle2 size={18} className="shrink-0 text-emerald-600" /> : <AlertTriangle size={18} className="shrink-0 text-red-600" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Current Admin Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    placeholder="Enter current password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Key size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    placeholder="Enter new password (min. 6 characters)"
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CheckCircle2 size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    placeholder="Confirm your new password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Password Requirements Card */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600 space-y-1.5">
                <p className="font-semibold text-gray-700">Password Recommendations:</p>
                <p className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${passwordData.newPassword.length >= 6 ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  At least 6 characters in length
                </p>
                <p className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${/[0-9]/.test(passwordData.newPassword) ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  Contains at least one number
                </p>
                <p className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  Confirmation matches new password
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl shadow-md shadow-amber-500/20 disabled:opacity-60 transition-all"
                >
                  {passwordLoading ? <RefreshCw size={16} className="animate-spin" /> : <Lock size={16} />}
                  {passwordLoading ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: PLATFORM & COMMISSION SETTINGS */}
      {currentTab === 'platform' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 animate-in fade-in">
          <div className="max-w-3xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Platform Financial & Business Rules</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Set platform fee percentages, creator payout minimums, and automated approval workflows.
              </p>
            </div>

            {settingsMsg.text && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm ${
                settingsMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {settingsMsg.type === 'success' ? <CheckCircle2 size={18} className="shrink-0 text-emerald-600" /> : <AlertCircle size={18} className="shrink-0 text-red-600" />}
                <span>{settingsMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Platform Commission Rate (%)
                  </label>
                  <div className="relative">
                    <Percent size={16} className="absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={systemSettings.platformCommissionPercent}
                      onChange={(e) => setSystemSettings({ ...systemSettings, platformCommissionPercent: Number(e.target.value) })}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Deducted automatically from casting completion payouts</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Boost Plan Commission (%)
                  </label>
                  <div className="relative">
                    <Percent size={16} className="absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={systemSettings.boostCommissionPercent}
                      onChange={(e) => setSystemSettings({ ...systemSettings, boostCommissionPercent: Number(e.target.value) })}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Platform fee on spotlight & boost purchases</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Minimum Creator Withdrawal (₹)
                  </label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="number"
                      min="100"
                      value={systemSettings.minWithdrawalAmount}
                      onChange={(e) => setSystemSettings({ ...systemSettings, minWithdrawalAmount: Number(e.target.value) })}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Minimum wallet balance required for bank payout</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Default Currency
                  </label>
                  <select
                    value={systemSettings.currency}
                    onChange={(e) => setSystemSettings({ ...systemSettings, currency: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                  </select>
                </div>
              </div>

              {/* Automation Toggles */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <h4 className="text-sm font-bold text-gray-900">Automation & Approvals</h4>
                
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Auto-Approve Casting Calls</p>
                    <p className="text-xs text-gray-500">Company casting calls become active immediately without manual review</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSystemSettings(prev => ({ ...prev, autoApproveCastings: !prev.autoApproveCastings }))}
                    className="text-2xl transition-colors text-blue-600"
                  >
                    {systemSettings.autoApproveCastings ? <ToggleRight size={36} /> : <ToggleLeft size={36} className="text-gray-300" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Auto-Approve Creator Verification</p>
                    <p className="text-xs text-gray-500">Automatically grant verified badge to creators upon profile completion</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSystemSettings(prev => ({ ...prev, autoApproveCreators: !prev.autoApproveCreators }))}
                    className="text-2xl transition-colors text-blue-600"
                  >
                    {systemSettings.autoApproveCreators ? <ToggleRight size={36} /> : <ToggleLeft size={36} className="text-gray-300" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={settingsSaving}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-60 transition-all"
                >
                  {settingsSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                  {settingsSaving ? 'Saving...' : 'Save Financial Rules'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM & MAINTENANCE */}
      {currentTab === 'system' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 animate-in fade-in">
          <div className="max-w-3xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Platform Availability & Maintenance</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Toggle maintenance mode, broadcast announcements, and control user access.
              </p>
            </div>

            {settingsMsg.text && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm ${
                settingsMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {settingsMsg.type === 'success' ? <CheckCircle2 size={18} className="shrink-0 text-emerald-600" /> : <AlertCircle size={18} className="shrink-0 text-red-600" />}
                <span>{settingsMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              {/* Maintenance Mode Alert Box */}
              <div className={`p-5 rounded-2xl border transition-all ${
                systemSettings.maintenanceMode 
                  ? 'bg-amber-500/10 border-amber-300 text-amber-900' 
                  : 'bg-emerald-500/10 border-emerald-200 text-emerald-900'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      systemSettings.maintenanceMode ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                    }`}>
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold">
                        {systemSettings.maintenanceMode ? 'Maintenance Mode is Active' : 'System is Live in Production'}
                      </h4>
                      <p className="text-xs opacity-80 mt-0.5">
                        {systemSettings.maintenanceMode 
                          ? 'Public access is paused. Creators and companies see a maintenance notice.' 
                          : 'All public endpoints and portals are operational and accessible.'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSystemSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                    className="text-2xl transition-colors text-blue-600"
                  >
                    {systemSettings.maintenanceMode ? <ToggleRight size={38} className="text-amber-600" /> : <ToggleLeft size={38} className="text-gray-400" />}
                  </button>
                </div>
              </div>

              {/* System Broadcast Message */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Platform System Broadcast Notice
                </label>
                <textarea
                  rows={2}
                  value={systemSettings.systemNotice}
                  onChange={(e) => setSystemSettings({ ...systemSettings, systemNotice: e.target.value })}
                  placeholder="e.g. Scheduled server optimization tonight at 2:00 AM IST."
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
                <p className="text-[11px] text-gray-400 mt-1">Displayed as a marquee notice in public portals</p>
              </div>

              {/* Registration Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Allow New Registrations</p>
                    <p className="text-xs text-gray-500">Allow creators & companies to register</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSystemSettings(prev => ({ ...prev, allowNewRegistrations: !prev.allowNewRegistrations }))}
                    className="text-2xl text-blue-600"
                  >
                    {systemSettings.allowNewRegistrations ? <ToggleRight size={36} /> : <ToggleLeft size={36} className="text-gray-300" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Email Dispatch System</p>
                    <p className="text-xs text-gray-500">Send transactional OTP & booking emails</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSystemSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                    className="text-2xl text-blue-600"
                  >
                    {systemSettings.emailNotifications ? <ToggleRight size={36} /> : <ToggleLeft size={36} className="text-gray-300" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={settingsSaving}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-60 transition-all"
                >
                  {settingsSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                  {settingsSaving ? 'Saving...' : 'Save System Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
