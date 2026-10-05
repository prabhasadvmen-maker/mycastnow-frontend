import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, X, Building2, Mail, Lock, Globe, MapPin, Briefcase, Image as ImageIcon, Eye, EyeOff, Settings, Edit2, Trash2, Power, Calendar, LogIn, CheckCircle2, XCircle, Clock, AlertCircle, ShieldCheck, Phone, FileText, Link as LinkIcon, User } from 'lucide-react';
import { useCompanyAuth } from '../../context/CompanyAuthContext';
import { useNavigate } from 'react-router-dom';

export default function Company() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [viewCompany, setViewCompany] = useState(null);
  const [editCompanyId, setEditCompanyId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [reviewCompany, setReviewCompany] = useState(null); // Company in review modal
  const [rejectReason, setRejectReason] = useState('');
  const [reviewMode, setReviewMode] = useState('review'); // 'review' | 'reject'
   // { type: 'success' | 'error' | 'info', text: string }
  const { adminLoginAsCompany } = useCompanyAuth();
  const navigate = useNavigate();

  

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.action-dropdown')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    logo: null,
    email: '',
    password: '',
    industry: '',
    website: '',
    location: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/companies`);
      setCompanies(res.data);
    } catch (err) {
      console.error('Failed to fetch companies', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/companies/${id}`);
      setCompanies(prev => prev.filter(c => c._id !== id));
      toast.info('Company deleted successfully');
    } catch (err) {
      console.error('Failed to delete company', err);
      toast.error('Failed to delete company');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/companies/${id}/status`);
      setCompanies(prev => prev.map(c => c._id === id ? { ...c, isActive: res.data.isActive } : c));
      toast.success('Company status updated');
    } catch (err) {
      console.error('Failed to toggle status', err);
      toast.error('Failed to update status');
    }
  };

  // Open the review modal
  const openReviewModal = (company, mode = 'review') => {
    setReviewCompany(company);
    setRejectReason(company.rejectionReason || '');
    setReviewMode(mode);
    setOpenDropdownId(null);
  };

  const handleApprove = async (id, companyName) => {
    setActionLoading(id);
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/companies/${id}/approve`, {
        approvedBy: 'Super Admin'
      });
      setCompanies(prev => prev.map(c => c._id === id ? { 
        ...c, 
        isApproved: true, 
        approvalStatus: 'approved',
        verified: true,
        approvedAt: new Date().toISOString()
      } : c));
      setReviewCompany(null);
      toast.success(`✅ Company "${companyName || 'Account'}" approved successfully! They can now log in.`);
    } catch (err) {
      console.error('Failed to approve company', err);
      toast.error('Failed to approve company. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id, companyName) => {
    const reason = rejectReason.trim() || 'Does not meet platform requirements';
    setActionLoading(id);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/companies/${id}/reject`, { reason });
      setCompanies(prev => prev.map(c => c._id === id ? { 
        ...c, 
        isApproved: false, 
        approvalStatus: 'rejected',
        rejectionReason: reason
      } : c));
      setReviewCompany(null);
      setRejectReason('');
      setReviewMode('review');
      toast.info(`Company "${companyName || 'Account'}" rejected.`);
    } catch (err) {
      console.error('Failed to reject company', err);
      toast.error('Failed to reject company. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleCompanyLogin = async (company) => {
    try {
      await adminLoginAsCompany(company._id);
      window.open('/company/dashboard', '_blank');
    } catch (err) {
      console.error('Failed to login as company', err);
      toast.error('Failed to login as company. Make sure the backend is running.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (editCompanyId && key === 'password' && !formData[key]) return;
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      if (editCompanyId) {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/companies/${editCompanyId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setCompanies(companies.map(c => c._id === editCompanyId ? res.data : c));
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/companies`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        // Admin-created companies are auto-approved
        const approvedCompany = { ...res.data, isApproved: true, approvalStatus: 'approved' };
        setCompanies([approvedCompany, ...companies]);
      }
      closeModal();
      toast.success(editCompanyId ? 'Company updated successfully' : 'Company added successfully');
    } catch (err) {
      console.error('Failed to save company', err);
      toast.error(err.response?.data?.message || 'Failed to save company');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditCompanyId(null);
    setFormData({
      name: '', logo: null, email: '', password: '', industry: '', website: '', location: ''
    });
  };

  const openAddModal = () => {
    setEditCompanyId(null);
    setFormData({
      name: '', logo: null, email: '', password: '', industry: '', website: '', location: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (company) => {
    setEditCompanyId(company._id);
    setFormData({
      name: company.name || '',
      logo: null,
      email: company.email || '',
      password: '',
      industry: company.industry || '',
      website: company.website || '',
      location: company.location || ''
    });
    setIsModalOpen(true);
    setOpenDropdownId(null);
  };

  // Filter companies by tab
  const pendingCompanies = companies.filter(c => !c.isApproved && c.approvalStatus !== 'rejected');
  const approvedCompanies = companies.filter(c => c.isApproved || c.approvalStatus === 'approved');
  const rejectedCompanies = companies.filter(c => c.approvalStatus === 'rejected');
  const filteredCompanies = activeTab === 'pending' ? pendingCompanies 
    : activeTab === 'approved' ? approvedCompanies 
    : activeTab === 'rejected' ? rejectedCompanies 
    : companies;

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Companies</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all registered companies and their accounts.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-medium transition-opacity shadow-md flex items-center gap-2"
        >
          <Plus size={20} />
          Add Company
        </button>
      </div>

      {/* Approval Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-100 shadow-sm w-fit">
        {[
          { key: 'all', label: 'All', count: companies.length, color: 'text-gray-600' },
          { key: 'pending', label: 'Pending Approval', count: pendingCompanies.length, color: 'text-amber-600', dot: 'bg-amber-400' },
          { key: 'approved', label: 'Approved', count: approvedCompanies.length, color: 'text-emerald-600' },
          { key: 'rejected', label: 'Rejected', count: rejectedCompanies.length, color: 'text-red-600' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.dot && tab.count > 0 && activeTab !== tab.key && (
              <span className={`w-2 h-2 rounded-full ${tab.dot} animate-pulse`}></span>
            )}
            {tab.label}
            <span className={`ml-1 px-1.5 py-0.5 rounded-md text-xs font-bold ${
              activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
            }`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Pending Alert Banner */}
      {pendingCompanies.length > 0 && activeTab !== 'pending' && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-sm text-amber-800">
          <AlertCircle size={18} className="text-amber-500 shrink-0" />
          <span>
            <strong>{pendingCompanies.length} company{pendingCompanies.length > 1 ? 'ies' : ''}</strong> waiting for your approval. 
            <button onClick={() => setActiveTab('pending')} className="ml-2 text-amber-700 font-bold underline hover:text-amber-900">
              Review Now →
            </button>
          </span>
        </div>
      )}

      {filteredCompanies.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Building2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {activeTab === 'pending' ? 'No Pending Approvals' : activeTab === 'approved' ? 'No Approved Companies' : activeTab === 'rejected' ? 'No Rejected Companies' : 'No Companies Yet'}
          </h3>
          <p className="text-gray-500 max-w-sm mb-6">
            {activeTab === 'all' ? "You haven't added any companies to the system." : `No companies with "${activeTab}" status.`}
          </p>
          {activeTab === 'all' && (
            <button onClick={openAddModal} className="text-fuchsia-600 font-medium hover:text-fuchsia-700 flex items-center gap-2">
              <Plus size={18} /> Add Your First Company
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-12 text-center">Sr.</th>
                  <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Industry</th>
                  <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                  <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Approval</th>
                  <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Dashboard</th>
                  <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCompanies.map((company, index) => (
                  <tr key={company._id} className={`hover:bg-gray-50/50 transition-colors ${company.isActive === false ? 'opacity-60' : ''}`}>
                    <td className="py-3 px-3 text-sm font-medium text-gray-500 text-center">
                      {(index + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div 
                          onClick={() => openReviewModal(company)}
                          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                          title="Click to view full company details"
                        >
                          {company.logo ? (
                            <img src={company.logo} alt="Logo" className="w-full h-full object-cover" />
                          ) : (
                            <Building2 size={16} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => openReviewModal(company)}
                            className={`font-bold text-left hover:text-blue-600 transition-colors block cursor-pointer break-words ${company.isActive === false ? 'text-gray-500' : 'text-gray-800'}`}
                            title="Click to view full company details"
                          >
                            {company.name}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Mail size={12} className="text-gray-400 shrink-0 mt-0.5" /> 
                        <span className="break-all">{company.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <MapPin size={12} className="text-gray-400 shrink-0 mt-0.5" /> 
                        <span className="break-words">{company.location || '-'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {company.industry ? (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[11px] font-medium border border-blue-100 break-words inline-block">
                          {company.industry}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${company.isActive === false ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                        {company.isActive === false ? 'Disabled' : 'Active'}
                      </span>
                    </td>
                    {/* APPROVAL STATUS COLUMN */}
                    <td className="py-3 px-3 text-center">
                      {company.approvalStatus === 'approved' || company.isApproved ? (
                        <button
                          type="button"
                          onClick={() => openReviewModal(company)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                          title="Click to view details"
                        >
                          <CheckCircle2 size={12} className="text-emerald-600" /> Approved
                        </button>
                      ) : company.approvalStatus === 'rejected' ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-red-50 text-red-700 border border-red-200">
                            <XCircle size={10} /> Rejected
                          </span>
                          <button
                            type="button"
                            onClick={() => openReviewModal(company)}
                            className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
                          >
                            View Details
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock size={10} /> Pending
                          </span>
                          {/* Approve / Review button - opens full company details modal */}
                          <button
                            type="button"
                            onClick={() => openReviewModal(company)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow transition-all transform hover:scale-[1.02] cursor-pointer"
                            title="Click to view full details to Approve or Reject"
                          >
                            <ShieldCheck size={13} /> Review & Approve
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button 
                        onClick={() => handleCompanyLogin(company)}
                        disabled={!company.isApproved && company.approvalStatus !== 'approved'}
                        title={!company.isApproved ? 'Company not yet approved' : 'Login as Company'}
                        className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${(!company.isApproved && company.approvalStatus !== 'approved') ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                      >
                        <LogIn size={12} />
                        Login
                      </button>
                    </td>
                    <td className="py-3 px-3 relative text-center">
                      <div className="action-dropdown inline-block">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(openDropdownId === company._id ? null : company._id);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors focus:outline-none"
                        >
                          <Settings size={18} className={openDropdownId === company._id ? 'rotate-90 transition-transform' : 'transition-transform'} />
                        </button>
                        
                        {openDropdownId === company._id && (
                          <div className="absolute right-0 top-10 mt-1 w-52 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <button 
                              onClick={() => { openReviewModal(company); setOpenDropdownId(null); }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left"
                            >
                              <Eye size={16} /> View Details
                            </button>
                            <button 
                              onClick={() => openEditModal(company)}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-700 transition-colors text-left"
                            >
                              <Edit2 size={16} /> Edit Company
                            </button>
                            {/* Approval actions in dropdown */}
                            {(!company.isApproved && company.approvalStatus !== 'approved' && company.approvalStatus !== 'rejected') && (<>
                              <div className="h-px bg-gray-100 my-1"></div>
                              <button
                                onClick={() => openReviewModal(company)}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors text-left font-semibold"
                              >
                                <ShieldCheck size={16} /> Review & Approve
                              </button>
                            </>)}
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button 
                              onClick={() => handleToggleStatus(company._id)}
                              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left ${company.isActive !== false ? 'text-orange-600 hover:bg-orange-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                            >
                              <Power size={16} /> {company.isActive !== false ? 'Disable Account' : 'Enable Account'}
                            </button>
                            <button 
                              onClick={() => handleDelete(company._id)}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                            >
                              <Trash2 size={16} /> Delete Company
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Company Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative my-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{editCompanyId ? 'Edit Company' : 'Add New Company'}</h3>
                <p className="text-sm text-gray-500 mt-1">{editCompanyId ? 'Update the details for this company.' : 'Enter the details to register a new company.'}</p>
              </div>
              <button 
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Column 1 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. Acme Corp" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="company@example.com" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} required={!editCompanyId}
                        className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder={editCompanyId ? "Leave empty to keep current" : "••••••••"} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input type="text" name="industry" value={formData.industry} onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. Technology" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input type="url" name="website" value={formData.website} onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="https://example.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input type="text" name="location" value={formData.location} onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="City, Country" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Full width row */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
                <div className="flex items-center gap-4">
                  {formData.logo && (
                    <div className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center p-1">
                      <img src={URL.createObjectURL(formData.logo)} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="file" name="logo" accept="image/*" onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white hover:opacity-90 font-medium shadow-md transition-opacity">
                  {editCompanyId ? 'Update Company' : 'Save Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── FULL COMPANY REVIEW & DETAILS MODAL ─── */}
      {reviewCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative my-8 overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
            {/* Top Color Banner */}
            <div className={`h-24 w-full relative ${
              reviewCompany.approvalStatus === 'approved' || reviewCompany.isApproved
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600'
                : reviewCompany.approvalStatus === 'rejected'
                ? 'bg-gradient-to-r from-rose-600 via-red-600 to-orange-600'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
            }`}>
              <button 
                onClick={() => { setReviewCompany(null); setReviewMode('review'); }}
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-colors cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Header Card */}
            <div className="px-6 sm:px-8 pb-6 pt-0 relative">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
                <div className="flex items-end gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-xl border-2 border-white overflow-hidden shrink-0">
                    <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                      {reviewCompany.logo ? (
                        <img src={reviewCompany.logo} alt={reviewCompany.name} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 size={32} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 leading-tight">{reviewCompany.name}</h2>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{reviewCompany.tagline || reviewCompany.industry || 'Registered Company'}</p>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2 self-start sm:self-end">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    reviewCompany.isActive === false ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {reviewCompany.isActive === false ? 'Disabled' : 'Active Account'}
                  </span>

                  {reviewCompany.approvalStatus === 'approved' || reviewCompany.isApproved ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={13} /> Approved
                    </span>
                  ) : reviewCompany.approvalStatus === 'rejected' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                      <XCircle size={13} /> Rejected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-300 animate-pulse">
                      <Clock size={13} /> Pending Review
                    </span>
                  )}
                </div>
              </div>

              {/* Status Context Banner */}
              {(!reviewCompany.isApproved && reviewCompany.approvalStatus !== 'approved' && reviewCompany.approvalStatus !== 'rejected') && (
                <div className="mb-5 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <AlertCircle size={18} />
                  </div>
                  <div className="text-xs text-amber-900 leading-relaxed">
                    <p className="font-bold text-sm text-amber-950">Pending Super Admin Approval</p>
                    <p className="mt-0.5 text-amber-800">
                      This company cannot log in or post castings until approved. Please review their company profile details below and choose to <strong>Approve</strong> or <strong>Reject</strong>.
                    </p>
                  </div>
                </div>
              )}

              {(reviewCompany.approvalStatus === 'approved' || reviewCompany.isApproved) && (
                <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="text-xs text-emerald-900">
                    <span className="font-bold text-emerald-950">Verified & Approved Partner</span>
                    <p className="text-[11px] text-emerald-700">
                      Approved by {reviewCompany.approvedBy || 'Super Admin'} {reviewCompany.approvedAt ? `on ${new Date(reviewCompany.approvedAt).toLocaleDateString()}` : ''}. Company has full active portal access.
                    </p>
                  </div>
                </div>
              )}

              {reviewCompany.approvalStatus === 'rejected' && (
                <div className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <XCircle size={18} />
                  </div>
                  <div className="text-xs text-rose-900">
                    <p className="font-bold text-sm text-rose-950">Registration Declined</p>
                    <p className="mt-0.5 text-rose-800">
                      <strong>Reason:</strong> {reviewCompany.rejectionReason || 'Does not meet platform requirements'}
                    </p>
                    <p className="text-[11px] text-rose-700 mt-1">You can re-evaluate and approve this company below if issues are resolved.</p>
                  </div>
                </div>
              )}

              {/* Company Details Grid */}
              <div className="space-y-4 max-h-[46vh] overflow-y-auto pr-1">
                {/* 1. Core Contact & Information */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Company Overview</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100/70 transition-colors rounded-xl border border-gray-100">
                      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-xs text-blue-600 shrink-0 border border-gray-100">
                        <Mail size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-gray-500 font-medium">Email Address</p>
                        <a href={`mailto:${reviewCompany.email}`} className="text-xs font-bold text-blue-600 hover:underline truncate block" title={reviewCompany.email}>
                          {reviewCompany.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100/70 transition-colors rounded-xl border border-gray-100">
                      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-xs text-indigo-600 shrink-0 border border-gray-100">
                        <Phone size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-gray-500 font-medium">Contact Phone</p>
                        <p className="text-xs font-bold text-gray-800 truncate">
                          {reviewCompany.phone || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100/70 transition-colors rounded-xl border border-gray-100">
                      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-xs text-red-500 shrink-0 border border-gray-100">
                        <MapPin size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-gray-500 font-medium">Location</p>
                        <p className="text-xs font-bold text-gray-800 truncate" title={reviewCompany.location || '-'}>
                          {reviewCompany.location || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100/70 transition-colors rounded-xl border border-gray-100">
                      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-xs text-fuchsia-600 shrink-0 border border-gray-100">
                        <Briefcase size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-gray-500 font-medium">Industry</p>
                        <p className="text-xs font-bold text-gray-800 truncate" title={reviewCompany.industry || '-'}>
                          {reviewCompany.industry || 'Film & Media'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100/70 transition-colors rounded-xl border border-gray-100">
                      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-xs text-teal-600 shrink-0 border border-gray-100">
                        <Globe size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-gray-500 font-medium">Website</p>
                        {reviewCompany.website ? (
                          <a 
                            href={reviewCompany.website.startsWith('http') ? reviewCompany.website : `https://${reviewCompany.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs font-bold text-blue-600 hover:underline truncate block"
                            title={reviewCompany.website}
                          >
                            {reviewCompany.website} ↗
                          </a>
                        ) : (
                          <p className="text-xs font-semibold text-gray-400">Not specified</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100/70 transition-colors rounded-xl border border-gray-100">
                      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-xs text-amber-600 shrink-0 border border-gray-100">
                        <Calendar size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-gray-500 font-medium">Registered Date</p>
                        <p className="text-xs font-bold text-gray-800">
                          {reviewCompany.createdAt ? new Date(reviewCompany.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Full Address if available */}
                {(reviewCompany.address || reviewCompany.city || reviewCompany.state || reviewCompany.pincode) && (
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block mb-1">Full Operating Address</span>
                    <p className="text-gray-800 font-medium">
                      {[reviewCompany.address, reviewCompany.city, reviewCompany.state, reviewCompany.pincode].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}

                {/* 3. Description / About */}
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block mb-1">About Company</span>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {reviewCompany.description || reviewCompany.tagline || 'No extended bio provided.'}
                  </p>
                </div>

                {/* 4. Contact Person (if provided) */}
                {reviewCompany.contactPerson && (reviewCompany.contactPerson.name || reviewCompany.contactPerson.email || reviewCompany.contactPerson.phone) && (
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block mb-1.5">Authorized Contact Person</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">Name:</span> <strong className="text-gray-800">{reviewCompany.contactPerson.name || '-'}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400">Designation:</span> <span className="text-gray-700 font-medium">{reviewCompany.contactPerson.designation || 'Casting Director'}</span>
                      </div>
                      {reviewCompany.contactPerson.email && (
                        <div>
                          <span className="text-gray-400">Email:</span> <span className="text-gray-700">{reviewCompany.contactPerson.email}</span>
                        </div>
                      )}
                      {reviewCompany.contactPerson.phone && (
                        <div>
                          <span className="text-gray-400">Phone:</span> <span className="text-gray-700">{reviewCompany.contactPerson.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. Business & Legal Details (GST / CIN / PAN if available) */}
                {(reviewCompany.gst || reviewCompany.cin || reviewCompany.pan) && (
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block mb-1.5">Legal Registration</span>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div><span className="text-gray-400">GST:</span> <span className="font-mono font-semibold">{reviewCompany.gst || '-'}</span></div>
                      <div><span className="text-gray-400">CIN:</span> <span className="font-mono font-semibold">{reviewCompany.cin || '-'}</span></div>
                      <div><span className="text-gray-400">PAN:</span> <span className="font-mono font-semibold">{reviewCompany.pan || '-'}</span></div>
                    </div>
                  </div>
                )}
              </div>

              {/* ─── REJECTION MODE FORM ─── */}
              {reviewMode === 'reject' ? (
                <div className="mt-5 p-4 bg-red-50/80 border-2 border-red-200 rounded-2xl animate-in fade-in duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-red-900 flex items-center gap-1.5">
                      <XCircle size={16} className="text-red-600" />
                      Specify Rejection Reason
                    </h4>
                    <span className="text-[11px] text-red-700">Optional or select below</span>
                  </div>
                  
                  {/* Quick Reason Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {[
                      'Incomplete business profile',
                      'Invalid contact details',
                      'Unverified production company',
                      'Duplicate account',
                      'Does not meet criteria'
                    ].map(chip => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setRejectReason(chip)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          rejectReason === chip 
                            ? 'bg-red-600 text-white border-red-600 shadow-xs' 
                            : 'bg-white text-gray-700 border-gray-200 hover:border-red-300'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason why this company application is being rejected..."
                    rows={2}
                    className="w-full p-3 text-xs rounded-xl border border-red-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white text-gray-800 placeholder-gray-400 resize-none outline-none"
                  />

                  <div className="flex items-center justify-end gap-2.5 mt-3">
                    <button
                      type="button"
                      onClick={() => setReviewMode('review')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-white transition-colors cursor-pointer"
                    >
                      Back to Review
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading === reviewCompany._id}
                      onClick={() => handleReject(reviewCompany._id, reviewCompany.name)}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {actionLoading === reviewCompany._id ? 'Rejecting...' : (
                        <>
                          <XCircle size={14} /> Confirm Rejection
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* ─── NORMAL REVIEW ACTION BUTTONS ─── */
                <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => { setReviewCompany(null); setReviewMode('review'); }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                    {/* If company is NOT approved */}
                    {(!reviewCompany.isApproved && reviewCompany.approvalStatus !== 'approved') ? (
                      <>
                        <button
                          type="button"
                          onClick={() => { setReviewMode('reject'); setRejectReason(''); }}
                          className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <XCircle size={15} />
                          Reject Company
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading === reviewCompany._id}
                          onClick={() => handleApprove(reviewCompany._id, reviewCompany.name)}
                          className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                          {actionLoading === reviewCompany._id ? (
                            'Approving...'
                          ) : (
                            <>
                              <CheckCircle2 size={16} />
                              Approve Company
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      /* If company is already approved */
                      <>
                        <button
                          type="button"
                          onClick={() => { setReviewMode('reject'); setRejectReason(''); }}
                          className="text-xs font-semibold text-red-600 hover:bg-red-50 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle size={13} /> Revoke / Reject Approval
                        </button>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl flex items-center gap-1.5">
                          <CheckCircle2 size={14} /> Approved & Active
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
