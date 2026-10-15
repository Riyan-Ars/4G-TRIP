/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#080B14',
        sidebar: '#0B0F1C',
        surface: {
          DEFAULT: '#101625',
          secondary: '#151D2E',
          elevated: '#1B2438',
          hover: '#192238',
        },
        card: {
          DEFAULT: '#101625',
          secondary: '#151D2E',
          elevated: '#1B2438',
          hover: '#182236',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.05)',
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          light: 'rgba(255, 255, 255, 0.12)',
          accent: 'rgba(119, 152, 255, 0.25)',
        },
        brand: {
          blue: '#7798FF',
          mint: '#78C8B0',
          accent: '#7798FF',
          teal: '#78C8B0',
          violet: '#9AA7FC',
          orange: '#E59866',
          amber: '#E5BE65',
          emerald: '#78C8B0',
          rose: '#F27A7A',
        },
        text: {
          primary: '#F3F5FA',
          secondary: '#9AA5BA',
          muted: '#637089',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-mint': '0 0 20px -4px rgba(120, 200, 176, 0.25)',
        'glow-blue': '0 0 20px -4px rgba(119, 152, 255, 0.25)',
        'glow-violet': '0 0 20px -4px rgba(154, 167, 252, 0.25)',
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.35)',
        'card': '0 4px 20px -2px rgba(2, 6, 20, 0.45)',
        'elevated': '0 12px 32px -4px rgba(2, 6, 20, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(6px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
