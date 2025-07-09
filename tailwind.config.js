/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // /build brand colors - minimalist tan/white theme with orange/pink accents
        tan: {
          50: '#fdfcfa',
          100: '#faf7f2',
          200: '#f5f0e8',
          300: '#ede5d3',
          400: '#e3d5bb',
          500: '#d4bfa0',
          600: '#c4a884',
          700: '#a08961',
          800: '#7d6b4f',
          900: '#5c4f3d',
          950: '#3d342a',
        },
        minimal: {
          gray: '#6b7280',
          orange: '#f97316',
          'orange-light': '#fb923c',
          'orange-dark': '#ea580c',
          green: '#10b981',
          pink: '#ec4899',
          'pink-neon': '#ff006e',
          purple: '#8b5cf6',
        },
        build: {
          bg: '#ffffff',
          surface: '#fdfcfa',
          border: '#e5e7eb',
          text: '#374151',
          muted: '#6b7280',
          accent: '#f97316',
          'accent-light': '#fb923c',
          'accent-dark': '#ea580c',
          pink: '#ec4899',
          'pink-neon': '#ff006e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-pink': 'pulse-pink 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'pulse-pink': {
          '0%': {
            'box-shadow': '0 0 5px #ff006e, 0 0 10px #ff006e',
          },
          '100%': {
            'box-shadow': '0 0 10px #ff006e, 0 0 20px #ff006e, 0 0 30px #ff006e',
          },
        },
      },
    },
  },
  plugins: [],
} 