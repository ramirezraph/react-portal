module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@vechaiui/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      // colors: {
      //   document: '#F2F2F2',
      //   primary: '#6C63FF',
      //   secondary: '#FFFFFF',
      // },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@vechaiui/core')],
};
