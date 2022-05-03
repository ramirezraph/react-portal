import { useAuth0 } from '@auth0/auth0-react';
import { AppShell } from '@mantine/core';
import { AppHeader } from 'app/components/Header/Loadable';
import { AppNavbar } from 'app/components/Navbar/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useNavigate } from 'react-router-dom';

export function Main() {
  const [opened, setOpened] = React.useState(false);

  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) navigate('/welcome');
    }
  }, [isAuthenticated, isLoading, navigate]);

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
        padding={0}
      >
        <Outlet />
      </AppShell>
    </>
  );
}
