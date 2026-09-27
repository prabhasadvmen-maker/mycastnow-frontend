import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X, Building2, Mail, Lock, Globe, MapPin, Briefcase, Image as ImageIcon, Eye, EyeOff, Settings, Edit2, Trash2, Power, Calendar, LogIn } from 'lucide-react';
import { useCompanyAuth } from '../context/CompanyAuthContext';
import { useNavigate } from 'react-router-dom';

export default function Company() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [viewCompany, setViewCompany] = useState(null);
  const [editCompanyId, setEditCompanyId] = useState(null);
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
    } catch (err) {
      console.error('Failed to delete company', err);
      alert('Failed to delete company');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/companies/${id}/status`);
      setCompanies(prev => prev.map(c => c._id === id ? { ...c, isActive: res.data.isActive } : c));
    } catch (err) {
      console.error('Failed to toggle status', err);
      alert('Failed to update status');
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
      alert('Failed to login as company. Make sure the backend is running.');
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
        setCompanies([res.data, ...companies]);
      }
      closeModal();
    } catch (err) {
      console.error('Failed to save company', err);
      alert(err.response?.data?.message || 'Failed to save company');
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

  return (
    <div className="space-y-6">
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

      {companies.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Building2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No Companies Yet</h3>
          <p className="text-gray-500 max-w-sm mb-6">You haven't added any companies to the system. Click the button above to register your first company.</p>
          <button 
            onClick={openAddModal}
            className="text-fuchsia-600 font-medium hover:text-fuchsia-700 flex items-center gap-2"
          >
            <Plus size={18} /> Add Your First Company
          </button>
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
                  <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Website</th>
                  <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Dashboard</th>
                  <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {companies.map((company, index) => (
                  <tr key={company._id} className={`hover:bg-gray-50/50 transition-colors ${company.isActive === false ? 'opacity-60' : ''}`}>
                    <td className="py-3 px-3 text-sm font-medium text-gray-500 text-center">
                      {(index + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden shrink-0">
                          {company.logo ? (
                            <img src={company.logo} alt="Logo" className="w-full h-full object-cover" />
                          ) : (
                            <Building2 size={16} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className={`font-bold truncate max-w-[140px] ${company.isActive === false ? 'text-gray-500' : 'text-gray-800'}`} title={company.name}>{company.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Mail size={12} className="text-gray-400 shrink-0" /> 
                        <span className="truncate max-w-[150px]" title={company.email}>{company.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <MapPin size={12} className="text-gray-400 shrink-0" /> 
                        <span className="truncate max-w-[100px]" title={company.location || '-'}>{company.location || '-'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {company.industry ? (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[11px] font-medium border border-blue-100 truncate max-w-[100px] inline-block" title={company.industry}>
                          {company.industry}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${company.isActive === false ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                        {company.isActive === false ? 'Disabled' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {company.website ? (
                        <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1 text-xs text-fuchsia-600 hover:text-fuchsia-700 font-medium transition-colors">
                          <Globe size={12} />
                          Visit
                        </a>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button 
                        onClick={() => handleCompanyLogin(company)}
                        disabled={company.isActive === false}
                        className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${company.isActive === false ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
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
                          <div className="absolute right-0 top-10 mt-1 w-48 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <button 
                              onClick={() => { setViewCompany(company); setOpenDropdownId(null); }}
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

      {/* View Company Modal */}
      {viewCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative my-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Company Details</h3>
              <button onClick={() => setViewCompany(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 overflow-hidden shrink-0">
                  {viewCompany.logo ? (
                    <img src={viewCompany.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={28} />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{viewCompany.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${viewCompany.isActive === false ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {viewCompany.isActive === false ? 'Disabled' : 'Active'}
                    </span>
                    {viewCompany.industry && <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">{viewCompany.industry}</span>}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-500 shrink-0"><Mail size={18} /></div>
                  <div><p className="text-xs text-gray-500 font-medium">Email Address</p><p className="text-sm font-semibold text-gray-800">{viewCompany.email}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-500 shrink-0"><MapPin size={18} /></div>
                  <div><p className="text-xs text-gray-500 font-medium">Location</p><p className="text-sm font-semibold text-gray-800">{viewCompany.location || 'Not specified'}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-500 shrink-0"><Globe size={18} /></div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Website</p>
                    {viewCompany.website ? (
                      <a href={viewCompany.website.startsWith('http') ? viewCompany.website : `https://${viewCompany.website}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline">{viewCompany.website}</a>
                    ) : <p className="text-sm font-semibold text-gray-800">Not specified</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-500 shrink-0"><Calendar size={18} /></div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Joined On</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {viewCompany.createdAt ? (
                        `${new Date(viewCompany.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} at ${new Date(viewCompany.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                      ) : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
