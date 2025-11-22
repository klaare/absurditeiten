/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vintage newspaper palette
        paper: {
          DEFAULT: '#f5f5f0',
          aged: '#e8e6dd',
          dark: '#d4d2c8',
        },
        ink: {
          DEFAULT: '#1a1a1a',
          light: '#4a4a4a',
          faded: '#6a6a6a',
        },
        accent: {
          DEFAULT: '#2c2416',
          border: '#8b7355',
          vintage: '#5c4a3a',
        },
      },
      fontFamily: {
        'serif': ['Georgia', 'Times New Roman', 'serif'],
        'headline': ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideDown: {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
