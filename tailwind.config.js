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
        background: '#050505',
        sidebar: '#111111',
        card: {
          DEFAULT: '#181818',
          secondary: '#202020',
          hover: '#252525',
          border: '#303030',
        },
        border: {
          subtle: '#242424',
          DEFAULT: '#303030',
          light: '#3f3f46',
        },
        brand: {
          blue: '#60A5FA',
          mint: '#6EE7B7',
          violet: '#C084FC',
          orange: '#FB923C',
          amber: '#FBBF24',
          emerald: '#34D399',
          rose: '#F87171'
        },
        text: {
          primary: '#F5F5F5',
          secondary: '#A3A3A3',
          muted: '#737373',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-mint': '0 0 25px -5px rgba(110, 231, 183, 0.25)',
        'glow-blue': '0 0 25px -5px rgba(96, 165, 250, 0.25)',
        'glow-violet': '0 0 25px -5px rgba(192, 132, 252, 0.25)',
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
