import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Building2 } from 'lucide-react';
import axios from 'axios';
import { useCompanyAuth } from '../../context/CompanyAuthContext';
import CompanyPendingApproval from './CompanyPendingApproval';

export default function CompanyLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingApprovalData, setPendingApprovalData] = useState(null);
  const { login, logout } = useCompanyAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/company/dashboard');
    } catch (err) {
      // Handle 202 – pending approval (login succeeded but not approved)
      if (err.response?.status === 202 && err.response?.data?.pendingApproval) {
        setPendingApprovalData(err.response.data.company);
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show pending approval screen
  if (pendingApprovalData) {
    return <CompanyPendingApproval companyData={pendingApprovalData} onBackToLogin={() => setPendingApprovalData(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl mb-4">
            <Building2 size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Company Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage your talent & castings</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-7">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-xl mb-5 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:bg-white/15 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 outline-none transition-all"
                  placeholder="company@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:bg-white/15 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-900/40 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing In...
                </>
              ) : 'Sign In to Dashboard'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-5">
            Don't have an account?{' '}
            <Link to="/company/signup" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Register Company
            </Link>
          </p>

          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <Link to="/home" className="text-xs text-gray-400 hover:text-white transition-colors">
              ← Back to MyCastNow Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
