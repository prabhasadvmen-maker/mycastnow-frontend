import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCircle, Video, CalendarCheck, 
  CreditCard, MonitorPlay, Wallet, Rocket, Star, 
  BarChart3, Settings, HelpCircle, LogOut, Building2, Globe
} from 'lucide-react';

const Sidebar = ({ isCollapsed }) => {
  const menuItems = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Company', path: '/admin/company', icon: <Building2 size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Creator Profiles', path: '/admin/profiles', icon: <UserCircle size={20} /> },
    { name: 'Casting', path: '/admin/casting', icon: <Video size={20} /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <CalendarCheck size={20} /> },
    { name: 'Payments', path: '/admin/payments', icon: <CreditCard size={20} /> },
    { name: 'Subscriptions', path: '/admin/subscriptions', icon: <MonitorPlay size={20} /> },
    { name: 'Wallet', path: '/admin/wallet', icon: <Wallet size={20} /> },
    { name: 'Boost', path: '/admin/boost', icon: <Rocket size={20} /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <Star size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
    { name: 'CMS', path: '/admin/cms', icon: <LayoutDashboard size={20} /> },
  ];

  const bottomItems = [
    { name: 'Public Website', path: '/home', icon: <Globe size={20} />, external: true },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
    { name: 'Help', path: '/admin/help', icon: <HelpCircle size={20} /> },
  ];

  return (
    <aside className={`bg-[#0b1120] text-white h-screen flex flex-col fixed left-0 top-0 transition-all duration-300 z-20 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`py-4 border-b border-white/10 flex flex-col items-center justify-center min-h-[5rem] shrink-0 gap-1`}>
        <img 
          src="/mycastnow logo.jpeg" 
          alt="Logo" 
          className={`object-contain transition-all duration-300 bg-white rounded-lg p-1 ${isCollapsed ? 'w-10 h-10' : 'h-10 w-auto max-w-[140px]'}`} 
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
                target={item.external ? '_blank' : undefined}
                className={({isActive}) => 
                  `flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 text-sm font-medium rounded-lg transition-all ${isActive && !item.external ? 'bg-gradient-to-r from-blue-600/20 to-fuchsia-600/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
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
