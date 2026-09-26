import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  X, 
  Star, 
  CheckCircle2, 
  Quote, 
  Video, 
  MessageSquare, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { isDirectVideo, formatEmbedUrl } from '../lib/videoUtils';

gsap.registerPlugin(ScrollTrigger);

export const REVIEWS_DATA = [
  {
    id: 'video-1',
    type: 'video',
    name: "Aman Verma",
    handle: "@amanverma_growth",
    role: "Growth Creator & Podcaster",
    initials: "AV",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "youtube",
    tag: "Influencer Feedback",
    duration: "1:42",
    metric: "4.2x ROAS",
    text: '"BrandMark completely revolutionized our creator campaigns. Our conversions spiked by 4.2x within 60 days with their data-driven funnels."',
    rating: 5
  },
  {
    id: 'text-1',
    type: 'text',
    initials: 'RS',
    name: 'Rajesh Sharma',
    role: 'Founder, TechVista Solutions',
    tag: 'B2B Tech Client',
    metric: '+300% Reach',
    text: '"BrandMark completely transformed our online presence. Within 3 months, our social media engagement increased by 300% and we saw a significant boost in sales."',
    rating: 5
  },
  {
    id: 'video-2',
    type: 'video',
    name: "Sneha Rao",
    handle: "@sneha_digital",
    role: "E-Commerce Strategist",
    initials: "SR",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    videoType: "youtube",
    tag: "Creator Review",
    duration: "2:10",
    metric: "₹18L+ Revenue",
    text: '"Hands down the sharpest growth agency in Bihar. Their high-converting ad scripts and landing page architecture doubled our monthly revenue."',
    rating: 5
  },
  {
    id: 'text-2',
    type: 'text',
    initials: 'PK',
    name: 'Priya Kapoor',
    role: 'Owner, Artisan Bakery Patna',
    tag: 'Retail Business',
    metric: '5x Footfall',
    text: '"As a small business owner, I was overwhelmed with marketing. BrandMark took that burden off my shoulders and delivered results beyond my expectations."',
    rating: 5
  },
  {
    id: 'video-3',
    type: 'video',
    name: "Vikramaditya Singh",
    handle: "@vikram_techmedia",
    role: "Tech Influencer & Media Producer",
    initials: "VS",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/watch?v=L_LUpnjgPso",
    videoType: "youtube",
    tag: "Media Reviewer",
    duration: "1:25",
    metric: "+85K Views",
    text: '"Their video production and viral storytelling quality is tier-1. Having an elite team like BrandMark in Patna is a massive competitive advantage for creators."',
    rating: 5
  },
  {
    id: 'text-3',
    type: 'text',
    initials: 'AM',
    name: 'Amit Mehta',
    role: 'Director, Horizon Academy Patna',
    tag: 'Education Sector',
    metric: '+45% Admissions',
    text: '"Our student admissions grew 45% this session thanks to BrandMark’s hyper-targeted Bihar campaigns. Parents constantly mention discovering our campus tours online."',
    rating: 5
  }
];

