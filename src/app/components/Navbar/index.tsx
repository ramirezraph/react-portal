import * as React from 'react';
import {
  Avatar,
  Divider,
  Group,
  Navbar,
  Text,
  useMantineTheme,
} from '@mantine/core';
import {
  Book,
  Calendar,
  ChartArrowsVertical,
  Home,
  Message,
  Users,
} from 'tabler-icons-react';
import { NavButton } from './components/navButton';

interface Props {
  hidden: boolean;
}

export function AppNavbar(props: Props) {
  const theme = useMantineTheme();
  const { hidden } = props;

  return (
    <Navbar
      p="md"
      // Breakpoint at which navbar will be hidden if hidden prop is true
      hiddenBreakpoint="sm"
      // Hides navbar when viewport size is less than value specified in hiddenBreakpoint
      hidden={hidden}
      // when viewport size is less than theme.breakpoints.sm navbar width is 100%
      // viewport size > theme.breakpoints.sm – width is 300px
      // viewport size > theme.breakpoints.lg – width is 400px
      width={{ sm: 200, lg: 230 }}
      className="bg-white p-6"
    >
      <Group direction="column">
        <Group direction="column">
          <Avatar
            size={'lg'}
            src={null}
            radius="lg"
            alt="John D. Doe"
            color={theme.primaryColor}
          >
            JD
          </Avatar>
          <Text weight={'bold'}>John D. Doe</Text>
        </Group>
        <Divider
          variant="solid"
          size="sm"
          color={'dark'}
          className="my-2 w-8"
        />
        <NavButton to="/" text="Dashboard" icon={<Home />} />
        <NavButton to="/discussions" text="Discussions" icon={<Message />} />
        <NavButton to="/classes" text="Classes" icon={<Users />} />
        <NavButton to="/grades" text="Grades" icon={<ChartArrowsVertical />} />
        <NavButton to="/calendar" text="Calendar" icon={<Calendar />} />
        <Divider
          variant="solid"
          size="sm"
          color={'dark'}
          className="my-2 w-8"
        />
        <NavButton to="/classes" text="RLW 101" icon={<Book />} />
        <NavButton to="/classes" text="PE 4" icon={<Book />} />
        <NavButton to="/classes" text="CPE 401" icon={<Book />} />
        <NavButton to="/classes" text="CPE 402" icon={<Book />} />
      </Group>
    </Navbar>
  );
}