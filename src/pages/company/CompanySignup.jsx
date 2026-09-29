import React, { useState } from 'react';
import { useCompanyAuth } from '../../context/CompanyAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Building2, Globe, MapPin, Briefcase, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import CompanyPendingApproval from './CompanyPendingApproval';

export default function CompanySignup() {
  const [formData, setFormData] = useState({
    name: '',
    logo: null,
    email: '',
    password: '',
    industry: '',
    website: '',
    location: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingApprovalData, setPendingApprovalData] = useState(null);
  const { signup } = useCompanyAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      const result = await signup(data);
      if (result?.pendingApproval) {
        // Show the waiting-for-approval screen
        setPendingApprovalData(result.company || { name: formData.name, email: formData.email });
      } else {
        navigate('/company/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show pending approval screen after successful signup
  if (pendingApprovalData) {
    return <CompanyPendingApproval companyData={pendingApprovalData} onBackToLogin={() => navigate('/company/login')} />;
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Register Company</h2>
          <p className="text-gray-500 mt-2">Join the platform to start casting talent</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-500 border border-red-100 p-3 rounded-lg mb-6 text-sm text-center font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
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
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} required
                    className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

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

          <div>
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
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:opacity-90 text-white py-3 rounded-xl font-medium transition-opacity shadow-md"
          >
            Register Company
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account? <Link to="/company/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
