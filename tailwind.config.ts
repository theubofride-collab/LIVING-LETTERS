import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          violet: '#EA580C',
          'violet-dark': '#9A3412',
          'violet-light': '#F97316',
          or: '#C8A24A',
          'or-light': '#DDB96A',
          'or-dark': '#A8832A',
          cream: '#FFF5EC',
          'cream-dark': '#F0EBE0',
          dark: '#1C1410',
          'dark-soft': '#3D2B1F',
          muted: '#7A6355',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #EA580C 0%, #9A3412 50%, #1C1410 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C8A24A 0%, #DDB96A 50%, #A8832A 100%)',
        'cream-gradient': 'linear-gradient(180deg, #FFF5EC 0%, #F0EBE0 100%)',
      },
      boxShadow: {
        'brand': '0 4px 24px rgba(110, 30, 43, 0.15)',
        'gold': '0 4px 24px rgba(200, 162, 74, 0.25)',
        'card': '0 2px 16px rgba(28, 20, 16, 0.08)',
        'card-hover': '0 8px 32px rgba(28, 20, 16, 0.14)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
