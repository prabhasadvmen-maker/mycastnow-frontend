import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Search, Plus, Edit2, Trash2, Calendar, MapPin, X, Clapperboard, Briefcase, 
  Settings, Image as ImageIcon, MoreVertical, Eye, CheckCircle2, XCircle, 
  Clock, Building2, AlertTriangle, ShieldCheck, Mail, User, Layers, Tag, 
  DollarSign, Check, ArrowLeft, ExternalLink, Sparkles
} from 'lucide-react';

const AdminCasting = () => {
  const [castings, setCastings] = useState([]);
  const [pendingCastings, setPendingCastings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [formData, setFormData] = useState({
    title: '', description: '', roleType: '', location: '', budget: '', deadline: '', status: 'Open', image: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [approvalLoading, setApprovalLoading] = useState(null);
  const [reviewCasting, setReviewCasting] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [reviewMode, setReviewMode] = useState('review'); // 'review' | 'reject'
  const [toastMsg, setToastMsg] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (type, text) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4500);
  };

  const openReviewModal = (casting, mode = 'review') => {
    setReviewCasting(casting);
    setRejectReason(casting.rejectionReason || '');
    setReviewMode(mode);
    setActiveDropdown(null);
  };

  useEffect(() => {
    fetchCastings();
    fetchPendingCastings();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (!e.target.closest('.action-dropdown')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCastings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/casting`);
      setCastings(res.data);
    } catch (error) {
      console.error('Error fetching castings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingCastings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/casting/pending`);
      setPendingCastings(res.data.castings || []);
    } catch (error) {
      console.error('Error fetching pending castings:', error);
    }
  };

  const handleApproveCasting = async (id, title) => {
    setApprovalLoading(id);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/casting/${id}/approve`);
      setPendingCastings(prev => prev.filter(c => c._id !== id));
      fetchCastings(); // refresh main list
      setReviewCasting(null);
      toast.success(`✅ Casting "${title}" approved and published live!`);
    } catch (error) {
      console.error('Error approving casting:', error);
      toast.error('Failed to approve casting');
    } finally {
      setApprovalLoading(null);
    }
  };

  const handleRejectCasting = async (id, title) => {
    const reason = rejectReason.trim() || 'Does not meet platform guidelines';
    setApprovalLoading(id);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/casting/${id}/reject`, { reason });
      setPendingCastings(prev => prev.filter(c => c._id !== id));
      fetchCastings();
      setReviewCasting(null);
      setRejectReason('');
      setReviewMode('review');
      toast.info(`Casting "${title}" has been rejected.`);
    } catch (error) {
      console.error('Error rejecting casting:', error);
      toast.error('Failed to reject casting');
    } finally {
      setApprovalLoading(null);
    }
  };

  const handleOpenModal = (casting = null) => {
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    if (casting) {
      setEditingId(casting._id);
      setFormData({
        title: casting.title,
        description: casting.description,
        roleType: casting.roleType,
        location: casting.location,
        budget: casting.budget,
        deadline: new Date(casting.deadline).toISOString().split('T')[0],
        status: casting.status,
        image: casting.image || ''
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', roleType: '', location: '', budget: '', deadline: '', status: 'Open', image: '' });
    }
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      let finalImageUrl = formData.image;
      
      // Upload image if a new file is selected
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('files', imageFile);
        const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL}/upload/portfolio`, uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (uploadRes.data.success && uploadRes.data.files.length > 0) {
          finalImageUrl = uploadRes.data.files[0].url;
        }
      }

      const submissionData = { ...formData, image: finalImageUrl };

      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/admin/casting/${editingId}`, submissionData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/casting`, submissionData);
      }
      setIsModalOpen(false);
      fetchCastings();
    } catch (error) {
      console.error('Error saving casting:', error);
      toast.error('Failed to save casting call');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    setActiveDropdown(null);
    if (!window.confirm('Are you sure you want to delete this casting call?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/casting/${id}`);
      setCastings(castings.filter(c => c._id !== id));
      toast.info('Casting call deleted successfully');
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete casting call');
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold animate-in slide-in-from-top-4 duration-200 ${
          toastMsg.type === 'success' 
            ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/30' 
            : toastMsg.type === 'error'
            ? 'bg-red-600 text-white border-red-500 shadow-red-600/30'
            : 'bg-gray-900 text-white border-gray-800 shadow-gray-900/30'
        }`}>
          {toastMsg.type === 'success' && <CheckCircle2 size={18} className="shrink-0" />}
          {toastMsg.type === 'error' && <XCircle size={18} className="shrink-0" />}
          {toastMsg.type === 'info' && <AlertTriangle size={18} className="shrink-0" />}
          <span>{toastMsg.text}</span>
          <button onClick={() => setToastMsg(null)} className="ml-2 opacity-70 hover:opacity-100">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Clapperboard className="text-blue-600" /> Casting Calls Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Review company submissions and manage platform-wide casting calls.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <Plus size={20} /> Create Admin Casting
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Castings</p>
            <p className="text-2xl font-bold text-gray-900">{castings.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <Clapperboard size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Live Castings</p>
            <p className="text-2xl font-bold text-gray-900">{castings.filter(c => c.status === 'Open').length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending Approval</p>
            <p className="text-2xl font-bold text-amber-600">{pendingCastings.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Company Submitted</p>
            <p className="text-2xl font-bold text-gray-900">{castings.filter(c => c.submittedByCompany).length}</p>
          </div>
        </div>
      </div>

      {/* Pending Company Castings - Alert Section */}
      {pendingCastings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-amber-200/70">
            <AlertTriangle size={20} className="text-amber-600 shrink-0" />
            <div>
              <h2 className="font-bold text-amber-900 text-base">
                {pendingCastings.length} Company Casting{pendingCastings.length > 1 ? 's' : ''} Awaiting Your Approval
              </h2>
              <p className="text-amber-700 text-xs">Click on any submission or use the buttons to inspect full details and approve or reject</p>
            </div>
          </div>
          <div className="divide-y divide-amber-100">
            {pendingCastings.map(casting => (
              <div key={casting._id} className="flex items-start gap-4 px-6 py-4 hover:bg-amber-100/50 transition-colors">
                {/* Image */}
                <div 
                  onClick={() => openReviewModal(casting, 'review')}
                  className="w-16 h-16 rounded-xl bg-white border border-amber-200 overflow-hidden shrink-0 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-amber-500 transition-all shadow-xs"
                  title="Click to view full casting details"
                >
                  {casting.image ? (
                    <img src={casting.image} alt={casting.title} className="w-full h-full object-cover" />
                  ) : (
                    <Clapperboard size={24} className="text-amber-500" />
                  )}
                </div>
                
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <h3 
                        onClick={() => openReviewModal(casting, 'review')}
                        className="font-bold text-gray-900 text-sm hover:text-blue-600 transition-colors cursor-pointer"
                        title="Click to view full casting details"
                      >
                        {casting.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-200/50">
                          <Building2 size={11} />
                          {casting.company?.name || casting.companyId?.name || 'Company'}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin size={11} /> {casting.location}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Briefcase size={11} /> {casting.roleType} • {casting.projectType}
                        </span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          {casting.budget}
                        </span>
                      </div>
                      {casting.description && (
                        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{casting.description}</p>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                      <button
                        type="button"
                        onClick={() => openReviewModal(casting, 'review')}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer"
                        title="Review full details and approve"
                      >
                        <ShieldCheck size={14} />
                        Approve & Publish
                      </button>
                      <button
                        type="button"
                        onClick={() => openReviewModal(casting, 'reject')}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                        title="Reject submission with feedback"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm w-fit">
        {[
          { key: 'all', label: 'All Castings', count: castings.length },
          { key: 'open', label: 'Open', count: castings.filter(c => c.status === 'Open').length },
          { key: 'closed', label: 'Closed', count: castings.filter(c => c.status === 'Closed').length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-md text-xs font-bold ${
              activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
            }`}>{tab.count}</span>
          </button>
        ))}
      </div>


      {/* Castings Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="py-4 px-6 w-16 text-center">Sr No.</th>
                <th className="py-4 px-6">Project Title & Role</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Deadline</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading casting calls...
                  </td>
                </tr>
              ) : castings.filter(c => activeTab === 'all' || c.status?.toLowerCase() === activeTab).length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16">
                    <div className="flex flex-col items-center justify-center text-gray-500 text-center">
                      <Clapperboard size={56} className="text-gray-300 mb-4" />
                      <p className="text-lg font-bold text-gray-700">No Casting Calls Found</p>
                      <p className="text-sm mt-1">Click "Create Admin Casting" to post a new requirement.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                castings.filter(c => activeTab === 'all' || c.status?.toLowerCase() === activeTab).map((c, index) => (

                  <tr key={c._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6 text-center font-medium text-gray-500">
                      {index + 1}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div 
                          onClick={() => openReviewModal(c, 'review')}
                          className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                          title="Click to view full details"
                        >
                          {c.image ? (
                            <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="text-gray-400" size={20} />
                          )}
                        </div>
                        <div>
                          <p 
                            onClick={() => openReviewModal(c, 'review')}
                            className="font-bold text-gray-900 text-base cursor-pointer hover:text-blue-600 transition-colors"
                            title="Click to view full details"
                          >
                            {c.title}
                          </p>
                          <p className="text-xs text-blue-600 font-medium uppercase mt-0.5">{c.roleType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <MapPin size={16} /> {c.location}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar size={16} className="text-gray-400" /> 
                        {new Date(c.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        c.status === 'Open' ? 'bg-green-100 text-green-700' :
                        c.status === 'Closed' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center relative action-dropdown">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === c._id ? null : c._id)} 
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Settings size={20} />
                      </button>
                      
                      {activeDropdown === c._id && (
                        <div className="absolute right-6 top-12 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20">
                          <button 
                            onClick={() => openReviewModal(c, 'review')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center gap-2 transition-colors cursor-pointer font-medium"
                          >
                            <Eye size={16} /> View Details
                          </button>
                          <button 
                            onClick={() => handleOpenModal(c)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Edit2 size={16} /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(c._id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {editingId ? <Edit2 className="text-blue-600" /> : <Plus className="text-blue-600" />}
                {editingId ? 'Edit Casting Call' : 'Create Casting Call'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project Image / Poster</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                      {imageFile ? (
                        <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                      ) : formData.image ? (
                        <img src={formData.image} alt="Current" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="text-gray-400" size={32} />
                      )}
                    </div>
                    <div>
                      <input 
                        type="file" 
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-2">Recommended: 800x800px or higher. PNG or JPG.</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="e.g. Netflix Feature Film - Extra" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role Type</label>
                  <input type="text" required value={formData.roleType} onChange={e => setFormData({...formData, roleType: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="e.g. Actor, Model, Voice Over" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
                  <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="e.g. Mumbai, Maharashtra" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Budget/Pay</label>
                  <input type="text" required value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="e.g. ₹5,000/day or Negotiable" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Application Deadline</label>
                  <input type="date" required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description & Requirements</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="4" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none" placeholder="Provide full details about the role, shoot dates, and specific requirements..."></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all">
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isUploading} className="px-5 py-2.5 font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2">
                  {isUploading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</>
                  ) : editingId ? 'Update Casting' : 'Publish Casting Call'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Casting Details & Super Admin Review Modal */}
      {reviewCasting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-4 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 shrink-0">
                  <Clapperboard size={20} className="text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-white">Casting Details & Approval</h2>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      reviewCasting.approvalStatus === 'approved' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : reviewCasting.approvalStatus === 'rejected'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                    }`}>
                      {reviewCasting.approvalStatus === 'approved' ? 'Live & Approved' : reviewCasting.approvalStatus === 'rejected' ? 'Rejected' : 'Awaiting Super Admin Approval'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Review project specifications, company verification, and publish live</p>
                </div>
              </div>
              <button 
                onClick={() => { setReviewCasting(null); setReviewMode('review'); }}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-gray-800">
              {/* Hero Banner: Image + Title + Company */}
              <div className="flex flex-col sm:flex-row gap-5 p-5 bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl border border-slate-200/80">
                <div className="w-full sm:w-36 h-36 rounded-2xl bg-white border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                  {reviewCasting.image ? (
                    <img src={reviewCasting.image} alt={reviewCasting.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 p-2">
                      <Clapperboard size={36} className="text-gray-300 mb-1" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">No Poster</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      {reviewCasting.projectType || 'Project'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                      Role: {reviewCasting.roleType || 'Actor'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${
                      reviewCasting.status === 'Open' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      Status: {reviewCasting.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-gray-900 leading-snug">
                    {reviewCasting.title}
                  </h3>

                  {/* Company Info Box */}
                  <div className="mt-3 flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200/80 shadow-xs">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100">
                      {reviewCasting.company?.logo ? (
                        <img src={reviewCasting.company.logo} alt="" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Building2 size={20} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Submitted By Company</p>
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {reviewCasting.company?.name || reviewCasting.companyId?.name || (reviewCasting.submittedByCompany ? 'Registered Casting Company' : 'Super Admin / Direct')}
                      </p>
                      {(reviewCasting.company?.email || reviewCasting.companyId?.email) && (
                        <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                          <Mail size={12} className="text-gray-400" /> {reviewCasting.company?.email || reviewCasting.companyId?.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Previous Rejection Feedback Banner */}
              {reviewCasting.rejectionReason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                  <XCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-red-900 uppercase tracking-wide">Previous Rejection Feedback</p>
                    <p className="text-sm text-red-700 mt-0.5">{reviewCasting.rejectionReason}</p>
                  </div>
                </div>
              )}

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <MapPin size={12} className="text-blue-500" /> Location
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1 truncate">{reviewCasting.location || 'Not Specified'}</p>
                </div>
                <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <DollarSign size={12} className="text-emerald-500" /> Compensation
                  </p>
                  <p className="text-sm font-bold text-emerald-700 mt-1 truncate">{reviewCasting.budget || 'Negotiable'}</p>
                </div>
                <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <User size={12} className="text-purple-500" /> Target Cast
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1 truncate">
                    {reviewCasting.gender || 'Any'} • {reviewCasting.ageRange || 'Any Age'}
                  </p>
                </div>
                <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={12} className="text-amber-500" /> Deadline
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1 truncate">
                    {reviewCasting.deadline ? new Date(reviewCasting.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Open'}
                  </p>
                </div>
              </div>

              {/* Shoot Dates */}
              {reviewCasting.shootDates && (
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center gap-2 text-xs text-blue-900">
                  <Clock size={14} className="text-blue-600 shrink-0" />
                  <span className="font-semibold">Tentative Shoot Dates:</span>
                  <span>{reviewCasting.shootDates}</span>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase size={14} className="text-gray-500" /> Project Description & Role Details
                </h4>
                <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {reviewCasting.description || 'No description provided by the company.'}
                </div>
              </div>

              {/* Requirements */}
              {reviewCasting.requirements && reviewCasting.requirements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-gray-500" /> Specific Candidate Requirements
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {reviewCasting.requirements.map((req, i) => (
                      <span key={i} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200/70 text-gray-800 rounded-xl text-xs font-medium border border-gray-200/60 transition-colors">
                        ✓ {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection Form (When in reject mode) */}
              {reviewMode === 'reject' && (
                <div className="p-5 bg-red-50/80 rounded-2xl border-2 border-red-200 space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <XCircle size={18} className="text-red-600 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-red-900">Specify Reason for Rejection</h4>
                      <p className="text-xs text-red-600">The company will be informed with this feedback so they can fix and re-submit.</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-red-800 mb-2">Quick Presets:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Incomplete project details',
                        'Budget/Pay violates platform guidelines',
                        'Inappropriate or misleading role description',
                        'Unclear shoot schedule or location',
                        'Duplicate submission'
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setRejectReason(preset)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                            rejectReason === preset
                              ? 'bg-red-600 text-white border-red-600 shadow-xs'
                              : 'bg-white text-red-800 border-red-200 hover:bg-red-100/60'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-red-900 mb-1.5">Custom Reason / Explanation:</label>
                    <textarea
                      rows="3"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Explain why this casting cannot be approved in its current state..."
                      className="w-full p-3 rounded-xl border border-red-300 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
              {reviewMode === 'review' ? (
                <>
                  <button
                    type="button"
                    onClick={() => { setReviewCasting(null); setReviewMode('review'); }}
                    className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-xl transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setReviewMode('reject')}
                      className="px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <XCircle size={16} />
                      Reject Casting
                    </button>
                    <button
                      type="button"
                      disabled={approvalLoading === reviewCasting._id}
                      onClick={() => handleApproveCasting(reviewCasting._id, reviewCasting.title)}
                      className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl transition-all shadow-md hover:shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-70"
                    >
                      {approvalLoading === reviewCasting._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Publishing Live...
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={18} />
                          Approve & Publish Live
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setReviewMode('review')}
                    className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft size={16} /> Back to Details
                  </button>
                  <button
                    type="button"
                    disabled={approvalLoading === reviewCasting._id}
                    onClick={() => handleRejectCasting(reviewCasting._id, reviewCasting.title)}
                    className="px-6 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md hover:shadow-lg shadow-red-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {approvalLoading === reviewCasting._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <XCircle size={18} />
                        Confirm Rejection
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCasting;
