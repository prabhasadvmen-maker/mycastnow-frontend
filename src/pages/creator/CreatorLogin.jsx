import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import { ArrowRight, ArrowLeft, ShieldCheck, AlertCircle, Sparkles, ChevronDown, User, Play } from 'lucide-react';

const IndiaFlag = () => (
  <svg viewBox="0 0 30 22" className="w-7 h-5 rounded-full shrink-0" aria-hidden="true">
    <defs><clipPath id="in-flag"><rect width="30" height="22" rx="4" /></clipPath></defs>
    <g clipPath="url(#in-flag)">
      <rect width="30" height="7.34" fill="#FF9933" />
      <rect y="7.34" width="30" height="7.33" fill="#fff" />
      <rect y="14.67" width="30" height="7.33" fill="#138808" />
      <circle cx="15" cy="11" r="2.6" fill="none" stroke="#000080" strokeWidth="0.7" />
      <circle cx="15" cy="11" r="0.5" fill="#000080" />
    </g>
  </svg>
);

// Stylised portrait placeholder (head + shoulders on a soft gradient)
const Portrait = ({ from, to, skin, hair, shirt, long = false }) => (
  <svg viewBox="0 0 100 120" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id={`bg-${from.slice(1)}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={from} />
        <stop offset="1" stopColor={to} />
      </linearGradient>
    </defs>
    <rect width="100" height="120" fill={`url(#bg-${from.slice(1)})`} />
    {long && <path d="M26 56c0-22 10-32 24-32s24 10 24 32v38H26z" fill={hair} />}
    <path d="M8 124c2-26 20-38 42-38s40 12 42 38z" fill={shirt} />
    <rect x="43" y="68" width="14" height="22" rx="6" fill={skin} />
    <ellipse cx="50" cy="52" rx="19" ry="23" fill={skin} />
    <path d={long ? 'M30 50c0-18 8-26 20-26s20 8 20 26c-6-10-14-14-20-14s-14 4-20 14z' : 'M30 48c-2-20 8-28 21-28 14 0 22 10 19 28-4-8-8-12-14-13-8 3-18 3-26 13z'} fill={hair} />
    <circle cx="43" cy="53" r="1.6" fill="#2a1d1a" />
    <circle cx="57" cy="53" r="1.6" fill="#2a1d1a" />
    <path d="M45 63q5 3.5 10 0" stroke="#9a5a50" strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </svg>
);

const FALLBACKS = [
  { from: '#d7dde6', to: '#b9c3d1', skin: '#d9a982', hair: '#1c1512', shirt: '#1d232c', category: 'Model' },
  { from: '#cfd6e0', to: '#aab6c6', skin: '#c99573', hair: '#16110e', shirt: '#14171c', category: 'Actor' },
  { from: '#e4e7ec', to: '#c8cfda', skin: '#dcae88', hair: '#2a1a14', shirt: '#eef1f5', category: 'Creator', long: true },
  { from: '#e1d9d6', to: '#c2b6b2', skin: '#d19c78', hair: '#2b1812', shirt: '#1b1b1f', category: 'Model', long: true },
  { from: '#dfe3e9', to: '#bcc5d2', skin: '#d6a37e', hair: '#1b130f', shirt: '#14161a', category: 'Actor', long: true },
];

const RoleChip = ({ label, sub, className = '' }) => (
  <div className={`absolute z-20 flex items-center gap-1.5 bg-white rounded-full pl-1.5 pr-3 py-1 shadow-lg shadow-blue-900/10 text-[11px] sm:text-xs font-semibold text-blue-700 max-w-[46%] ${className}`}>
    <span className="w-5 h-5 shrink-0 rounded-full bg-blue-50 flex items-center justify-center">
      <User size={11} className="text-blue-600" strokeWidth={2.5} />
    </span>
    <span className="truncate">{label}</span>
    {sub && <span className="hidden sm:inline font-medium text-slate-400 truncate">· {sub}</span>}
  </div>
);

// Real creator photo (falls back to the illustrated portrait if missing / broken)
const TalentPhoto = ({ talent, fallback }) => {
  const [broken, setBroken] = useState(false);
  if (!talent?.image || broken) return <Portrait {...fallback} />;
  return (
    <img
      src={talent.image}
      alt={talent.name}
      loading="lazy"
      onError={() => setBroken(true)}
      className="w-full h-full object-cover"
    />
  );
};

const VIDEO_SRC = '/My%20cast%20now%20video%20.mp4';

// Only stream the (large) showreel on desktop, and never on data-saver / reduced motion
const canPlayVideo = () => {
  try {
    return (
      window.matchMedia('(min-width: 1024px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      !navigator.connection?.saveData
    );
  } catch {
    return false;
  }
};

const HeroCollage = ({ talents = [] }) => {
  const [video] = useState(canPlayVideo);
  const t = (i) => talents[i];
  const f = (i) => FALLBACKS[i];
  const label = (i) => {
    const tal = t(i);
    return tal ? (tal.name || '').split(' ')[0] : f(i).category;
  };
  const sub = (i) => (t(i) ? t(i).category : '');
  const card = 'absolute rounded-xl overflow-hidden border-[3px] border-white shadow-xl shadow-blue-900/15 aspect-[4/5]';

  return (
    <div className="relative mx-auto w-full max-w-[380px] sm:max-w-[440px] h-[215px] sm:h-[300px] select-none">
      <div className="absolute inset-x-8 inset-y-4 bg-gradient-to-br from-white/70 to-blue-200/0 rounded-full blur-2xl" />
      <svg viewBox="0 0 100 100" className="absolute left-1/2 top-[8%] -translate-x-1/2 w-[52%] h-[85%] text-white/50" aria-hidden="true">
        <path d="M18 10 L90 50 L18 90 Z" fill="currentColor" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 440 300" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <ellipse cx="220" cy="150" rx="205" ry="110" fill="none" stroke="#1767B8" strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="130 60 30 60" transform="rotate(-8 220 150)" />
      </svg>

      <div className={`${card} cn-float-a left-[6%] top-[3%] w-[27%] -rotate-6`}><TalentPhoto talent={t(0)} fallback={f(0)} /></div>
      <RoleChip label={label(0)} sub={sub(0)} className="left-[9%] top-[33%] -rotate-6" />

      <div className={`${card} cn-float-b right-[6%] top-[2%] w-[26%] rotate-6`}><TalentPhoto talent={t(1)} fallback={f(1)} /></div>
      <RoleChip label={label(1)} sub={sub(1)} className="right-[7%] top-[31%] -rotate-3" />

      <div className={`${card} cn-float-b left-[5%] bottom-[3%] w-[26%] rotate-3`}><TalentPhoto talent={t(2)} fallback={f(2)} /></div>
      <RoleChip label={label(2)} sub={sub(2)} className="left-[8%] bottom-[2%] -rotate-3" />

      <div className={`${card} cn-float-a right-[5%] bottom-[4%] w-[26%] rotate-3`}><TalentPhoto talent={t(3)} fallback={f(3)} /></div>
      <RoleChip label={label(3)} sub={sub(3)} className="right-[7%] bottom-[1%]" />

      {/* centre hero card: showreel video on desktop, creator photo elsewhere */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[38%] aspect-[4/5] rounded-2xl overflow-hidden border-4 border-white shadow-2xl shadow-blue-900/30 rotate-[4deg] z-10 bg-blue-900">
        {video ? (
          <video
            src={VIDEO_SRC}
            poster={t(4)?.image || undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="MyCastNow showreel"
            className="w-full h-full object-cover"
          />
        ) : (
          <TalentPhoto talent={t(4)} fallback={f(4)} />
        )}
      </div>
      <RoleChip label={video ? 'MyCastNow' : label(4)} sub={video ? 'Showreel' : sub(4)} className="left-1/2 bottom-[14%] translate-x-[-10%] rotate-[-5deg] z-20" />

      {!video && (
        <div className="absolute right-[26%] bottom-[2%] w-9 h-9 rounded-full bg-blue-600 shadow-lg shadow-blue-600/40 flex items-center justify-center z-20">
          <Play size={14} className="text-white fill-white ml-0.5" />
        </div>
      )}
    </div>
  );
};

const CreatorLogin = ({ isSignup = false }) => {
  const { sendOtp, resendOtp, verifyOtp } = useCreatorAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const planParam = searchParams.get('plan');
  const isSignupMode = isSignup || location.pathname.includes('signup') || searchParams.get('mode') === 'signup';

  // Shared coupon link (e.g. /creator/signup?coupon=CODE): remember it for the payment step
  useEffect(() => {
    const c = new URLSearchParams(location.search).get('coupon');
    if (c) {
      try { localStorage.setItem('creatorCoupon', c.trim().toUpperCase()); } catch { /* ignore */ }
    }
  }, [location.search]);

  const [talents, setTalents] = useState([]);
  useEffect(() => {
    const ctrl = new AbortController();
    axios
      .get(`${import.meta.env.VITE_API_URL}/public/talents`, { signal: ctrl.signal })
      .then((res) => {
        const withPhoto = (res.data?.talents || []).filter((t) => t.image);
        // prefer a mix of different categories (Model / Actor / ...) over 5 of the same
        const seen = new Set();
        const mixed = [];
        for (const t of withPhoto) {
          const key = (t.category || '').toLowerCase();
          if (!seen.has(key)) { seen.add(key); mixed.push(t); }
        }
        for (const t of withPhoto) if (mixed.length < 5 && !mixed.includes(t)) mixed.push(t);
        setTalents(mixed.slice(0, 5));
      })
      .catch(() => { /* decorative only – keep illustrated fallbacks */ });
    return () => ctrl.abort();
  }, []);

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loginOverride, setLoginOverride] = useState(null);
  const isLogin = loginOverride ?? !isSignupMode;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  // Countdown timer
  useEffect(() => {
    if (step !== 2 || resendTimer <= 0) return undefined;
    const interval = setInterval(() => setResendTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const autoFillDevOtp = (devOtp) => {
    setTimeout(() => {
      setOtp(devOtp);
      setTimeout(() => handleVerifyOtp(null, devOtp), 1000);
    }, 1500);
  };

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
        setStep(2);
        setResendTimer(30);
        if (res.devOtp) autoFillDevOtp(res.devOtp);
      } else {
        setError(res.message || 'Failed to send OTP');
      }
    } catch {
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
        if (res.devOtp) autoFillDevOtp(res.devOtp);
      } else {
        setError(res.message || 'Failed to resend OTP');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const otpArray = (otp || '').split('');
    while (otpArray.length < 6) otpArray.push('');
    otpArray[index] = value || '';
    setOtp(otpArray.slice(0, 6).join(''));

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    const otpArray = (otp || '').split('');
    while (otpArray.length < 6) otpArray.push('');
    if (e.key === 'Backspace' && otpArray[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!digits) return;
    e.preventDefault();
    setOtp(digits);
    const focusIdx = Math.min(digits.length, 5);
    document.getElementById(`otp-${focusIdx}`)?.focus();
  };

  const handleVerifyOtp = async (e, autoOtp = null) => {
    if (e) e.preventDefault();
    const currentOtp = (autoOtp || otp || '').trim();

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
    } catch {
      setError('Failed to verify OTP');
    }
    setLoading(false);
  };

  // Auto-send OTP when 10 digits are entered
  useEffect(() => {
    const timer = setTimeout(() => {
      if (phone.length === 10 && step === 1 && !loading) {
        handleSendOtp();
      }
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone, step, loading]);

  const primaryBtn =
    'w-full h-12 sm:h-14 bg-blue-500 hover:bg-blue-600 active:scale-[0.99] text-white rounded-xl font-semibold text-base sm:text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#c4defc_42%,#8dbcf5_100%)] font-sans">
      <style>{`
        @keyframes cn-float-a { 0%,100% { translate: 0 0; } 50% { translate: 0 -7px; } }
        @keyframes cn-float-b { 0%,100% { translate: 0 0; } 50% { translate: 0 7px; } }
        .cn-float-a { animation: cn-float-a 5s ease-in-out infinite; }
        .cn-float-b { animation: cn-float-b 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .cn-float-a, .cn-float-b { animation: none; } }
      `}</style>

      {/* ambient blobs */}
      <div className="pointer-events-none absolute -left-24 top-1/3 w-64 h-64 rounded-full bg-white/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-10 w-72 h-72 rounded-full bg-sky-300/50 blur-3xl" />

      <div className="relative mx-auto w-full max-w-md lg:max-w-5xl px-4 pt-3 pb-6 sm:pt-8 sm:pb-10 lg:grid lg:grid-cols-2 lg:gap-14 lg:items-center lg:min-h-screen lg:py-6">
        {/* Left: brand + hero */}
        <div>
        {/* Logo */}
        <div className="text-center">
          <img
            src="/mycastnow logo.jpeg"
            alt="MyCastNow – Solutions for a connected world"
            className="h-20 sm:h-28 -my-3 mx-auto object-contain mix-blend-multiply"
          />
        </div>

        {/* Hero collage */}
        <div className="mt-0 sm:mt-4">
          <HeroCollage talents={talents} />
        </div>

        {/* Title */}
        <div className="mt-2 sm:mt-4 text-center">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <span className="h-px flex-1 max-w-[70px] bg-gradient-to-r from-transparent to-blue-400" />
            <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">Creator Portal</h1>
            <span className="h-px flex-1 max-w-[70px] bg-gradient-to-l from-transparent to-blue-400" />
          </div>
          <p className="mt-0.5 text-sm sm:text-lg text-slate-600">Your talent journey starts here</p>
        </div>
        </div>

        {/* Card */}
        <div className="mt-4 sm:mt-7 lg:mt-0 w-full lg:max-w-md lg:justify-self-start bg-white/90 backdrop-blur rounded-3xl shadow-xl shadow-blue-900/[0.07] border border-white p-5 sm:p-8">
          {error && (
            <div role="alert" className="mb-5 p-3.5 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} noValidate>
              {planParam && (
                <div className="mb-5 p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-blue-900 font-bold">
                    <Sparkles size={14} className="text-blue-600" />
                    <span>Selected: {planParam.toLowerCase() === 'pro' ? 'Unlimited Pro Plan (₹499/mo)' : 'Starter Artist (Free)'}</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white">
                    {planParam.toLowerCase() === 'pro' ? 'PRO' : 'FREE'}
                  </span>
                </div>
              )}

              <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="mt-1.5 sm:mt-3 text-slate-500 text-sm sm:text-base leading-relaxed">
                {isLogin
                  ? 'Log in to discover opportunities and manage your profile.'
                  : 'Sign up to get discovered and start building your creator profile.'}
              </p>

              <label htmlFor="creator-phone" className="block mt-4 sm:mt-7 mb-2 text-sm sm:text-base font-semibold text-blue-950">
                Phone Number
              </label>
              <div className="flex items-stretch h-12 sm:h-14 bg-white border border-slate-200 rounded-xl overflow-hidden transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/15">
                <div className="flex items-center gap-1.5 pl-3 pr-2.5 text-blue-950 font-medium border-r border-slate-200 my-2.5 select-none" aria-label="Country code India +91">
                  <IndiaFlag />
                  <span>+91</span>
                  <ChevronDown size={16} className="text-slate-500" />
                </div>
                <input
                  id="creator-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="flex-1 min-w-0 px-3 bg-transparent outline-none text-lg text-blue-950 font-medium tracking-wide placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal placeholder:text-[15px]"
                  placeholder="Enter phone number"
                  autoFocus
                />
              </div>

              <button type="submit" disabled={loading || phone.length !== 10} className={`${primaryBtn} mt-4 sm:mt-6`}>
                {loading ? 'Sending OTP...' : 'Continue with OTP'}
                {!loading && <ArrowRight size={20} />}
              </button>

              <p className="mt-4 sm:mt-6 text-center text-slate-600 text-[15px] whitespace-nowrap">
                {isLogin ? 'New to Mycastnow? ' : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => { setLoginOverride(!isLogin); setError(''); }}
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {isLogin ? 'Create an account' : 'Log in'}
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <button
                type="button"
                onClick={() => { setStep(1); setOtp(''); setError(''); }}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 mb-5 flex items-center gap-1.5"
              >
                <ArrowLeft size={16} /> Change number
              </button>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">Verify OTP</h2>
              <p className="mt-3 text-slate-500 text-base">
                We've sent a 6-digit code to <strong className="text-blue-950">+91 {phone}</strong>
              </p>

              <div className="mt-5 sm:mt-7 flex gap-2 sm:gap-2.5 justify-center">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    maxLength={1}
                    value={(otp || '').split('')[index] || ''}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    aria-label={`OTP digit ${index + 1}`}
                    className="w-11 h-14 sm:w-12 text-center text-2xl font-bold bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all text-blue-950"
                  />
                ))}
              </div>

              <div className="flex justify-between items-center mt-5 mb-6 text-sm px-1">
                <span className="text-slate-500">Didn't receive code?</span>
                <button
                  type="button"
                  disabled={resendTimer > 0 || loading}
                  onClick={handleResendOtp}
                  className={`font-semibold transition-colors ${resendTimer > 0 ? 'text-slate-400' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>

              <button type="submit" disabled={loading || (otp || '').length !== 6} className={primaryBtn}>
                {loading ? 'Verifying...' : 'Verify & Continue'}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>
          )}

          {/* Secure note */}
          <div className="mt-4 sm:mt-7 flex items-center justify-center gap-2 text-[13px] text-slate-500 whitespace-nowrap">
            <ShieldCheck size={24} className="text-blue-600 shrink-0" strokeWidth={1.75} />
            <span>Secure login <span className="mx-0.5">•</span> Your details stay protected</span>
          </div>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-5 border-t border-slate-100 text-center">
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              By continuing, you agree to MyCastNow's<br />
              <Link to="#" className="text-blue-600 hover:underline font-medium">Terms of Service</Link> and{' '}
              <Link to="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</Link>
            </p>
            <Link
              to="/home"
              className="mt-3 sm:mt-5 inline-flex items-center gap-2 text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ArrowLeft size={18} /> Back to MyCastNow
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorLogin;
