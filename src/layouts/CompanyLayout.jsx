import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useCompanyAuth } from '../context/CompanyAuthContext';
import { 
  LayoutDashboard, Search, Film, ShoppingCart, 
  FolderOpen, MessageSquare, CreditCard, Briefcase, 
  Building, Settings, HelpCircle, LogOut, Menu, User, UserCircle, Building2
} from 'lucide-react';

const CompanyLayout = () => {
  const { companyUser, loading, logout } = useCompanyAuth();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isAdminImpersonating = localStorage.getItem('isAdminImpersonating') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6f8]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!companyUser) {
    return <Navigate to="/company/login" />;
  }

  // Handle direct login -> Under Review
  if (!isAdminImpersonating) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Under Review</h2>
          <p className="text-gray-500 mb-8">
            Your company account is currently being reviewed by our administration team. You will be notified once it is approved and you can access your dashboard.
          </p>
          <button 
            onClick={logout}
            className="w-full bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:opacity-90 text-white py-3 rounded-xl font-medium transition-opacity shadow-md flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/company/dashboard' },
    { name: 'Find Talent', icon: Search, path: '/company/dashboard/find-talent' },
    { name: 'Casting', icon: Film, path: '/company/dashboard/casting' },
    { name: 'Talent Cart', icon: ShoppingCart, path: '/company/dashboard/talent-cart' },
    { name: 'Hires / Projects', icon: FolderOpen, path: '/company/dashboard/hires' },
    { name: 'Inbox', icon: MessageSquare, path: '/company/dashboard/inbox' },
    { name: 'Wallet / Payments', icon: CreditCard, path: '/company/dashboard/wallet' },
    { name: 'Subscription', icon: Briefcase, path: '/company/dashboard/subscription' },
    { name: 'Company Profile', icon: Building, path: '/company/dashboard/profile' },
  ];

  const bottomItems = [
    { name: 'Settings', icon: Settings, path: '/company/dashboard/settings' },
    { name: 'Help', icon: HelpCircle, path: '/company/dashboard/help' },
  ];

  const pageTitle = navItems.find(i => i.path === location.pathname)?.name || location.pathname.split('/').pop().replace('-', ' ') || 'Overview';
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="flex bg-[#f5f6f8] h-screen overflow-hidden">
      {/* Sidebar (Same styling as Admin Sidebar) */}
      <aside className={`bg-[#0b1120] text-white h-screen flex flex-col fixed left-0 top-0 transition-all duration-300 z-20 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="py-4 border-b border-white/10 flex flex-col items-center justify-center min-h-[5rem] shrink-0 gap-1">
          <img 
            src="/Mycastnow logo.png" 
            alt="Logo" 
            className={`object-contain transition-all duration-300 ${isSidebarCollapsed ? 'w-10 h-10' : 'w-40 h-10'}`} 
          />
          {!isSidebarCollapsed && (
            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mt-1">Company Dashboard</span>
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
                    className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-6'} py-3 text-sm font-medium transition-all ${isActive ? 'bg-gradient-to-r from-blue-600/20 to-fuchsia-600/10 border-r-4 border-fuchsia-500 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                  >
                    <div className="shrink-0"><item.icon size={20} /></div>
                    {!isSidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-white/10 shrink-0 bg-[#0b1120]">
          <ul className="space-y-1">
            {bottomItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name} title={isSidebarCollapsed ? item.name : ''}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 text-sm font-medium rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-blue-600/20 to-fuchsia-600/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
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
      <div className={`flex-1 flex flex-col min-w-0 h-screen transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* Header (Same styling as Admin Header) */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-blue-600 transition-colors bg-gray-100 hover:bg-blue-50 p-2 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-800 capitalize">{pageTitle}</h2>
              <p className="text-sm text-gray-500">{today}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-xs font-medium text-blue-700">Impersonation Mode</span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-gray-800">{companyUser.name}</p>
                  <p className="text-xs text-gray-500">{companyUser.email}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-fuchsia-600 rounded-full flex items-center justify-center text-white overflow-hidden">
                  {companyUser.logo ? (
                    <img src={companyUser.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={20} />
                  )}
                </div>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-gray-100 mb-2">
                    <p className="text-sm font-bold text-gray-800">Company Access</p>
                    <p className="text-xs text-gray-500 truncate">{companyUser.email}</p>
                  </div>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Exit Impersonation
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Route Content */}
        <main className="flex-1 p-8 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CompanyLayout;
