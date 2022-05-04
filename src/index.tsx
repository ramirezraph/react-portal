/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// Use consistent styling
import 'sanitize.css/sanitize.css';

// Import root app
import { App } from 'app';

import { HelmetProvider } from 'react-helmet-async';

import { configureAppStore } from 'store/configureStore';

import reportWebVitals from 'reportWebVitals';

import './index.css';

// Initialize languages
import './locales/i18n';
import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const store = configureAppStore();
const MOUNT_NODE = document.getElementById('root') as HTMLElement;

const theme: MantineThemeOverride = {
  fontFamily: 'Open Sans, sans-serif',
  colors: {
    'primary-purple': [
      '#E3E2F6',
      '#BFBCF0',
      '#9892F3',
      '#6C63FF',
      '#5C53EC',
      '#5048D7',
      '#4841C2',
      '#4A45A4',
      '#4A468B',
      '#484577',
    ],
  },
  primaryColor: 'primary-purple',
};

ReactDOM.render(
  <Auth0Provider
    domain="dev-1gj8-11r.us.auth0.com"
    clientId="yULiFwDReW2HmJgTZWOVHD4bnBMprBae"
    redirectUri={window.location.origin}
    audience="https://dev-1gj8-11r.us.auth0.com/api/v2"
    scope="read:current_user update:current_user_metadata"
  >
    <Provider store={store}>
      <HelmetProvider>
        <React.StrictMode>
          <MantineProvider theme={theme}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </MantineProvider>
        </React.StrictMode>
      </HelmetProvider>
    </Provider>
  </Auth0Provider>,
  MOUNT_NODE,
);

// Hot reloadable translation json files
if (module.hot) {
  module.hot.accept(['./locales/i18n'], () => {
    // No need to render the App again because i18next works with the hooks
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
