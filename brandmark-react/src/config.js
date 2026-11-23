// VITE_API_URL = backend server address WITHOUT /api, e.g. https://brandmark-backend.onrender.com
// (empty = same origin, used by the local Vite proxy). A trailing /api is tolerated.
export const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '').replace(/\/api$/, '');
export const API_URL = `${API_ORIGIN}/api`;

/**
 * Universal, secure fetch wrapper that ensures:
 * 1. Correct '/api/...' routing across dev and production
 * 2. Automatic CSRF token generation & injection for mutation requests
 */
export async function apiFetch(endpoint, options = {}) {
  // Normalize endpoint URL
  let url = endpoint;
  if (!url.startsWith('http')) {
    if (url.startsWith('/api')) {
      url = `${API_ORIGIN}${url}`;
    } else {
      const cleanPath = url.startsWith('/') ? url : `/${url}`;
      url = `${API_URL}${cleanPath}`;
    }
  }

  const method = (options.method || 'GET').toUpperCase();
  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

  let csrfToken = null;
  if (isMutation) {
    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`);
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
