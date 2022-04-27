/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
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
import { LessonModal } from './components/LessonModal/Loadable';
import { ClassworkModal } from './components/ClassworkModal';

export function App() {
  const { i18n } = useTranslation();

  let location = useLocation();

  let state = location.state as { backgroundLocation?: Location };

  return (
    <>
      <Helmet
        titleTemplate="%s - DPVMSHS Portal"
        defaultTitle="DPVMSHS Portal"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="DPVMSHS Portal" />
      </Helmet>

      <Routes location={state?.backgroundLocation || location}>
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

      {state?.backgroundLocation && (
        <Routes>
          <Route path="/classwork/new" element={<ClassworkModal />} />
          <Route path="/classwork/id" element={<ClassworkModal />} />
          <Route path="/lesson/new" element={<LessonModal />} />
          <Route path="/lesson/:id" element={<LessonModal />} />
        </Routes>
      )}

      <GlobalStyle />
    </>
  );
}
