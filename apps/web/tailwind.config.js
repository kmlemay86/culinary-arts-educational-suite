/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef9ee',
          100: '#fef0d0',
          200: '#fddea0',
          300: '#fbc660',
          400: '#f9a829',
          500: '#f78f09',
          600: '#e07004',
          700: '#b95307',
          800: '#94410d',
          900: '#7a360e',
        },
        culinary: {
          green: '#2d6a4f',
          brown: '#7c4f1e',
          cream: '#fef6e4',
        }
      }
    },
  },
  plugins: [],
}
