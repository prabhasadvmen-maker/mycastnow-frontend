import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import { CheckCircle2, ChevronRight, ChevronLeft, UploadCloud, AlertCircle, User } from 'lucide-react';

const steps = [
  "Category",
  "Basic Details",
  "Professional",
  "Physical Attributes",
  "Portfolio",
  "Pricing",
  "Availability",
  "Preview"
];

const categories = ["Model", "Actor", "Influencer", "Photographer", "Makeup Artist", "Stylist", "Voice Over Artist"];

const CreatorSignupFlow = () => {
  const { creatorUser, updateProfile } = useCreatorAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(creatorUser?.onboardingStep || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Basic Details
  const [basic, setBasic] = useState({
    fullName: creatorUser?.basicDetails?.fullName || '',
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

  // 3. Physical Attributes (New Step)
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
    ...(creatorUser?.portfolio?.photos?.map(url => ({ url, type: 'image/jpeg' })) || []),
    ...(creatorUser?.portfolio?.videos?.map(url => ({ url, type: 'video/mp4' })) || [])
  ];
  const [portfolioFiles, setPortfolioFiles] = useState(initialPortfolioFiles);

  // 6. Pricing
  const [pricing, setPricing] = useState({
    hourlyRate: creatorUser?.pricing?.hourlyRate || '',
    dayRate: creatorUser?.pricing?.dayRate || ''
  });

  // 7. Availability
  const [availabilityStatus, setAvailabilityStatus] = useState(creatorUser?.availability?.status || 'Available');

  useEffect(() => {
    if (creatorUser?.isProfileComplete) {
      navigate('/creator/dashboard');
    }
  }, [creatorUser, navigate]);

  const handleNext = async () => {
    setError('');
    setLoading(true);

    try {
      // Save progress to DB before moving to next step
      let updateData = { onboardingStep: currentStep + 1 };
      
      if (currentStep === 1) updateData.professionalDetails = { ...creatorUser?.professionalDetails, ...prof, skills: prof.skills.split(',').map(s=>s.trim()).filter(s=>s) };
      if (currentStep === 2) updateData.basicDetails = { ...creatorUser?.basicDetails, ...basic, languages: basic.languages.split(',').map(s=>s.trim()).filter(s=>s) };
      if (currentStep === 3) updateData.professionalDetails = { ...creatorUser?.professionalDetails, ...prof, skills: prof.skills.split(',').map(s=>s.trim()).filter(s=>s) };
      if (currentStep === 4) updateData.physicalDetails = { ...creatorUser?.physicalDetails, ...physical };
      if (currentStep === 5) {
        // Upload any new files to R2 via backend
        const filesToUpload = portfolioFiles.filter(f => f.file);
        let finalPortfolio = [...portfolioFiles];
        
        if (filesToUpload.length > 0) {
          const formData = new FormData();
          filesToUpload.forEach(f => {
            formData.append('files', f.file);
          });
          
          try {
            const uploadRes = await axios.post(`http://localhost:5000/api/upload/portfolio`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (uploadRes.data.success) {
              let uploadIndex = 0;
              finalPortfolio = finalPortfolio.map(f => {
                if (f.file) {
                  const uploaded = uploadRes.data.files[uploadIndex++];
                  return { url: uploaded.url, type: uploaded.type };
                }
                return f;
              });
            }
          } catch (uploadErr) {
            console.error('Failed to upload files:', uploadErr);
            throw new Error('Failed to upload files to server.');
          }
        }
        
        setPortfolioFiles(finalPortfolio); // update state so they are not re-uploaded if user comes back
        
        updateData.portfolio = {
          photos: finalPortfolio.filter(f => f.type?.startsWith('image/')).map(f => f.url),
          videos: finalPortfolio.filter(f => f.type?.startsWith('video/')).map(f => f.url)
        };
      }
      if (currentStep === 6) updateData.pricing = { ...creatorUser?.pricing, ...pricing };
      if (currentStep === 7) updateData.availability = { ...creatorUser?.availability, status: availabilityStatus };

      await updateProfile(updateData);
      setCurrentStep((prev) => prev + 1);
    } catch (err) {
      setError('Failed to save progress.');
    }
    setLoading(false);
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      await updateProfile({
        isProfileComplete: true,
        onboardingStep: 8
      });
      navigate('/creator/dashboard');
    } catch (err) {
      setError('Failed to publish profile.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <img src="/Mycastnow logo.png" alt="Logo" className="h-6 sm:h-8" />
        <p className="text-xs sm:text-sm font-semibold text-gray-500 text-right">
          <span className="md:hidden">Step {currentStep}/{steps.length}</span>
          <span className="hidden md:inline">Step {currentStep} of {steps.length}: {steps[currentStep - 1]}</span>
        </p>
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
                <h2 className="text-2xl font-bold text-gray-800 mb-6">What describes you best?</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setProf({ ...prof, primaryCategory: cat })}
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
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-5">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Details</h2>
                
                <div className="flex gap-6 mb-6 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md overflow-hidden shrink-0 flex items-center justify-center relative group">
                    {basic.profilePhoto ? (
                      <img src={basic.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="text-gray-400 w-10 h-10" />
                    )}
                    <label className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                      <span className="text-white text-xs font-bold">Upload</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={async (e) => {
                          if(e.target.files && e.target.files[0]){
                            const file = e.target.files[0];
                            // Show immediate preview
                            setBasic({...basic, profilePhoto: URL.createObjectURL(file)});
                            
                            // Upload in background
                            const formData = new FormData();
                            formData.append('files', file);
                            try {
                              const res = await axios.post('http://localhost:5000/api/upload/portfolio', formData, {
                                headers: { 'Content-Type': 'multipart/form-data' }
                              });
                              if (res.data.success) {
                                setBasic(prev => ({...prev, profilePhoto: res.data.files[0].url}));
                              }
                            } catch (err) {
                              console.error('Failed to upload profile photo', err);
                            }
                          }
                        }} 
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input type="text" value={basic.fullName} onChange={e => setBasic({...basic, fullName: e.target.value})} className="w-full p-3 bg-white border border-gray-200 rounded-xl shadow-sm" placeholder="John Doe" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">City / Location</label>
                    <input type="text" value={basic.city} onChange={e => setBasic({...basic, city: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Mumbai" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                    <select value={basic.gender} onChange={e => setBasic({...basic, gender: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
                    <input type="date" value={basic.dob} onChange={e => setBasic({...basic, dob: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bio / About Me</label>
                  <textarea value={basic.bio} onChange={e => setBasic({...basic, bio: e.target.value})} rows="4" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Tell brands about yourself..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Languages Spoken</label>
                  <input type="text" value={basic.languages} onChange={e => setBasic({...basic, languages: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="English, Hindi, Marathi" />
                  <p className="text-xs text-gray-400 mt-1">Separate multiple languages with commas</p>
                </div>
              </div>
            )}

            {/* Step 3: Professional */}
            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-5">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Professional Experience</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Years of Experience</label>
                    <select value={prof.experience} onChange={e => setProf({...prof, experience: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <option value="">Select</option>
                      <option value="Fresher">Fresher</option>
                      <option value="1-3 Years">1-3 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Skills</label>
                    <input type="text" value={prof.skills} onChange={e => setProf({...prof, skills: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Acting, Dancing, Modeling" />
                    <p className="text-xs text-gray-400 mt-1">Separate multiple skills with commas</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Physical Attributes */}
            {currentStep === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-5">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Physical Attributes</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Height</label>
                    <input type="text" value={physical.height} onChange={e => setPhysical({...physical, height: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="5'10&quot;" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Weight</label>
                    <input type="text" value={physical.weight} onChange={e => setPhysical({...physical, weight: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="70 kg" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Eye Color</label>
                    <input type="text" value={physical.eyeColor} onChange={e => setPhysical({...physical, eyeColor: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Brown" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Hair Color</label>
                    <input type="text" value={physical.hairColor} onChange={e => setPhysical({...physical, hairColor: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Black" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Chest / Bust</label>
                    <input type="text" value={physical.chest} onChange={e => setPhysical({...physical, chest: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="40&quot;" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Waist</label>
                    <input type="text" value={physical.waist} onChange={e => setPhysical({...physical, waist: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="32&quot;" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Hips</label>
                    <input type="text" value={physical.hips} onChange={e => setPhysical({...physical, hips: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="38&quot;" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Portfolio */}
            {currentStep === 5 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Portfolio</h2>
                <p className="text-gray-500 mb-6">Add your best photos and videos to showcase your work.</p>
                
                <label className="border-2 border-dashed border-gray-300 rounded-3xl p-12 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex flex-col items-center justify-center relative">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*,video/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        const newFiles = Array.from(e.target.files).map(file => ({
                          file, // Store actual file for upload
                          url: URL.createObjectURL(file), // Temp URL for preview
                          type: file.type
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
                  <div className="mt-6 grid grid-cols-3 md:grid-cols-4 gap-4">
                    {portfolioFiles.map((fileObj, idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-gray-200 relative group bg-black flex items-center justify-center">
                        {fileObj.type.startsWith('video/') ? (
                          <video src={fileObj.url} className="w-full h-full object-cover" autoPlay muted loop />
                        ) : (
                          <img src={fileObj.url} className="w-full h-full object-cover" alt="portfolio item" />
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
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-5">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Pricing Setup</h2>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Hourly Rate (₹)</label>
                  <input type="number" value={pricing.hourlyRate} onChange={e => setPricing({...pricing, hourlyRate: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="e.g. 500" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Day Rate (₹)</label>
                  <input type="number" value={pricing.dayRate} onChange={e => setPricing({...pricing, dayRate: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="e.g. 4000" />
                </div>
              </div>
            )}

            {/* Step 7: Availability */}
            {currentStep === 7 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Availability</h2>
                <div className="flex gap-4">
                  <button onClick={() => setAvailabilityStatus('Available')} className={`flex-1 py-4 border-2 rounded-2xl font-bold ${availabilityStatus === 'Available' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'}`}>Available Now</button>
                  <button onClick={() => setAvailabilityStatus('Unavailable')} className={`flex-1 py-4 border-2 rounded-2xl font-bold ${availabilityStatus === 'Unavailable' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600'}`}>Unavailable</button>
                </div>
              </div>
            )}

            {/* Step 8: Preview */}
            {currentStep === 8 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">You're all set, {basic.fullName}!</h2>
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
              <button onClick={() => setCurrentStep(prev => prev - 1)} disabled={loading} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2">
                <ChevronLeft size={18} /> Back
              </button>
            ) : <div></div>}
            
            {currentStep < steps.length ? (
              <button 
                onClick={handleNext} 
                disabled={loading || (currentStep === 1 && !prof.primaryCategory)} 
                className="px-8 py-3 rounded-xl font-bold bg-gray-900 text-white hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Next'} <ChevronRight size={18} />
              </button>
            ) : (
              <button 
                onClick={handlePublish} 
                disabled={loading} 
                className="px-8 py-3 rounded-xl font-bold bg-fuchsia-600 text-white hover:bg-fuchsia-700 shadow-lg shadow-fuchsia-500/30 transition-all flex items-center gap-2"
              >
                {loading ? 'Publishing...' : 'Publish Profile'} <CheckCircle2 size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorSignupFlow;
