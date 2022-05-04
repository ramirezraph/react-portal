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
import {
  Home,
  Calendar,
  Bell,
  User,
  Settings,
  Logout,
} from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

interface Props {
  opened: boolean;
  burgerOnClick: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AppHeader(props: Props) {
  const theme = useMantineTheme();

  const navigate = useNavigate();

  const { opened, burgerOnClick } = props;

  const { logout } = useAuth0();

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
              <Bell size={24} />
            </ActionIcon>

            <Menu
              control={
                <Avatar
                  size={'sm'}
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
                  radius="xl"
                  className="cursor-pointer"
                />
              }
            >
              <Menu.Item icon={<User size={17} />}>My account</Menu.Item>
              <Divider />
              <Menu.Item icon={<Settings size={17} />}>Settings</Menu.Item>
              <Menu.Item
                onClick={() =>
                  logout({ returnTo: `${window.location.origin}/welcome` })
                }
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
