import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import {
  User, Mail, Phone, MapPin, Calendar, Camera,
  Save, CheckCircle2, ShieldCheck, Sparkles, AlertCircle
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const CreatorProfile = () => {
  const { creatorUser, updateProfile } = useCreatorAuth();
  const [form, setForm] = useState({
    fullName: 'Arvind Kumar',
    email: 'arvind.model@gmail.com',
    phone: '7599847194',
    city: 'Mumbai',
    gender: 'Male',
    bio: 'Professional fashion and commercial runway model with 4+ years of industry experience across brand ad campaigns and OTT series.'
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (creatorUser) {
      setForm({
        fullName: creatorUser.basicDetails?.fullName || 'Arvind Kumar',
        email: creatorUser.email || 'arvind.model@gmail.com',
        phone: creatorUser.phone || '7599847194',
        city: creatorUser.basicDetails?.city || 'Mumbai',
        gender: creatorUser.basicDetails?.gender || 'Male',
        bio: creatorUser.basicDetails?.bio || 'Professional runway model and actor.'
      });
    }
  }, [creatorUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile({
        basicDetails: {
          fullName: form.fullName,
          city: form.city,
          gender: form.gender,
          bio: form.bio
        },
        email: form.email
      });
      setToast('Profile updated successfully!');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xl animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#180a22] rounded-3xl p-6 text-white shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Creator Profile & Identity</h1>
          <p className="text-xs text-purple-200 mt-1">Manage your official talent identity and casting contact details.</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
          <ShieldCheck size={14} /> Approved Creator
        </span>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number (Verified)</label>
            <input
              type="text"
              disabled
              value={form.phone}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Base City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 mb-1">Professional Bio</label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatorProfile;
