import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const AudioLessonPlayer = ({ module, courseData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progress, setProgress] = useState(0);
  const [voiceTone, setVoiceTone] = useState('female');
  const utteranceRef = useRef(null);
  const timerRef = useRef(null);

  const textToRead = module?.audioSummary || `Welcome to ${module?.title}. In this masterclass module, you will gain practical, hands-on insights to advance your expertise.`;

  // Stop speech when module changes
  useEffect(() => {
    stopPlayback();
    setProgress(0);
  }, [module?.id]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  const stopPlayback = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const togglePlay = () => {
    if (!('speechSynthesis' in window)) {
      alert("Speech audio is not supported in this browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
        startTimer();
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = playbackRate;
        utterance.pitch = voiceTone === 'female' ? 1.15 : 0.9;
        
        // Pick best English voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith('en') && (voiceTone === 'female' ? v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US') : v.name.includes('Male') || v.name.includes('Daniel')));
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => {
          setIsPlaying(true);
          startTimer();
        };

        utterance.onend = () => {
          setIsPlaying(false);
          setProgress(100);
          if (timerRef.current) clearInterval(timerRef.current);
        };

        utterance.onerror = () => {
          setIsPlaying(false);
          if (timerRef.current) clearInterval(timerRef.current);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const estimatedDurationSec = Math.max(15, Math.ceil(textToRead.split(' ').length / (2.5 * playbackRate)));
    const intervalMs = 250;
    const increment = (intervalMs / 1000 / estimatedDurationSec) * 100;

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timerRef.current);
          return 100;
        }
        return Math.min(100, prev + increment);
      });
    }, intervalMs);
  };

  const changeSpeed = (speed) => {
    setPlaybackRate(speed);
    if (isPlaying) {
      stopPlayback();
      setTimeout(() => togglePlay(), 100);
    }
  };

  return (
    <div className="bg-gradient-to-r from-brand-navy via-[#0c2444] to-[#123158] text-white p-6 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden mb-8">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/15 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        
        {/* Left Info & Title */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center flex-shrink-0 text-2xl">
            🎧
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 bg-brand-orange text-white rounded-md">
                Podcast Mode
              </span>
              <span className="text-xs text-gray-300">Audio Lesson Narration</span>
            </div>
            <h3 className="font-extrabold text-base md:text-lg text-white mt-1 line-clamp-1">
              {module?.title || "Audio Lesson Overview"}
            </h3>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          
          {/* Voice Tone Selector */}
          <div className="flex items-center bg-white/10 rounded-xl p-1 text-xs">
            <button
              onClick={() => { setVoiceTone('female'); if (isPlaying) { stopPlayback(); } }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${voiceTone === 'female' ? 'bg-brand-orange text-white' : 'text-gray-300 hover:text-white'}`}
            >
              👩 Sofia
            </button>
            <button
              onClick={() => { setVoiceTone('male'); if (isPlaying) { stopPlayback(); } }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${voiceTone === 'male' ? 'bg-brand-orange text-white' : 'text-gray-300 hover:text-white'}`}
            >
              👨 David
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center bg-white/10 rounded-xl p-1 text-xs">
            {[1, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => changeSpeed(speed)}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${playbackRate === speed ? 'bg-white text-brand-navy' : 'text-gray-300 hover:text-white'}`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Play / Pause Main Button */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-brand-orange hover:bg-brand-orange-dark text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all flex-shrink-0"
            title={isPlaying ? "Pause Lesson" : "Listen to Lesson"}
          >
            {isPlaying ? (
              <span className="text-lg">⏸</span>
            ) : (
              <span className="text-lg ml-0.5">▶</span>
            )}
          </button>
        </div>
      </div>

      {/* Waveform Animation & Progress Bar */}
      <div className="mt-5 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between gap-4">
          
          {/* Animated equalizer bars when playing */}
          <div className="flex items-end gap-1 h-5 w-20 flex-shrink-0">
            {[40, 80, 50, 100, 60, 90, 70].map((height, i) => (
              <motion.div
                key={i}
                animate={{
                  height: isPlaying ? [`${Math.max(20, height * 0.3)}%`, `${height}%`, '30%'] : '25%'
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6 + (i * 0.1),
                  ease: "easeInOut"
                }}
                className={`w-1 rounded-full ${isPlaying ? 'bg-brand-orange' : 'bg-gray-600'}`}
              />
            ))}
          </div>

          {/* Progress track */}
          <div className="flex-grow bg-white/10 h-2 rounded-full overflow-hidden cursor-pointer">
            <div 
              className="bg-brand-orange h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="text-[11px] font-mono text-gray-300 flex-shrink-0">
            {isPlaying ? "Speaking..." : progress >= 100 ? "Finished" : "Ready to Play"}
          </span>
        </div>
      </div>
    </div>
  );
};
