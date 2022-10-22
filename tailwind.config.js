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
      fontFamily: {
        openSans: ["'Open Sans'", "'sans-serif'"],
      },
      screens: {
        sm: '640px',
        // => @media (min-width: 640px) { ... }

        md: '768px',
        // => @media (min-width: 768px) { ... }

        lg: '1024px',
        // => @media (min-width: 1024px) { ... }

        xl: '1280px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      },
    },
  },
  plugins: [],
};
