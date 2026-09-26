// Helper to determine if a video source is a direct file (.mp4, .webm, etc.)
export const isDirectVideo = (url, videoType) => {
  if (videoType === 'direct' || videoType === 'mp4') return true;
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)($|\?)/i.test(url);
};

// Helper to convert arbitrary video URLs (YouTube watch, Shorts, youtu.be, Loom, Vimeo) to safe auto-playing embed URLs
export const formatEmbedUrl = (url) => {
  if (!url) return '';
  const target = url.trim();

  // If already an embed URL, ensure autoplay parameter is set
  if (target.includes('/embed/') || target.includes('player.vimeo.com')) {
    return target.includes('autoplay=') ? target : `${target}${target.includes('?') ? '&' : '?'}autoplay=1`;
  }

  // YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID
  const ytShortsMatch = target.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/i);
  if (ytShortsMatch && ytShortsMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytShortsMatch[1]}?autoplay=1&rel=0&modestbranding=1`;
  }

  // Standard YouTube: watch?v=XYZ or youtu.be/XYZ
  const ytWatchMatch = target.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i);
  if (ytWatchMatch && ytWatchMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytWatchMatch[1]}?autoplay=1&rel=0&modestbranding=1`;
  }

  // Vimeo: https://vimeo.com/123456789
  const vimeoMatch = target.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  // Loom: https://www.loom.com/share/XYZ
  const loomMatch = target.match(/loom\.com\/share\/([a-f0-9]+)/i);
  if (loomMatch && loomMatch[1]) {
    return `https://www.loom.com/embed/${loomMatch[1]}?autoplay=1`;
  }

  return target;
};
