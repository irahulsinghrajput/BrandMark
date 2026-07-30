import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const CourseModule = ({ module, onNext, onPrev, isFirst, isLast }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Stop audio when changing modules or unmounting
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [module.id]);

  const handleListen = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        // Strip markdown and code blocks for cleaner audio reading
        const plainTextContent = module.content.replace(/```[\s\S]*?```/g, "Code example provided in text.").replace(/\*\*/g, "");
        const textToRead = `${module.title}. ${plainTextContent}`;
        
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.95; // Slightly slower for comprehension
        
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        window.speechSynthesis.speak(utterance);
      }
      setIsPlaying(true);
    }
  };

  const handleStopListen = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-8 rounded-3xl border border-brand-border-light shadow-sm relative w-full"
    >
      {/* Playback Controls */}
      <div className="absolute top-8 right-8 flex items-center gap-3 bg-brand-bg-light p-2 rounded-xl border border-brand-border-light shadow-sm z-10">
        {isPlaying && (
          <div className="flex items-end gap-1 h-5 mr-2 pl-2">
            <span className="w-1.5 bg-brand-orange animate-pulse h-full rounded-t-sm"></span>
            <span className="w-1.5 bg-brand-orange animate-pulse h-2/3 rounded-t-sm" style={{ animationDelay: '0.1s' }}></span>
            <span className="w-1.5 bg-brand-orange animate-pulse h-full rounded-t-sm" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-1.5 bg-brand-orange animate-pulse h-1/2 rounded-t-sm" style={{ animationDelay: '0.3s' }}></span>
          </div>
        )}
        <button 
          onClick={handleListen}
          className="w-10 h-10 rounded-lg bg-brand-navy text-white flex items-center justify-center hover:bg-brand-orange transition-colors shadow-sm font-bold"
          title={isPlaying ? "Pause Audio" : "Listen to Module"}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button 
          onClick={handleStopListen}
          disabled={!isPlaying}
          className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors shadow-sm disabled:opacity-50"
          title="Stop Audio"
        >
          ⏹
        </button>
      </div>

      <h1 className="text-3xl font-bold text-brand-navy mb-8 pr-48 leading-tight">{module.title}</h1>
      
      <div className="prose prose-lg text-brand-text-body mb-10 max-w-none">
        {module.content.split('\n').map((paragraph, idx) => {
          if (paragraph.trim().startsWith('\`\`\`')) {
            const isCodeEnd = paragraph.trim() === '\`\`\`';
            if (isCodeEnd) return null; // Simple assumption: opening tags handled below
          }
          
          // Enhanced code block rendering
          if (paragraph.includes('\`\`\`')) {
              const codeBlocks = paragraph.split('\`\`\`');
              return (
                  <div key={idx}>
                      {codeBlocks.map((block, i) => {
                          if (i % 2 === 1) { // It's inside a code block
                              return (
                                  <pre key={i} className="bg-[#0A2038] text-[#E5E7EB] p-5 rounded-xl overflow-x-auto text-sm my-6 font-mono shadow-inner border border-gray-700/50">
                                      <code>{block.replace(/^(javascript|html|css|json)\n?/, '')}</code>
                                  </pre>
                              );
                          }
                          // Handle bolding for non-code text
                          const boldedText = block.split(/(\*\*.*?\*\*)/).map((part, j) => {
                             if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={j} className="text-brand-navy font-bold">{part.slice(2, -2)}</strong>;
                             }
                             return part;
                          });
                          return block.trim() ? <p key={i} className="mb-4 leading-relaxed">{boldedText}</p> : null;
                      })}
                  </div>
              )
          }

          if (paragraph.trim() === '') return null;
          
          // Normal bolding
          const boldedText = paragraph.split(/(\*\*.*?\*\*)/).map((part, i) => {
             if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-brand-navy font-bold">{part.slice(2, -2)}</strong>;
             }
             return part;
          });

          return <p key={idx} className="mb-4 leading-relaxed">{boldedText}</p>;
        })}
      </div>
      
      <div className="flex justify-between items-center pt-8 border-t border-brand-border-light">
        <button 
          disabled={isFirst}
          onClick={onPrev}
          className="px-6 py-3 border border-brand-border-light rounded-xl font-semibold text-brand-navy hover:bg-brand-bg-light disabled:opacity-50 transition-colors"
        >
          &larr; Previous Module
        </button>
        <button 
          disabled={isLast}
          onClick={onNext}
          className="px-6 py-3 bg-brand-orange text-white rounded-xl font-bold hover:bg-brand-orange-dark disabled:opacity-50 shadow-md transition-all hover:shadow-lg"
        >
          Next Module &rarr;
        </button>
      </div>
    </motion.div>
  );
};
