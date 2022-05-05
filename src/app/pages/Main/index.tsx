import { useAuth0 } from '@auth0/auth0-react';
import { AppShell } from '@mantine/core';
import { AppHeader } from 'app/components/Header/Loadable';
import { AppNavbar } from 'app/components/Navbar/Loadable';
import { useUserSlice } from 'store/userSlice';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from 'services/firebase';

export function Main() {
  const [opened, setOpened] = React.useState(false);

  const { isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) navigate('/welcome');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const { actions } = useUserSlice();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (isAuthenticated) {
      if (user) {
        dispatch(actions.fetchUserInformation({ user: user }));
      }
    }
  }, [actions, dispatch, isAuthenticated, user]);

  React.useEffect(() => {
    const storeUserData = async () => {
      if (!user) return;

      if (user.sub) {
        const docRef = doc(db, 'users', user.sub);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) return;

        console.log(user);
        await setDoc(doc(db, 'users', user.sub), {
          firstName: user.given_name ? user.given_name : '',
          lastName: user.family_name ? user.family_name : '',
          name: user.name ? user.name : '',
        });
      }
    };

    storeUserData().catch(console.error);
  }, [user]);

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
