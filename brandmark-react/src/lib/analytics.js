// Marketing analytics: Meta Pixel + Google Analytics 4.
// Both stay off until their IDs are set in the environment:
//   VITE_META_PIXEL_ID=123456789012345
//   VITE_GA4_ID=G-XXXXXXXXXX
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;
const GA4_ID = import.meta.env.VITE_GA4_ID;

let initialized = false;

const loadScript = (src) => {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
};

export const initAnalytics = () => {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  if (PIXEL_ID && !window.fbq) {
    const fbq = function (...args) {
      fbq.callMethod ? fbq.callMethod.apply(fbq, args) : fbq.queue.push(args);
    };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;
    loadScript('https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
  }

  if (GA4_ID && !window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`);
    window.gtag('js', new Date());
    // Page views are sent manually on each SPA route change.
    window.gtag('config', GA4_ID, { send_page_view: false });
  }
};

export const trackPageView = (path) => {
  try {
    if (window.fbq) window.fbq('track', 'PageView');
    if (window.gtag && GA4_ID) {
      window.gtag('event', 'page_view', { page_path: path, page_location: window.location.href });
    }
  } catch { /* analytics must never break the page */ }
};

// Standard e-commerce events, mapped to Meta + GA4 names.
const EVENT_MAP = {
  ViewContent: 'view_item',
  InitiateCheckout: 'begin_checkout',
  Purchase: 'purchase',
  Lead: 'generate_lead'
};

export const trackEvent = (name, { value, currency = 'INR', contentName, contentId, transactionId } = {}) => {
  try {
    if (window.fbq) {
      const params = { currency };
      if (value != null) params.value = value;
      if (contentName) params.content_name = contentName;
      if (contentId) { params.content_ids = [contentId]; params.content_type = 'product'; }
      window.fbq('track', name, params, transactionId ? { eventID: transactionId } : undefined);
    }
    if (window.gtag && GA4_ID) {
      const params = { currency };
      if (value != null) params.value = value;
      if (transactionId) params.transaction_id = transactionId;
      if (contentId) params.items = [{ item_id: contentId, item_name: contentName, price: value }];
      window.gtag('event', EVENT_MAP[name] || name, params);
    }
  } catch { /* ignore */ }
};
