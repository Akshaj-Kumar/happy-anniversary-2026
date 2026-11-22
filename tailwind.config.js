/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030106',
          900: '#07030b',
          850: '#0d0614',
          800: '#14081f',
        },
        rose: {
          gold: '#e0a899',
          blush: '#ffb3c1',
          crimson: '#e60039',
          neon: '#ff2a85',
          glow: '#ff1493',
        },
        gold: {
          shimmer: '#ffd700',
          champagne: '#f7e7ce',
          metallic: '#d4af37',
          amber: '#ffaa00',
        },
        violet: {
          neon: '#bd00ff',
          deep: '#4a0e4e',
          cosmic: '#8a2be2',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        outfit: ['"Outfit"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      boxShadow: {
        'neon-pink': '0 0 25px rgba(255, 42, 133, 0.45), 0 0 50px rgba(255, 42, 133, 0.25)',
        'neon-gold': '0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(212, 175, 55, 0.2)',
        'neon-purple': '0 0 30px rgba(189, 0, 255, 0.45), 0 0 60px rgba(138, 43, 226, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'glass-rose': '0 8px 32px 0 rgba(255, 42, 133, 0.25), inset 0 0 0 1px rgba(255, 179, 193, 0.2)',
      },
      animation: {
        'heartbeat': 'heartbeat 1.4s ease-in-out infinite',
        'heartbeat-fast': 'heartbeatFast 0.8s ease-in-out infinite',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'float-medium': 'floatSlow 4.5s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'fog-drift': 'fogDrift 25s linear infinite',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.2)' },
          '70%': { transform: 'scale(1)' },
        },
        heartbeatFast: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.18)' },
          '50%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.25)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 15px rgba(255, 42, 133, 0.4))' },
          '50%': { opacity: '0.9', filter: 'drop-shadow(0 0 35px rgba(255, 42, 133, 0.8))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fogDrift: {
          '0%': { transform: 'translateX(-5%) translateY(0)' },
          '50%': { transform: 'translateX(5%) translateY(-2%)' },
          '100%': { transform: 'translateX(-5%) translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
