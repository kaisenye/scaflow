module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gray': {
          50: '#fdfcf5',
          100: '#F5F5F5FF',
          200: '#F0F0F0FF',
          300: '#E0E0E0FF',
          400: '#D9D8D2FF',
          500: '#D9D8D2FF',
          600: '#D9D8D2FF',
          700: '#D9D8D2FF',
          800: '#D9D8D2FF',
          900: '#D9D8D2FF',
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
        '3xl': '30px',    // 1.875rem * 16
        '4xl': '36px',    // 2.25rem * 16
        '5xl': '48px',    // 3rem * 16
        '6xl': '64px',    // 4rem * 16
        '7xl': '80px',    // 5rem * 16
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