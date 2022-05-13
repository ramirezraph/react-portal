import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Open Sans', sans-serif;
  }

  #root {
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  input, select {
    font-family: inherit;
    font-size: inherit;
  }

  *::-webkit-scrollbar {
    width: 7px;
  }
  
  *::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
  
  *::-webkit-scrollbar-thumb {
    background-color: darkGray;
  }

  .fslightbox-fade-out-strong {
  animation: none;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.25s, opacity 0.25s ease;
}
`;
