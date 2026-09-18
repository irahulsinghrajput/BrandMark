import React, { useState } from 'react';

export const CommunityBanner = ({ courseTitle }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Floating Dashboard Banner */}
      <div className="bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy border border-brand-orange/30 rounded-2xl p-4 md:p-5 text-white shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl flex-shrink-0">
            💬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase rounded">
                Active Cohort
              </span>
              <h4 className="font-extrabold text-sm text-white">Join the Official VIP Student Community</h4>
            </div>
            <p className="text-xs text-white/70 mt-0.5">
              Network with 1,200+ students, get answers from instructors, and participate in live Friday masterclasses.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>Connect Now</span>
          <span>→</span>
        </button>
      </div>

      {/* Community Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-brand-border-light relative animate-scaleUp">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <span className="px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs font-black uppercase rounded-md">
                VIP Access Pass
              </span>
              <h3 className="text-2xl font-black text-brand-navy mt-1">
                Official Student Hub
              </h3>
              <p className="text-xs text-brand-text-muted mt-1">
                Your direct connection to instructors and fellow students for {courseTitle}.
              </p>
            </div>

            <div className="space-y-4">
              {/* WhatsApp Community */}
              <a
                href="https://chat.whatsapp.com/invite-brandmark-vip"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between hover:bg-emerald-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xl font-black">
                    W
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-emerald-950">WhatsApp VIP Student Cohort</h4>
                    <p className="text-xs text-emerald-800">Direct questions, daily tips, and announcements</p>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-700 group-hover:translate-x-1 transition-transform">
                  Join Group →
                </span>
              </a>

              {/* Discord Server */}
              <a
                href="https://discord.gg/brandmark-academy"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between hover:bg-indigo-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl font-black">
                    D
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-indigo-950">Discord Growth & Tech Hub</h4>
                    <p className="text-xs text-indigo-800">Code reviews, ad funnel audits & hiring channels</p>
                  </div>
                </div>
                <span className="text-xs font-black text-indigo-700 group-hover:translate-x-1 transition-transform">
                  Join Server →
                </span>
              </a>

              {/* Weekly Live Office Hours */}
              <div className="p-4 rounded-2xl bg-brand-bg-light border border-brand-border-light">
                <div className="flex items-center justify-between text-xs font-bold text-brand-navy mb-1">
                  <span>📅 Next Live Office Hours</span>
                  <span className="text-brand-orange">Friday @ 7:00 PM IST</span>
                </div>
                <p className="text-xs text-brand-text-muted">
                  Live interactive Zoom Q&A session with founder and senior architects. Meeting links are posted 1 hour before in WhatsApp and Discord.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-border-light flex justify-center">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-brand-navy hover:bg-brand-orange text-white rounded-xl text-xs font-bold transition-all"
              >
                Back to Learning
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
