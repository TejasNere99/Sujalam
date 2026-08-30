/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f4',
          100: '#e1ede6',
          200: '#c3dbcd',
          300: '#97c1a9',
          400: '#64a17f',
          500: '#40845f',
          600: '#2d6a4f', // Natural Leaf Green
          700: '#23543f',
          800: '#1c4233',
          900: '#143823', // Deep Forest Green (Primary)
          950: '#0a1d13',
        },
        ivory: {
          50: '#ffffff',
          100: '#fdfdfb',
          200: '#f9f8f3', // Base background
          300: '#f2efe6', // Card borders / subtle surfaces
          400: '#e5e1d5',
          500: '#d1cbbd',
          600: '#a8a191',
          700: '#7e7769',
          800: '#554f44',
          900: '#2c2923',
        },
        gold: {
          50: '#faf8f1',
          100: '#f3eed9',
          200: '#e7dcaf',
          300: '#d9c680',
          400: '#c5a864', // Muted Gold Accent
          500: '#b08f47',
          600: '#927338',
          700: '#75582f',
          800: '#61482b',
          900: '#523e27',
        },
        charcoal: {
          50: '#f6f7f6',
          100: '#e1e4e2',
          200: '#c2c8c4',
          300: '#9da7a0',
          400: '#758279',
          500: '#56625a',
          600: '#434e47',
          700: '#343e38',
          800: '#262d29',
          900: '#1c2520', // Main Dark Text
          950: '#0f1411',
        },
        earth: {
          50: '#faf7f5',
          100: '#f2ede8',
          200: '#e4d8cd',
          300: '#d2beac',
          400: '#bca18a',
          500: '#aa8870',
          600: '#99735d',
          700: '#7f5d4a',
          800: '#684d3e',
          900: '#553f34',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
        serif: ['"Merriweather"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(20, 56, 35, 0.05), 0 1px 2px -1px rgba(20, 56, 35, 0.05)',
        'card': '0 4px 20px -2px rgba(20, 56, 35, 0.05), 0 2px 8px -2px rgba(20, 56, 35, 0.03)',
        'elevated': '0 12px 30px -4px rgba(20, 56, 35, 0.1), 0 8px 12px -4px rgba(20, 56, 35, 0.06)',
        'glow': '0 0 20px rgba(45, 106, 79, 0.4)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}
