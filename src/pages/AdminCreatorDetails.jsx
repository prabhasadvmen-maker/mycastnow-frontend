import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, CheckCircle, XCircle, Clock, Phone, MapPin, Briefcase, ArrowLeft, Trash2 } from 'lucide-react';

const AdminCreatorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    fetchCreator();
  }, [id]);

  const fetchCreator = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/creators/${id}`);
      setCreator(res.data);
    } catch (err) {
      console.error('Failed to fetch creator', err);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (newStatus, reason = '') => {
    setStatusLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/creators/${id}/status`, { status: newStatus, rejectionReason: reason });
      setCreator(prev => ({ ...prev, status: newStatus, isApproved: newStatus === 'approved', rejectionReason: reason }));
    } catch (err) {
      alert('Failed to update status');
    }
    setStatusLoading(false);
  };

  const handleActiveToggle = async (newActiveState) => {
    setStatusLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/creators/${id}/active`, { isActive: newActiveState });
      setCreator(prev => ({ ...prev, isActive: newActiveState }));
    } catch (err) {
      alert('Failed to update active status');
    }
    setStatusLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this creator account?")) return;
    setStatusLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/creators/${id}`);
      navigate('/profiles');
    } catch (err) {
      alert('Failed to delete account');
      setStatusLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={14}/> Approved</span>;
      case 'rejected': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={14}/> Rejected</span>;
      default: return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={14}/> Pending</span>;
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Creator Details...</div>;
  if (!creator) return <div className="p-8 text-center text-red-500">Creator not found.</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      {/* Header / Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/profiles')}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Creator Details</h1>
        <div className="ml-auto flex gap-4">
          <button 
            onClick={handleDelete}
            disabled={statusLoading}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Trash2 size={18} /> Delete
          </button>
          
          {creator.status === 'pending' && (
            <>
              <button 
                onClick={() => {
                  const reason = window.prompt("Please enter the reason for rejection:");
                  if (reason !== null && reason.trim() !== '') {
                    handleStatusUpdate('rejected', reason);
                  } else if (reason !== null) {
                    alert("Rejection reason is required.");
                  }
                }}
                disabled={statusLoading}
                className="px-8 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <XCircle size={18} /> Reject
              </button>

              <button 
                onClick={() => handleStatusUpdate('approved')}
                disabled={statusLoading}
                className="px-8 py-2.5 bg-green-500 text-white hover:bg-green-600 font-bold rounded-xl transition-colors shadow-lg shadow-green-500/30 disabled:opacity-50 flex items-center gap-2"
              >
                <CheckCircle size={18} /> Approve
              </button>
            </>
          )}

          {creator.status === 'approved' && (
            <button 
              onClick={() => handleActiveToggle(!creator.isActive)}
              disabled={statusLoading}
              className={`px-8 py-2.5 font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 ${
                creator.isActive 
                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              <CheckCircle size={18} /> {creator.isActive ? 'Disable Account' : 'Enable Account'}
            </button>
          )}
        </div>
      </div>

      {/* Top Summary Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm mb-8 flex items-start gap-8">
        <div className="w-40 h-40 rounded-3xl bg-gray-100 overflow-hidden shrink-0 border-4 border-white shadow-xl">
          {creator.basicDetails?.profilePhoto ? (
            <img src={creator.basicDetails.profilePhoto} alt="Profile" className="w-full h-full object-cover"/>
          ) : <div className="w-full h-full flex items-center justify-center"><User size={48} className="text-gray-400" /></div>}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{creator.basicDetails?.fullName || 'Anonymous'}</h1>
              <p className="text-blue-600 font-medium text-xl">{creator.professionalDetails?.primaryCategory || 'Category Not Set'}</p>
            </div>
            {getStatusBadge(creator.status)}
          </div>
          
          <div className="flex gap-8 mt-6 bg-gray-50 p-4 rounded-2xl">
            <div className="flex items-center gap-3 text-gray-600"><Phone size={20} className="text-gray-400"/> <span className="font-medium">{creator.phone}</span></div>
            <div className="flex items-center gap-3 text-gray-600"><MapPin size={20} className="text-gray-400"/> <span className="font-medium">{creator.basicDetails?.city || 'Location Not Set'}</span></div>
            <div className="flex items-center gap-3 text-gray-600"><Clock size={20} className="text-gray-400"/> <span className="font-medium">Joined: {new Date(creator.createdAt).toLocaleDateString()}</span></div>
          </div>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        
        {/* Left Column */}
        <div className="space-y-8">
          {/* Bio */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">About / Bio</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
              {creator.basicDetails?.bio || <span className="text-gray-400 italic">No bio provided.</span>}
            </p>
          </div>

          {/* Physical Details */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Physical Attributes</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              <div><p className="text-sm text-gray-500 mb-1">Height</p><p className="font-bold text-gray-800 text-lg">{creator.physicalDetails?.height || '-'}</p></div>
              <div><p className="text-sm text-gray-500 mb-1">Weight</p><p className="font-bold text-gray-800 text-lg">{creator.physicalDetails?.weight || '-'}</p></div>
              <div><p className="text-sm text-gray-500 mb-1">Chest/Bust</p><p className="font-bold text-gray-800 text-lg">{creator.physicalDetails?.chest || '-'}</p></div>
              <div><p className="text-sm text-gray-500 mb-1">Waist</p><p className="font-bold text-gray-800 text-lg">{creator.physicalDetails?.waist || '-'}</p></div>
              <div><p className="text-sm text-gray-500 mb-1">Hips</p><p className="font-bold text-gray-800 text-lg">{creator.physicalDetails?.hips || '-'}</p></div>
              <div><p className="text-sm text-gray-500 mb-1">Eye Color</p><p className="font-bold text-gray-800 text-lg">{creator.physicalDetails?.eyeColor || '-'}</p></div>
              <div><p className="text-sm text-gray-500 mb-1">Hair Color</p><p className="font-bold text-gray-800 text-lg">{creator.physicalDetails?.hairColor || '-'}</p></div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Professional Details */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Professional Info</h3>
            <div className="space-y-6">
              <div><p className="text-sm text-gray-500 mb-1">Experience</p><p className="font-bold text-gray-800 text-lg">{creator.professionalDetails?.experience || '-'}</p></div>
              
              <div>
                <p className="text-sm text-gray-500 mb-3">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {creator.professionalDetails?.skills?.length > 0 
                    ? creator.professionalDetails.skills.map((s,i) => <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold border border-blue-100">{s}</span>)
                    : <span className="text-gray-400">-</span>
                  }
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-3">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {creator.basicDetails?.languages?.length > 0 
                    ? creator.basicDetails.languages.map((l,i) => <span key={i} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-bold border border-gray-200">{l}</span>)
                    : <span className="text-gray-400">-</span>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Pricing & Availability</h3>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div><p className="text-sm text-gray-500 mb-1">Hourly Rate</p><p className="font-bold text-gray-800 text-2xl">{creator.pricing?.hourlyRate ? `₹${creator.pricing.hourlyRate}` : '-'}</p></div>
              <div><p className="text-sm text-gray-500 mb-1">Day Rate</p><p className="font-bold text-gray-800 text-2xl">{creator.pricing?.dayRate ? `₹${creator.pricing.dayRate}` : '-'}</p></div>
            </div>
            <div><p className="text-sm text-gray-500 mb-1">Availability Status</p><p className="font-bold text-gray-800 text-lg">{creator.availability?.status || 'Unknown'}</p></div>
          </div>
        </div>
      </div>
      
      {/* Portfolio Section */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Portfolio Showcase</h3>
        {creator.portfolio?.photos?.length > 0 || creator.portfolio?.videos?.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
            {creator.portfolio?.photos?.map((photo, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm"><img src={photo} className="w-full h-full object-cover" alt="portfolio"/></div>
            ))}
            {creator.portfolio?.videos?.map((vid, i) => (
              <div key={i} className="aspect-square bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 shadow-sm"><video src={vid} className="w-full h-full object-cover" controls /></div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-lg">No portfolio items uploaded yet.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminCreatorDetails;
