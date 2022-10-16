import { Group, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { NavButton } from 'app/components/Navbar/components/navButton';
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Files, Message, Users, Video } from 'tabler-icons-react';

interface Props {
  // someProps: string
}

export function ClassTabs(props: Props) {
  // const { units } = props;

  const theme = useMantineTheme();
  const isLargeScreen = useMediaQuery(`(min-width: ${theme.breakpoints.xl}px)`);

  return (
    <div className="h-full w-full">
      <Group
        grow
        noWrap
        direction="row"
        className="w-full rounded-tr-md rounded-tl-md bg-white py-3 shadow-md"
      >
        {!isLargeScreen && (
          <NavButton
            centered
            smallText
            to="materials"
            text={isLargeScreen ? 'Class Materials' : undefined}
            icon={<Files size={21} />}
          />
        )}

        <NavButton
          centered
          smallText
          to="discussions"
          text={isLargeScreen ? 'Discussions' : undefined}
          icon={<Message size={21} />}
        />
        <NavButton
          centered
          smallText
          to="meetings"
          text={isLargeScreen ? 'Meetings' : undefined}
          icon={<Video size={21} />}
        />
        <NavButton
          centered
          smallText
          to="people"
          text={isLargeScreen ? 'People' : undefined}
          icon={<Users size={21} />}
        />
      </Group>
      <Outlet />
    </div>
  );
}
