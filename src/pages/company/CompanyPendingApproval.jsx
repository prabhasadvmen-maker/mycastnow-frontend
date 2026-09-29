import React, { useEffect, useState } from 'react';
import { Clock, Shield, CheckCircle, Mail, Phone, Building2, Star, AlertCircle, LogOut, RefreshCw } from 'lucide-react';
import { useCompanyAuth } from '../../context/CompanyAuthContext';
import axios from 'axios';

export default function CompanyPendingApproval({ companyData, onBackToLogin }) {
  const { logout } = useCompanyAuth();
  const [checking, setChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [isApprovedNow, setIsApprovedNow] = useState(false);

  // Calculate time remaining since signup
  useEffect(() => {
    const updateTimer = () => {
      const createdAt = companyData?.createdAt ? new Date(companyData.createdAt) : new Date();
      const deadline = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
      const now = new Date();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft('Review period expired — please contact support');
        return;
      }

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hrs}h ${mins}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [companyData]);

  const checkApprovalStatus = async () => {
    setChecking(true);
    setStatusMessage(null);
    try {
      const email = companyData?.email;
      if (email) {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/companyAuth/status?email=${encodeURIComponent(email)}`);
        if (res.data?.isApproved) {
          setIsApprovedNow(true);
          setStatusMessage({
            type: 'success',
            text: '🎉 Congratulations! Your account has been approved by Super Admin. You can now log in directly!'
          });
        } else if (res.data?.approvalStatus === 'rejected') {
          setStatusMessage({
            type: 'error',
            text: `Application Declined: ${res.data?.rejectionReason || 'Does not meet requirements.'}`
          });
        } else {
          setStatusMessage({
            type: 'info',
            text: 'Your account is still awaiting Super Admin review. Please check back soon!'
          });
        }
      } else {
        setStatusMessage({ type: 'info', text: 'Still in review. Please check back shortly.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'info', text: 'Still in review. Please check back shortly.' });
    } finally {
      setChecking(false);
    }
  };

  const handleReturnToLogin = () => {
    logout();
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      window.location.href = '/company/login';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10 text-center">
          
          {/* Animated Clock Icon */}
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-blue-400/40 flex items-center justify-center mx-auto animate-pulse">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl">
                <Clock size={30} className="text-white" />
              </div>
            </div>
            {/* Orbiting dot */}
            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-white/50 flex items-center justify-center shadow-md">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-4">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
            Pending Super Admin Approval
          </div>

          {/* Heading */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-3 leading-tight">
            Your Company Account<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              is Under Review
            </span>
          </h1>
          
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-sm mx-auto">
            Thank you for registering <strong className="text-white">{companyData?.name || 'your company'}</strong> on MyCastNow. 
            Our Super Admin team is reviewing your account and will approve it within <strong className="text-amber-300">24 hours</strong>.
          </p>

          {/* Countdown Timer */}
          {timeLeft && (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-6">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Estimated Review Time</p>
              <div className="flex items-center justify-center gap-2">
                <Clock size={16} className="text-blue-400" />
                <span className="text-white font-bold text-lg">{timeLeft}</span>
              </div>
            </div>
          )}

          {/* Steps / What happens next */}
          <div className="text-left space-y-3 mb-7">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-3">What Happens Next</p>
            
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-full bg-blue-500/30 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Account Registration Successful</p>
                <p className="text-xs text-gray-400 mt-0.5">Your company profile has been saved and submitted for review</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-400/20">
              <div className="w-8 h-8 rounded-full bg-amber-500/30 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5">
                <Shield size={16} className="text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Admin Verification in Progress</p>
                <p className="text-xs text-gray-400 mt-0.5">Super Admin is reviewing your business credentials and details</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 opacity-60">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center shrink-0 mt-0.5">
                <Building2 size={16} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Dashboard Access Granted</p>
                <p className="text-xs text-gray-400 mt-0.5">Once approved, you can post castings and hire talent</p>
              </div>
            </div>
          </div>

          {/* Company details chip */}
          {companyData?.email && (
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-5 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10">
              <Mail size={13} className="text-blue-400" />
              <span className="font-medium text-white">{companyData.email}</span>
              <span className="text-gray-500">• {companyData.industry || 'Media & Production'}</span>
            </div>
          )}

          {/* Status Message Display */}
          {statusMessage && (
            <div className={`p-4 rounded-2xl mb-5 text-xs font-semibold text-center border animate-in fade-in duration-200 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                : statusMessage.type === 'error'
                ? 'bg-red-500/20 border-red-400/50 text-red-200'
                : 'bg-blue-500/20 border-blue-400/40 text-blue-200'
            }`}>
              <p>{statusMessage.text}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {isApprovedNow ? (
              <button
                type="button"
                onClick={handleReturnToLogin}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
              >
                Sign In to Access Dashboard →
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={checkApprovalStatus}
                  disabled={checking}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg transition-all disabled:opacity-70 cursor-pointer"
                >
                  {checking ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <RefreshCw size={16} />
                  )}
                  {checking ? 'Checking...' : 'Check Approval Status'}
                </button>

                <button
                  type="button"
                  onClick={handleReturnToLogin}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 text-sm font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut size={16} />
                  Back to Login
                </button>
              </>
            )}
          </div>

          {/* Support Contact */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-xs text-gray-500 mb-2">Need urgent help? Contact our support team</p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <a href="mailto:support@mycastnow.com" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors">
                <Mail size={12} />
                support@mycastnow.com
              </a>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <Phone size={12} />
                +91 98765 43210
              </span>
            </div>
          </div>
        </div>

        {/* Branding */}
        <p className="text-center text-xs text-gray-600 mt-4">
          MyCastNow Platform — Trusted by 500+ Production Houses
        </p>
      </div>
    </div>
  );
}
