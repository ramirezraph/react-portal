module.exports = {
  mode: 'jit',
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        document: '#F2F2F2',
        primary: '#6C63FF',
        secondary: '#FFFFFF',
      },
    },
  },
  plugins: [],
};
