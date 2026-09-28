import React, { useState } from 'react';
import { Settings, Bell, Lock, Shield, Eye, CheckCircle2 } from 'lucide-react';

const CreatorSettings = () => {
  const [notifications, setNotifications] = useState({
    castingAlerts: true,
    chatMessages: true,
    payoutUpdates: true,
    marketingEmails: false
  });
  const [toast, setToast] = useState(null);

  const handleSave = () => {
    setToast('Settings preferences saved successfully!');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xl animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#180a22] rounded-3xl p-6 text-white shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Account & Privacy Settings</h1>
          <p className="text-xs text-purple-200 mt-1">Manage notifications, casting privacy, and security preferences.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Bell size={16} className="text-purple-600" /> Notifications & Alerts
          </h3>

          <div className="space-y-3">
            {[
              { key: 'castingAlerts', label: 'Instant SMS & WhatsApp on New Matching Castings', desc: 'Receive instant alerts when a director posts an audition matching your category' },
              { key: 'chatMessages', label: 'Direct Message Notifications from Studios', desc: 'Get notified as soon as a casting team messages you' },
              { key: 'payoutUpdates', label: 'Escrow & Wallet Payout Status Updates', desc: 'Receive real-time alerts when booking fees are deposited' }
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3.5 bg-gray-50/60 rounded-2xl border border-gray-100">
                <div>
                  <h4 className="font-bold text-xs text-gray-800">{item.label}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorSettings;
