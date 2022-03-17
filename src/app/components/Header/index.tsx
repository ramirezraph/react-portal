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
} from '@mantine/core';
import { Home, Calendar, Bell } from 'tabler-icons-react';

interface Props {
  opened: boolean;
  burgerOnClick: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AppHeader(props: Props) {
  const theme = useMantineTheme();

  const { opened, burgerOnClick } = props;

  return (
    <Header height={50} className="bg-zinc-800 text-white" p="md">
      {/* Handle other responsive styles with MediaQuery component or createStyles function */}
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
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
          <Text weight="bold">DPVMHSHS Portal</Text>
          <Group spacing={'xl'}>
            <ActionIcon className="text-white hover:bg-transparent hover:text-secondary">
              <Home size={24} />
            </ActionIcon>
            <ActionIcon className="text-white hover:bg-transparent hover:text-secondary">
              <Calendar size={24} />
            </ActionIcon>
            <ActionIcon className="text-white hover:bg-transparent hover:text-secondary">
              <Bell size={24} />
            </ActionIcon>
            <Avatar
              size={'sm'}
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
              radius="xl"
            />
          </Group>
        </Group>
      </div>
    </Header>
  );
}
