import React, { useState } from 'react';
import { AudioLessonPlayer } from './AudioLessonPlayer';

export const VideoLessonPlayer = ({ module, courseData }) => {
  const [learningMode, setLearningMode] = useState('video'); // 'video' | 'audio' | 'text'

  const videoId = module?.videoEmbedId || 'dQw4w9WgXcQ'; // Fallback or topic video
  const videoTitle = module?.videoTitle || `${module?.title} — Comprehensive Masterclass Walkthrough`;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-brand-border-light mb-8">
      {/* 3-Way Mode Switcher Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 mb-6 border-b border-brand-border-light">
        <div>
          <span className="text-xs font-black tracking-wider uppercase text-brand-orange">
            Adaptive Learning Modes
          </span>
          <h3 className="text-xl md:text-2xl font-black text-brand-navy mt-0.5">
            Choose How You Want to Learn
          </h3>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex items-center gap-1.5 p-1.5 bg-brand-bg-light rounded-2xl border border-brand-border-light">
          <button
            onClick={() => setLearningMode('video')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              learningMode === 'video' 
                ? 'bg-brand-navy text-white shadow-md' 
                : 'text-brand-text-muted hover:text-brand-navy'
            }`}
          >
            <span>🎬</span> Video Masterclass
          </button>
          <button
            onClick={() => setLearningMode('audio')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              learningMode === 'audio' 
                ? 'bg-brand-orange text-white shadow-md' 
                : 'text-brand-text-muted hover:text-brand-navy'
            }`}
          >
            <span>🎙️</span> Audio Podcast
          </button>
          <button
            onClick={() => setLearningMode('text')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              learningMode === 'text' 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'text-brand-text-muted hover:text-brand-navy'
            }`}
          >
            <span>📄</span> Deep Reading
          </button>
        </div>
      </div>

      {/* Mode 1: Video Player Container */}
      {learningMode === 'video' && (
        <div className="space-y-4">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-brand-border-light">
            {module?.videoEmbedUrl ? (
              <iframe
                src={module.videoEmbedUrl}
                title={videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-brand-navy to-slate-950 p-6 text-center text-white relative">
                <div className="w-16 h-16 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center mb-4 text-brand-orange text-2xl shadow-lg">
                  ▶
                </div>
                <h4 className="text-lg md:text-xl font-black max-w-lg mb-2">
                  {videoTitle}
                </h4>
                <p className="text-xs text-white/70 max-w-md mb-4">
                  High-definition walkthrough with hands-on live screen demonstrations for {module?.title}.
                </p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-3 py-1 bg-white/10 rounded-full border border-white/20">Duration: {module?.duration || '45 Mins'}</span>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">1080p Ultra HD</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-brand-text-muted px-1">
            <span>💡 Pro Tip: Take notes and test the code/copy inside the <strong>AI Sandbox Lab</strong> tab.</span>
            <span>HD Walkthrough</span>
          </div>
        </div>
      )}

      {/* Mode 2: Audio Player Container */}
      {learningMode === 'audio' && (
        <AudioLessonPlayer module={module} />
      )}

      {/* Mode 3: Quick Reading Summary */}
      {learningMode === 'text' && (
        <div className="p-6 bg-brand-bg-light rounded-2xl border border-brand-border-light space-y-3">
          <div className="flex items-center gap-2 text-brand-navy font-bold text-sm">
            <span>📄</span>
            <span>Focus Mode Activated</span>
          </div>
          <p className="text-xs text-brand-text-muted leading-relaxed">
            Scroll down to explore the complete technical curriculum guide, prompt cheat sheets, code blocks, and interactive knowledge check quiz below.
          </p>
        </div>
      )}
    </div>
  );
};
