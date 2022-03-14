import { colors, ColorScheme, extendTheme } from '@vechaiui/react';

const light: ColorScheme = {
  id: 'light',
  type: 'light',
  colors: {
    bg: {
      base: '#FFFFFF', // used for background
      fill: '#F2F2F2', // used for navbar, sidebar, header
    },
    text: {
      foreground: colors.gray[700], // text primary
      muted: colors.gray[300], // text secondary
    },
    primary: {
      '50': '#9e95ff',
      '100': '#948bff',
      '200': '#8a81ff',
      '300': '#8077ff',
      '400': '#766dff',
      '500': '#6c63ff',
      '600': '#6259f5',
      '700': '#584feb',
      '800': '#4e45e1',
      '900': '#443bd7',
    },
    neutral: {
      '50': '#ffffff',
      '100': '#ffffff',
      '200': '#ffffff',
      '300': '#ffffff',
      '400': '#fcfcfc',
      '500': '#f2f2f2',
      '600': '#e8e8e8',
      '700': '#dedede',
      '800': '#d4d4d4',
      '900': '#cacaca',
    },
  },
};

export const theme = extendTheme({
  cursor: 'pointer',
  colorSchemes: {
    light,
  },
});
