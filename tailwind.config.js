module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#151414FF',
        'secondary': '#464342FF',
        'gold': '#887557FF',
        'red': '#B03535FF',
        'green': '#558A50FF',
        'blue': '#496392FF',
        'gray': {
          50: '#FDF9F5FF',
          100: '#E0DCDCFF',
          200: '#C4C1BEFF',
          300: '#A8A5A2FF',
          400: '#8C8986FF',
          500: '#706D6AFF',
          600: '#54514EFF',
        },
      },
      fontSize: {
        'xs': '12px',     // .75rem * 16
        'sm': '13px',     // .8rem * 16 (rounded)
        'tiny': '14px',   // .875rem * 16
        'base': '16px',   // 1rem * 16
        'lg': '18px',     // 1.125rem * 16
        'xl': '20px',     // 1.25rem * 16
        '2xl': '24px',    // 1.5rem * 16
      },
      fontWeight: {
        hairline: 100,
        thin: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
    },
  },
  plugins: [],
}; 