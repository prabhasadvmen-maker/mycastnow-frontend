import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Clapperboard, Sparkles, ChevronDown, Building2, User,
  LayoutDashboard, LogOut, Settings, FolderOpen, Menu, X,
  ShieldCheck, HelpCircle, ArrowRight, Play, ChevronRight, Briefcase
} from 'lucide-react';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import { useCompanyAuth } from '../../context/CompanyAuthContext';

const PublicNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication Contexts
  const { creatorUser, logout: creatorLogout } = useCreatorAuth();
  const { companyUser, logout: companyLogout } = useCompanyAuth();

  // Navigation & Dropdown States
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [authSelectModal, setAuthSelectModal] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* ────────────────── TOP ANNOUNCEMENT BANNER ────────────────── */}
      <div className="bg-gradient-to-r from-purple-100 via-indigo-50 to-blue-100 border-b border-purple-200/60 px-4 py-2 text-center text-xs font-semibold text-purple-900 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
        <span className="flex h-2 w-2 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
        </span>
        <span className="break-words">Over <strong className="text-purple-950 font-bold">45+ New Casting Calls</strong> live this week!</span>
        <Link to="/castings" className="underline hover:text-purple-700 ml-1 font-bold inline-flex items-center gap-0.5 shrink-0">
          Explore Calls <ArrowRight size={12} />
        </Link>
      </div>

      {/* ────────────────── CRISP LIGHT NAVBAR ────────────────── */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 border-b border-slate-200/80 shadow-xs transition-all">
        <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="h-12 w-auto flex items-center">
              <img 
                src="/Mycastnow logo.png" 
                alt="MyCastNow Logo" 
                className="h-11 w-auto object-contain transition-transform group-hover:scale-105" 
              />
            </div>
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <Link to="/talents" className="hover:text-purple-600 transition-colors">
              Explore Talent
            </Link>
            <Link to="/castings" className="hover:text-purple-600 transition-colors flex items-center gap-1.5">
              Live Castings
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-300">
                LIVE
              </span>
            </Link>
            <Link to="/home#showreel" className="hover:text-purple-600 transition-colors flex items-center gap-1">
              <Play size={12} className="text-purple-600 fill-purple-600" /> Watch Reel
            </Link>
            <Link to="/home#how-it-works" className="hover:text-purple-600 transition-colors">
              How It Works
            </Link>
            <Link to="/plans" className="hover:text-purple-600 transition-colors">
              Plans & Pricing
            </Link>
            <Link to="/guidelines" className="hover:text-purple-600 transition-colors">
              Audition Guidelines
            </Link>
            <Link to="/home#faq" className="hover:text-purple-600 transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {creatorUser ? (
              <div className="flex items-center gap-2 sm:gap-3" ref={dropdownRef}>
                {/* Direct Dashboard Link (Desktop) */}
                <Link
                  to="/creator/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all transform hover:-translate-y-0.5"
                >
                  <LayoutDashboard size={14} />
                  <span>Dashboard</span>
                </Link>

                {/* Creator Profile Chip Menu Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 sm:gap-2.5 p-1 sm:pl-1.5 sm:pr-3 sm:py-1.5 rounded-full bg-slate-50 hover:bg-purple-50/80 border border-slate-200 hover:border-purple-300 transition-all cursor-pointer shadow-xs group"
                    aria-label="Creator Profile Menu"
                  >
                    {/* Avatar with live pulse dot */}
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden shadow-xs ring-2 ring-white">
                        {creatorUser.basicDetails?.profilePhoto ? (
                          <img
                            src={creatorUser.basicDetails.profilePhoto}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (creatorUser.basicDetails?.fullName?.[0] || 'C').toUpperCase()
                        )}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>

                    {/* Name & Category / Status */}
                    <div className="text-left hidden min-[480px]:block max-w-[130px] lg:max-w-[150px]">
                      <p className="text-xs font-bold text-slate-800 truncate group-hover:text-purple-700 leading-tight">
                        {creatorUser.basicDetails?.fullName || creatorUser.phone || 'Creator'}
                      </p>
                      <p className="text-[10px] font-semibold text-purple-600 truncate leading-tight flex items-center gap-1">
                        <span>{creatorUser.professionalDetails?.primaryCategory || 'Creator / Artist'}</span>
                        <span className="w-1 h-1 rounded-full bg-purple-400"></span>
                        <span className="text-emerald-600 font-bold">Online</span>
                      </p>
                    </div>

                    <ChevronDown
                      size={14}
                      className={`text-slate-400 group-hover:text-purple-600 transition-transform duration-200 ${
                        userDropdownOpen ? 'rotate-180 text-purple-600' : ''
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* Identity Header Card */}
                      <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-purple-50/80 to-indigo-50/50 rounded-t-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0 overflow-hidden shadow-sm">
                            {creatorUser.basicDetails?.profilePhoto ? (
                              <img
                                src={creatorUser.basicDetails.profilePhoto}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              (creatorUser.basicDetails?.fullName?.[0] || 'C').toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-900 truncate">
                              {creatorUser.basicDetails?.fullName || 'Verified Artist'}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {creatorUser.email || creatorUser.phone}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="px-2 py-0.5 text-[10px] font-bold text-purple-700 bg-purple-100 rounded-full capitalize">
                                {creatorUser.professionalDetails?.primaryCategory || 'Creator'}
                              </span>
                              <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded-full flex items-center gap-0.5">
                                <ShieldCheck size={10} /> Logged In
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Links */}
                      <div className="py-2 px-1 text-slate-700">
                        <Link
                          to="/creator/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-xs font-semibold hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <LayoutDashboard size={14} />
                          </div>
                          <div className="flex-1">
                            <span className="block font-bold">Creator Dashboard</span>
                            <span className="block text-[10px] text-slate-400 font-normal">Manage bookings & auditions</span>
                          </div>
                        </Link>

                        <Link
                          to="/creator/dashboard/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-xs font-semibold hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-fuchsia-100 text-fuchsia-700 flex items-center justify-center group-hover:bg-fuchsia-600 group-hover:text-white transition-colors">
                            <User size={14} />
                          </div>
                          <div className="flex-1">
                            <span className="block font-bold">View & Edit Profile</span>
                            <span className="block text-[10px] text-slate-400 font-normal">Photos, bio & measurements</span>
                          </div>
                        </Link>

                        <Link
                          to="/creator/dashboard/profile?tab=compcard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-xs font-semibold hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                            <Sparkles size={14} />
                          </div>
                          <div className="flex-1">
                            <span className="block font-bold">Digital Comp Card</span>
                            <span className="block text-[10px] text-slate-400 font-normal">Industry sedcard & stats</span>
                          </div>
                        </Link>

                        <Link
                          to="/creator/dashboard/portfolio"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-xs font-semibold hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <FolderOpen size={14} />
                          </div>
                          <div className="flex-1">
                            <span className="block font-bold">Portfolio & Reels</span>
                            <span className="block text-[10px] text-slate-400 font-normal">Photos, videos & work links</span>
                          </div>
                        </Link>

                        <Link
                          to="/creator/dashboard/settings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-xs font-semibold hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-700 group-hover:text-white transition-colors">
                            <Settings size={14} />
                          </div>
                          <div className="flex-1">
                            <span className="block font-bold">Settings & Password</span>
                            <span className="block text-[10px] text-slate-400 font-normal">Privacy & notifications</span>
                          </div>
                        </Link>

                        <Link
                          to="/creator/dashboard/help"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-xs font-semibold hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <HelpCircle size={14} />
                          </div>
                          <div className="flex-1">
                            <span className="block font-bold">Help & Support</span>
                            <span className="block text-[10px] text-slate-400 font-normal">Tickets & quick answers</span>
                          </div>
                        </Link>
                      </div>

                      {/* Log Out */}
                      <div className="pt-1 border-t border-slate-100 px-1">
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            creatorLogout();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                            <LogOut size={14} />
                          </div>
                          <span>Sign Out from Website</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : companyUser ? (
              <div className="flex items-center gap-2 sm:gap-3" ref={dropdownRef}>
                <Link
                  to="/company/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all transform hover:-translate-y-0.5"
                >
                  <LayoutDashboard size={14} />
                  <span>Dashboard</span>
                </Link>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 sm:gap-2.5 p-1 sm:pl-1.5 sm:pr-3 sm:py-1.5 rounded-full bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-xs group"
                    aria-label="Company Profile Menu"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden shadow-xs ring-2 ring-white">
                        {companyUser.logo ? (
                          <img
                            src={companyUser.logo}
                            alt="Logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (companyUser.name?.[0] || 'C').toUpperCase()
                        )}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 border-2 border-white rounded-full"></span>
                    </div>

                    <div className="text-left hidden min-[480px]:block max-w-[130px] lg:max-w-[150px]">
                      <p className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-700 leading-tight">
                        {companyUser.name || 'Company'}
                      </p>
                      <p className="text-[10px] font-semibold text-blue-600 truncate leading-tight flex items-center gap-1">
                        <span>Production</span>
                        <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                        <span className="text-emerald-600 font-bold">Online</span>
                      </p>
                    </div>

                    <ChevronDown
                      size={14}
                      className={`text-slate-400 group-hover:text-blue-600 transition-transform duration-200 ${
                        userDropdownOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 rounded-t-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0 overflow-hidden shadow-sm">
                            {companyUser.logo ? (
                              <img
                                src={companyUser.logo}
                                alt="Logo"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              (companyUser.name?.[0] || 'C').toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-900 truncate">
                              {companyUser.name || 'Production House'}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{companyUser.email}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold text-blue-700 bg-blue-100 rounded-full">
                              Verified Production
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="py-2 px-1 text-slate-700">
                        <Link
                          to="/company/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-xs font-semibold hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <LayoutDashboard size={14} />
                          </div>
                          <div className="flex-1">
                            <span className="block font-bold">Company Dashboard</span>
                            <span className="block text-[10px] text-slate-400 font-normal">Manage castings & auditions</span>
                          </div>
                        </Link>
                        <Link
                          to="/company/dashboard/castings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-xs font-semibold hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Briefcase size={14} />
                          </div>
                          <div className="flex-1">
                            <span className="block font-bold">Post & Manage Castings</span>
                            <span className="block text-[10px] text-slate-400 font-normal">Active calls & submissions</span>
                          </div>
                        </Link>
                        <Link
                          to="/company/dashboard/settings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-xs font-semibold hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-700 group-hover:text-white transition-colors">
                            <Settings size={14} />
                          </div>
                          <div className="flex-1">
                            <span className="block font-bold">Company Settings</span>
                            <span className="block text-[10px] text-slate-400 font-normal">Password & profile</span>
                          </div>
                        </Link>
                        <Link
                          to="/company/dashboard/help"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-xs font-semibold hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <HelpCircle size={14} />
                          </div>
                          <div className="flex-1">
                            <span className="block font-bold">Help Desk</span>
                            <span className="block text-[10px] text-slate-400 font-normal">Support tickets & inquiry</span>
                          </div>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100 px-1">
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            companyLogout();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                            <LogOut size={14} />
                          </div>
                          <span>Sign Out from Website</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setAuthSelectModal(true)}
                  className="text-xs sm:text-sm font-bold text-slate-700 hover:text-purple-700 px-3.5 sm:px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer border border-slate-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthSelectModal(true)}
                  className="text-xs sm:text-sm font-bold text-white px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md shadow-purple-600/20 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles size={15} />
                  Join MyCastNow
                </button>
              </div>
            )}

            {/* Mobile Nav Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-purple-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            {creatorUser ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 mb-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-xs">
                    {creatorUser.basicDetails?.profilePhoto ? (
                      <img src={creatorUser.basicDetails.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      (creatorUser.basicDetails?.fullName?.[0] || 'C').toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {creatorUser.basicDetails?.fullName || creatorUser.phone}
                    </p>
                    <p className="text-xs text-purple-600 font-semibold truncate flex items-center gap-1">
                      <span>{creatorUser.professionalDetails?.primaryCategory || 'Creator / Artist'}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="text-emerald-600 font-bold">Logged In</span>
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-purple-200/60">
                  <Link
                    to="/creator/dashboard"
                    onClick={() => setMobileNavOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-xs text-center"
                  >
                    <LayoutDashboard size={13} /> Dashboard
                  </Link>
                  <Link
                    to="/creator/dashboard/profile"
                    onClick={() => setMobileNavOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-purple-200 text-purple-700 text-xs font-bold text-center"
                  >
                    <User size={13} /> My Profile
                  </Link>
                </div>
              </div>
            ) : companyUser ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 mb-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-xs">
                    {companyUser.logo ? (
                      <img src={companyUser.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      (companyUser.name?.[0] || 'C').toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">{companyUser.name}</p>
                    <p className="text-xs text-blue-600 font-semibold truncate">Production House • Logged In</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200/60">
                  <Link
                    to="/company/dashboard"
                    onClick={() => setMobileNavOpen(false)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs text-center"
                  >
                    <LayoutDashboard size={13} /> Open Company Dashboard
                  </Link>
                </div>
              </div>
            ) : null}

            <nav className="flex flex-col space-y-1 text-sm font-semibold text-slate-700">
              <Link
                to="/talents"
                onClick={() => setMobileNavOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                Explore Talent
              </Link>
              <Link
                to="/castings"
                onClick={() => setMobileNavOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 flex items-center justify-between transition-colors"
              >
                <span>Live Castings</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-300">
                  LIVE
                </span>
              </Link>
              <Link
                to="/plans"
                onClick={() => setMobileNavOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                Plans & Pricing
              </Link>
              <Link
                to="/guidelines"
                onClick={() => setMobileNavOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                Audition Guidelines
              </Link>
              <Link
                to="/safety"
                onClick={() => setMobileNavOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                Safety & Verification
              </Link>
              <Link
                to="/support"
                onClick={() => setMobileNavOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                Contact Support
              </Link>
            </nav>

            {(creatorUser || companyUser) && (
              <div className="pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setMobileNavOpen(false);
                    if (creatorUser) creatorLogout();
                    if (companyUser) companyLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition-colors"
                >
                  <LogOut size={14} /> Sign Out from Website
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ────────────────── SIGN IN / ROLE SELECT MODAL ────────────────── */}
      {authSelectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-7 text-center shadow-2xl relative my-auto">
            <button
              onClick={() => setAuthSelectModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-600/30">
              <Sparkles size={28} className="text-white" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Welcome to MyCastNow</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">Choose how you want to sign in or get started:</p>

            <div className="space-y-3 text-left">
              {/* Creator Choice */}
              <Link
                to="/creator/login"
                onClick={() => setAuthSelectModal(false)}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 flex items-center gap-4 transition-all group block shadow-xs"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Clapperboard size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-purple-700">Creator / Artist Portal</p>
                  <p className="text-[11px] text-slate-500">For Actors, Models, Dancers, Voice Artists</p>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-purple-600" />
              </Link>

              {/* Company Choice */}
              <Link
                to="/company/login"
                onClick={() => setAuthSelectModal(false)}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 flex items-center gap-4 transition-all group block shadow-xs"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Building2 size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700">Production / Company Portal</p>
                  <p className="text-[11px] text-slate-500">For Casting Directors, Brands & Studios</p>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicNavbar;
