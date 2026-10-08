export const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Universal, secure fetch wrapper that ensures:
 * 1. Correct '/api/...' routing across dev and production
 * 2. Automatic CSRF token generation & injection for mutation requests
 */
export async function apiFetch(endpoint, options = {}) {
  // Normalize endpoint URL
  let url = endpoint;
  if (!url.startsWith('http')) {
    if (!url.startsWith('/api') && !url.startsWith(API_URL)) {
      const cleanPath = url.startsWith('/') ? url : `/${url}`;
      url = `${API_URL}${cleanPath}`;
    }
  }

  const method = (options.method || 'GET').toUpperCase();
  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

  let csrfToken = null;
  if (isMutation) {
    try {
      const csrfRes = await fetch('/api/csrf-token');
      if (csrfRes.ok) {
        const csrfData = await csrfRes.json();
        csrfToken = csrfData.token;
      }
    } catch (e) {
      console.warn('Notice: CSRF token retrieval fallback:', e);
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    ...(options.headers || {})
  };

  return fetch(url, {
    ...options,
    headers
  });
}
