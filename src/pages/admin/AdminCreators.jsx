import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { User, CheckCircle, XCircle, Clock, Search, Eye, Settings, Trash2, AlertCircle, Sparkles } from 'lucide-react';
import { getMediaUrl } from '../../utils/mediaUtils';

const AdminCreators = () => {
  const navigate = useNavigate();
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [dropdownState, setDropdownState] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/creators`);
      setCreators(res.data);
    } catch (err) {
      console.error('Failed to fetch creators', err);
      toast.error('Failed to fetch creators list');
    }
    setLoading(false);
  };

  const handleDelete = async (creatorId) => {
    if (!window.confirm('Are you sure you want to permanently delete this creator record?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/creators/${creatorId}`);
      setCreators(prev => prev.filter(c => c._id !== creatorId));
      toast.success('Creator record deleted successfully');
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  const handleActiveToggle = async (creatorId, isActive) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/creators/${creatorId}/active`, { isActive });
      setCreators(prev => prev.map(c => c._id === creatorId ? { ...c, isActive } : c));
      if (selectedCreator && selectedCreator._id === creatorId) {
        setSelectedCreator(prev => ({ ...prev, isActive }));
      }
      toast.success(`Creator account ${isActive ? 'enabled' : 'disabled'}`);
    } catch (err) {
      toast.error('Failed to update active status');
    }
  };

  const isIncomplete = (creator) => {
    return !creator.isProfileComplete || creator.status === 'incomplete';
  };

  const getStepTitle = (step) => {
    const titles = {
      1: 'Category',
      2: 'Basic Details',
      3: 'Professional',
      4: 'Physical',
      5: 'Portfolio',
      6: 'Pricing',
      7: 'Availability',
      8: 'Payment',
      9: 'Preview'
    };
    return titles[step] || 'Category';
  };

  const handleStatusUpdate = async (creatorId, newStatus) => {
    const creator = creators.find(c => c._id === creatorId);
    if (newStatus === 'approved' && creator && isIncomplete(creator)) {
      const proceed = window.confirm(
        `Notice: This creator has NOT finished onboarding yet (Step ${creator.onboardingStep || 1}/9: ${getStepTitle(creator.onboardingStep || 1)}).\n\nAre you sure you want to approve this incomplete profile?`
      );
      if (!proceed) return;
    }

    setStatusLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/creators/${creatorId}/status`, { status: newStatus });
      setCreators(prev => prev.map(c => c._id === creatorId ? { ...c, status: newStatus, isApproved: newStatus === 'approved' } : c));
      
      if (selectedCreator && selectedCreator._id === creatorId) {
        setSelectedCreator(prev => ({ ...prev, status: newStatus, isApproved: newStatus === 'approved' }));
      }
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
    setStatusLoading(false);
  };

  const getStatusBadge = (creator) => {
    if (isIncomplete(creator)) {
      const step = creator.onboardingStep || 1;
      return (
        <div className="flex flex-col gap-1 items-start">
          <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <AlertCircle size={12} className="text-amber-600" /> Incomplete
          </span>
          <span className="text-[11px] text-gray-500 font-medium">
            Step {step}/9 ({getStepTitle(step)})
          </span>
        </div>
      );
    }
    switch (creator.status) {
      case 'approved':
        return (
          <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
            <CheckCircle size={13} className="text-emerald-600" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
            <XCircle size={13} className="text-rose-600" /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
            <Clock size={13} className="text-blue-600" /> Pending Review
          </span>
        );
    }
  };

  // Counts for tabs
  const counts = {
    all: creators.length,
    incomplete: creators.filter(isIncomplete).length,
    pending: creators.filter(c => !isIncomplete(c) && c.status === 'pending').length,
    approved: creators.filter(c => !isIncomplete(c) && c.status === 'approved').length,
    rejected: creators.filter(c => !isIncomplete(c) && c.status === 'rejected').length
  };

  // Filtering
  const filteredCreators = creators.filter(creator => {
    const term = searchTerm.toLowerCase().trim();
    const name = (creator.basicDetails?.fullName || '').toLowerCase();
    const phone = (creator.phone || '').toLowerCase();
    const category = (creator.professionalDetails?.primaryCategory || '').toLowerCase();
    const city = (creator.basicDetails?.city || '').toLowerCase();
    const matchesSearch = !term || name.includes(term) || phone.includes(term) || category.includes(term) || city.includes(term);

    if (!matchesSearch) return false;

    if (activeTab === 'Incomplete') return isIncomplete(creator);
    if (activeTab === 'Pending') return !isIncomplete(creator) && creator.status === 'pending';
    if (activeTab === 'Approved') return !isIncomplete(creator) && creator.status === 'approved';
    if (activeTab === 'Rejected') return !isIncomplete(creator) && creator.status === 'rejected';
    return true;
  });

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-fuchsia-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-medium text-sm">Loading Creators...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Creator Profiles</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor verified artists and dropped-off incomplete registrations in real-time.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none shadow-sm transition"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'All', label: 'All Creators', count: counts.all, color: 'text-gray-700' },
          { id: 'Incomplete', label: 'Incomplete Signups', count: counts.incomplete, color: 'text-amber-700', alert: true },
          { id: 'Pending', label: 'Pending Review', count: counts.pending, color: 'text-blue-700' },
          { id: 'Approved', label: 'Approved', count: counts.approved, color: 'text-emerald-700' },
          { id: 'Rejected', label: 'Rejected', count: counts.rejected, countColor: 'bg-rose-100 text-rose-700', color: 'text-rose-700' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === tab.id
                ? 'bg-white/20 text-white'
                : tab.alert ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Creators Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold w-12 text-center">#</th>
                <th className="p-4 font-bold">Creator</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Location</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCreators.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-500">
                    <p className="font-semibold text-gray-700 mb-1">No creators found</p>
                    <p className="text-xs text-gray-400">Try adjusting your search or active filter tab.</p>
                  </td>
                </tr>
              ) : filteredCreators.map((creator, index) => {
                const incomplete = isIncomplete(creator);
                return (
                  <tr key={creator._id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="p-4 text-xs text-gray-400 font-medium text-center">{index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                          {creator.basicDetails?.profilePhoto ? (
                            <img src={getMediaUrl(creator.basicDetails.profilePhoto)} alt="" className="w-full h-full object-cover"/>
                          ) : (
                            <User className="text-gray-400 w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">
                            {creator.basicDetails?.fullName || (
                              <span className="text-amber-700 italic font-semibold">Incomplete Lead</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">+91 {creator.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-700">
                      {creator.professionalDetails?.primaryCategory || (
                        <span className="text-gray-400 text-xs italic">Not selected</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {creator.basicDetails?.city || (
                        <span className="text-gray-400 text-xs italic">Not set</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-start gap-1">
                        {getStatusBadge(creator)}
                        {creator.isActive === false && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">
                            DISABLED
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right relative">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => navigate(`/admin/profiles/${creator._id}`)}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          title="View Details"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button 
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setDropdownState({
                              id: dropdownState?.id === creator._id ? null : creator._id,
                              top: rect.bottom + window.scrollY,
                              left: rect.left + window.scrollX - 130
                            });
                          }}
                          className="text-gray-400 hover:text-gray-800 p-1.5 rounded-lg hover:bg-gray-100 transition"
                          title="More Actions"
                        >
                          <Settings size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Dropdown */}
      {dropdownState?.id && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setDropdownState(null)}></div>
          <div 
            className="fixed z-50 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 animate-in fade-in zoom-in-95 duration-100"
            style={{ top: dropdownState.top, left: dropdownState.left }}
          >
            <button 
              onClick={() => { navigate(`/admin/profiles/${dropdownState.id}`); setDropdownState(null); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium flex items-center gap-2"
            >
              <Eye size={15} /> View Profile
            </button>
            <button 
              onClick={() => { handleStatusUpdate(dropdownState.id, 'approved'); setDropdownState(null); }}
              className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 font-medium flex items-center gap-2"
            >
              <CheckCircle size={15} /> Approve
            </button>
            <button 
              onClick={() => { handleStatusUpdate(dropdownState.id, 'rejected'); setDropdownState(null); }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
            >
              <XCircle size={15} /> Reject
            </button>
            <div className="h-px bg-gray-100 my-1"></div>
            {creators.find(c => c._id === dropdownState.id)?.isActive === false ? (
              <button 
                onClick={() => { handleActiveToggle(dropdownState.id, true); setDropdownState(null); }}
                className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium"
              >
                Enable Account
              </button>
            ) : (
              <button 
                onClick={() => { handleActiveToggle(dropdownState.id, false); setDropdownState(null); }}
                className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 font-medium"
              >
                Disable Account
              </button>
            )}
            <div className="h-px bg-gray-100 my-1"></div>
            <button 
              onClick={() => { handleDelete(dropdownState.id); setDropdownState(null); }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-2"
            >
              <Trash2 size={15} /> Delete Account
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCreators;
