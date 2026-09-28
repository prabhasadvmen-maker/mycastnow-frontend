import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Plus, Edit2, Trash2, Calendar, MapPin, X, Clapperboard, Briefcase, Settings, Image as ImageIcon, MoreVertical, Eye } from 'lucide-react';

const AdminCasting = () => {
  const [castings, setCastings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', roleType: '', location: '', budget: '', deadline: '', status: 'Open', image: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCastings();
    
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
      alert('Failed to save casting call');
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
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Clapperboard className="text-blue-600" /> Casting Calls Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform-wide casting calls, auditions, and job postings.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <Plus size={20} /> Create New Casting
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <p className="text-sm text-gray-500 font-medium">Open Castings</p>
            <p className="text-2xl font-bold text-gray-900">{castings.filter(c => c.status === 'Open').length}</p>
          </div>
        </div>
      </div>

      {/* Table */}
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
              ) : castings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16">
                    <div className="flex flex-col items-center justify-center text-gray-500 text-center">
                      <Clapperboard size={56} className="text-gray-300 mb-4" />
                      <p className="text-lg font-bold text-gray-700">No Casting Calls Found</p>
                      <p className="text-sm mt-1">Click "Create New Casting" to post your first requirement.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                castings.map((c, index) => (
                  <tr key={c._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6 text-center font-medium text-gray-500">
                      {index + 1}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {c.image ? (
                            <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="text-gray-400" size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base">{c.title}</p>
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
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Settings size={20} />
                      </button>
                      
                      {activeDropdown === c._id && (
                        <div className="absolute right-6 top-12 mt-1 w-36 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20">
                          <button 
                            onClick={() => handleOpenModal(c)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                          >
                            <Edit2 size={16} /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(c._id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
    </div>
  );
};

export default AdminCasting;
