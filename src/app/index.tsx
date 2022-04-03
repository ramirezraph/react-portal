/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import { GlobalStyle } from 'styles/global-styles';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';
import { Landing } from './pages/Landing/Loadable';
import { Main } from './pages/Main/Loadable';
import { Dashboard } from './pages/Dashboard/Loadable';
import { Discussions } from './pages/Discussions/Loadable';
import { Classes } from './pages/Classes/Loadable';
import { Class } from './pages/Class/Loadable';
import { Grades } from './pages/Grades/Loadable';
import { Calendar } from './pages/Calendar/Loadable';
import {
  DiscussionTab,
  ClassworkTab,
  PeopleTab,
  MeetingsTab,
} from './pages/Class/components/ClassTabs/Loadable';

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

      <Routes>
        <Route path="/welcome" element={<Landing />} />
        <Route path="/" element={<Main />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/discussions" element={<Discussions />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/class/:id" element={<Class />}>
            <Route
              index
              element={<Navigate to="discussions" replace={true} />}
            />
            <Route path="discussions" element={<DiscussionTab />} />
            <Route path="classwork" element={<ClassworkTab />} />
            <Route path="people" element={<PeopleTab />} />
            <Route path="meetings" element={<MeetingsTab />} />
          </Route>
          <Route path="/grades" element={<Grades />} />
          <Route path="/calendar" element={<Calendar />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <GlobalStyle />
    </BrowserRouter>
  );
}
