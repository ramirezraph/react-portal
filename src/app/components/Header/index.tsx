import * as React from 'react';
import {
  ActionIcon,
  Avatar,
  Burger,
  Group,
  MediaQuery,
  Header,
  Text,
  useMantineTheme,
  Menu,
  Divider,
} from '@mantine/core';
import { Home, Calendar, User, Settings, Logout } from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { selectUser } from 'store/userSlice/selectors';
import { useSelector } from 'react-redux';

import { PopoverNotification } from './components/PopoverNotifcation/loadable';
import { AppNotification } from 'store/userSlice/types';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from 'services/firebase';

interface Props {
  opened: boolean;
  burgerOnClick: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AppHeader(props: Props) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { opened, burgerOnClick } = props;
  const { logout } = useAuth0();

  const { currentUser } = useSelector(selectUser);
  const [userImageUrl, setUserImageUrl] = React.useState(currentUser?.picture);

  const [notifications, setNotifications] = React.useState<AppNotification[]>(
    [],
  );

  React.useEffect(() => {
    if (!currentUser) return;
    setUserImageUrl(currentUser.picture);
  }, [currentUser, currentUser?.picture]);

  React.useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, `users/${currentUser.sub}/notifications`),
      orderBy('createdAt', 'desc'),
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const list: AppNotification[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const notification: AppNotification = {
          id: doc.id,
          fromUserId: data.fromUserId,
          read: data.read,
          type: data.type,
          createdAt: data.createdAt.toDate().toISOString(),

          classId: data?.classId,
          classworkId: data?.classworkId,
          postId: data?.postId,
          result: data?.result,
        };
        list.push(notification);
      });
      setNotifications(list);
    });
    return () => {
      console.log('onSnapshot: notifications - unsubscribe');
      unsubscribe();
    };
  }, [currentUser]);

  return (
    <Header height={50} className="bg-zinc-800 text-white sm:px-6" p="md">
      {/* Handle other responsive styles with MediaQuery component or createStyles function */}
      <div className="flex h-full items-center">
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => burgerOnClick(o => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <Group className="w-full justify-end md:justify-between">
          <Text className="hidden md:inline" weight="bold">
            Student Portal
          </Text>
          <Group spacing={'xl'}>
            <ActionIcon
              className="text-white hover:bg-transparent hover:text-secondary"
              onClick={() => {
                navigate('/');
              }}
            >
              <Home size={24} />
            </ActionIcon>
            <ActionIcon
              className="text-white hover:bg-transparent hover:text-secondary"
              onClick={() => {
                navigate('/calendar');
              }}
            >
              <Calendar size={24} />
            </ActionIcon>

            <ActionIcon className="text-white hover:bg-transparent hover:text-secondary">
              <PopoverNotification notifications={notifications} />
            </ActionIcon>

            <Menu
              control={
                <Avatar
                  size={'sm'}
                  src={userImageUrl}
                  radius="xl"
                  className="cursor-pointer"
                />
              }
            >
              <Menu.Item icon={<User size={17} />}>My account</Menu.Item>
              <Divider />
              <Menu.Item icon={<Settings size={17} />}>Settings</Menu.Item>
              <Menu.Item
                onClick={() => logout({ returnTo: window.location.origin })}
                color="red"
                icon={<Logout size={17} />}
              >
                Sign out
              </Menu.Item>
            </Menu>
          </Group>
        </Group>
      </div>
    </Header>
  );
}
