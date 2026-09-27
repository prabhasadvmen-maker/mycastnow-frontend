import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCircle, Video, CalendarCheck, 
  CreditCard, MonitorPlay, Wallet, Rocket, Star, 
  BarChart3, Settings, HelpCircle, LogOut, Building2 
} from 'lucide-react';

const Sidebar = ({ isCollapsed }) => {
  const menuItems = [
    { name: 'Overview', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Company', path: '/company', icon: <Building2 size={20} /> },
    { name: 'Users', path: '/users', icon: <Users size={20} /> },
    { name: 'Creator Profiles', path: '/profiles', icon: <UserCircle size={20} /> },
    { name: 'Casting', path: '/casting', icon: <Video size={20} /> },
    { name: 'Bookings', path: '/bookings', icon: <CalendarCheck size={20} /> },
    { name: 'Payments', path: '/payments', icon: <CreditCard size={20} /> },
    { name: 'Subscriptions', path: '/subscriptions', icon: <MonitorPlay size={20} /> },
    { name: 'Wallet', path: '/wallet', icon: <Wallet size={20} /> },
    { name: 'Boost', path: '/boost', icon: <Rocket size={20} /> },
    { name: 'Reviews', path: '/reviews', icon: <Star size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
    { name: 'CMS', path: '/cms', icon: <LayoutDashboard size={20} /> },
  ];

  const bottomItems = [
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    { name: 'Help', path: '/help', icon: <HelpCircle size={20} /> },
  ];

  return (
    <aside className={`bg-[#0b1120] text-white h-screen flex flex-col fixed left-0 top-0 transition-all duration-300 z-20 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`py-4 border-b border-white/10 flex flex-col items-center justify-center min-h-[5rem] shrink-0 gap-1`}>
        <img 
          src="/Mycastnow logo.png" 
          alt="Logo" 
          className={`object-contain transition-all duration-300 ${isCollapsed ? 'w-10 h-10' : 'w-40 h-10'}`} 
        />
        {!isCollapsed && (
          <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mt-1">Superadmin Dashboard</span>
        )}
      </div>
      
      {/* Scrollable Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name} title={isCollapsed ? item.name : ''}>
              <NavLink 
                to={item.path} 
                className={({isActive}) => 
                  `flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-6'} py-3 text-sm font-medium transition-all ${isActive ? 'bg-gradient-to-r from-blue-600/20 to-fuchsia-600/10 border-r-4 border-fuchsia-500 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
                }
              >
                <div className="shrink-0">{item.icon}</div>
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Sticky Bottom Section */}
      <div className="p-4 border-t border-white/10 shrink-0 bg-[#0b1120]">
        <ul className="space-y-1">
          {bottomItems.map((item) => (
            <li key={item.name} title={isCollapsed ? item.name : ''}>
              <NavLink 
                to={item.path} 
                className={({isActive}) => 
                  `flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 text-sm font-medium rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-blue-600/20 to-fuchsia-600/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
                }
              >
                <div className="shrink-0">{item.icon}</div>
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
