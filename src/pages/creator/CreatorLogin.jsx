import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import { Phone, ArrowRight, ShieldCheck, AlertCircle, Sparkles, Check } from 'lucide-react';

const CreatorLogin = ({ isSignup = false }) => {
  const { sendOtp, resendOtp, verifyOtp } = useCreatorAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const planParam = searchParams.get('plan');
  const isSignupMode = isSignup || location.pathname.includes('signup') || searchParams.get('mode') === 'signup';

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [isLogin, setIsLogin] = useState(!isSignupMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  // Countdown timer
  useEffect(() => {
    let interval = null;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(t => t - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Keep isLogin in sync if path or params change
  useEffect(() => {
    if (isSignupMode) {
      setIsLogin(false);
    }
  }, [isSignupMode]);

  // Auto-send OTP when 10 digits are entered
  useEffect(() => {
    if (phone.length === 10 && step === 1 && !loading) {
      handleSendOtp();
    }
  }, [phone]);

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await sendOtp(phone);
      if (res.success) {
        setStep(2); // Show the OTP screen first
        setResendTimer(30);

        // Auto-fill and auto-verify magic (with visual delay so they can see it happen)
        if (res.devOtp) {
          // Wait 1.5 seconds so they read "Verify OTP" and see the empty box
          setTimeout(() => {
            setOtp(res.devOtp); // Box fills up magically!

            // Wait another 1 second so they see the filled OTP before it logs them in
            setTimeout(() => {
              handleVerifyOtp(null, res.devOtp);
            }, 1000);
          }, 1500);
        }
      } else {
        setError(res.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    setOtp('');
    try {
      const res = await resendOtp(phone);
      if (res.success) {
        setResendTimer(30);
        if (res.devOtp) {
          setTimeout(() => {
            setOtp(res.devOtp);
            setTimeout(() => {
              handleVerifyOtp(null, res.devOtp);
            }, 1000);
          }, 1500);
        }
      } else {
        setError(res.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    
    let otpArray = (otp || '').padEnd(6, ' ').split('');
    otpArray[index] = value || ' ';
    setOtp(otpArray.join(''));

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    let otpArray = (otp || '').padEnd(6, ' ').split('');
    if (e.key === 'Backspace' && otpArray[index] === ' ' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async (e, autoOtp = null) => {
    if (e) e.preventDefault();
    const currentOtp = (autoOtp || otp).replace(/\s/g, '');

    if (currentOtp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await verifyOtp(phone, currentOtp);
      if (res.success) {
        if (res.isNewUser || !res.creator.isProfileComplete) {
          navigate('/creator/onboarding');
        } else {
          navigate('/creator/dashboard');
        }
      } else {
        setError(res.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="p-6 sm:p-10 text-center border-b border-gray-100">
          <img src="/mycastnow logo.jpeg" alt="MyCastNow" className="h-12 sm:h-16 mx-auto mb-4 sm:mb-6 object-contain" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Creator Portal</h2>
          <p className="text-gray-500 mt-2 text-xs sm:text-sm">Join the top casting network</p>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              {planParam && (
                <div className="mb-5 p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-purple-900 font-bold">
                    <Sparkles size={14} className="text-purple-600" />
                    <span>Selected: {planParam.toLowerCase() === 'pro' ? 'Unlimited Pro Plan (₹499/mo)' : 'Starter Artist (Free)'}</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-600 text-white">
                    {planParam.toLowerCase() === 'pro' ? 'PRO' : 'FREE'}
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {isLogin ? 'Welcome back' : 'Create an Account'}
              </h3>
              <p className="text-gray-500 mb-8 text-sm">
                {isLogin ? 'Enter your phone number to login to your creator dashboard.' : 'Enter your phone number to start building your creator profile.'}
              </p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 font-medium">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-gray-800 text-lg tracking-wide"
                    placeholder="99999 99999"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:from-blue-700 hover:to-fuchsia-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg mb-6"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
                {!loading && <ArrowRight size={20} />}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-1"
              >
                ← Back
              </button>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h3>
              <p className="text-gray-500 mb-8 text-sm">We've sent a 6-digit code to <strong>+91 {phone}</strong></p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">Enter 6-digit OTP</label>
                <div className="flex gap-2 justify-center">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={(otp || '').padEnd(6, ' ')[index] !== ' ' ? (otp || '').padEnd(6, ' ')[index] : ''}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800"
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 text-sm px-2">
                <span className="text-gray-500">Didn't receive code?</span>
                <button
                  type="button"
                  disabled={resendTimer > 0 || loading}
                  onClick={handleResendOtp}
                  className={`font-semibold transition-colors ${resendTimer > 0 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || (otp || '').replace(/\s/g, '').length !== 6}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:from-blue-700 hover:to-fuchsia-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-xs text-gray-500 leading-relaxed">
              By continuing, you agree to MyCastNow's <br />
              <Link to="#" className="text-blue-600 hover:underline font-medium">Terms of Service</Link> and <Link to="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</Link>
            </p>
            <div className="mt-4 pt-2">
              <Link to="/home" className="text-xs text-gray-400 hover:text-blue-600 transition-colors font-medium">
                ← Back to MyCastNow Public Website
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreatorLogin;
