import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, LogOut, User, Settings, HelpCircle, Key, ShieldCheck, Globe } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AdminProfileModal from './AdminProfileModal';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const pageTitle = {
    '/admin': 'Overview',
    '/admin/users': 'Users Management',
    '/admin/profiles': 'Creator Profiles',
    '/admin/cms': 'Content Management System',
    '/admin/settings': 'Settings & Security',
    '/admin/help': 'Help Center & Documentation'
  }[location.pathname] || location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  });

  return (
    <>
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-blue-600 transition-colors bg-gray-100 hover:bg-blue-50 p-2 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{pageTitle}</h2>
            <p className="text-sm text-gray-500">{today}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link
            to="/home"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full text-xs font-semibold shadow-xs transition-all"
            title="Open public website in new tab"
          >
            <Globe size={13} /> View Website
          </Link>

          <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-xs font-medium text-blue-700">System Live</span>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-800">{user?.name || user?.email}</p>
                <p className="text-xs text-gray-500">{user?.role || 'Super Admin'}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-fuchsia-600 rounded-full flex items-center justify-center text-white overflow-hidden shadow-sm">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Admin" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                  </span>
                )}
              </div>
            </button>
            
            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setDropdownOpen(false)} 
                />
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 z-50"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-gray-100 mb-1 bg-gray-50/50 rounded-t-xl">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-800 truncate">{user?.name || 'Super Admin'}</p>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                        {user?.role || 'Admin'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                  </div>

                {/* Profile section requested by user */}
                <button 
                  onClick={() => {
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50/70 hover:text-blue-700 transition-colors font-medium text-left"
                >
                  <User size={16} className="text-blue-600" />
                  My Profile & Account
                </button>

                <button 
                  onClick={() => navigate('/admin/settings?tab=security')}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50/70 hover:text-blue-700 transition-colors font-medium text-left"
                >
                  <Key size={16} className="text-amber-500" />
                  Change Password
                </button>

                <button 
                  onClick={() => navigate('/admin/settings')}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50/70 hover:text-blue-700 transition-colors font-medium text-left"
                >
                  <Settings size={16} className="text-purple-600" />
                  System Settings
                </button>

                <button 
                  onClick={() => navigate('/admin/help')}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50/70 hover:text-blue-700 transition-colors font-medium text-left"
                >
                  <HelpCircle size={16} className="text-emerald-600" />
                  Help & Documentation
                </button>

                <div className="border-t border-gray-100 my-1"></div>

                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium text-left"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          )}
          </div>
        </div>
      </header>

      {/* Profile Update Modal */}
      <AdminProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </>
  );
};

export default Header;
