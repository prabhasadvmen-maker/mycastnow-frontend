import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useCreatorAuth } from '../context/CreatorAuthContext';
import { 
  LayoutDashboard, FolderOpen, Video, Briefcase, Calendar, 
  MessageSquare, Wallet, TrendingUp, CreditCard, 
  Settings, User, HelpCircle, Menu, LogOut, ShieldAlert
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
        
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 shadow-sm">
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
                className="flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-gray-800">{creatorUser.basicDetails?.fullName || creatorUser.phone}</p>
                  <p className="text-xs text-gray-500 capitalize">{creatorUser.professionalDetails?.primaryCategory || 'Creator'}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-fuchsia-600 to-blue-600 rounded-full flex items-center justify-center text-white overflow-hidden font-bold">
                  {creatorUser.basicDetails?.profilePhoto ? (
                    <img src={creatorUser.basicDetails.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    (creatorUser.basicDetails?.fullName?.[0] || 'C').toUpperCase()
                  )}
                </div>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-gray-100 mb-2">
                    <p className="text-sm font-bold text-gray-800">{creatorUser.phone}</p>
                    <p className="text-xs text-gray-500 truncate">Approved Creator</p>
                  </div>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
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
