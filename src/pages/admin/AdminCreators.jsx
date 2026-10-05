import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { User, CheckCircle, XCircle, Clock, Search, Filter, Eye, Phone, MapPin, Briefcase, Settings, Trash2 } from 'lucide-react';

const AdminCreators = () => {
  const navigate = useNavigate();
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [dropdownState, setDropdownState] = useState(null);

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/creators`);
      setCreators(res.data);
    } catch (err) {
      console.error('Failed to fetch creators', err);
    }
    setLoading(false);
  };

  const handleDelete = async (creatorId) => {
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/creators/${creatorId}`);
      setCreators(prev => prev.filter(c => c._id !== creatorId));
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
    } catch (err) {
      toast.error('Failed to update active status');
    }
  };

  const handleStatusUpdate = async (creatorId, newStatus) => {
    setStatusLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/creators/${creatorId}/status`, { status: newStatus });
      // Update local state
      setCreators(prev => prev.map(c => c._id === creatorId ? { ...c, status: newStatus, isApproved: newStatus === 'approved' } : c));
      
      // Update selected creator if open
      if (selectedCreator && selectedCreator._id === creatorId) {
        setSelectedCreator(prev => ({ ...prev, status: newStatus, isApproved: newStatus === 'approved' }));
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
    setStatusLoading(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={14}/> Approved</span>;
      case 'rejected': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={14}/> Rejected</span>;
      default: return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={14}/> Pending</span>;
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Creators...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto flex gap-8">
      
      {/* LEFT: Creators Table */}
      <div className={`flex-1 transition-all ${selectedCreator ? 'w-1/2' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Creator Profiles</h1>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input type="text" placeholder="Search creators..." className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button className="p-2 border rounded-lg text-gray-600 hover:bg-gray-50"><Filter size={20}/></button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-visible min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 font-semibold w-16">Sr.</th>
                <th className="p-4 font-semibold">Creator</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {creators.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No creators found.</td></tr>
              ) : creators.map((creator, index) => (
                <tr key={creator._id} className="border-b border-gray-50 hover:bg-blue-50/30 transition">
                  <td className="p-4 text-sm text-gray-500 font-medium">#{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                        {creator.basicDetails?.profilePhoto ? (
                          <img src={creator.basicDetails.profilePhoto} alt="" className="w-full h-full object-cover"/>
                        ) : <User className="text-gray-400" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{creator.basicDetails?.fullName || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">{creator.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{creator.professionalDetails?.primaryCategory || 'N/A'}</td>
                  <td className="p-4 text-sm text-gray-600">{creator.basicDetails?.city || 'N/A'}</td>
                  <td className="p-4">
                    <div className="flex flex-col items-start gap-1">
                      {getStatusBadge(creator.status)}
                      {creator.isActive === false && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">DISABLED</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right relative">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setDropdownState({
                            id: dropdownState?.id === creator._id ? null : creator._id,
                            top: rect.bottom + window.scrollY,
                            left: rect.left + window.scrollX - 120
                          });
                        }}
                        className="text-gray-500 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition"
                        title="Settings"
                      >
                        <Settings size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Dropdown */}
      {dropdownState?.id && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setDropdownState(null)}></div>
          <div 
            className="fixed z-50 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-100"
            style={{ top: dropdownState.top, left: dropdownState.left }}
          >
            <button 
              onClick={() => { navigate(`/admin/profiles/${dropdownState.id}`); setDropdownState(null); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium flex items-center gap-2"
            >
              <Eye size={16} /> View Profile
            </button>
            <button 
              onClick={() => { handleStatusUpdate(dropdownState.id, 'approved'); setDropdownState(null); }}
              className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 font-medium flex items-center gap-2"
            >
              <CheckCircle size={16} /> Approve
            </button>
            <button 
              onClick={() => { handleStatusUpdate(dropdownState.id, 'rejected'); setDropdownState(null); }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
            >
              <XCircle size={16} /> Reject
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
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCreators;
