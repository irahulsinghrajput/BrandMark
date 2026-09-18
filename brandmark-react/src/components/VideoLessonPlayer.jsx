import React, { useState, useEffect } from 'react';
import { 
  Play, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Settings, 
  Sparkles,
  Headphones,
  BookOpen,
  Film,
  AlertCircle
} from 'lucide-react';
import { AudioLessonPlayer } from './AudioLessonPlayer';

// Helper to convert arbitrary video URLs (YouTube watch, youtu.be, Loom, Vimeo) to safe embed URLs
function formatEmbedUrl(url, fallbackId) {
  if (!url && !fallbackId) return '';
  const target = (url || '').trim();

  // If already an embed URL
  if (target.includes('/embed/')) {
    return target;
  }

  // Standard YouTube watch URL: https://www.youtube.com/watch?v=XYZ
  const ytWatchMatch = target.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytWatchMatch && ytWatchMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytWatchMatch[1]}?rel=0&enablejsapi=1`;
  }

  // Loom share link: https://www.loom.com/share/XYZ
  const loomMatch = target.match(/loom\.com\/share\/([a-f0-9]+)/i);
  if (loomMatch && loomMatch[1]) {
    return `https://www.loom.com/embed/${loomMatch[1]}`;
  }

  // Vimeo link: https://vimeo.com/XYZ
  const vimeoMatch = target.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // If valid fallback ID provided
  if (fallbackId) {
    return `https://www.youtube-nocookie.com/embed/${fallbackId}?rel=0&enablejsapi=1`;
  }

  return target;
}

