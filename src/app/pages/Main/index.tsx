import { Text, AppShell } from '@mantine/core';
import { AppHeader } from 'app/components/Header/Loadable';
import { AppNavbar } from 'app/components/Navbar/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Switch } from 'react-router-dom';
import { Calendar } from '../Calendar/Loadable';
import { Classes } from '../Classes/Loadable';
import { Dashboard } from '../Dashboard/Loadable';
import { Discussions } from '../Discussions/Loadable';
import { Grades } from '../Grades/Loadable';

export function Main() {
  const [opened, setOpened] = React.useState(false);

  return (
    <>
      <Helmet>
        <title>Main</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <AppShell
        // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
        navbarOffsetBreakpoint="sm"
        // fixed prop on AppShell will be automatically added to Header and Navbar
        fixed
        navbar={<AppNavbar hidden={!opened} />}
        header={<AppHeader opened={opened} burgerOnClick={setOpened} />}
        className="bg-document"
      >
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/discussions" component={Discussions} />
          <Route path="/classes" component={Classes} />
          <Route path="/grades" component={Grades} />
          <Route path="/calendar" component={Calendar} />
        </Switch>
      </AppShell>
    </>
  );
}
