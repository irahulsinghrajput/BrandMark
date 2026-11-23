import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Allow the browser to call the configured backend (VITE_API_URL) under the page's
// Content-Security-Policy: its origin is added to connect-src in index.html at dev/build time.
const apiOriginInCsp = (apiUrl) => ({
  name: 'api-origin-in-csp',
  transformIndexHtml(html) {
    let origin = '';
    try { origin = apiUrl ? new URL(apiUrl).origin : ''; } catch { origin = ''; }
    return origin ? html.replace("connect-src 'self'", `connect-src 'self' ${origin}`) : html;
  }
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env };
  return {
    plugins: [react(), apiOriginInCsp(env.VITE_API_URL)],
    server: {
      port: 3000,
      strictPort: true, // Fail if port is already in use instead of trying the next available port
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false
        }
      }
    },
    clearScreen: false, // Prevent Vite from clearing the terminal screen so you can read error logs
  }
})
