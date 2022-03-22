/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { GlobalStyle } from 'styles/global-styles';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';
import { Landing } from './pages/Landing/Loadable';
import { Main } from './pages/Main/Loadable';

export function App() {
  const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - DPVMSHS Portal"
        defaultTitle="DPVMSHS Portal"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="DPVMSHS Portal" />
      </Helmet>

      <Switch>
        <Route exact path="/welcome" component={Landing} />
        <Route path="/" component={Main} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  );
}
