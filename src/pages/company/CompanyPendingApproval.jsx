import React, { useEffect, useState } from 'react';
import { Clock, Mail, Phone, LogOut, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useCompanyAuth } from '../../context/CompanyAuthContext';
import axios from 'axios';

export default function CompanyPendingApproval({ companyData, onBackToLogin }) {
  const { logout } = useCompanyAuth();
  const [checking, setChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [isApprovedNow, setIsApprovedNow] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const createdAt = companyData?.createdAt ? new Date(companyData.createdAt) : new Date();
      const deadline = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
      const now = new Date();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft('Review period expired');
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
            text: 'Your account has been approved! You can now sign in.'
          });
        } else if (res.data?.approvalStatus === 'rejected') {
          setStatusMessage({
            type: 'error',
            text: `Application declined: ${res.data?.rejectionReason || 'Does not meet requirements.'}`
          });
        } else {
          setStatusMessage({
            type: 'info',
            text: 'Still under review. Please check back soon.'
          });
        }
      }
    } catch (err) {
      setStatusMessage({ type: 'info', text: 'Still under review. Please check back soon.' });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          
          {/* Icon */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Account Under Review
          </h1>
          
          <p className="text-gray-600 text-sm mb-6">
            Thank you for registering <span className="font-semibold text-gray-900">{companyData?.name}</span>. We're reviewing your details and will approve within 24 hours.
          </p>

          {/* Timer */}
          {timeLeft && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg py-3 px-4 mb-6 flex items-center justify-between">
              <span className="text-sm text-gray-600">Estimated time</span>
              <span className="text-lg font-bold text-blue-600">{timeLeft}</span>
            </div>
          )}

          {/* Status Message */}
          {statusMessage && (
            <div className={`p-3 rounded-lg mb-6 text-sm font-medium ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : statusMessage.type === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {statusMessage.text}
            </div>
          )}

          {/* Company Info */}
          {companyData?.email && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Company Details</p>
              <p className="text-sm font-medium text-gray-900 mb-1">{companyData.name}</p>
              <p className="text-sm text-gray-600">{companyData.email}</p>
              {companyData.industry && <p className="text-sm text-gray-600">{companyData.industry}</p>}
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-3">
            {isApprovedNow ? (
              <button
                onClick={handleReturnToLogin}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} />
                Sign In to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={checkApprovalStatus}
                  disabled={checking}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} className={checking ? 'animate-spin' : ''} />
                  {checking ? 'Checking...' : 'Check Status'}
                </button>
                <button
                  onClick={handleReturnToLogin}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  Back to Login
                </button>
              </>
            )}
          </div>

          {/* Support */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Need help?</p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <a href="mailto:info@mycastnow.com" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Mail size={14} />
                info@mycastnow.com
              </a>
              <span className="text-gray-300">•</span>
              <a href="tel:+919918309983" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Phone size={14} />
                +91 9918309983
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
