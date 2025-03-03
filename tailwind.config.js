/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'comerian-blue': '#0a2540',
        'comerian-teal': '#00b8d9',
        'comerian-light': '#0f172a',
        'comerian-gray': '#94a3b8',
        'comerian-dark': '#1e293b',
        'comerian-accent': '#00d4ff',
        'card-bg': 'rgba(15, 23, 42, 0.9)',
        'card-border': 'rgba(30, 41, 59, 0.8)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'comerian': '0 4px 15px -1px rgba(0, 184, 217, 0.1), 0 2px 10px -1px rgba(0, 184, 217, 0.06)',
        'card': '0 0 15px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};