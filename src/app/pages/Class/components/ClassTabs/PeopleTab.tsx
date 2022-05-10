import {
  ActionIcon,
  Button,
  Checkbox,
  Divider,
  Group,
  Modal,
  NativeSelect,
  Text,
  TextInput,
} from '@mantine/core';
import * as React from 'react';
import { useState } from 'react';
import {
  ArrowsUpDown,
  Menu2,
  Search,
  UserPlus,
  UserSearch,
} from 'tabler-icons-react';
import { PendingInvitesModal } from './components/PendingInvitesModal/loadable';
import { PeopleItem } from './components/PeopleItem/Loadable';

interface Props {
  // someProps: string
}

export function PeopleTab(props: Props) {
  // const { someProps } = props;
  const [opened, setOpened] = useState(false);
  const [openedInvite, setOpenedInvite] = useState(false);

  return (
    <div className="bg-white p-6">
      <PendingInvitesModal opened={opened} setOpened={setOpened} />

      <Group position="apart">
        <Modal
          withCloseButton={false}
          opened={openedInvite}
          onClose={() => setOpenedInvite(false)}
          centered
          size="lg"
        >
          <Group position="apart">
            <Text size="xl" weight={600}>
              Send Invite
            </Text>
            <Button variant="default" onClick={() => setOpenedInvite(false)}>
              Close
            </Button>
          </Group>
          <Divider my="sm" />
          <Group className="mt-10">
            <TextInput
              className="w-full"
              placeholder="Search people by email"
              variant="default"
              icon={<UserSearch size={18} />}
            ></TextInput>
            <Group position="apart">
              <Text size="sm">Search Result:</Text>
              <Text size="sm">0</Text>
            </Group>
          </Group>

          <Button size="sm" className="mt-6 w-full">
            {' '}
            SEND INVITE
          </Button>
        </Modal>
        <Button
          onClick={() => setOpenedInvite(true)}
          color="primary"
          radius="xl"
          leftIcon={<UserPlus size={19} />}
          variant="filled"
          size="md"
        >
          <Text weight={400} size="sm">
            Send Invite
          </Text>
        </Button>

        <Group position="center">
          <Button
            size="sm"
            leftIcon={<Menu2 color="black" size={19} />}
            variant="subtle"
            onClick={() => setOpened(true)}
          >
            <Text weight={400} color="black">
              Pending Invites
            </Text>
          </Button>
        </Group>
      </Group>
      <Text className="mt-6 text-2xl font-semibold">Teacher</Text>
      <PeopleItem name="John Doe" />
      <Text className="mt-6 text-2xl font-semibold">Students</Text>
      <Group position="apart" className="mt-6">
        <Group>
          <Checkbox />
          <NativeSelect
            className="w-48"
            data={['Action', 'React', 'Vue', 'Angular', 'Svelte']}
          />
          <ActionIcon>
            <ArrowsUpDown size={20} />
          </ActionIcon>
        </Group>
        <TextInput placeholder="Search" rightSection={<Search size={15} />} />
        <PeopleItem name="John Doe" />
        <PeopleItem name="Jeff Lacerna" />
        <PeopleItem name="Jane Test" />
      </Group>
    </div>
  );
}
