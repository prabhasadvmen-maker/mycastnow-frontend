import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useCreatorAuth } from '../context/CreatorAuthContext';
import { 
  LayoutDashboard, FolderOpen, Video, Briefcase, Calendar, 
  MessageSquare, Wallet, TrendingUp, CreditCard, 
  Settings, User, HelpCircle, Menu, LogOut, ShieldAlert, KeyRound, Sparkles, ShieldCheck
} from 'lucide-react';

const navItems = [
  { name: 'Overview', icon: LayoutDashboard, path: '/creator/dashboard' },
  { name: 'Portfolio', icon: FolderOpen, path: '/creator/dashboard/portfolio' },
  { name: 'Casting', icon: Video, path: '/creator/dashboard/casting' },
  { name: 'Applications', icon: Briefcase, path: '/creator/dashboard/applications' },
  { name: 'Bookings', icon: Calendar, path: '/creator/dashboard/bookings' },
  { name: 'Inbox', icon: MessageSquare, path: '/creator/dashboard/inbox' },
  { name: 'Wallet', icon: Wallet, path: '/creator/dashboard/wallet' },
  { name: 'Earnings', icon: TrendingUp, path: '/creator/dashboard/earnings' },
  { name: 'Subscription', icon: CreditCard, path: '/creator/dashboard/subscription' },
];

const bottomItems = [
  { name: 'Profile', icon: User, path: '/creator/dashboard/profile' },
  { name: 'Settings', icon: Settings, path: '/creator/dashboard/settings' },
  { name: 'Help', icon: HelpCircle, path: '/creator/dashboard/help' },
];

