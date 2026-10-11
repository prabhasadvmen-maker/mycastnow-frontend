import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import { CheckCircle2, ChevronRight, ChevronLeft, UploadCloud, AlertCircle, User, CreditCard, ShieldCheck, IndianRupee, Check, Cloud } from 'lucide-react';
import DownloadReceipt from '../../components/DownloadReceipt';

const steps = [
  "Category",
  "Basic Details",
  "Professional",
  "Physical Attributes",
  "Portfolio",
  "Pricing",
  "Availability",
  "Payment",
  "Preview"
];

const categories = ["Model", "Actor", "Influencer", "Photographer", "Makeup Artist", "Stylist", "Voice Over Artist"];

const CreatorSignupFlow = () => {
  const { creatorUser, loading: authLoading, updateProfile } = useCreatorAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(creatorUser?.onboardingStep || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoUploading, setPhotoUploading] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(false);

  // Track if we have already initialized state from creatorUser
  const hasLoadedUserRef = useRef(false);
  const debounceTimerRef = useRef(null);
  const latestPayloadRef = useRef(null);

  // 1. Basic Details
  const [basic, setBasic] = useState({
    fullName: creatorUser?.basicDetails?.fullName || '',
    email: creatorUser?.email || '',
    instagram: creatorUser?.socialLinks?.instagram || '',
    linkedin: creatorUser?.socialLinks?.linkedin || '',
    portfolioLink: creatorUser?.socialLinks?.website || '',
    profilePhoto: creatorUser?.basicDetails?.profilePhoto || '',
    gender: creatorUser?.basicDetails?.gender || '',
    dob: creatorUser?.basicDetails?.dob ? new Date(creatorUser.basicDetails.dob).toISOString().split('T')[0] : '',
    city: creatorUser?.basicDetails?.city || '',
    bio: creatorUser?.basicDetails?.bio || '',
    languages: creatorUser?.basicDetails?.languages?.join(', ') || ''
  });

  // 2. Professional Details
  const [prof, setProf] = useState({
    primaryCategory: creatorUser?.professionalDetails?.primaryCategory || '',
    experience: creatorUser?.professionalDetails?.experience || '',
    skills: creatorUser?.professionalDetails?.skills?.join(', ') || ''
  });

  // 3. Physical Attributes
  const [physical, setPhysical] = useState({
    height: creatorUser?.physicalDetails?.height || '',
    weight: creatorUser?.physicalDetails?.weight || '',
    chest: creatorUser?.physicalDetails?.chest || '',
    waist: creatorUser?.physicalDetails?.waist || '',
    hips: creatorUser?.physicalDetails?.hips || '',
    eyeColor: creatorUser?.physicalDetails?.eyeColor || '',
    hairColor: creatorUser?.physicalDetails?.hairColor || ''
  });

  // 5. Portfolio
  const initialPortfolioFiles = [
    ...(creatorUser?.portfolio?.photos?.map(url => ({ url, type: 'image/jpeg', uploadProgress: 100 })) || []),
    ...(creatorUser?.portfolio?.videos?.map(url => ({ url, type: 'video/mp4', uploadProgress: 100 })) || [])
  ];
  const [portfolioFiles, setPortfolioFiles] = useState(initialPortfolioFiles);

  // 6. Pricing
  const [pricing, setPricing] = useState({
    hourlyRate: creatorUser?.pricing?.hourlyRate || '',
    dayRate: creatorUser?.pricing?.dayRate || ''
  });

  // 7. Availability
  const [availabilityStatus, setAvailabilityStatus] = useState(creatorUser?.availability?.status || 'Available');
  const [paymentDone, setPaymentDone] = useState(creatorUser?.onboardingFeePaid || false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [onboardingFeeConfig, setOnboardingFeeConfig] = useState({ fee: 99, isFree: false, enabled: true });

  // Fetch live onboarding fee configuration set by Super Admin
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/payments/razorpay-key`)
      .then(res => {
        if (res.data) {
          setOnboardingFeeConfig({
            fee: typeof res.data.fee === 'number' ? res.data.fee : 99,
            isFree: res.data.isFree === true || res.data.fee === 0,
            enabled: res.data.enabled !== false
          });
        }
      })
      .catch(err => console.error('Failed to load fee config:', err));
  }, []);

  // Redirect completed profiles
  useEffect(() => {
    if (creatorUser?.isProfileComplete) {
      navigate('/creator/dashboard');
    }
  }, [creatorUser, navigate]);

  // Hydrate state once creatorUser is loaded from backend
  useEffect(() => {
    if (creatorUser && !hasLoadedUserRef.current) {
      hasLoadedUserRef.current = true;
      if (creatorUser.onboardingStep && creatorUser.onboardingStep >= 1) {
        setCurrentStep(creatorUser.onboardingStep);
      }
      if (creatorUser.basicDetails) {
        setBasic(prev => ({
          ...prev,
          fullName: creatorUser.basicDetails.fullName || '',
          profilePhoto: creatorUser.basicDetails.profilePhoto || '',
          gender: creatorUser.basicDetails.gender || '',
          dob: creatorUser.basicDetails.dob ? new Date(creatorUser.basicDetails.dob).toISOString().split('T')[0] : '',
          city: creatorUser.basicDetails.city || '',
          bio: creatorUser.basicDetails.bio || '',
          languages: creatorUser.basicDetails.languages?.join(', ') || ''
        }));
      }
      if (creatorUser.email) {
        setBasic(prev => ({ ...prev, email: creatorUser.email }));
      }
      if (creatorUser.socialLinks) {
        setBasic(prev => ({
          ...prev,
          instagram: creatorUser.socialLinks.instagram || '',
          linkedin: creatorUser.socialLinks.linkedin || '',
          portfolioLink: creatorUser.socialLinks.website || ''
        }));
      }
      if (creatorUser.professionalDetails) {
        setProf({
          primaryCategory: creatorUser.professionalDetails.primaryCategory || '',
          experience: creatorUser.professionalDetails.experience || '',
          skills: creatorUser.professionalDetails.skills?.join(', ') || ''
        });
      }
      if (creatorUser.physicalDetails) {
        setPhysical({
          height: creatorUser.physicalDetails.height || '',
          weight: creatorUser.physicalDetails.weight || '',
          chest: creatorUser.physicalDetails.chest || '',
          waist: creatorUser.physicalDetails.waist || '',
          hips: creatorUser.physicalDetails.hips || '',
          eyeColor: creatorUser.physicalDetails.eyeColor || '',
          hairColor: creatorUser.physicalDetails.hairColor || ''
        });
      }
      if (creatorUser.portfolio) {
        const photos = (creatorUser.portfolio.photos || []).map(url => ({ url, type: 'image/jpeg', uploadProgress: 100 }));
        const videos = (creatorUser.portfolio.videos || []).map(url => ({ url, type: 'video/mp4', uploadProgress: 100 }));
        if (photos.length > 0 || videos.length > 0) {
          setPortfolioFiles([...photos, ...videos]);
        }
      }
      if (creatorUser.pricing) {
        setPricing({
          hourlyRate: creatorUser.pricing.hourlyRate ?? '',
          dayRate: creatorUser.pricing.dayRate ?? ''
        });
      }
      if (creatorUser.availability?.status) {
        setAvailabilityStatus(creatorUser.availability.status);
      }
      if (creatorUser.onboardingFeePaid) {
        setPaymentDone(true);
      }
    }
  }, [creatorUser]);

  // Helper to compile latest form payload
  const buildCurrentPayload = (stepOverride = currentStep, customOverrides = {}) => {
    const s = stepOverride || currentStep;
    const p = {
      onboardingStep: s,
      isProfileComplete: false,
      ...customOverrides
    };

    const effectiveProf = customOverrides.professionalDetails || prof;
    p.professionalDetails = {
      ...(creatorUser?.professionalDetails || {}),
      primaryCategory: effectiveProf.primaryCategory || '',
      experience: effectiveProf.experience || '',
      skills: typeof effectiveProf.skills === 'string'
        ? effectiveProf.skills.split(',').map(x => x.trim()).filter(Boolean)
        : (Array.isArray(effectiveProf.skills) ? effectiveProf.skills : [])
    };

    const effectiveBasic = customOverrides.basicDetails || basic;
    p.basicDetails = {
      ...(creatorUser?.basicDetails || {}),
      fullName: effectiveBasic.fullName || '',
      profilePhoto: effectiveBasic.profilePhoto || '',
      gender: effectiveBasic.gender || '',
      city: effectiveBasic.city || '',
      bio: effectiveBasic.bio || '',
      languages: typeof effectiveBasic.languages === 'string'
        ? effectiveBasic.languages.split(',').map(x => x.trim()).filter(Boolean)
        : (Array.isArray(effectiveBasic.languages) ? effectiveBasic.languages : [])
    };
    if (effectiveBasic.dob && effectiveBasic.dob.trim() !== '') {
      p.basicDetails.dob = effectiveBasic.dob;
    }

    if (effectiveBasic.email && effectiveBasic.email.trim() !== '') {
      p.email = effectiveBasic.email.trim();
    } else {
      p.email = null;
    }

    p.socialLinks = {
      ...(creatorUser?.socialLinks || {}),
      instagram: effectiveBasic.instagram || '',
      linkedin: effectiveBasic.linkedin || '',
      website: effectiveBasic.portfolioLink || ''
    };

    const effectivePhysical = customOverrides.physicalDetails || physical;
    p.physicalDetails = {
      ...(creatorUser?.physicalDetails || {}),
      height: effectivePhysical.height || '',
      weight: effectivePhysical.weight || '',
      chest: effectivePhysical.chest || '',
      waist: effectivePhysical.waist || '',
      hips: effectivePhysical.hips || '',
      eyeColor: effectivePhysical.eyeColor || '',
      hairColor: effectivePhysical.hairColor || ''
    };

    const effectivePricing = customOverrides.pricing || pricing;
    p.pricing = {
      ...(creatorUser?.pricing || {})
    };
    if (effectivePricing.hourlyRate !== '' && effectivePricing.hourlyRate !== undefined) {
      p.pricing.hourlyRate = Number(effectivePricing.hourlyRate);
    }
    if (effectivePricing.dayRate !== '' && effectivePricing.dayRate !== undefined) {
      p.pricing.dayRate = Number(effectivePricing.dayRate);
    }

    p.availability = {
      status: customOverrides.availabilityStatus || availabilityStatus
    };

    const validPhotos = portfolioFiles.filter(f => f.type?.startsWith('image/') && f.url && !f.url.startsWith('blob:')).map(f => f.url);
    const validVideos = portfolioFiles.filter(f => f.type?.startsWith('video/') && f.url && !f.url.startsWith('blob:')).map(f => f.url);
    if (validPhotos.length > 0 || validVideos.length > 0) {
      p.portfolio = {
        photos: validPhotos,
        videos: validVideos
      };
    }

    return p;
  };

  // Keep latest payload ref updated for visibilitychange / unload
  useEffect(() => {
    latestPayloadRef.current = buildCurrentPayload();
  }, [basic, prof, physical, pricing, availabilityStatus, currentStep, portfolioFiles]);

  // Method to trigger save to DB immediately
  const triggerAutoSave = async (customOverrides = {}) => {
    if (!creatorUser || creatorUser?.isProfileComplete) return;
    try {
      setAutoSaving(true);
      const payload = buildCurrentPayload(currentStep, customOverrides);
      await updateProfile(payload);
      setLastSaved(true);
    } catch (err) {
      console.warn('Auto-save notice:', err);
    } finally {
      setAutoSaving(false);
    }
  };

  // Debounce auto-save (800ms) on form input changes
  useEffect(() => {
    if (!hasLoadedUserRef.current || creatorUser?.isProfileComplete) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      triggerAutoSave();
    }, 800);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [basic, prof, physical, pricing, availabilityStatus]);

  // Immediate save on Category selection (Step 1)
  const handleSelectCategory = (cat) => {
    const nextProf = { ...prof, primaryCategory: cat };
    setProf(nextProf);
    triggerAutoSave({
      professionalDetails: {
        ...creatorUser?.professionalDetails,
        ...nextProf,
        skills: nextProf.skills ? nextProf.skills.split(',').map(s => s.trim()).filter(Boolean) : []
      },
      onboardingStep: 1
    });
  };

  // Immediate save on Availability selection (Step 7)
  const handleSelectAvailability = (status) => {
    setAvailabilityStatus(status);
    triggerAutoSave({
      availabilityStatus: status,
      onboardingStep: 7
    });
  };

  // Handle Tab close / minimize / page exit with keepalive fetch
  useEffect(() => {
    const handleExit = () => {
      const token = localStorage.getItem('creatorToken');
      if (!token || creatorUser?.isProfileComplete) return;
      const data = latestPayloadRef.current;
      if (!data) return;
      try {
        fetch(`${import.meta.env.VITE_API_URL}/creatorAuth/update-profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data),
          keepalive: true
        });
      } catch (e) {}
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        handleExit();
      }
    };

    window.addEventListener('beforeunload', handleExit);
    window.addEventListener('pagehide', handleExit);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('beforeunload', handleExit);
      window.removeEventListener('pagehide', handleExit);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [creatorUser]);

  const handleNext = async () => {
    setError('');
    setLoading(true);

    try {
      const nextStep = currentStep + 1;
      let stepCustom = {};

      if (currentStep === 1) {
        stepCustom.professionalDetails = {
          ...creatorUser?.professionalDetails,
          ...prof,
          skills: prof.skills ? prof.skills.split(',').map(s => s.trim()).filter(Boolean) : []
        };
      }
      if (currentStep === 2) {
        stepCustom.basicDetails = {
          ...creatorUser?.basicDetails,
          ...basic,
          languages: basic.languages ? basic.languages.split(',').map(s => s.trim()).filter(Boolean) : []
        };
        stepCustom.email = basic.email?.trim() || null;
        stepCustom.socialLinks = {
          ...creatorUser?.socialLinks,
          instagram: basic.instagram,
          linkedin: basic.linkedin,
          website: basic.portfolioLink
        };
      }
      if (currentStep === 3) {
        stepCustom.professionalDetails = {
          ...creatorUser?.professionalDetails,
          ...prof,
          skills: prof.skills ? prof.skills.split(',').map(s => s.trim()).filter(Boolean) : []
        };
      }
      if (currentStep === 4) {
        stepCustom.physicalDetails = { ...creatorUser?.physicalDetails, ...physical };
      }
      if (currentStep === 5) {
        const filesToUpload = portfolioFiles.filter(f => f.file);
        let finalPortfolio = [...portfolioFiles];

        if (filesToUpload.length > 0) {
          try {
            for (let i = 0; i < filesToUpload.length; i++) {
              const f = filesToUpload[i];
              const fileIndex = finalPortfolio.findIndex(item => item === f);

              const formData = new FormData();
              formData.append('file', f.file);

              await axios.post(`${import.meta.env.VITE_API_URL}/upload/upload-direct`, formData, {
                onUploadProgress: (progressEvent) => {
                  const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                  setPortfolioFiles(prev => {
                    const updated = [...prev];
                    if (updated[fileIndex]) {
                      updated[fileIndex] = { ...updated[fileIndex], uploadProgress: progress };
                    }
                    return updated;
                  });
                }
              }).then(res => {
                if (res.data.success) {
                  if (fileIndex !== -1) {
                    finalPortfolio[fileIndex] = { url: res.data.url, type: f.file.type, uploadProgress: 100 };
                    setPortfolioFiles([...finalPortfolio]);
                  }
                }
              });
            }
          } catch (uploadErr) {
            console.error('Failed to upload files:', uploadErr);
            throw new Error('Failed to upload files to server.');
          }
        }

        stepCustom.portfolio = {
          photos: finalPortfolio.filter(f => f.type?.startsWith('image/')).map(f => f.url),
          videos: finalPortfolio.filter(f => f.type?.startsWith('video/')).map(f => f.url)
        };
      }
      if (currentStep === 6) {
        stepCustom.pricing = { ...creatorUser?.pricing, ...pricing };
      }
      if (currentStep === 7) {
        stepCustom.availability = { ...creatorUser?.availability, status: availabilityStatus };
      }
      if (currentStep === 8 && !paymentDone) {
        setLoading(false);
        setError('Please complete the onboarding fee payment to proceed.');
        return;
      }

      const payload = buildCurrentPayload(nextStep, stepCustom);
      await updateProfile(payload);
      setLastSaved(true);
      setCurrentStep(nextStep);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save progress.');
    }
    setLoading(false);
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('creatorToken');
      const orderRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/create-onboarding-order`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // If Super Admin configured Onboarding Fee to be FREE
      if (orderRes.data.isFree) {
        const verifyRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/payments/verify-onboarding`,
          { isFree: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (verifyRes.data.success) {
          setPaymentDone(true);
          setReceipt({
            paymentId: 'FREE_ACTIVATION',
            orderId: 'FREE_ONBOARDING',
            amount: 0,
            name: orderRes.data.creatorName || basic.fullName,
            phone: orderRes.data.creatorPhone || '',
            date: new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })
          });
        }
        setPaymentLoading(false);
        return;
      }

      const { orderId, amount, currency, creatorName, creatorPhone } = orderRes.data;
      const keyRes = await axios.get(`${import.meta.env.VITE_API_URL}/payments/razorpay-key`);

      const options = {
        key: keyRes.data.key,
        amount,
        currency,
        name: 'MyCastNow',
        description: 'Creator Onboarding Fee',
        image: '/mycastnow logo.jpeg',
        order_id: orderId,
        prefill: { name: creatorName, contact: creatorPhone },
        theme: { color: '#a21caf' },
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/payments/verify-onboarding`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (verifyRes.data.success) {
              setPaymentDone(true);
              setReceipt({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: amount / 100,
                name: creatorName,
                phone: creatorPhone,
                date: new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })
              });
            }
          } catch {
            setError('Payment verification failed. Please contact support.');
          }
          setPaymentLoading(false);
        },
        modal: { ondismiss: () => setPaymentLoading(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment.');
      setPaymentLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      await updateProfile({
        isProfileComplete: true,
        onboardingStep: 9
      });
      navigate('/creator/dashboard');
    } catch (err) {
      setError('Failed to publish profile.');
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-fuchsia-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <img src="/mycastnow logo.jpeg" alt="Logo" className="h-6 sm:h-8" />
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 text-xs">
            {autoSaving ? (
              <span className="flex items-center gap-1.5 text-fuchsia-600 font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-fuchsia-600 animate-ping"></span>
                Saving draft...
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <Check size={14} className="text-emerald-500" />
                Draft auto-saved
              </span>
            ) : null}
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 text-right">
            <span className="md:hidden">Step {currentStep}/{steps.length}</span>
            <span className="hidden md:inline">Step {currentStep} of {steps.length}: {steps[currentStep - 1]}</span>
          </p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1.5">
        <div
          className="bg-fuchsia-600 h-1.5 transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        ></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-6xl w-full mx-auto p-4 md:p-8 gap-8">

        {/* Sidebar Steps Indicator */}
        <div className="hidden md:block w-64 shrink-0">
          <ul className="space-y-6">
            {steps.map((s, i) => (
              <li key={i} className={`flex items-center gap-4 ${currentStep === i + 1 ? 'text-gray-900 font-bold' : currentStep > i + 1 ? 'text-green-600 font-medium' : 'text-gray-400 font-medium'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === i + 1 ? 'border-gray-900 bg-white' : currentStep > i + 1 ? 'border-green-600 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
                  {currentStep > i + 1 ? <CheckCircle2 size={16} /> : (i + 1)}
                </div>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Form Content */}
        <div className="flex-1 bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-5 sm:p-8 min-h-[500px] flex flex-col relative">

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div className="flex-1">
            {/* Step 1: Category */}
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">What describes you best?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleSelectCategory(cat)}
                      className={`p-4 border-2 rounded-2xl text-center font-bold transition-all ${prof.primaryCategory === cat ? 'border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Basic Details */}
            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4 sm:space-y-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Basic Details</h2>

                <div className="flex flex-col sm:flex-row gap-6 mb-6 sm:items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md overflow-hidden flex items-center justify-center relative group">
                      {basic.profilePhoto ? (
                        <img src={basic.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-gray-400 w-10 h-10" />
                      )}
                      {photoUploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                          <div className="w-6 h-6 rounded-full border-2 border-white border-t-fuchsia-400 animate-spin"></div>
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/50 flex opacity-0 group-hover:opacity-100 items-center justify-center cursor-pointer transition-all">
                        <span className="text-white text-xs font-bold text-center px-2">Upload Profile Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              const previewUrl = URL.createObjectURL(file);
                              setBasic(prev => ({ ...prev, profilePhoto: previewUrl }));
                              setPhotoUploading(true);
                              try {
                                const formData = new FormData();
                                formData.append('file', file);
                                const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload/upload-direct`, formData);
                                if (res.data.success) {
                                  const uploadedUrl = res.data.url;
                                  setBasic(prev => ({ ...prev, profilePhoto: uploadedUrl }));
                                  triggerAutoSave({
                                    basicDetails: { ...basic, profilePhoto: uploadedUrl },
                                    onboardingStep: 2
                                  });
                                } else {
                                  setError('Profile photo upload failed. Please try again.');
                                  setBasic(prev => ({ ...prev, profilePhoto: previewUrl }));
                                }
                              } catch (err) {
                                console.error('Failed to upload profile photo', err);
                                setError('Profile photo upload failed. Please try again.');
                                setBasic(prev => ({ ...prev, profilePhoto: previewUrl }));
                              } finally {
                                setPhotoUploading(false);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                    <span className="text-xs font-bold text-gray-500">Upload Profile Image</span>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input type="text" value={basic.fullName} onChange={e => setBasic({ ...basic, fullName: e.target.value })} className="w-full p-3 bg-white border border-gray-200 rounded-xl shadow-sm" placeholder="John Doe" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">City / Location</label>
                    <input type="text" value={basic.city} onChange={e => setBasic({ ...basic, city: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Mumbai" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                    <select value={basic.gender} onChange={e => setBasic({ ...basic, gender: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
                    <input type="date" value={basic.dob} onChange={e => setBasic({ ...basic, dob: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bio / About Me</label>
                  <textarea value={basic.bio} onChange={e => setBasic({ ...basic, bio: e.target.value })} rows="4" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Tell brands about yourself..."></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input type="email" value={basic.email} onChange={e => setBasic({ ...basic, email: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="johndoe@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Languages Spoken</label>
                    <input type="text" value={basic.languages} onChange={e => setBasic({ ...basic, languages: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="English, Hindi, Marathi" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Instagram Link</label>
                    <input type="url" value={basic.instagram} onChange={e => setBasic({ ...basic, instagram: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="https://instagram.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">LinkedIn Link</label>
                    <input type="url" value={basic.linkedin} onChange={e => setBasic({ ...basic, linkedin: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Portfolio Link</label>
                    <input type="url" value={basic.portfolioLink} onChange={e => setBasic({ ...basic, portfolioLink: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="https://yourportfolio.com" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Professional */}
            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4 sm:space-y-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Professional Experience</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Years of Experience</label>
                    <select value={prof.experience} onChange={e => setProf({ ...prof, experience: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <option value="">Select</option>
                      <option value="Fresher">Fresher</option>
                      <option value="1-3 Years">1-3 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Skills</label>
                    <input type="text" value={prof.skills} onChange={e => setProf({ ...prof, skills: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Acting, Dancing, Modeling" />
                    <p className="text-xs text-gray-400 mt-1">Separate multiple skills with commas</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Physical Attributes */}
            {currentStep === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4 sm:space-y-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Physical Attributes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Height</label>
                    <input type="text" value={physical.height} onChange={e => setPhysical({ ...physical, height: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="5'10&quot;" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Weight</label>
                    <input type="text" value={physical.weight} onChange={e => setPhysical({ ...physical, weight: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="70 kg" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Eye Color</label>
                    <input type="text" value={physical.eyeColor} onChange={e => setPhysical({ ...physical, eyeColor: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Brown" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Hair Color</label>
                    <input type="text" value={physical.hairColor} onChange={e => setPhysical({ ...physical, hairColor: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Black" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Chest / Bust</label>
                    <input type="text" value={physical.chest} onChange={e => setPhysical({ ...physical, chest: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="40&quot;" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Waist</label>
                    <input type="text" value={physical.waist} onChange={e => setPhysical({ ...physical, waist: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="32&quot;" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Hips</label>
                    <input type="text" value={physical.hips} onChange={e => setPhysical({ ...physical, hips: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="38&quot;" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Portfolio */}
            {currentStep === 5 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Upload Portfolio</h2>
                <p className="text-sm sm:text-base text-gray-500 mb-6">Add your best photos and videos to showcase your work.</p>

                <label className="border-2 border-dashed border-gray-300 rounded-3xl p-8 sm:p-12 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex flex-col items-center justify-center relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        const newFiles = Array.from(e.target.files).map(file => ({
                          file,
                          url: URL.createObjectURL(file),
                          type: file.type,
                          uploadProgress: 0
                        }));
                        setPortfolioFiles(prev => [...prev, ...newFiles]);
                      }
                    }}
                  />
                  <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 font-medium">Click to browse or drag and drop files here</p>
                  <p className="text-xs text-gray-400 mt-2">JPG, PNG, MP4 up to 50MB</p>
                </label>

                {portfolioFiles.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {portfolioFiles.map((fileObj, idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-gray-200 relative group bg-black flex items-center justify-center">
                        {fileObj.type.startsWith('video/') ? (
                          <video src={fileObj.url} className="w-full h-full object-cover" autoPlay muted loop />
                        ) : (
                          <img src={fileObj.url} className="w-full h-full object-cover" alt="portfolio item" />
                        )}
                        {fileObj.uploadProgress > 0 && fileObj.uploadProgress < 100 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-12 h-12 rounded-full border-4 border-white border-t-fuchsia-500 animate-spin mb-2"></div>
                              <p className="text-white text-xs font-bold">{fileObj.uploadProgress}%</p>
                            </div>
                          </div>
                        )}
                        {fileObj.uploadProgress === 100 && (
                          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                            <CheckCircle2 size={24} className="text-green-400" />
                          </div>
                        )}
                        <button
                          onClick={() => setPortfolioFiles(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <AlertCircle size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Pricing */}
            {currentStep === 6 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4 sm:space-y-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Pricing Setup</h2>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Hourly Rate (₹)</label>
                  <input type="number" value={pricing.hourlyRate} onChange={e => setPricing({ ...pricing, hourlyRate: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="e.g. 500" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Day Rate (₹)</label>
                  <input type="number" value={pricing.dayRate} onChange={e => setPricing({ ...pricing, dayRate: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="e.g. 4000" />
                </div>
              </div>
            )}

            {/* Step 7: Availability */}
            {currentStep === 7 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Current Availability</h2>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button onClick={() => handleSelectAvailability('Available')} className={`flex-1 py-4 border-2 rounded-2xl font-bold ${availabilityStatus === 'Available' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'}`}>Available Now</button>
                  <button onClick={() => handleSelectAvailability('Unavailable')} className={`flex-1 py-4 border-2 rounded-2xl font-bold ${availabilityStatus === 'Unavailable' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600'}`}>Unavailable</button>
                </div>
              </div>
            )}

            {/* Step 8: Payment */}
            {currentStep === 8 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 px-2 sm:px-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Onboarding Fee</h2>
                <p className="text-sm sm:text-base text-gray-500 mb-8">One-time fee to activate your creator profile on MyCastNow.</p>

                {paymentDone ? (
                  <div className="flex flex-col items-center gap-5">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-green-700">Payment Successful!</h3>
                    <p className="text-gray-500 text-sm">Your onboarding fee has been received. Click Next to continue.</p>
                    <DownloadReceipt receipt={receipt} />
                  </div>
                ) : (
                  <div className="max-w-sm mx-auto">
                    <div className="bg-gradient-to-br from-fuchsia-600 to-purple-700 rounded-3xl p-8 text-white text-center mb-6 shadow-xl shadow-fuchsia-200">
                      <CreditCard className="w-10 h-10 mx-auto mb-4 opacity-80" />
                      <p className="text-sm font-semibold opacity-80 mb-1">
                        {onboardingFeeConfig.isFree || onboardingFeeConfig.fee === 0 ? 'Special Promotion' : 'One-time Onboarding Fee'}
                      </p>
                      <p className="text-5xl font-black mb-1">
                        {onboardingFeeConfig.isFree || onboardingFeeConfig.fee === 0 ? 'FREE' : `₹${onboardingFeeConfig.fee}`}
                      </p>
                      <p className="text-xs opacity-70">
                        {onboardingFeeConfig.isFree || onboardingFeeConfig.fee === 0 ? '₹0 activation fee currently active' : 'Includes profile listing + admin verification'}
                      </p>
                    </div>
                    <ul className="space-y-3 mb-8 text-sm text-gray-600">
                      {['Profile listed on MyCastNow platform', 'Admin verification & approval', 'Access to casting calls & bookings', 'Lifetime profile (no renewal)'].map(item => (
                        <li key={item} className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-fuchsia-600 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={handlePayment}
                      disabled={paymentLoading}
                      className="w-full py-4 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-200 transition-all disabled:opacity-60 cursor-pointer"
                    >
                      {onboardingFeeConfig.isFree || onboardingFeeConfig.fee === 0 ? (
                        <>
                          <CheckCircle2 size={18} />
                          {paymentLoading ? 'Activating Profile...' : 'Activate Profile for Free'}
                        </>
                      ) : (
                        <>
                          <IndianRupee size={18} />
                          {paymentLoading ? 'Opening Payment...' : `Pay ₹${onboardingFeeConfig.fee} Now`}
                        </>
                      )}
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-3">
                      {onboardingFeeConfig.isFree || onboardingFeeConfig.fee === 0 
                        ? '100% Free · No payment required'
                        : 'Secured by Razorpay · UPI, Cards, NetBanking accepted'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 9: Preview */}
            {currentStep === 9 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center px-2 sm:px-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">You're all set, {basic.fullName}!</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">Your profile looks great. Hit publish to submit your profile to our admin team for verification.</p>

                <div className="bg-gray-50 p-6 rounded-2xl text-left max-w-md mx-auto mb-8 border border-gray-100">
                  <p className="font-bold text-gray-800 mb-2">Profile Summary</p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li><strong>Category:</strong> {prof.primaryCategory}</li>
                    <li><strong>Phone:</strong> {creatorUser?.phone}</li>
                    <li><strong>Location:</strong> {basic.city || 'Not specified'}</li>
                  </ul>
                </div>
              </div>
            )}

          </div>

          {/* Footer Controls */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button onClick={() => setCurrentStep(prev => prev - 1)} disabled={loading} className="px-4 sm:px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                <ChevronLeft size={18} /> <span className="hidden sm:inline">Back</span>
              </button>
            ) : <div></div>}

            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                disabled={loading || (currentStep === 1 && !prof.primaryCategory) || (currentStep === 8 && !paymentDone)}
                className="px-6 sm:px-8 py-3 rounded-xl font-bold bg-gray-900 text-white hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? 'Saving...' : 'Next'} <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={loading}
                className="px-6 sm:px-8 py-3 rounded-xl font-bold bg-fuchsia-600 text-white hover:bg-fuchsia-700 shadow-lg shadow-fuchsia-500/30 transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                {loading ? 'Publishing...' : <><span className="hidden sm:inline">Publish Profile</span><span className="sm:hidden">Publish</span></>} <CheckCircle2 size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorSignupFlow;
