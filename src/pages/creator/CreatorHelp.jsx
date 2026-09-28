import React from 'react';
import { HelpCircle, Mail, Phone, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';

const CreatorHelp = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#180a22] rounded-3xl p-6 text-white shadow-xl">
        <h1 className="text-2xl font-black">Creator Support & Help Desk</h1>
        <p className="text-xs text-purple-200 mt-1">24/7 dedicated support for audition disputes, contracts, and shoot payments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Mail size={18} />
          </div>
          <h3 className="font-bold text-sm text-gray-900">Email Support</h3>
          <p className="text-xs text-gray-500">support@mycastnow.com</p>
          <span className="text-[10px] text-gray-400 block pt-1">Response within 2 hours</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Phone size={18} />
          </div>
          <h3 className="font-bold text-sm text-gray-900">Talent Helpline</h3>
          <p className="text-xs text-gray-500">+91 98201 45892</p>
          <span className="text-[10px] text-gray-400 block pt-1">Mon-Sat (10am - 8pm)</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <h3 className="font-bold text-sm text-gray-900">Escrow Safety Desk</h3>
          <p className="text-xs text-gray-500">escrow@mycastnow.com</p>
          <span className="text-[10px] text-gray-400 block pt-1">100% Payment Guarantee</span>
        </div>
      </div>
    </div>
  );
};

export default CreatorHelp;
