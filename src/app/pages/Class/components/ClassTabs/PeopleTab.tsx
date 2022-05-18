import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  NativeSelect,
  Text,
  TextInput,
} from '@mantine/core';
import { SendClassInviteModal } from 'app/components/SendClassInviteModal/Loadable';
import * as React from 'react';
import { useState } from 'react';
import { ArrowsUpDown, Menu2, Search, UserPlus } from 'tabler-icons-react';
import { PendingInvitesModal } from './components/PendingInvitesModal/Loadable';
import { PeopleItem } from './components/PeopleItem/Loadable';

interface Props {
  // someProps: string
}

export function PeopleTab(props: Props) {
  // const { someProps } = props;
  const [openedPendingInvite, setOpenedPendingInvite] = useState(false);
  const [openedSendInvite, setOpenedSendInvite] = useState(false);

  return (
    <div className="bg-white p-6">
      <PendingInvitesModal
        visible={openedPendingInvite}
        onToggle={setOpenedPendingInvite}
      />
      <SendClassInviteModal
        visible={openedSendInvite}
        onToggle={setOpenedSendInvite}
      />

      <Group position="apart">
        <Button
          onClick={() => setOpenedSendInvite(true)}
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
            onClick={() => setOpenedPendingInvite(true)}
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
