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
import { useSelector } from 'react-redux';
import { selectUser } from 'store/userSlice/selectors';
import { selectClasses } from 'app/pages/Classes/slice/selectors';
import { Class } from 'app/pages/Classes/slice/types';

interface Props {
  hidden: boolean;
}

export function AppNavbar(props: Props) {
  const theme = useMantineTheme();
  const { hidden } = props;

  const userSlice = useSelector(selectUser);
  const classesSlice = useSelector(selectClasses);

  const [userImageUrl, setUserImageUrl] = React.useState(
    userSlice.currentUser?.picture,
  );
  const [userName, setUserName] = React.useState(
    userSlice.currentUser?.nickname,
  );
  const [classes, setClasses] = React.useState<Class[]>([]);

  React.useEffect(() => {
    setUserImageUrl(userSlice.currentUser?.picture);
    setUserName(userSlice.currentUser?.name);
  }, [userSlice]);

  React.useEffect(() => {
    setClasses(classesSlice.classes);
  }, [classesSlice.classes]);

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
            src={userImageUrl}
            radius="lg"
            alt="John D. Doe"
            color={theme.primaryColor}
          />
          <Text weight={'bold'} className="w-full" lineClamp={1}>
            {userName}
          </Text>
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
        {classes.map(c => (
          <NavButton
            key={c.id}
            to={`/class/${c.id}`}
            text={c.code}
            icon={<Book />}
          />
        ))}
      </Group>
    </Navbar>
  );
}
