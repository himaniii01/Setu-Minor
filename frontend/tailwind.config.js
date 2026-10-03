/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        setu: {
          navy: '#08234D',
          navyHover: '#0F346C',
          gold: '#D97706',
          goldHover: '#B45309',
          goldLight: '#FEF3C7',
          pageBg: '#F3F6FA',
          cardBorder: '#E2E8F0',
          textHead: '#0F172A',
          textBody: '#334155',
          textMuted: '#64748B',
          emerald: '#059669',
          emeraldLight: '#D1FAE5',
          infoBlue: '#1D6FD8',
          infoLight: '#E0F2FE',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '"Noto Sans"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(8,35,77,0.06), 0 1px 3px rgba(8,35,77,0.04)',
        modal: '0 25px 50px -12px rgba(8,35,77,0.3)',
        lift: '0 12px 28px -6px rgba(8,35,77,0.12)',
        gold: '0 4px 14px rgba(217,119,6,0.25)'
      }
    },
  },
  plugins: [],
}
