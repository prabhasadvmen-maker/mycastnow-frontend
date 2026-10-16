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
  "Photos",
  "Videos",
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
  const [fieldErrors, setFieldErrors] = useState({});
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

  // 5. Photos (max 10)
  const initialPhotoFiles = (creatorUser?.portfolio?.photos?.map(url => ({ url, type: 'image/jpeg', uploadProgress: 100 })) || []);
  const [photoFiles, setPhotoFiles] = useState(initialPhotoFiles);

  // 6. Videos (max 5)
  const initialVideoFiles = (creatorUser?.portfolio?.videos?.map(url => ({ url, type: 'video/mp4', uploadProgress: 100 })) || []);
  const [portfolioFiles, setPortfolioFiles] = useState(initialVideoFiles);

  // 7. Pricing
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
        if (photos.length > 0) setPhotoFiles(photos);
        if (videos.length > 0) setPortfolioFiles(videos);
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

    const validPhotos = photoFiles.filter(f => f.url && !f.url.startsWith('blob:')).map(f => f.url);
    const validVideos = portfolioFiles.filter(f => f.url && !f.url.startsWith('blob:')).map(f => f.url);
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
  }, [basic, prof, physical, pricing, availabilityStatus, currentStep, portfolioFiles, photoFiles]);

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
    clearFieldError('primaryCategory');
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
    clearFieldError('availability');
    triggerAutoSave({
      availabilityStatus: status,
      onboardingStep: 8
    });
  };

  // Clear specific field validation error
  const clearFieldError = (field) => {
    setFieldErrors(prev => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
    setError('');
  };

  // Validate fields for current step
  const validateCurrentStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!prof.primaryCategory) {
        errors.primaryCategory = 'Please select a category that describes you best.';
      }
    } else if (step === 2) {
      if (photoUploading) {
        errors.profilePhoto = 'Please wait for your profile photo to finish uploading.';
      } else if (!basic.profilePhoto || !basic.profilePhoto.trim()) {
        errors.profilePhoto = 'Profile photo is required.';
      }
      if (!basic.fullName || !basic.fullName.trim()) {
        errors.fullName = 'Full Name is required.';
      } else if (basic.fullName.trim().length < 2) {
        errors.fullName = 'Full Name must be at least 2 characters.';
      }
      if (!basic.city || !basic.city.trim()) {
        errors.city = 'City / Location is required.';
      }
      if (!basic.gender) {
        errors.gender = 'Please select your gender.';
      }
      if (!basic.dob) {
        errors.dob = 'Date of birth is required.';
      }
      if (!basic.bio || !basic.bio.trim()) {
        errors.bio = 'Bio / About Me is required.';
      } else if (basic.bio.trim().length < 10) {
        errors.bio = 'Bio must be at least 10 characters long.';
      }
      if (basic.email && basic.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basic.email.trim())) {
        errors.email = 'Please enter a valid email address.';
      }
    } else if (step === 3) {
      if (!prof.experience) {
        errors.experience = 'Please select your experience level.';
      }
      if (!prof.skills || !prof.skills.trim()) {
        errors.skills = 'Please enter at least one skill or talent.';
      }
    } else if (step === 4) {
      const isPhysicalStrict = ['Model', 'Actor', 'Influencer'].includes(prof.primaryCategory);
      if (isPhysicalStrict) {
        if (!physical.height || !physical.height.trim()) {
          errors.height = `Height is required for ${prof.primaryCategory || 'this category'}.`;
        }
        if (!physical.weight || !physical.weight.trim()) {
          errors.weight = `Weight is required for ${prof.primaryCategory || 'this category'}.`;
        }
      }
    } else if (step === 5) {
      if (!photoFiles || photoFiles.length === 0) {
        errors.photos = 'Please upload at least 1 photo.';
      } else if (photoFiles.some(f => f.uploadProgress > 0 && f.uploadProgress < 100)) {
        errors.photos = 'Please wait for your photos to finish uploading.';
      }
    } else if (step === 6) {
      if (!portfolioFiles || portfolioFiles.length === 0) {
        errors.portfolio = 'Please upload at least 1 video.';
      } else if (portfolioFiles.some(f => f.uploadProgress > 0 && f.uploadProgress < 100)) {
        errors.portfolio = 'Please wait for your videos to finish uploading.';
      }
    } else if (step === 7) {
      const hasHourly = pricing.hourlyRate !== '' && Number(pricing.hourlyRate) > 0;
      const hasDay = pricing.dayRate !== '' && Number(pricing.dayRate) > 0;
      if (!hasHourly && !hasDay) {
        errors.pricing = 'Please enter a valid Day Rate or Hourly Rate (greater than ₹0).';
      }
    } else if (step === 8) {
      if (!availabilityStatus) {
        errors.availability = 'Please select your current availability status.';
      }
    } else if (step === 9) {
      if (!paymentDone) {
        errors.payment = 'Please complete the onboarding fee payment to proceed.';
      }
    }

    return errors;
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
    const stepErrors = validateCurrentStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setFieldErrors(stepErrors);
      const firstErrorMessage = Object.values(stepErrors)[0];
      setError(firstErrorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setFieldErrors({});
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
        const finalPhotos = photoFiles.filter(f => f.uploadProgress === 100 && f.url && !f.url.startsWith('blob:'));
        stepCustom.portfolio = {
          photos: finalPhotos.map(f => f.url),
          videos: creatorUser?.portfolio?.videos || []
        };
      }
      if (currentStep === 6) {
        const finalVideos = portfolioFiles.filter(f => f.uploadProgress === 100 && f.url && !f.url.startsWith('blob:'));
        stepCustom.portfolio = {
          photos: photoFiles.filter(f => f.uploadProgress === 100 && f.url && !f.url.startsWith('blob:')).map(f => f.url),
          videos: finalVideos.map(f => f.url)
        };
      }
      if (currentStep === 7) {
        stepCustom.pricing = { ...creatorUser?.pricing, ...pricing };
      }
      if (currentStep === 8) {
        stepCustom.availability = { ...creatorUser?.availability, status: availabilityStatus };
      }
      if (currentStep === 9 && !paymentDone) {
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
    setError('');
    for (let s = 1; s <= 9; s++) {
      const sErrors = validateCurrentStep(s);
      if (Object.keys(sErrors).length > 0) {
        setFieldErrors(sErrors);
        setError(`Please complete step ${s} (${steps[s - 1]}): ${Object.values(sErrors)[0]}`);
        setCurrentStep(s);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setLoading(true);
    try {
      await updateProfile({
        isProfileComplete: true,
        onboardingStep: 10
      });
      navigate('/creator/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish profile.');
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
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                    What describes you best? <span className="text-rose-500">*</span>
                  </h2>
                  <p className="text-sm text-gray-500">
                    Select your primary talent category. This helps brands, studios, and casting directors find you.
                  </p>
                </div>
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 p-1 rounded-2xl ${fieldErrors.primaryCategory ? 'ring-2 ring-rose-500/50 bg-rose-50/20' : ''}`}>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        handleSelectCategory(cat);
                        clearFieldError('primaryCategory');
                      }}
                      className={`p-4 border-2 rounded-2xl text-center font-bold transition-all cursor-pointer ${prof.primaryCategory === cat ? 'border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700 shadow-sm' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {fieldErrors.primaryCategory && (
                  <p className="text-xs text-rose-500 mt-2 font-medium flex items-center gap-1">
                    <AlertCircle size={14} /> {fieldErrors.primaryCategory}
                  </p>
                )}
              </div>
            )}

            {/* Step 2: Basic Details */}
            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4 sm:space-y-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Basic Details</h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Fields marked with <span className="text-rose-500 font-bold">*</span> are required for creator verification.
                  </p>
                </div>

                <div className={`flex flex-col sm:flex-row gap-6 mb-6 sm:items-center bg-gray-50 p-4 rounded-2xl border ${fieldErrors.profilePhoto ? 'border-rose-400 bg-rose-50/30' : 'border-gray-100'}`}>
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className={`w-24 h-24 rounded-full bg-gray-200 border-4 ${fieldErrors.profilePhoto ? 'border-rose-500 ring-2 ring-rose-300' : 'border-white'} shadow-md overflow-hidden flex items-center justify-center relative group`}>
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
                              clearFieldError('profilePhoto');
                              setPhotoUploading(true);
                              try {
                                const formData = new FormData();
                                formData.append('file', file);
                                const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload/upload-direct`, formData);
                                if (res.data.success) {
                                  const uploadedUrl = res.data.url;
                                  setBasic(prev => ({ ...prev, profilePhoto: uploadedUrl }));
                                  clearFieldError('profilePhoto');
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
                    <span className="text-xs font-bold text-gray-600 flex items-center gap-0.5">
                      Profile Photo <span className="text-rose-500">*</span>
                    </span>
                    {fieldErrors.profilePhoto && (
                      <p className="text-[11px] text-rose-500 font-semibold">{fieldErrors.profilePhoto}</p>
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={basic.fullName}
                      onChange={e => {
                        setBasic({ ...basic, fullName: e.target.value });
                        clearFieldError('fullName');
                      }}
                      className={`w-full p-3 bg-white border ${fieldErrors.fullName ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-200' : 'border-gray-200'} rounded-xl shadow-sm`}
                      placeholder="e.g. Aarav Sharma"
                    />
                    {fieldErrors.fullName && <p className="text-xs text-rose-500 mt-1 font-medium">{fieldErrors.fullName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      City / Location <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={basic.city}
                      onChange={e => {
                        setBasic({ ...basic, city: e.target.value });
                        clearFieldError('city');
                      }}
                      className={`w-full p-3 bg-gray-50 border ${fieldErrors.city ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-200' : 'border-gray-200'} rounded-xl`}
                      placeholder="e.g. Mumbai"
                    />
                    {fieldErrors.city && <p className="text-xs text-rose-500 mt-1 font-medium">{fieldErrors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Gender <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={basic.gender}
                      onChange={e => {
                        setBasic({ ...basic, gender: e.target.value });
                        clearFieldError('gender');
                      }}
                      className={`w-full p-3 bg-gray-50 border ${fieldErrors.gender ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-200' : 'border-gray-200'} rounded-xl`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {fieldErrors.gender && <p className="text-xs text-rose-500 mt-1 font-medium">{fieldErrors.gender}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Date of Birth <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={basic.dob}
                      onChange={e => {
                        setBasic({ ...basic, dob: e.target.value });
                        clearFieldError('dob');
                      }}
                      className={`w-full p-3 bg-gray-50 border ${fieldErrors.dob ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-200' : 'border-gray-200'} rounded-xl`}
                    />
                    {fieldErrors.dob && <p className="text-xs text-rose-500 mt-1 font-medium">{fieldErrors.dob}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Bio / About Me <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={basic.bio}
                    onChange={e => {
                      setBasic({ ...basic, bio: e.target.value });
                      clearFieldError('bio');
                    }}
                    rows="4"
                    className={`w-full p-3 bg-gray-50 border ${fieldErrors.bio ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-200' : 'border-gray-200'} rounded-xl`}
                    placeholder="Tell brands and casting directors about your work, background, and special talents (at least 10 characters)..."
                  />
                  {fieldErrors.bio && <p className="text-xs text-rose-500 mt-1 font-medium">{fieldErrors.bio}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={basic.email}
                      onChange={e => {
                        setBasic({ ...basic, email: e.target.value });
                        clearFieldError('email');
                      }}
                      className={`w-full p-3 bg-gray-50 border ${fieldErrors.email ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-200' : 'border-gray-200'} rounded-xl`}
                      placeholder="johndoe@example.com"
                    />
                    {fieldErrors.email && <p className="text-xs text-rose-500 mt-1 font-medium">{fieldErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Languages Spoken <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={basic.languages}
                      onChange={e => setBasic({ ...basic, languages: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                      placeholder="English, Hindi, Marathi"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Instagram Link <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={basic.instagram}
                      onChange={e => setBasic({ ...basic, instagram: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      LinkedIn Link <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={basic.linkedin}
                      onChange={e => setBasic({ ...basic, linkedin: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Portfolio Link <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={basic.portfolioLink}
                      onChange={e => setBasic({ ...basic, portfolioLink: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Professional */}
            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4 sm:space-y-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Professional Experience</h2>
                  <p className="text-xs sm:text-sm text-gray-500">Provide details about your experience and primary skill set.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Years of Experience <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={prof.experience}
                      onChange={e => {
                        setProf({ ...prof, experience: e.target.value });
                        clearFieldError('experience');
                      }}
                      className={`w-full p-3 bg-gray-50 border ${fieldErrors.experience ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-200' : 'border-gray-200'} rounded-xl`}
                    >
                      <option value="">Select Experience</option>
                      <option value="Fresher">Fresher (New to industry)</option>
                      <option value="1-3 Years">1-3 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                    </select>
                    {fieldErrors.experience && <p className="text-xs text-rose-500 mt-1 font-medium">{fieldErrors.experience}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Skills & Talents <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={prof.skills}
                      onChange={e => {
                        setProf({ ...prof, skills: e.target.value });
                        clearFieldError('skills');
                      }}
                      className={`w-full p-3 bg-gray-50 border ${fieldErrors.skills ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-200' : 'border-gray-200'} rounded-xl`}
                      placeholder="Acting, Dancing, Modeling, Commercials"
                    />
                    <p className="text-xs text-gray-400 mt-1">Separate multiple skills with commas</p>
                    {fieldErrors.skills && <p className="text-xs text-rose-500 mt-1 font-medium">{fieldErrors.skills}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Physical Attributes */}
            {currentStep === 4 && (() => {
              const isPhysicalStrict = ['Model', 'Actor', 'Influencer'].includes(prof.primaryCategory);
              return (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4 sm:space-y-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Physical Attributes</h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {isPhysicalStrict
                        ? `Height & weight are required for ${prof.primaryCategory || 'your category'} casting calls.`
                        : `Physical measurements are optional for ${prof.primaryCategory || 'your category'}.`}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Height {isPhysicalStrict && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        type="text"
                        value={physical.height}
                        onChange={e => {
                          setPhysical({ ...physical, height: e.target.value });
                          clearFieldError('height');
                        }}
                        className={`w-full p-3 bg-gray-50 border ${fieldErrors.height ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-200' : 'border-gray-200'} rounded-xl`}
                        placeholder="5'10&quot; or 178 cm"
                      />
                      {fieldErrors.height && <p className="text-xs text-rose-500 mt-1 font-medium">{fieldErrors.height}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Weight {isPhysicalStrict && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        type="text"
                        value={physical.weight}
                        onChange={e => {
                          setPhysical({ ...physical, weight: e.target.value });
                          clearFieldError('weight');
                        }}
                        className={`w-full p-3 bg-gray-50 border ${fieldErrors.weight ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-200' : 'border-gray-200'} rounded-xl`}
                        placeholder="70 kg"
                      />
                      {fieldErrors.weight && <p className="text-xs text-rose-500 mt-1 font-medium">{fieldErrors.weight}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Eye Color</label>
                      <input
                        type="text"
                        value={physical.eyeColor}
                        onChange={e => setPhysical({ ...physical, eyeColor: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                        placeholder="Brown"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Hair Color</label>
                      <input
                        type="text"
                        value={physical.hairColor}
                        onChange={e => setPhysical({ ...physical, hairColor: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                        placeholder="Black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Chest / Bust</label>
                      <input
                        type="text"
                        value={physical.chest}
                        onChange={e => setPhysical({ ...physical, chest: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                        placeholder="40&quot;"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Waist</label>
                      <input
                        type="text"
                        value={physical.waist}
                        onChange={e => setPhysical({ ...physical, waist: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                        placeholder="32&quot;"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Hips</label>
                      <input
                        type="text"
                        value={physical.hips}
                        onChange={e => setPhysical({ ...physical, hips: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                        placeholder="38&quot;"
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Step 5: Photos Upload (Max 10) */}
            {currentStep === 5 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                    Upload Photos <span className="text-rose-500">*</span>
                  </h2>
                  <p className="text-sm text-gray-500">
                    Upload up to <strong>10 photos</strong> to showcase your look to casting directors.
                  </p>
                </div>

                {photoFiles.length < 10 ? (
                  <label className={`border-2 border-dashed ${fieldErrors.photos ? 'border-rose-400 bg-rose-50/20' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'} rounded-3xl p-8 sm:p-12 transition-colors cursor-pointer flex flex-col items-center justify-center relative`}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={async (e) => {
                        if (!e.target.files || e.target.files.length === 0) return;
                        const remaining = 10 - photoFiles.length;
                        const selectedFiles = Array.from(e.target.files).slice(0, remaining);
                        clearFieldError('photos');
                        const newEntries = selectedFiles.map(file => ({
                          file, name: file.name, size: file.size,
                          url: URL.createObjectURL(file), type: file.type,
                          uploadProgress: 0, error: false
                        }));
                        setPhotoFiles(prev => {
                          const updated = [...prev, ...newEntries];
                          newEntries.forEach((entry, i) => {
                            const globalIdx = prev.length + i;
                            const formData = new FormData();
                            formData.append('file', entry.file);
                            axios.post(`${import.meta.env.VITE_API_URL}/upload/upload-direct`, formData, {
                              onUploadProgress: (pe) => {
                                const pct = Math.round((pe.loaded / pe.total) * 100);
                                setPhotoFiles(cur => { const c = [...cur]; if (c[globalIdx]) c[globalIdx] = { ...c[globalIdx], uploadProgress: pct }; return c; });
                              }
                            }).then(res => {
                              if (res.data.success) {
                                setPhotoFiles(cur => { const c = [...cur]; if (c[globalIdx]) c[globalIdx] = { ...c[globalIdx], url: res.data.url, uploadProgress: 100, file: null }; return c; });
                              }
                            }).catch(() => {
                              setPhotoFiles(cur => { const c = [...cur]; if (c[globalIdx]) c[globalIdx] = { ...c[globalIdx], uploadProgress: 0, error: true }; return c; });
                            });
                          });
                          return updated;
                        });
                      }}
                    />
                    <UploadCloud className={`w-12 h-12 mb-4 ${fieldErrors.photos ? 'text-rose-400' : 'text-gray-400'}`} />
                    <p className="text-gray-700 font-semibold">Click to browse or drag and drop photos here</p>
                    <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 10MB · {10 - photoFiles.length} photo{10 - photoFiles.length !== 1 ? 's' : ''} remaining</p>
                  </label>
                ) : (
                  <div className="border-2 border-emerald-300 bg-emerald-50 rounded-3xl p-8 flex flex-col items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 mb-3 text-emerald-500" />
                    <p className="text-emerald-700 font-bold">Maximum 10 photos uploaded!</p>
                    <p className="text-xs text-emerald-600 mt-1">Remove a photo below to upload a different one.</p>
                  </div>
                )}

                {fieldErrors.photos && (
                  <p className="text-xs text-rose-500 mt-2 font-medium flex items-center gap-1">
                    <AlertCircle size={14} /> {fieldErrors.photos}
                  </p>
                )}

                {photoFiles.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-xs font-semibold px-1 mb-3">
                      <span className="text-gray-500">{photoFiles.length}/10 photos</span>
                      <span className="flex items-center gap-3">
                        {photoFiles.filter(f => f.uploadProgress > 0 && f.uploadProgress < 100).length > 0 && <span className="text-fuchsia-600 animate-pulse">{photoFiles.filter(f => f.uploadProgress > 0 && f.uploadProgress < 100).length} uploading...</span>}
                        {photoFiles.filter(f => f.uploadProgress === 100).length > 0 && <span className="text-emerald-600">{photoFiles.filter(f => f.uploadProgress === 100).length} uploaded</span>}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {photoFiles.map((fileObj, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                          <img src={fileObj.url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                          {fileObj.uploadProgress > 0 && fileObj.uploadProgress < 100 && (
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                              <span className="text-white text-xs font-black">{fileObj.uploadProgress}%</span>
                              <div className="w-3/4 bg-white/30 rounded-full h-1 mt-1">
                                <div className="bg-fuchsia-400 h-full rounded-full" style={{ width: `${fileObj.uploadProgress}%` }} />
                              </div>
                            </div>
                          )}
                          {fileObj.error && (
                            <div className="absolute inset-0 bg-rose-500/70 flex items-center justify-center">
                              <AlertCircle size={20} className="text-white" />
                            </div>
                          )}
                          {fileObj.uploadProgress === 100 && (
                            <div className="absolute top-1 left-1">
                              <CheckCircle2 size={16} className="text-emerald-400 drop-shadow" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => setPhotoFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-xs font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Videos Upload (Max 5) */}
            {currentStep === 6 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                    Upload Videos <span className="text-rose-500">*</span>
                  </h2>
                  <p className="text-sm sm:text-base text-gray-500">
                    Upload up to <strong>5 videos</strong> to showcase your talent to casting directors.
                  </p>
                </div>

                {(() => {
                  const videoFiles = portfolioFiles.filter(f => f.type?.startsWith('video/'));
                  const canUploadMore = videoFiles.length < 5;
                  return (
                    <>
                      {canUploadMore ? (
                        <label className={`border-2 border-dashed ${fieldErrors.portfolio ? 'border-rose-400 bg-rose-50/20' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'} rounded-3xl p-8 sm:p-12 transition-colors cursor-pointer flex flex-col items-center justify-center relative`}>
                          <input
                            type="file"
                            multiple
                            accept="video/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={async (e) => {
                              if (!e.target.files || e.target.files.length === 0) return;
                              const currentVideos = portfolioFiles.filter(f => f.type?.startsWith('video/'));
                              const remaining = 5 - currentVideos.length;
                              const selectedFiles = Array.from(e.target.files).slice(0, remaining);
                              clearFieldError('portfolio');

                              const newEntries = selectedFiles.map(file => ({
                                file,
                                name: file.name,
                                size: file.size,
                                url: URL.createObjectURL(file),
                                type: file.type,
                                uploadProgress: 0,
                                error: false
                              }));

                              setPortfolioFiles(prev => {
                                const updated = [...prev, ...newEntries];
                                newEntries.forEach((entry, i) => {
                                  const globalIdx = prev.length + i;
                                  const formData = new FormData();
                                  formData.append('file', entry.file);
                                  axios.post(`${import.meta.env.VITE_API_URL}/upload/upload-direct`, formData, {
                                    onUploadProgress: (progressEvent) => {
                                      const pct = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                                      setPortfolioFiles(cur => {
                                        const copy = [...cur];
                                        if (copy[globalIdx]) copy[globalIdx] = { ...copy[globalIdx], uploadProgress: pct };
                                        return copy;
                                      });
                                    }
                                  }).then(res => {
                                    if (res.data.success) {
                                      setPortfolioFiles(cur => {
                                        const copy = [...cur];
                                        if (copy[globalIdx]) copy[globalIdx] = { ...copy[globalIdx], url: res.data.url, uploadProgress: 100, file: null };
                                        return copy;
                                      });
                                    }
                                  }).catch(() => {
                                    setPortfolioFiles(cur => {
                                      const copy = [...cur];
                                      if (copy[globalIdx]) copy[globalIdx] = { ...copy[globalIdx], uploadProgress: 0, error: true };
                                      return copy;
                                    });
                                  });
                                });
                                return updated;
                              });
                            }}
                          />
                          <UploadCloud className={`w-12 h-12 mb-4 ${fieldErrors.portfolio ? 'text-rose-400' : 'text-gray-400'}`} />
                          <p className="text-gray-700 font-semibold">Click to browse or drag and drop videos here</p>
                          <p className="text-xs text-gray-400 mt-2">MP4, MOV up to 50MB · {5 - videoFiles.length} video{5 - videoFiles.length !== 1 ? 's' : ''} remaining</p>
                        </label>
                      ) : (
                        <div className="border-2 border-emerald-300 bg-emerald-50 rounded-3xl p-8 flex flex-col items-center justify-center">
                          <CheckCircle2 className="w-12 h-12 mb-3 text-emerald-500" />
                          <p className="text-emerald-700 font-bold">Maximum 5 videos uploaded!</p>
                          <p className="text-xs text-emerald-600 mt-1">Remove a video below to upload a different one.</p>
                        </div>
                      )}
                    </>
                  );
                })()}

                {fieldErrors.portfolio && (
                  <p className="text-xs text-rose-500 mt-2 font-medium flex items-center gap-1">
                    <AlertCircle size={14} /> {fieldErrors.portfolio}
                  </p>
                )}

                {portfolioFiles.filter(f => f.type?.startsWith('video/')).length > 0 && (
                  <div className="mt-6 space-y-3">
                    {/* Overall upload summary */}
                    {(() => {
                      const videoFiles = portfolioFiles.filter(f => f.type?.startsWith('video/'));
                      const uploading = videoFiles.filter(f => f.uploadProgress > 0 && f.uploadProgress < 100);
                      const done = videoFiles.filter(f => f.uploadProgress === 100);
                      const failed = videoFiles.filter(f => f.error);
                      return (
                        <div className="flex items-center justify-between text-xs font-semibold px-1">
                          <span className="text-gray-500">{videoFiles.length}/5 videos selected</span>
                          <span className="flex items-center gap-3">
                            {uploading.length > 0 && <span className="text-fuchsia-600 animate-pulse">{uploading.length} uploading...</span>}
                            {done.length > 0 && <span className="text-emerald-600">{done.length} uploaded</span>}
                            {failed.length > 0 && <span className="text-rose-500">{failed.length} failed</span>}
                          </span>
                        </div>
                      );
                    })()}

                    {/* File cards with progress bars */}
                    {portfolioFiles.filter(f => f.type?.startsWith('video/')).map((fileObj, idx) => {
                      const isUploading = fileObj.uploadProgress > 0 && fileObj.uploadProgress < 100;
                      const isDone = fileObj.uploadProgress === 100;
                      const isFailed = fileObj.error;
                      const isQueued = fileObj.uploadProgress === 0 && !fileObj.error;
                      const fileName = fileObj.name || fileObj.url?.split('/').pop() || `File ${idx + 1}`;
                      const fileSizeKB = fileObj.size ? (fileObj.size / 1024).toFixed(0) : null;

                      return (
                        <div key={idx} className={`rounded-2xl border overflow-hidden ${
                          isFailed ? 'border-rose-200 bg-rose-50' :
                          isDone ? 'border-emerald-200 bg-emerald-50/40' :
                          isUploading ? 'border-fuchsia-200 bg-fuchsia-50/30' :
                          'border-gray-200 bg-gray-50'
                        }`}>
                          <div className="flex items-center gap-3 p-3">
                            {/* Thumbnail */}
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 shrink-0 relative">
                              {fileObj.type?.startsWith('video/') ? (
                                <video src={fileObj.url} className="w-full h-full object-cover" muted />
                              ) : (
                                <img src={fileObj.url} className="w-full h-full object-cover" alt="preview" />
                              )}
                              {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <span className="text-white text-[10px] font-black">{fileObj.uploadProgress}%</span>
                                </div>
                              )}
                            </div>

                            {/* Info + Progress */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-bold text-gray-800 truncate max-w-[160px]">{fileName}</p>
                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                  {isDone && <CheckCircle2 size={16} className="text-emerald-500" />}
                                  {isFailed && <AlertCircle size={16} className="text-rose-500" />}
                                  {isUploading && (
                                    <span className="text-[11px] font-black text-fuchsia-600">{fileObj.uploadProgress}%</span>
                                  )}
                                  {isQueued && <span className="text-[10px] text-gray-400 font-semibold">Queued</span>}
                                  <button
                                    type="button"
                                    onClick={() => setPortfolioFiles(prev => prev.filter((_, i) => i !== idx))}
                                    className="text-gray-400 hover:text-rose-500 transition cursor-pointer"
                                  >
                                    <AlertCircle size={15} />
                                  </button>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    isFailed ? 'bg-rose-400' :
                                    isDone ? 'bg-emerald-500' :
                                    'bg-fuchsia-500'
                                  }`}
                                  style={{ width: `${isFailed ? 100 : fileObj.uploadProgress}%` }}
                                />
                              </div>

                              <div className="flex items-center justify-between mt-1">
                                <span className="text-[10px] text-gray-400">
                                  {fileObj.type?.startsWith('video/') ? '🎬 Video' : '🖼️ Image'}
                                  {fileSizeKB && ` · ${fileSizeKB > 1024 ? (fileSizeKB / 1024).toFixed(1) + ' MB' : fileSizeKB + ' KB'}`}
                                </span>
                                <span className={`text-[10px] font-semibold ${
                                  isFailed ? 'text-rose-500' :
                                  isDone ? 'text-emerald-600' :
                                  isUploading ? 'text-fuchsia-600' :
                                  'text-gray-400'
                                }`}>
                                  {isFailed ? 'Upload failed' : isDone ? 'Uploaded ✓' : isUploading ? 'Uploading...' : 'Waiting'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Step 7: Pricing */}
            {currentStep === 7 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4 sm:space-y-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                    Pricing Setup <span className="text-rose-500">*</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Set your commercial rates so brands and production houses know your booking fees (at least Day Rate or Hourly Rate is required).
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Day Rate (₹) <span className="text-rose-500 font-semibold">* (Recommended)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pricing.dayRate}
                    onChange={e => {
                      setPricing({ ...pricing, dayRate: e.target.value });
                      clearFieldError('pricing');
                    }}
                    className={`w-full p-3 bg-gray-50 border ${fieldErrors.pricing ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-200' : 'border-gray-200'} rounded-xl`}
                    placeholder="e.g. 5000"
                  />
                  <p className="text-xs text-gray-400 mt-1">Full-day shoot or commercial booking rate</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={pricing.hourlyRate}
                    onChange={e => {
                      setPricing({ ...pricing, hourlyRate: e.target.value });
                      clearFieldError('pricing');
                    }}
                    className={`w-full p-3 bg-gray-50 border ${fieldErrors.pricing ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-200' : 'border-gray-200'} rounded-xl`}
                    placeholder="e.g. 800"
                  />
                  <p className="text-xs text-gray-400 mt-1">Per hour charge for short shoots or voice sessions</p>
                </div>

                {fieldErrors.pricing && (
                  <p className="text-xs text-rose-500 mt-2 font-medium flex items-center gap-1">
                    <AlertCircle size={14} /> {fieldErrors.pricing}
                  </p>
                )}
              </div>
            )}

            {/* Step 8: Availability */}
            {currentStep === 8 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                    Current Availability <span className="text-rose-500">*</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Let casting directors know if you are currently open for new projects and bookings.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectAvailability('Available');
                      clearFieldError('availability');
                    }}
                    className={`flex-1 py-4 border-2 rounded-2xl font-bold transition-all cursor-pointer ${
                      availabilityStatus === 'Available'
                        ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Available Now
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectAvailability('Unavailable');
                      clearFieldError('availability');
                    }}
                    className={`flex-1 py-4 border-2 rounded-2xl font-bold transition-all cursor-pointer ${
                      availabilityStatus === 'Unavailable'
                        ? 'border-red-500 bg-red-50 text-red-700 shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Unavailable
                  </button>
                </div>
                {fieldErrors.availability && (
                  <p className="text-xs text-rose-500 mt-2 font-medium flex items-center gap-1">
                    <AlertCircle size={14} /> {fieldErrors.availability}
                  </p>
                )}
              </div>
            )}

            {/* Step 9: Payment */}
            {currentStep === 9 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 px-2 sm:px-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  Onboarding Fee <span className="text-rose-500">*</span>
                </h2>
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

            {/* Step 10: Preview */}
            {currentStep === 10 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center px-2 sm:px-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">You're all set, {basic.fullName}!</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">Your profile is complete with all required information. Hit publish to submit your profile to our admin team for verification.</p>

                <div className="bg-gray-50 p-6 rounded-2xl text-left max-w-md mx-auto mb-8 border border-gray-100 shadow-sm">
                  <p className="font-bold text-gray-800 mb-3 text-base border-b border-gray-200 pb-2">Profile Summary</p>
                  <ul className="text-sm text-gray-600 space-y-2.5">
                    <li className="flex justify-between"><strong>Full Name:</strong> <span>{basic.fullName || 'N/A'}</span></li>
                    <li className="flex justify-between"><strong>Category:</strong> <span className="font-semibold text-fuchsia-700">{prof.primaryCategory}</span></li>
                    <li className="flex justify-between"><strong>Location:</strong> <span>{basic.city || 'Not specified'}</span></li>
                    <li className="flex justify-between"><strong>Gender:</strong> <span>{basic.gender || 'Not specified'}</span></li>
                    <li className="flex justify-between"><strong>Experience:</strong> <span>{prof.experience || 'Not specified'}</span></li>
                    <li className="flex justify-between"><strong>Day Rate:</strong> <span>{pricing.dayRate ? `₹${pricing.dayRate}` : (pricing.hourlyRate ? `₹${pricing.hourlyRate}/hr` : 'Not specified')}</span></li>
                    <li className="flex justify-between"><strong>Portfolio Files:</strong> <span>{portfolioFiles.length} item(s)</span></li>
                    <li className="flex justify-between"><strong>Onboarding Fee:</strong> <span className="text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 size={14} /> Completed</span></li>
                  </ul>
                </div>
              </div>
            )}

          </div>

          {/* Footer Controls */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setFieldErrors({});
                  setCurrentStep(prev => prev - 1);
                }}
                disabled={loading}
                className="px-4 sm:px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base cursor-pointer"
              >
                <ChevronLeft size={18} /> <span className="hidden sm:inline">Back</span>
              </button>
            ) : <div></div>}

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading || (currentStep === 9 && !paymentDone)}
                className="px-6 sm:px-8 py-3 rounded-xl font-bold bg-gray-900 text-white hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-50 text-sm sm:text-base cursor-pointer"
              >
                {loading ? 'Saving...' : 'Next'} <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={loading}
                className="px-6 sm:px-8 py-3 rounded-xl font-bold bg-fuchsia-600 text-white hover:bg-fuchsia-700 shadow-lg shadow-fuchsia-500/30 transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
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
