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
      animation: {
        'loading-bounce-1': 'bounce 1s ease-in-out',
        'loading-bounce-2': 'bounce 1.25s ease-in-out',
        'loading-bounce-3': 'bounce 1.5s ease-in-out',
        'loading-bounce-4': 'bounce 1.75s ease-in-out',
      },
    },
  },
  plugins: [],
};
