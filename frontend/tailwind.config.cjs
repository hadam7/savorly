/ /** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#46873E', // 46873E
          primary: '#77BA7B', // 77BA7B
          light: '#B7D9A3', // B7D9A3
          shell: '#F6DECC', // F6DECC
          accent: '#E26B6B' // E26B6B
        }
      },
      boxShadow: {
        'soft': '0 18px 45px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        'xl': '1.25rem',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.96)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'fade-up': 'fade-up 500ms ease-out both',
        'scale-in': 'scale-in 450ms ease-out both',
      },
    },
  },
  plugins: [],
};
