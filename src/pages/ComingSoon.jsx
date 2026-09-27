import React from 'react';
import { Construction } from 'lucide-react';

export default function ComingSoon() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="bg-blue-50 p-6 rounded-full mb-6">
        <Construction size={64} className="text-yellow-500" />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Coming Soon</h2>
      <p className="text-gray-500 max-w-md text-center">
        We're working hard to bring you this feature. Check back later for updates!
      </p>
    </div>
  );
}
