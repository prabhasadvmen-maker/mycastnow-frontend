import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-slate-200/50 w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-1.5 rounded-2xl bg-white shadow-sm border border-slate-100 mb-5">
            <img src="/mycastnow logo.jpeg" alt="Logo" className="w-20 h-auto object-contain mix-blend-multiply" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Login</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Sign in to access dashboard</p>
        </div>
        
        {error && <div className="bg-rose-50 text-rose-600 border border-rose-200 p-3 rounded-xl mb-6 text-sm text-center font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder-slate-400 font-medium"
                placeholder="admin@mycastnow.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder-slate-400 font-medium"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-violet-200 mt-4 active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <button 
            onClick={() => navigate('/home')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-violet-600 transition-colors cursor-pointer"
          >
            <span>←</span> Back to Public Website
          </button>
        </div>
      </div>
    </div>
  );
}
