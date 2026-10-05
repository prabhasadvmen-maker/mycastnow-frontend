import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, User, Mail, Phone, Shield, Camera, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || 'Super Admin',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || 'Platform Super Administrator with full privileges.',
        avatar: user.avatar || ''
      });
    }
    setSuccessMsg('');
    setErrorMsg('');
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/auth/profile`, formData);
      if (res.data.success) {
        setSuccessMsg('Profile updated successfully!');
        if (updateUser) {
          updateUser(res.data.user);
        }
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b1120] to-[#1e1b4b] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <User size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Admin Profile</h3>
              <p className="text-xs text-gray-300">Manage your credentials & account details</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl flex items-center gap-2">
              <Check size={18} className="text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
              <AlertCircle size={18} className="text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex items-center gap-4 pb-2 border-b border-gray-100">
            <div className="relative group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-fuchsia-600 flex items-center justify-center text-white text-xl font-bold overflow-hidden shadow-md">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  formData.name ? formData.name.charAt(0).toUpperCase() : 'A'
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-105">
                <Camera size={13} />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800">{formData.name || 'Super Admin'}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <Shield size={11} /> {user?.role || 'Super Admin'}
                </span>
                <span className="text-xs text-gray-400">ID: {user?.id || user?._id || 'Verified'}</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3 text-gray-400" />
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Admin Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3 text-gray-400" />
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  required
                  placeholder="admin@mycastnow.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-3 text-gray-400" />
              <input 
                type="text" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Admin Bio / Role Description</label>
            <textarea 
              name="bio" 
              rows={2}
              value={formData.bio} 
              onChange={handleChange}
              placeholder="Administrator notes or bio..."
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
            />
          </div>

          {/* Quick link to password change */}
          <div className="pt-2 flex items-center justify-between text-xs border-t border-gray-100">
            <span className="text-gray-500">Need to update your password?</span>
            <button 
              type="button"
              onClick={() => {
                onClose();
                navigate('/admin/settings?tab=security');
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
            >
              Go to Password Settings →
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-60 transition-all"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfileModal;
