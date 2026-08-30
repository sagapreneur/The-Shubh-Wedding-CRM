/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tsw: {
          bg: '#FAF8F5',
          ink: '#3A3A3A',
          border: '#EAE5DE',
          surface: '#FFFFFF',
          gold: {
            DEFAULT: '#B8935F',
            light: '#F4EFE6',
            hover: '#A27F4D',
            dark: '#8C6836'
          },
          sage: {
            DEFAULT: '#5C8A6B',
            light: '#EDF4EF',
            dark: '#456950'
          },
          terracotta: {
            DEFAULT: '#C97B4A',
            light: '#FAF0E8',
            dark: '#A65D2E'
          },
          brick: {
            DEFAULT: '#B25454',
            light: '#FBF0F0',
            dark: '#8E3B3B'
          },
          muted: '#8A857D',
          subtle: '#F4F0EA'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"EB Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'tsw-soft': '0 4px 20px -2px rgba(58, 58, 58, 0.05)',
        'tsw-card': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'tsw-modal': '0 20px 40px -15px rgba(58, 58, 58, 0.15)'
      }
    },
  },
  plugins: [],
}
