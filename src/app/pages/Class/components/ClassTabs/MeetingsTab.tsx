import {
  Text,
  Button,
  Group,
  ActionIcon,
  Chips,
  Chip,
  Menu,
} from '@mantine/core';
import { Video, Settings, Pencil, Butterfly } from 'tabler-icons-react';
import * as React from 'react';
import { MeetingItem } from './components/MeetingItem/Loadable';

interface Props {
  // someProps: string
}

export function MeetingsTab(props: Props) {
  // const { someProps } = props;

  return (
    <div className="bg-white p-6">
      <Group>
        <Menu
          position="bottom"
          control={
            <Button
              color="primary"
              radius="xl"
              size="md"
              leftIcon={<Video size={20} />}
            >
              <Text weight={400} size="sm">
                New Meeting
              </Text>
            </Button>
          }
        >
          <Menu.Item icon={<Pencil size={16} />}>
            <Butterfly />
          </Menu.Item>
          <Menu.Item icon={<Pencil size={16} />}>option 2</Menu.Item>
          <Menu.Item icon={<Pencil size={16} />}>option 3</Menu.Item>
        </Menu>
        <Group className="ml-auto">
          <Chips color="violet" variant="filled" spacing={5} size="sm">
            <Chip value={'today'}>Today</Chip>
            <Chip value={'week'}>This Week</Chip>
            <Chip value={'all'}>All Meetings</Chip>
          </Chips>
        </Group>
      </Group>
      <Group className="py-6 px-2">
        <Text size="lg" weight={500}>
          Class meetings
        </Text>
        <Group className="ml-auto">
          <ActionIcon variant="hover">
            <Settings size={28} />
          </ActionIcon>
        </Group>
      </Group>
      <Group>
        <MeetingItem
          title="Class Introduction"
          subtitle="CPE 401 - Python Programming"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          date="Thu, Feb, 25, 2021"
          timeStart="1:30 PM"
          timeEnd="2:30 PM"
          shouldShowDescription={true}
        />

        <MeetingItem
          title="Class Introduction"
          subtitle="CPE 401 - Python Programming"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          date="Thu, Feb, 25, 2021"
          timeStart="1:30 PM"
          timeEnd="2:30 PM"
          shouldShowDescription={true}
        />
      </Group>
    </div>
  );
}
