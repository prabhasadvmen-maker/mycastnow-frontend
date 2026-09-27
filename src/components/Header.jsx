import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, LogOut, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  
  const pageTitle = {
    '/': 'Overview',
    '/users': 'Users Management',
    '/profiles': 'Creator Profiles',
    '/cms': 'Content Management System',
  }[location.pathname] || location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  });

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
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
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-xs font-medium text-blue-700">System Live</span>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-gray-800">{user?.email}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-fuchsia-600 rounded-full flex items-center justify-center text-white">
              <User size={20} />
            </div>
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-gray-100 mb-2">
                <p className="text-sm font-bold text-gray-800">{user?.role}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <button 
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
