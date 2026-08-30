/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design tokens — see README "Design system" section
        blush: {
          pale: '#FDF1F0',   // initial almost-white background
          mist: '#F7DDE2',
        },
        rose: {
          liquid: '#E1476A',  // primary liquid pink
          deep: '#B22F4E',    // shadow / depth of the liquid
          highlight: '#FFD9DE', // glossy highlight on droplets
        },
        ink: {
          black: '#0B0708', // warm cinematic black, not pure #000
        },
        warmwhite: '#FBEAE7',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Jost"', 'sans-serif'],
      },
      dropShadow: {
        rose: '0 0 24px rgba(225, 71, 106, 0.45)',
      },
    },
  },
  plugins: [],
};
