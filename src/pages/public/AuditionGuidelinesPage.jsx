import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, XCircle, Camera, Mic, Sun, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import PublicLayout from '../../components/public/PublicLayout';

const GUIDELINES = [
  {
    title: 'Self-Tape Audition Setup',
    icon: Camera,
    dos: [
      'Record in a quiet, well-lit room with a plain neutral background (gray, beige, white).',
      'Position camera at eye level in horizontal (16:9) frame unless vertical reel is requested.',
      'Slate clearly at the start: Name, Age, Height, Location, and Current Availability.'
    ],
    donts: [
      'Do not use heavy beauty filters or face smoothing effects.',
      'Avoid distracting busy backgrounds or loud background music.',
      'Never send blurry, poorly lit or pixelated low-resolution clips.'
    ]
  },
  {
    title: 'Profile Photos & Comp Cards',
    icon: Sun,
    dos: [
      'Include 1 clean headshot, 1 profile shot, and 1 full-length body shot.',
      'Maintain natural hair, minimal makeup, and form-fitting solid wardrobe.',
      'Update your photos every 6 months or whenever your appearance changes.'
    ],
    donts: [
      'Do not submit group photos, sunglasses, or hat-wearing photos.',
      'Avoid heavy Photoshop edits that alter your real facial structure.',
      'Do not upload low-res selfies taken in bad bathroom lighting.'
    ]
  },
  {
    title: 'Voice Over & Audio Auditions',
    icon: Mic,
    dos: [
      'Record in a soundproofed area away from AC hum, echo, or traffic noise.',
      'Provide 2 distinct tones: Commercial pitch & Dramatic narrative voice.',
      'Submit uncompressed clean MP3 or WAV audio files.'
    ],
    donts: [
      'Do not record voice auditions using cheap phone speaker mics.',
      'Avoid clipping or distorting audio by standing too close to mic.',
      'Never leave long unedited silences or mouth clicks in the sample.'
    ]
  }
];

export default function AuditionGuidelinesPage() {
  return (
    <PublicLayout>
      {/* ────────────────── HERO BANNER ────────────────── */}
      <section className="bg-slate-950 text-white py-16 md:py-24 text-center relative overflow-hidden border-b border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-xs font-bold text-purple-300 mb-6">
            <FileText size={14} className="text-purple-300" />
            <span>INDUSTRY BEST PRACTICES & STANDARDS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
            Official Audition <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-300">Guidelines</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Make every audition count. Follow these standards to get noticed by top casting directors and production houses.
          </p>
        </div>
      </section>

      {/* ────────────────── GUIDELINES CARDS ────────────────── */}
      <section className="py-20 bg-slate-50 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-12">
          {GUIDELINES.map((guide, idx) => {
            const Icon = guide.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Icon size={24} />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900">{guide.title}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* DO's */}
                  <div className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200/80 space-y-3">
                    <h3 className="text-sm font-black text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-600" /> RECOMMENDED (DOs)
                    </h3>
                    <ul className="space-y-2.5">
                      {guide.dos.map((item, i) => (
                        <li key={i} className="text-xs text-emerald-950 font-medium leading-relaxed flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* DONT's */}
                  <div className="bg-rose-50/60 p-6 rounded-2xl border border-rose-200/80 space-y-3">
                    <h3 className="text-sm font-black text-rose-800 flex items-center gap-2">
                      <XCircle size={18} className="text-rose-600" /> AVOID (DONTs)
                    </h3>
                    <ul className="space-y-2.5">
                      {guide.donts.map((item, i) => (
                        <li key={i} className="text-xs text-rose-950 font-medium leading-relaxed flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PublicLayout>
  );
}
