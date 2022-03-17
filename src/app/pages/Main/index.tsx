import { Text, AppShell } from '@mantine/core';
import { AppHeader } from 'app/components/Header/Loadable';
import { AppNavbar } from 'app/components/Navbar/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';

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
      >
        <Text>Resize app to see responsive navbar in action</Text>
      </AppShell>
    </>
  );
}
