module.exports = {
  mode: 'jit',
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        document: '#ececec',
        primary: '#6C63FF',
        secondary: '#FFFFFF',
      },
    },
  },
  plugins: [],
};
