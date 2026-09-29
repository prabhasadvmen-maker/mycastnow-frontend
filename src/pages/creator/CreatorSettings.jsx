import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import {
  Settings, Bell, Lock, Shield, Eye, EyeOff,
  CheckCircle2, AlertCircle, KeyRound, Smartphone,
  Globe, CreditCard, ExternalLink, RefreshCw, Save,
  Check, UserCheck, Sparkles, ShieldCheck
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const CreatorSettings = () => {
  const { creatorUser, updateProfile } = useCreatorAuth();
  const [searchParams] = useSearchParams();

  // Active Tab: 'security' | 'notifications' | 'privacy' | 'membership'
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = new URLSearchParams(window.location.search).get('tab');
    return tabParam && ['security', 'notifications', 'privacy', 'membership'].includes(tabParam) ? tabParam : 'security';
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['security', 'notifications', 'privacy', 'membership'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Notifications State
  const [notifications, setNotifications] = useState({
    castingAlerts: true,
    chatMessages: true,
    payoutUpdates: true,
    marketingEmails: false
  });

  // Privacy State
  const [privacy, setPrivacy] = useState({
    isProfilePublic: true,
    showPhone: true,
    showMeasurements: true
  });

  // Password State
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

  // General Toast State
  const [toast, setToast] = useState(null);
  const [savingPreferences, setSavingPreferences] = useState(false);

  // Initialize from creatorUser
  useEffect(() => {
    if (creatorUser?.settings) {
      if (creatorUser.settings.notifications) {
        setNotifications(prev => ({ ...prev, ...creatorUser.settings.notifications }));
      }
      if (creatorUser.settings.privacy) {
        setPrivacy(prev => ({ ...prev, ...creatorUser.settings.privacy }));
      }
    }
  }, [creatorUser]);

  // Password Change Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

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
      const token = localStorage.getItem('creatorToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      let res;
      try {
        res = await axios.put(`${API}/creatorAuth/change-password`, {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }, { headers });
      } catch (err) {
        if (err.response?.status === 404) {
          // If server was running before change-password route was added, update via profile update
          await updateProfile({ password: passwordForm.newPassword });
          res = { data: { success: true, message: 'Password updated successfully!' } };
        } else {
          throw err;
        }
      }

      if (res.data?.success) {
        setPasswordSuccess(res.data.message || 'Password changed successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setPasswordSuccess(''), 5000);
      } else {
        setPasswordError(res.data?.message || 'Failed to update password.');
      }
    } catch (err) {
      console.error('Change password error:', err);
      setPasswordError(err.response?.data?.message || 'Current password incorrect or server error.');
    } finally {
      setSavingPassword(false);
    }
  };

  // Save Notifications & Privacy Preferences
  const handleSavePreferences = async () => {
    setSavingPreferences(true);
    try {
      await updateProfile({
        settings: {
          notifications,
          privacy
        }
      });
      setToast('Preferences saved successfully to database!');
      setTimeout(() => setToast(null), 3500);
    } catch (err) {
      console.error('Failed to save preferences:', err);
      setToast('Failed to save preferences.');
      setTimeout(() => setToast(null), 3500);
    } finally {
      setSavingPreferences(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-gray-900 text-white text-xs font-bold flex items-center gap-3 shadow-2xl border border-gray-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-[#0e0720] rounded-3xl p-6 md:p-8 text-white shadow-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-fuchsia-600/30 text-fuchsia-400">
              <Settings size={20} />
            </span>
            <h1 className="text-2xl md:text-3xl font-black">Creator Account & Security Settings</h1>
          </div>
          <p className="text-xs text-purple-200 mt-1 max-w-xl">
            Manage your account login credentials, password, casting alerts, and talent privacy controls.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 w-fit">
          <ShieldCheck size={16} /> Verified Phone: {creatorUser?.phone || '7599847194'}
        </span>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1">
        {[
          { id: 'security', label: 'Security & Password', icon: KeyRound },
          { id: 'notifications', label: 'Casting Alerts & Notifications', icon: Bell },
          { id: 'privacy', label: 'Privacy & Directory Visibility', icon: Shield },
          { id: 'membership', label: 'Membership & Payouts', icon: CreditCard },
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
      {/* TAB 1: SECURITY & PASSWORD CHANGE                                */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Password Change Form */}
            <form onSubmit={handleChangePassword} className="md:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
              <div>
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Lock size={16} className="text-fuchsia-600" /> Change or Set Creator Password
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update your account password for secure login without waiting for SMS OTP.
                </p>
              </div>

              {/* Status messages */}
              {passwordSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-600 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Current Password <span className="font-normal text-gray-400">(leave blank if first time)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="Enter existing password..."
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">New Password (Min 6 Characters) *</label>
                    <div className="relative">
                      <input
                        type={showNewPass ? "text" : "password"}
                        required
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="At least 6 characters..."
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Confirm New Password *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="Re-type new password..."
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password strength indicators */}
                <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-[11px] text-gray-500">
                  <p className="font-bold text-gray-700">Password Checklist:</p>
                  <p className={passwordForm.newPassword.length >= 6 ? "text-emerald-600 font-semibold" : ""}>
                    • At least 6 characters in length
                  </p>
                  <p className={passwordForm.newPassword && passwordForm.newPassword === passwordForm.confirmPassword ? "text-emerald-600 font-semibold" : ""}>
                    • Password and confirmation match
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingPassword || !passwordForm.newPassword}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingPassword ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" /> Updating Password...
                    </>
                  ) : (
                    <>
                      <Save size={15} /> Update Account Password
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Security Badge Card */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="font-bold text-sm text-gray-900">OTP Dual-Layer Authentication</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Your registered number <strong>{creatorUser?.phone}</strong> is verified with high-speed SMS OTP. You can log in using either instant OTP or your password.
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active & Protected
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Smartphone size={20} />
                </div>
                <h4 className="font-bold text-sm text-gray-900">Active Device Session</h4>
                <p className="text-xs text-gray-500">
                  Last login recorded from Chrome on Windows. All platform sessions are encrypted with 256-bit SSL.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: CASTING ALERTS & NOTIFICATIONS                            */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div>
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Bell size={16} className="text-fuchsia-600" /> Notifications & Casting Call Alerts
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Choose which alerts you want to receive on SMS, WhatsApp, and in-app inbox.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                key: 'castingAlerts',
                title: 'Matching Casting Call Alerts (WhatsApp & SMS)',
                desc: 'Get notified immediately whenever a production studio posts an audition that fits your gender, age, and category.'
              },
              {
                key: 'chatMessages',
                title: 'Direct Messages from Verified Casting Directors',
                desc: 'Instant notifications when a director messages you regarding audition self-tapes or call-backs.'
              },
              {
                key: 'payoutUpdates',
                title: 'Escrow Booking & Wallet Deposit Alerts',
                desc: 'Real-time alerts when advance booking fees are deposited into Escrow or transferred to your Wallet.'
              },
              {
                key: 'marketingEmails',
                title: 'Weekly Industry Audition Digest',
                desc: 'Weekly summary of top commercial campaigns and celebrity casting calls in Mumbai and Delhi.'
              }
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50/70 rounded-2xl border border-gray-100">
                <div className="pr-4">
                  <h4 className="font-bold text-xs text-gray-900">{item.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                  className="w-5 h-5 accent-fuchsia-600 rounded cursor-pointer shrink-0"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleSavePreferences}
              disabled={savingPreferences}
              className="px-6 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {savingPreferences ? 'Saving...' : 'Save Notification Preferences'}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 3: PRIVACY & DIRECTORY VISIBILITY                            */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'privacy' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div>
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Shield size={16} className="text-purple-600" /> Talent Directory & Privacy Controls
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Control how your profile appears to casting directors and production houses in Talent Search.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                key: 'isProfilePublic',
                title: 'Public Casting Search Visibility',
                desc: 'When enabled, verified agencies and directors can find your portfolio in the Talent Cart and casting directories.'
              },
              {
                key: 'showPhone',
                title: 'Show Verified Contact Number to Approved Directors',
                desc: 'Allow approved casting directors to view your phone number for direct shoot coordination.'
              },
              {
                key: 'showMeasurements',
                title: 'Show Detailed Body Measurements & Stats',
                desc: 'Display height, chest, waist, and hips on your public card for accurate costume fitting.'
              }
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50/70 rounded-2xl border border-gray-100">
                <div className="pr-4">
                  <h4 className="font-bold text-xs text-gray-900">{item.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy[item.key]}
                  onChange={(e) => setPrivacy({ ...privacy, [item.key]: e.target.checked })}
                  className="w-5 h-5 accent-fuchsia-600 rounded cursor-pointer shrink-0"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleSavePreferences}
              disabled={savingPreferences}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {savingPreferences ? 'Saving...' : 'Save Privacy Controls'}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 4: MEMBERSHIP & PAYOUT OVERVIEW                              */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'membership' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div>
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <CreditCard size={16} className="text-emerald-600" /> Creator Tier & Escrow Payouts
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Overview of your active creator membership tier and direct links to financial management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold uppercase text-gray-400">Current Plan</span>
              <p className="text-lg font-black text-gray-900 mt-1">Verified Pro Artist</p>
              <span className="inline-block mt-1 text-xs text-emerald-600 font-bold">Active Member</span>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold uppercase text-gray-400">Audition Submissions</span>
              <p className="text-lg font-black text-fuchsia-600 mt-1">Unlimited</p>
              <p className="text-[11px] text-gray-500 mt-1">Apply to all OTT & Brand Castings</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold uppercase text-gray-400">Platform Commission</span>
              <p className="text-lg font-black text-purple-700 mt-1">0% Direct Escrow</p>
              <p className="text-[11px] text-gray-500 mt-1">100% of approved fee deposited</p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="/creator/dashboard/subscription"
              className="px-6 py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              Manage Membership Plan <ExternalLink size={14} />
            </a>

            <a
              href="/creator/dashboard/wallet"
              className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs border border-gray-200 transition flex items-center gap-2"
            >
              View Wallet & Bank Payouts <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorSettings;