export const VideoLessonPlayer = ({ module, courseData }) => {
  const [learningMode, setLearningMode] = useState('video'); // 'video' | 'audio' | 'text'
  const [copied, setCopied] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [activeCustomUrl, setActiveCustomUrl] = useState('');

  const storageKey = module?.id ? `bm_custom_video_${module.id}` : null;

  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setActiveCustomUrl(saved);
        setCustomUrlInput(saved);
      } else {
        setActiveCustomUrl('');
        setCustomUrlInput('');
      }
    }
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  }, [module?.id, storageKey]);

  // Determine active video ID and embed URL
  const baseVideoId = module?.videoId || 'qnBhOVH1QQ8';
  const rawUrl = activeCustomUrl || module?.videoEmbedUrl;
  const embedUrl = formatEmbedUrl(rawUrl, baseVideoId);

  // Direct YouTube watch link
  const directWatchUrl = activeCustomUrl || (module?.videoId 
    ? `https://www.youtube.com/watch?v=${module.videoId}`
    : 'https://www.youtube.com');

  const videoTitle = module?.videoTitle || `${module?.title} — Comprehensive Masterclass Walkthrough`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directWatchUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSaveCustomUrl = (e) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      setActiveCustomUrl(customUrlInput.trim());
      if (storageKey) localStorage.setItem(storageKey, customUrlInput.trim());
    } else {
      setActiveCustomUrl('');
      if (storageKey) localStorage.removeItem(storageKey);
    }
    setShowCustomInput(false);
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleResetToDefault = () => {
    setActiveCustomUrl('');
    setCustomUrlInput('');
    if (storageKey) localStorage.removeItem(storageKey);
    setShowCustomInput(false);
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className={`bg-white rounded-3xl p-5 md:p-7 shadow-sm border border-brand-border-light mb-8 transition-all ${
      theaterMode ? 'ring-2 ring-brand-navy shadow-2xl' : ''
    }`}>
      {/* 3-Way Mode Switcher Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 mb-5 border-b border-brand-border-light">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-wider uppercase text-brand-orange flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Adaptive Learning Suite
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
              Module {module?.id || 1}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-brand-navy mt-1">
            Choose Your Study Format
          </h3>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex items-center gap-1.5 p-1.5 bg-brand-bg-light rounded-2xl border border-brand-border-light w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setLearningMode('video')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              learningMode === 'video' 
                ? 'bg-brand-navy text-white shadow-md' 
                : 'text-brand-text-muted hover:text-brand-navy'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Video Masterclass</span>
          </button>
          <button
            onClick={() => setLearningMode('audio')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              learningMode === 'audio' 
                ? 'bg-brand-orange text-white shadow-md' 
                : 'text-brand-text-muted hover:text-brand-navy'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Audio Podcast</span>
          </button>
          <button
            onClick={() => setLearningMode('text')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              learningMode === 'text' 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'text-brand-text-muted hover:text-brand-navy'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Deep Reading</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Video Player Container */}
      {learningMode === 'video' && (
        <div className="space-y-4">
          {/* Custom Link Configuration Box (Collapsible) */}
          {showCustomInput && (
            <form onSubmit={handleSaveCustomUrl} className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Settings className="w-4 h-4 text-amber-700" />
                  <span>Custom Lesson Video / Screen Recording URL</span>
                </div>
                {activeCustomUrl && (
                  <button 
                    type="button" 
                    onClick={handleResetToDefault}
                    className="text-[11px] font-bold text-amber-800 hover:underline"
                  >
                    Reset to Default Curriculum Video
                  </button>
                )}
              </div>
              <p className="text-[11px] text-amber-800/80 leading-relaxed">
                Paste any YouTube, Loom, or Vimeo URL for this module. The player will automatically convert and stream it.
              </p>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="e.g. https://www.youtube.com/watch?v=... or https://loom.com/share/..."
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                >
                  Save URL
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-amber-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Interactive Player Frame */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800 group">
            {/* Loading Shimmer / Skeleton */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-white z-10 transition-opacity">
                <div className="w-12 h-12 rounded-full border-4 border-brand-orange/30 border-t-brand-orange animate-spin mb-3" />
                <span className="text-xs font-semibold text-slate-300">Loading High-Definition Stream...</span>
                <span className="text-[10px] text-slate-500 mt-1 max-w-xs text-center truncate px-4">{videoTitle}</span>
              </div>
            )}

            {/* Embedded Video Iframe */}
            <iframe
              key={iframeKey}
              src={embedUrl}
              title={videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="eager"
              onLoad={() => setIsLoading(false)}
              className="w-full h-full border-0 absolute inset-0 z-20"
            />
          </div>

          {/* Player Controls, Links & Fallback Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
            {/* Left: Video Metadata & Duration */}
            <div className="flex items-center flex-wrap gap-2 text-brand-text-muted">
              <span className="inline-flex items-center gap-1 font-bold text-brand-navy bg-slate-100 px-2.5 py-1 rounded-lg">
                ⏱️ {module?.duration || '45 Mins'}
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                1080p Ultra HD
              </span>
              {activeCustomUrl && (
                <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-[11px]">
                  Custom Link Active
                </span>
              )}
            </div>

            {/* Right: Escape Hatches, Direct Watch & Tools */}
            <div className="flex items-center flex-wrap gap-1.5">
              {/* Direct Open in YouTube / New Tab */}
              <a
                href={directWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-navy hover:bg-slate-900 text-white font-extrabold rounded-xl transition shadow-sm hover:shadow"
                title="Open video in a new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Watch on YouTube</span>
              </a>

              {/* Copy Direct Link */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-brand-bg-light hover:bg-slate-200 text-brand-navy font-bold rounded-xl border border-brand-border-light transition"
                title="Copy direct video URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              {/* Theater Mode Toggle */}
              <button
                type="button"
                onClick={() => setTheaterMode(!theaterMode)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-brand-bg-light hover:bg-slate-200 text-brand-navy font-bold rounded-xl border border-brand-border-light transition"
                title={theaterMode ? 'Exit Theater Mode' : 'Theater Mode'}
              >
                {theaterMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              {/* Reload Player */}
              <button
                type="button"
                onClick={() => {
                  setIsLoading(true);
                  setIframeKey(prev => prev + 1);
                }}
                className="inline-flex items-center gap-1 px-2 py-1.5 bg-brand-bg-light hover:bg-slate-200 text-brand-text-muted hover:text-brand-navy font-bold rounded-xl border border-brand-border-light transition"
                title="Reload video player"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {/* Change / Custom Link Toggle */}
              <button
                type="button"
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="inline-flex items-center gap-1 px-2 py-1.5 bg-brand-bg-light hover:bg-slate-200 text-brand-text-muted hover:text-brand-navy font-bold rounded-xl border border-brand-border-light transition"
                title="Configure custom video link"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Ad-Blocker & Network Help Tip */}
          <div className="flex items-center justify-between text-[11px] text-brand-text-muted bg-brand-bg-light/80 p-2.5 rounded-xl border border-brand-border-light">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-brand-orange shrink-0" />
              <span>
                If your browser ad-blocker or strict security blocks the embed, click <strong>"Watch on YouTube"</strong> above to view without interruption.
              </span>
            </div>
            <span className="hidden md:inline-block font-semibold text-brand-navy shrink-0">
              💡 Take notes in AI Sandbox Lab
            </span>
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
            <BookOpen className="w-4 h-4 text-brand-orange" />
            <span>Deep Reading & Focus Mode Activated</span>
          </div>
          <p className="text-xs text-brand-text-muted leading-relaxed">
            Distraction-free technical curriculum view. Scroll down to review the technical architecture, prompt cheat sheets, code blocks, and knowledge check quiz for {module?.title}.
          </p>
        </div>
      )}
    </div>
  );
};
