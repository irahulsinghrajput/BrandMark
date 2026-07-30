/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          navy: '#0B0F19',     // Deep Space Navy
          indigo: '#4F46E5',   // Electric Indigo
          blue: '#3B82F6',     // Electric Tech Blue
          coral: '#F97316',    // Vibrant Coral
          muted: '#9CA3AF',    // Slate Grey
          white: '#F9FAFB',    // Crisp Studio White
        }
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
