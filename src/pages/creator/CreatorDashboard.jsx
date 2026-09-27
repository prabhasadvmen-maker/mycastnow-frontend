import React from 'react';
import { useCreatorAuth } from '../../context/CreatorAuthContext';

const CreatorDashboard = () => {
  const { creatorUser } = useCreatorAuth();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-fuchsia-900 to-blue-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {creatorUser.basicDetails?.fullName?.split(' ')[0] || 'Creator'}! ✨</h1>
          <p className="text-fuchsia-100 text-sm md:text-base">Here's what's happening with your profile today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium mb-1">Total Bookings</p>
          <h3 className="text-3xl font-bold text-gray-800">{creatorUser.stats?.totalBookings || 0}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium mb-1">Profile Views</p>
          <h3 className="text-3xl font-bold text-gray-800">0</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium mb-1">Current Rating</p>
          <h3 className="text-3xl font-bold text-gray-800">{creatorUser.stats?.rating || 'New'}</h3>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
