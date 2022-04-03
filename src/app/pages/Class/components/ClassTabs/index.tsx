import { Group } from '@mantine/core';
import { NavButton } from 'app/components/Navbar/components/navButton';
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Message, Notes, Users, Video } from 'tabler-icons-react';

interface Props {
  // someProps: string
}

export function ClassTabs(props: Props) {
  // const { units } = props;

  return (
    <div className="h-full w-2/3 rounded-md bg-white">
      <Group grow noWrap direction="row" className="w-full py-3">
        <NavButton
          centered
          smallText
          to="discussions"
          text="Discussions"
          icon={<Message size={21} />}
        />
        <NavButton
          centered
          smallText
          to="classwork"
          text="Classwork"
          icon={<Notes size={21} />}
        />
        <NavButton
          centered
          smallText
          to="people"
          text="People"
          icon={<Users size={21} />}
        />
        <NavButton
          centered
          smallText
          to="meetings"
          text="Meetings"
          icon={<Video size={21} />}
        />
      </Group>
      <Outlet />
    </div>
  );
}
