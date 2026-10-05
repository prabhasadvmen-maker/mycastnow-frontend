import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin, Heart } from 'lucide-react';

const PublicFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-12 text-slate-400 text-xs">
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/home" onClick={scrollToTop} className="inline-block h-10">
              <img src="/mycastnow logo.jpeg" alt="MyCastNow" className="h-9 w-auto object-contain" />
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              MyCastNow is India's premier entertainment casting & talent marketplace. Connecting verified actors, models, voiceover artists, dancers, and creators directly with production houses, OTT networks, and ad agencies.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-300">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>System Operational</span>
              </div>
              <Link to="/escrow" onClick={scrollToTop} className="text-[11px] text-purple-400 hover:text-purple-300 underline font-semibold flex items-center gap-1">
                <ShieldCheck size={12} /> 100% Escrow Protected
              </Link>
            </div>
          </div>

          {/* Column 2: For Artists */}
          <div className="space-y-3">
            <p className="font-bold text-white text-sm uppercase tracking-wider">For Artists</p>
            <ul className="space-y-2">
              <li>
                <Link to="/creator/signup" onClick={scrollToTop} className="hover:text-purple-400 transition-colors">
                  Join as Creator
                </Link>
              </li>
              <li>
                <Link to="/creator/login" onClick={scrollToTop} className="hover:text-purple-400 transition-colors">
                  Creator Sign In
                </Link>
              </li>
              <li>
                <Link to="/castings" onClick={scrollToTop} className="hover:text-purple-400 transition-colors font-medium text-slate-300 flex items-center gap-1">
                  Live Casting Calls <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-bold">HOT</span>
                </Link>
              </li>
              <li>
                <Link to="/membership" onClick={scrollToTop} className="hover:text-purple-400 transition-colors">
                  Creator Pro Membership
                </Link>
              </li>
              <li>
                <Link to="/guidelines" onClick={scrollToTop} className="hover:text-purple-400 transition-colors">
                  Audition Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Productions */}
          <div className="space-y-3">
            <p className="font-bold text-white text-sm uppercase tracking-wider">For Productions</p>
            <ul className="space-y-2">
              <li>
                <Link to="/company/signup" onClick={scrollToTop} className="hover:text-purple-400 transition-colors">
                  Register Company
                </Link>
              </li>
              <li>
                <Link to="/company/login" onClick={scrollToTop} className="hover:text-purple-400 transition-colors">
                  Company Sign In
                </Link>
              </li>
              <li>
                <Link to="/talents" onClick={scrollToTop} className="hover:text-purple-400 transition-colors">
                  Search Talent Directory
                </Link>
              </li>
              <li>
                <Link to="/post-casting" onClick={scrollToTop} className="hover:text-purple-400 transition-colors">
                  Post Casting Call
                </Link>
              </li>
              <li>
                <Link to="/plans" onClick={scrollToTop} className="hover:text-purple-400 transition-colors">
                  Agency Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Support */}
          <div className="space-y-3">
            <p className="font-bold text-white text-sm uppercase tracking-wider">Trust & Support</p>
            <ul className="space-y-2">
              <li>
                <Link to="/safety" onClick={scrollToTop} className="hover:text-purple-400 transition-colors">
                  Safety & Verification
                </Link>
              </li>
              <li>
                <Link to="/escrow" onClick={scrollToTop} className="hover:text-purple-400 transition-colors">
                  Escrow Guarantee
                </Link>
              </li>
              <li>
                <Link to="/support" onClick={scrollToTop} className="hover:text-purple-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/fraud-prevention" onClick={scrollToTop} className="hover:text-purple-400 transition-colors text-amber-400 font-medium">
                  Fraud Prevention Advisory
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MyCastNow Technologies India Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/terms" onClick={scrollToTop} className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" onClick={scrollToTop} className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/fraud-prevention" onClick={scrollToTop} className="hover:text-slate-300 transition-colors">
              Fraud Prevention
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
