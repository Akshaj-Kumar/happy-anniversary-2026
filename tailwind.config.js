/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'romantic-red': {
          DEFAULT: '#B5122A',
          deep: '#9B0F23',
          crimson: '#8C1023',
          dark: '#630B19',
          light: '#D32F47',
        },
        'cream': {
          DEFAULT: '#FFF6E9',
          light: '#FFFAF3',
          warm: '#F7EAD7',
          dark: '#EBD8C1',
        },
        'soft-pink': {
          DEFAULT: '#F8D8E0',
          light: '#FDEEF2',
          medium: '#F2BAC9',
        },
        'gold': {
          DEFAULT: '#D8A657',
          light: '#E6BF7A',
          dark: '#B08239',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        poppins: ['"Poppins"', 'sans-serif'],
      },
      boxShadow: {
        'polaroid': '0 10px 25px -5px rgba(140, 16, 35, 0.15), 0 8px 10px -6px rgba(140, 16, 35, 0.1)',
        'polaroid-hover': '0 20px 35px -5px rgba(181, 18, 42, 0.25), 0 10px 15px -5px rgba(181, 18, 42, 0.15)',
        'vintage': '0 4px 20px rgba(140, 16, 35, 0.12)',
        'red-glow': '0 0 25px rgba(181, 18, 42, 0.4)',
        'gold-glow': '0 0 20px rgba(216, 166, 87, 0.4)',
      },
      animation: {
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-heart': 'floatHeart 8s linear infinite',
        'pulse-gentle': 'pulseGentle 2.5s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1.5deg)' },
        },
        floatHeart: {
          '0%': { transform: 'translateY(100vh) scale(0.6)', opacity: '0' },
          '15%': { opacity: '0.8' },
          '85%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-15vh) scale(1.1)', opacity: '0' },
        },
        pulseGentle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
