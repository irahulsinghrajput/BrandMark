import React, { useState, useEffect } from 'react';

export const GamificationWidget = ({ completedModulesCount, totalModules, courseData }) => {
  const [streak, setStreak] = useState(1);
  const [xp, setXp] = useState(150);
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  useEffect(() => {
    // Calculate streak from localStorage
    const today = new Date().toISOString().slice(0, 10);
    const lastLogin = localStorage.getItem('last_login_date');
    const storedStreak = parseInt(localStorage.getItem('user_streak') || '1', 10);

    if (!lastLogin) {
      localStorage.setItem('last_login_date', today);
      localStorage.setItem('user_streak', '1');
      setStreak(1);
    } else if (lastLogin !== today) {
      const lastDate = new Date(lastLogin);
      const curDate = new Date(today);
      const diffDays = Math.round((curDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        const newStreak = storedStreak + 1;
        localStorage.setItem('user_streak', String(newStreak));
        localStorage.setItem('last_login_date', today);
        setStreak(newStreak);
      } else if (diffDays > 1) {
        localStorage.setItem('user_streak', '1');
        localStorage.setItem('last_login_date', today);
        setStreak(1);
      }
    } else {
      setStreak(storedStreak);
    }

    // Calculate XP
    const storedXp = parseInt(localStorage.getItem(`xp_${courseData}`) || '150', 10);
    const calculatedXp = storedXp + (completedModulesCount * 50);
    setXp(calculatedXp);
  }, [completedModulesCount, courseData]);

  // Determine Level
  const level = xp >= 1000 ? 5 : xp >= 700 ? 4 : xp >= 450 ? 3 : xp >= 250 ? 2 : 1;
  const levelNames = ['Novice', 'Practitioner', 'Specialist', 'Lead Strategist', 'Master Architect'];
  const levelTitle = levelNames[level - 1];

  const badges = [
    {
      id: 'b1',
      title: 'First Milestone',
      desc: 'Completed your first comprehensive module',
      unlocked: completedModulesCount >= 1,
      icon: '🌱'
    },
    {
      id: 'b2',
      title: 'Fast Mover',
      desc: 'Completed 3 or more course modules',
      unlocked: completedModulesCount >= 3,
      icon: '⚡'
    },
    {
      id: 'b3',
      title: 'Domain Specialist',
      desc: 'Completed 8 or more course modules',
      unlocked: completedModulesCount >= 8,
      icon: '🧠'
    },
    {
      id: 'b4',
      title: 'Interview Ready',
      desc: 'Practiced in the AI Mock Interview Simulator',
      unlocked: xp >= 300,
      icon: '🎙️'
    },
    {
      id: 'b5',
      title: 'Master Graduate',
      desc: 'Achieved 100% course completion & certified',
      unlocked: completedModulesCount === totalModules && totalModules > 0,
      icon: '🎓'
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <>
      <div className="bg-white rounded-2xl p-4 border border-brand-border-light shadow-sm flex items-center justify-between gap-3">
        {/* Streak */}
        <div className="flex items-center gap-2">
          <span className="text-xl animate-bounce">🔥</span>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-text-muted block">
              Daily Streak
            </span>
            <span className="text-xs font-black text-brand-navy">
              {streak} Days Active
            </span>
          </div>
        </div>

        {/* Level & XP */}
        <div className="flex items-center gap-2 border-l border-brand-border-light pl-3">
          <span className="text-xl">⭐</span>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-text-muted block">
              Level {level} • {levelTitle}
            </span>
            <span className="text-xs font-black text-brand-orange">
              {xp} XP Earned
            </span>
          </div>
        </div>

        {/* Badges Button */}
        <button
          onClick={() => setShowBadgesModal(true)}
          className="px-3 py-1.5 bg-brand-bg-light hover:bg-brand-orange/10 text-brand-navy hover:text-brand-orange border border-brand-border-light rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <span>🏆</span>
          <span>{unlockedCount}/{badges.length} Badges</span>
        </button>
      </div>

      {/* Badges Modal */}
      {showBadgesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-brand-border-light relative animate-scaleUp">
            <button
              onClick={() => setShowBadgesModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <span className="text-3xl block mb-2">🏆</span>
              <h3 className="text-xl font-black text-brand-navy">
                Achievement Badges
              </h3>
              <p className="text-xs text-brand-text-muted mt-1">
                Unlock honors as you master modules, pass quizzes, and practice interviews.
              </p>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all ${
                    b.unlocked 
                      ? 'bg-amber-50/70 border-amber-200 text-brand-navy' 
                      : 'bg-gray-50 border-gray-200 opacity-50 text-gray-400'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                    b.unlocked ? 'bg-amber-100 text-amber-900' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {b.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-xs">{b.title}</h4>
                      <span className={`text-[10px] font-black uppercase ${b.unlocked ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {b.unlocked ? 'Unlocked ✓' : 'Locked'}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-text-muted mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-brand-border-light flex justify-center">
              <button
                onClick={() => setShowBadgesModal(false)}
                className="px-6 py-2 bg-brand-navy hover:bg-brand-orange text-white rounded-xl text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
