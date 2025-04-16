module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#000000',
        'secondary': '#494949FF',
        'gray': {
          50: '#FDF9F5FF',
          100: '#F1F0EFFF',
          200: '#E9E6E3FF',
          300: '#E0DED9FF',
          400: '#D7D4D0FF',
          500: '#CFCBC6FF',
          600: '#C7C4BFFF',
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