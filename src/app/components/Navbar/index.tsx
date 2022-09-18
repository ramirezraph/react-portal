import * as React from 'react';
import { Divider, Group, Navbar, Text } from '@mantine/core';
import { Book, Calendar, Home, Message, Users } from 'tabler-icons-react';
import { NavButton } from './components/navButton';
import { useSelector } from 'react-redux';
import { selectUser } from 'store/userSlice/selectors';
import { selectClasses } from 'app/pages/Classes/slice/selectors';
import { Class } from 'app/pages/Classes/slice/types';
import { UserAvatar } from '../UserAvatar';

interface Props {
  navbarVisible: boolean;
  setNavbarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AppNavbar(props: Props) {
  const { navbarVisible, setNavbarVisible } = props;

  const userSlice = useSelector(selectUser);
  const classesSlice = useSelector(selectClasses);

  const [userName, setUserName] = React.useState(
    userSlice.currentUser?.nickname,
  );
  const [classes, setClasses] = React.useState<Class[]>([]);

  React.useEffect(() => {
    setUserName(userSlice.currentUser?.name);
  }, [userSlice]);

  React.useEffect(() => {
    setClasses(classesSlice.classes);
  }, [classesSlice.classes]);

  const onNavButtonClicked = () => {
    setNavbarVisible(false);
  };

  return (
    <Navbar
      p="md"
      // Breakpoint at which navbar will be hidden if hidden prop is true
      hiddenBreakpoint="sm"
      // Hides navbar when viewport size is less than value specified in hiddenBreakpoint
      hidden={navbarVisible}
      // when viewport size is less than theme.breakpoints.sm navbar width is 100%
      // viewport size > theme.breakpoints.sm – width is 300px
      // viewport size > theme.breakpoints.lg – width is 400px
      width={{ sm: 200, lg: 230 }}
      className="z-50 bg-white p-6"
    >
      <Group direction="column">
        <Group direction="column">
          <UserAvatar currentUser />
          <Text weight={'bold'} className="w-40" lineClamp={1}>
            {userName}
          </Text>
        </Group>
        <Divider
          variant="solid"
          size="sm"
          color={'dark'}
          className="my-2 w-8"
        />
        <NavButton
          to="/"
          text="Dashboard"
          icon={<Home />}
          onClick={onNavButtonClicked}
        />
        <NavButton
          to="/discussions"
          text="Discussions"
          icon={<Message />}
          onClick={onNavButtonClicked}
        />
        <NavButton
          to="/classes"
          text="Classes"
          icon={<Users />}
          onClick={onNavButtonClicked}
        />
        {/* <NavButton to="/grades" text="Grades" icon={<ChartArrowsVertical />} /> */}
        <NavButton
          to="/calendar"
          text="Calendar"
          icon={<Calendar />}
          onClick={onNavButtonClicked}
        />
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
            onClick={onNavButtonClicked}
          />
        ))}
      </Group>
    </Navbar>
  );
}
