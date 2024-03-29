import { useAuth0 } from '@auth0/auth0-react';
import { AppShell } from '@mantine/core';
import { useUserSlice } from 'store/userSlice';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { classesColRef, db } from 'services/firebase';
import { selectUser } from 'store/userSlice/selectors';
import { Class } from '../Classes/slice/types';
import { useClassesSlice } from '../Classes/slice';
import { AppNavbar } from 'app/components/Navbar';
import { AppHeader } from 'app/components/Header';

export function Main() {
  const [navbarVisible, setNavbarVisible] = React.useState(false);

  const { isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();

  const { actions: userSliceActions } = useUserSlice();
  const { actions: classesSliceActions } = useClassesSlice();

  const userSlice = useSelector(selectUser);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) navigate('/welcome');
    }
  }, [isAuthenticated, isLoading, navigate]);

  React.useEffect(() => {
    if (isAuthenticated) {
      if (user) {
        dispatch(userSliceActions.fetchUserInformation({ user: user }));
      }
    }
  }, [userSliceActions, dispatch, isAuthenticated, user]);

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
          email: user.email ? user.email : '',
          picture: user.picture ? user.picture : '',
        });
      }
    };

    storeUserData().catch(console.error);
  }, [user]);

  React.useEffect(() => {
    if (!userSlice.currentUser?.sub) return;

    const classesQuery = query(
      classesColRef,
      where('usersList', 'array-contains', userSlice.currentUser.sub),
    );

    const unsubscribe = onSnapshot(classesQuery, querySnapshot => {
      console.log('onSnapshot: classes');

      const classesList: Class[] = [];
      querySnapshot.forEach(result => {
        const data = result.data();
        // get owner display name
        const newClass = {
          id: result.id,
          code: data.code,
          name: data.name,
          ownerId: data.ownerId,
          shortDescription: data.shortDescription,
          usersList: data.usersList,
          pendingInvites: data.pendingInvites,
          inviteCode: data.inviteCode,
          color: data.color,
          createdAt: data.createdAt && data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt && data.updatedAt.toDate().toISOString(),
          permissions: data.permissions,
        };

        classesList.push(newClass);
      });
      dispatch(classesSliceActions.fetchClasses({ classes: classesList }));
    });

    return () => {
      console.log('onSnapshot: classes - unsubsribe');

      unsubscribe();
    };
  }, [classesSliceActions, dispatch, userSlice.currentUser]);

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
        navbar={
          <AppNavbar
            navbarVisible={!navbarVisible}
            setNavbarVisible={setNavbarVisible}
          />
        }
        header={
          <AppHeader
            navbarVisible={navbarVisible}
            setNavbarVisible={setNavbarVisible}
          />
        }
        className="bg-document"
        padding={0}
      >
        <Outlet />
      </AppShell>
    </>
  );
}