const CreatorLayout = () => {
  const { creatorUser, loading, logout } = useCreatorAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-fuchsia-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!creatorUser) {
    return <Navigate to="/creator/login" replace />;
  }

  if (!creatorUser.isProfileComplete) {
    return <Navigate to="/creator/onboarding" replace />;
  }

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const getPageTitle = () => {
    const currentItem = [...navItems, ...bottomItems].find(item => item.path === location.pathname);
    return currentItem ? currentItem.name : 'Creator Dashboard';
  };

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // -----------------------------------------------------
  // UNDER REVIEW GATEKEEPER
  // -----------------------------------------------------
  if (!creatorUser.isApproved) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full border border-gray-100">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-12 h-12 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile Under Review</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for completing your profile! Our admin team is currently reviewing your details. 
            Once approved, you will gain full access to your creator dashboard, casting calls, and bookings.
          </p>
          <div className="p-4 bg-gray-50 rounded-xl mb-8">
            <p className="text-sm font-semibold text-gray-700">Current Status</p>
            <p className="text-xs text-gray-500 mt-1">Pending Admin Approval (Usually takes 24-48 hours)</p>
          </div>
          <button 
            onClick={logout}
            className="text-gray-500 hover:text-gray-800 font-medium text-sm transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------
  // MAIN DASHBOARD LAYOUT (If Approved)
  // -----------------------------------------------------
  return (
    <div className="flex bg-[#f5f6f8] h-screen overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`bg-[#170B20] text-white h-screen flex flex-col fixed left-0 top-0 transition-all duration-300 z-50 ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'} ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 md:translate-x-0'}`}>
        <div className="py-4 border-b border-white/10 flex flex-col items-center justify-center min-h-[5rem] shrink-0 gap-1">
          <img 
            src="/Mycastnow logo.png" 
            alt="Logo" 
            className={`object-contain transition-all duration-300 ${isSidebarCollapsed ? 'w-10 h-10' : 'w-40 h-10'}`} 
          />
          {!isSidebarCollapsed && (
            <span className="text-[9px] text-fuchsia-400 uppercase tracking-widest font-bold mt-1">Creator Portal</span>
          )}
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name} title={isSidebarCollapsed ? item.name : ''}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-6'} py-3 text-sm font-medium transition-all ${isActive ? 'bg-gradient-to-r from-fuchsia-600/20 to-blue-600/10 border-r-4 border-fuchsia-500 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                  >
                    <div className="shrink-0"><item.icon size={20} /></div>
                    {!isSidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-white/10 shrink-0 bg-[#170B20]">
          <ul className="space-y-1">
            {bottomItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name} title={isSidebarCollapsed ? item.name : ''}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 text-sm font-medium rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-fuchsia-600/20 to-blue-600/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                  >
                    <div className="shrink-0"><item.icon size={20} /></div>
                    {!isSidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 h-screen transition-all duration-300 ml-0 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-fuchsia-600 transition-colors bg-gray-100 hover:bg-fuchsia-50 p-2 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-xl font-bold text-gray-800 capitalize">{getPageTitle()}</h2>
              <p className="text-sm text-gray-500">{today}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-3.5 py-1.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-gray-800 leading-tight">{creatorUser.basicDetails?.fullName || creatorUser.phone}</p>
                  <p className="text-xs text-fuchsia-600 font-semibold capitalize">{creatorUser.professionalDetails?.primaryCategory || 'Creator'}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white overflow-hidden font-bold shadow-sm shrink-0">
                  {creatorUser.basicDetails?.profilePhoto ? (
                    <img src={creatorUser.basicDetails.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    (creatorUser.basicDetails?.fullName?.[0] || 'C').toUpperCase()
                  )}
                </div>
              </button>
              
              {dropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {/* Creator Identity Header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-fuchsia-50/50 to-purple-50/40 rounded-t-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-fuchsia-600 to-blue-600 flex items-center justify-center text-white font-bold shrink-0 overflow-hidden shadow-sm">
                          {creatorUser.basicDetails?.profilePhoto ? (
                            <img src={creatorUser.basicDetails.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            (creatorUser.basicDetails?.fullName?.[0] || 'C').toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {creatorUser.basicDetails?.fullName || 'Verified Artist'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{creatorUser.email || creatorUser.phone}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="px-2 py-0.5 text-[10px] font-bold text-fuchsia-700 bg-fuchsia-100/80 rounded-full capitalize">
                              {creatorUser.professionalDetails?.primaryCategory || 'Talent'}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 rounded-full flex items-center gap-0.5">
                              <ShieldCheck size={10} /> Verified
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu links */}
                    <div className="py-2 px-1">
                      <Link
                        to="/creator/dashboard/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50/70 rounded-xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center group-hover:bg-fuchsia-600 group-hover:text-white transition-colors shrink-0">
                          <User size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block font-semibold text-xs text-gray-900 group-hover:text-fuchsia-600">My Profile</span>
                          <span className="block text-[11px] text-gray-400 font-normal">View & edit public talent card</span>
                        </div>
                      </Link>

                      <Link
                        to="/creator/dashboard/profile?tab=compcard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-purple-600 hover:bg-purple-50/70 rounded-xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                          <Sparkles size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block font-semibold text-xs text-gray-900 group-hover:text-purple-600">Digital Comp Card</span>
                          <span className="block text-[11px] text-gray-400 font-normal">Industry sedcard & stats card</span>
                        </div>
                      </Link>

                      <Link
                        to="/creator/dashboard/portfolio"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50/70 rounded-xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                          <FolderOpen size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block font-semibold text-xs text-gray-900 group-hover:text-blue-600">Portfolio & Media</span>
                          <span className="block text-[11px] text-gray-400 font-normal">Photos, reels & work campaigns</span>
                        </div>
                      </Link>

                      <Link
                        to="/creator/dashboard/settings?tab=security"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/70 rounded-xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                          <KeyRound size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block font-semibold text-xs text-gray-900 group-hover:text-indigo-600">Change Password</span>
                          <span className="block text-[11px] text-gray-400 font-normal">Account password & security</span>
                        </div>
                      </Link>

                      <Link
                        to="/creator/dashboard/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100/70 rounded-xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-gray-800 group-hover:text-white transition-colors shrink-0">
                          <Settings size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block font-semibold text-xs text-gray-900">Settings & Privacy</span>
                          <span className="block text-[11px] text-gray-400 font-normal">Notifications & casting privacy</span>
                        </div>
                      </Link>

                      <Link
                        to="/creator/dashboard/help"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-amber-600 hover:bg-amber-50/70 rounded-xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors shrink-0">
                          <HelpCircle size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block font-semibold text-xs text-gray-900 group-hover:text-amber-600">Help & Support</span>
                          <span className="block text-[11px] text-gray-400 font-normal">Tickets, hotline & FAQs</span>
                        </div>
                      </Link>
                    </div>

                    {/* Log out */}
                    <div className="pt-1 border-t border-gray-100 px-1">
                      <button 
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50/80 rounded-xl transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors shrink-0">
                          <LogOut size={16} />
                        </div>
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Route Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CreatorLayout;
