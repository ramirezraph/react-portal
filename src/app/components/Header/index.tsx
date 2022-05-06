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

interface Props {
  opened: boolean;
  burgerOnClick: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AppHeader(props: Props) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { opened, burgerOnClick } = props;
  const { logout } = useAuth0();

  const userSlice = useSelector(selectUser);
  const [userImageUrl, setUserImageUrl] = React.useState(
    userSlice.currentUser.picture,
  );
  React.useEffect(() => {
    setUserImageUrl(userSlice.currentUser.picture);
  }, [userSlice]);

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
        <Group position="apart" className="w-full">
          <Text weight="bold">DPVMHS Portal</Text>
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

            <ActionIcon
              className="text-white hover:bg-transparent hover:text-secondary"
              onClick={() => {
                console.log('menu');
              }}
            >
              <PopoverNotification />
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
