// Small client for the BrandMark Lead Marketplace API (/api/marketplace)
// The backend can live on another domain (Render), so auth uses Bearer tokens, not cookies.
import { API_URL } from '../config';

const BASE = `${API_URL}/marketplace`;

const store = (storage, key) => ({
  get: () => { try { return storage().getItem(key); } catch { return null; } },
  set: (t) => { try { storage().setItem(key, t); } catch { /* ignore */ } },
  clear: () => { try { storage().removeItem(key); } catch { /* ignore */ } }
});
export const businessToken = store(() => localStorage, 'bm_business_token');
export const adminToken = store(() => sessionStorage, 'bm_mp_admin_token');

async function csrf() {
  let res;
  try { res = await fetch(`${API_URL}/csrf-token`); } catch { res = null; }
  if (!res || !res.ok) throw new Error('Could not reach the BrandMark server. Please try again in a minute.');
  return (await res.json()).token;
}

export async function mp(path, { method = 'GET', body, business = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (method !== 'GET') headers['X-CSRF-Token'] = await csrf();
  const token = business ? businessToken.get() : (path.startsWith('/admin') ? adminToken.get() : null);
  if (token) headers.Authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error('Could not reach the BrandMark server. Please check your connection and try again.');
  }
  let data = {};
  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  if (!isJson) {
    // e.g. the website answered instead of the API (VITE_API_URL not set on the host)
    console.error(`[marketplace] ${BASE}${path} returned ${res.status} ${res.headers.get('content-type')} instead of JSON`);
    const err = new Error('BrandMark Connect is temporarily unavailable. Please try again later.');
    err.status = res.status;
    throw err;
  }
  try { data = await res.json(); } catch { /* bad JSON */ }
  if (res.status === 503) {
    const err = new Error('BrandMark Connect is temporarily unavailable. Please try again later.');
    err.status = 503;
    throw err;
  }
  if (!res.ok || data.success === false) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function adminLogin(email, password) {
  const data = await mp('/admin/login', { method: 'POST', body: { email, password } });
  adminToken.set(data.token);
  return data;
}

export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
