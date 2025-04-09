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
        'xs': '.75rem',
        'sm': '.8rem',
        'tiny': '.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
        '7xl': '5rem',
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