export const Testimonials = () => {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'video' | 'text'

  const filteredReviews = useMemo(() => {
    if (activeFilter === 'video') {
      return REVIEWS_DATA.filter(r => r.type === 'video');
    }
    if (activeFilter === 'text') {
      return REVIEWS_DATA.filter(r => r.type === 'text');
    }
    return REVIEWS_DATA;
  }, [activeFilter]);

  const openVideo = (video) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  const closeVideo = () => {
    setIsVideoModalOpen(false);
    setTimeout(() => setSelectedVideo(null), 300);
  };

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isVideoModalOpen) {
        closeVideo();
      }
    };

    if (isVideoModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVideoModalOpen]);

  // GSAP scroll trigger for section header
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.testimonial-header', 
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.9, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section ref={containerRef} className="py-28 md:py-36 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F1F5F9] border-t border-brand-border-light relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-orange/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-navy/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-12 testimonial-header">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs md:text-sm font-bold tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Social Proof & Creator Stories
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-navy tracking-tight mb-4">
            Trusted by Creators, Founders & Enterprises
          </h2>
          <p className="text-lg md:text-xl text-brand-text-muted font-light max-w-2xl mx-auto">
            Watch authentic video reviews from leading influencers and read firsthand experiences from businesses that scaled with BrandMark.
          </p>

          {/* Filter Tabs & Navigation Controls */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 max-w-4xl mx-auto">
            <div className="flex items-center p-1.5 bg-slate-200/60 backdrop-blur-sm rounded-2xl border border-slate-300/60 mx-auto sm:mx-0">
              <button
                onClick={() => setActiveFilter('all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeFilter === 'all'
                    ? 'bg-brand-navy text-white shadow-md'
                    : 'text-brand-text-muted hover:text-brand-navy'
                }`}
              >
                <span>All Stories</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  activeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-300 text-slate-700'
                }`}>
                  {REVIEWS_DATA.length}
                </span>
              </button>

              <button
                onClick={() => setActiveFilter('video')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeFilter === 'video'
                    ? 'bg-brand-orange text-white shadow-md'
                    : 'text-brand-text-muted hover:text-brand-navy'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Stories</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  activeFilter === 'video' ? 'bg-white/20 text-white' : 'bg-slate-300 text-slate-700'
                }`}>
                  {REVIEWS_DATA.filter(r => r.type === 'video').length}
                </span>
              </button>

              <button
                onClick={() => setActiveFilter('text')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeFilter === 'text'
                    ? 'bg-brand-navy text-white shadow-md'
                    : 'text-brand-text-muted hover:text-brand-navy'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Client Reviews</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  activeFilter === 'text' ? 'bg-white/20 text-white' : 'bg-slate-300 text-slate-700'
                }`}>
                  {REVIEWS_DATA.filter(r => r.type === 'text').length}
                </span>
              </button>
            </div>

            {/* Carousel Arrow Controls */}
            <div className="hidden sm:flex items-center gap-2 mx-auto sm:mx-0">
              <button
                onClick={() => scroll('left')}
                aria-label="Previous Testimonials"
                className="w-10 h-10 rounded-full border border-slate-300/80 bg-white text-brand-navy hover:bg-brand-navy hover:text-white flex items-center justify-center transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Next Testimonials"
                className="w-10 h-10 rounded-full border border-slate-300/80 bg-white text-brand-navy hover:bg-brand-navy hover:text-white flex items-center justify-center transition-colors shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Testimonials Carousel */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 scroll-smooth no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredReviews.map((review) => {
            const isVideo = review.type === 'video';

            return (
              <motion.div 
                key={review.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="snap-start flex-shrink-0 w-[300px] sm:w-[380px] md:w-[400px] bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-brand-orange/60 transition-all duration-300 overflow-hidden flex flex-col group select-none"
              >
                {/* Video Card Header with Play Trigger */}
                {isVideo ? (
                  <div 
                    className="relative aspect-video w-full cursor-pointer overflow-hidden bg-slate-900 group/thumb"
                    onClick={() => openVideo(review)}
                  >
                    <img 
                      src={review.thumbnail} 
                      alt={review.name} 
                      loading="lazy" 
                      className="w-full h-full object-cover group-hover/thumb:scale-108 transition-transform duration-700 brightness-[0.9]" 
                    />
                    
                    {/* Top gradient with tag */}
                    <div className="absolute top-0 inset-x-0 p-3.5 bg-gradient-to-b from-black/70 via-black/30 to-transparent flex items-center justify-between z-10">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-orange text-white text-[11px] font-bold tracking-wide uppercase shadow">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        {review.tag || 'Video Review'}
                      </span>
                      {review.duration && (
                        <span className="text-[11px] font-semibold text-white/90 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                          {review.duration}
                        </span>
                      )}
                    </div>

                    {/* Centered Pulsing Play Button */}
                    <div className="absolute inset-0 bg-black/25 group-hover/thumb:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute -inset-3 rounded-full bg-brand-orange/40 animate-ping opacity-75" />
                        <div className="relative w-16 h-16 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-full flex items-center justify-center shadow-2xl transform group-hover/thumb:scale-115 transition-transform duration-300">
                          <Play className="w-7 h-7 fill-white ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom gradient hint */}
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white text-xs font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Play className="w-3 h-3 fill-white text-white" /> Click to watch feedback
                      </span>
                      {review.metric && (
                        <span className="text-brand-orange font-bold bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded">
                          {review.metric}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="px-8 pt-7 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-brand-navy text-[11px] font-bold uppercase tracking-wider border border-slate-200">
                      <Quote className="w-3 h-3 text-brand-orange" />
                      {review.tag || 'Verified Client'}
                    </span>
                    {review.metric && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-brand-orange border border-orange-200">
                        {review.metric}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Card Content Body */}
                <div className="p-7 flex flex-col flex-grow">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(review.rating || 5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 text-brand-orange fill-brand-orange" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-brand-text-body font-normal text-base mb-6 leading-relaxed flex-grow italic">
                    {review.text}
                  </p>

                  {/* Author Credentials */}
                  <div className="flex items-center mt-auto border-t border-slate-100 pt-5">
                    {review.avatar ? (
                      <img 
                        src={review.avatar} 
                        alt={review.name}
                        loading="lazy" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-brand-orange/40 mr-4 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-navy to-slate-800 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0 shadow-sm text-sm">
                        {review.initials || review.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-brand-navy text-sm truncate">{review.name}</h4>
                        <CheckCircle2 className="w-4 h-4 text-brand-orange fill-brand-orange/10 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-brand-text-muted truncate">
                        {review.handle ? (
                          <span className="font-medium text-brand-orange">{review.handle}</span>
                        ) : null}
                        {review.handle && review.role ? ' • ' : ''}
                        <span>{review.role}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center testimonial-header">
          <p className="text-brand-text-muted text-xs md:text-sm font-semibold uppercase tracking-widest mb-6">
            Endorsed by high-growth founders and digital innovators across Bihar & Beyond
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-2xl">🏆</span>
              <div className="text-left">
                <div className="text-brand-navy font-bold text-sm leading-tight">98% Satisfaction</div>
                <div className="text-[11px] text-brand-text-muted">Over 40+ Active Accounts</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-2xl">⚡</span>
              <div className="text-left">
                <div className="text-brand-navy font-bold text-sm leading-tight">Fast Execution</div>
                <div className="text-[11px] text-brand-text-muted">Turnaround Under 72 Hours</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-2xl">🤝</span>
              <div className="text-left">
                <div className="text-brand-navy font-bold text-sm leading-tight">Verified Attribution</div>
                <div className="text-[11px] text-brand-text-muted">Real Revenue & ROAS Tracking</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Video Modal Overlay */}
      <AnimatePresence>
        {isVideoModalOpen && selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 sm:p-6 md:p-10 backdrop-blur-md"
            onClick={closeVideo}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-slate-950 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-white/10 text-white z-10">
                <div className="flex items-center gap-3 min-w-0">
                  {selectedVideo.avatar ? (
                    <img 
                      src={selectedVideo.avatar} 
                      alt={selectedVideo.name} 
                      className="w-10 h-10 rounded-full object-cover border border-brand-orange" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm">
                      {selectedVideo.initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white truncate">{selectedVideo.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange fill-brand-orange/20" />
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {selectedVideo.handle || selectedVideo.role}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={closeVideo}
                  aria-label="Close Video Player"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors border border-white/10 ml-4 flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Media Player Container */}
              <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                {isDirectVideo(selectedVideo.videoUrl, selectedVideo.videoType) ? (
                  <video 
                    src={selectedVideo.videoUrl} 
                    className="w-full h-full object-contain"
                    controls 
                    autoPlay 
                    playsInline
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <iframe 
                    src={formatEmbedUrl(selectedVideo.videoUrl)} 
                    title={`${selectedVideo.name} Video Testimonial`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  />
                )}
              </div>

              {/* Modal Bottom Caption */}
              <div className="px-6 py-4 bg-slate-900/90 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
                <p className="italic text-slate-200 font-light">
                  {selectedVideo.text}
                </p>
                {selectedVideo.metric && (
                  <span className="inline-flex items-center self-start sm:self-auto gap-1 text-xs font-bold px-3 py-1 rounded-full bg-brand-orange/20 text-brand-orange border border-brand-orange/30 whitespace-nowrap">
                    ⭐ Result: {selectedVideo.metric}
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
