/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff4444',
          dark: '#cc0000',
        },
        background: {
          DEFAULT: '#0a0a0a',
          surface: '#1a1a1a',
          hover: '#252525',
        },
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        slideIn: {
          'from': { opacity: '0', transform: 'translateY(-10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
