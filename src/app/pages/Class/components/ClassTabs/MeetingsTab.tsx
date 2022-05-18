import {
  Text,
  Button,
  Group,
  ActionIcon,
  Chips,
  Chip,
  Modal,
  Divider,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import {
  Video,
  Settings,
  Link,
  Pencil,
  CalendarEvent,
  Clock,
} from 'tabler-icons-react';
import * as React from 'react';
import { MeetingItem } from './components/MeetingItem/Loadable';
import { useState } from 'react';
import { DatePicker, TimeInput } from '@mantine/dates';

interface Props {
  // someProps: string
}

export function MeetingsTab(props: Props) {
  const [NewMeetingOpened, NewMeetingsetOpened] = useState(false);

  return (
    <div className="bg-white p-6">
      <Group>
        <Modal
          centered
          size="lg"
          opened={NewMeetingOpened}
          onClose={() => NewMeetingsetOpened(false)}
          withCloseButton={false}
        >
          <Group position="apart">
            <Text size="xl" weight={600}>
              Create Meeting
            </Text>
            <Button variant="default">
              <Text>Cancel</Text>
            </Button>
          </Group>
          <Divider className="mt-6" />

          <Stack className="mt-6">
            <TextInput
              size="md"
              placeholder="Link"
              icon={<Link color="gray" />}
            />
            <TextInput
              size="md"
              icon={<Pencil color="gray" />}
              placeholder="Title"
            />
            <Textarea
              size="md"
              icon={<Pencil color="gray" className="mt-2.5 self-start" />}
              placeholder="Description"
              required
            />
            <DatePicker
              size="md"
              icon={<CalendarEvent color="gray" />}
              label="Date"
              required
            />
            <TimeInput
              icon={<Clock color="gray" />}
              size="md"
              label="Time start"
              format="12"
              defaultValue={new Date()}
              required
            />
            <TimeInput
              icon={<Clock color="gray" />}
              size="md"
              label="Time end"
              format="12"
              defaultValue={new Date()}
              required
            />
          </Stack>
        </Modal>
        <Button
          onClick={() => NewMeetingsetOpened(true)}
          color="primary"
          radius="xl"
          size="md"
          leftIcon={<Video size={20} />}
        >
          <Text weight={400} size="sm">
            New Meeting
          </Text>
        </Button>

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
