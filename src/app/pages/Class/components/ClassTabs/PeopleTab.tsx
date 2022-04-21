import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  NativeSelect,
  Text,
  TextInput,
} from '@mantine/core';
import * as React from 'react';
import { ArrowsUpDown, Menu2, Search, UserPlus } from 'tabler-icons-react';
import { PeopleItem } from './components/PeopleItem/Loadable';

interface Props {
  // someProps: string
}

export function PeopleTab(props: Props) {
  // const { someProps } = props;

  return (
    <div className="bg-white p-6">
      <Group position="apart">
        <Button
          color="primary"
          radius="xl"
          leftIcon={<UserPlus size={19} />}
          variant="filled"
        >
          Send Invite
        </Button>
        <Button leftIcon={<Menu2 color="black" size={19} />} variant="subtle">
          <Text weight={400} color="black">
            Pending Invites
          </Text>
        </Button>
      </Group>
      <Text className="mt-6 text-2xl font-semibold">Teacher</Text>
      <PeopleItem name="John Doe" />
      <Text className="mt-6 text-2xl font-semibold">Students</Text>
      <Group position="apart" className="mt-6">
        <Group>
          <Checkbox />
          <NativeSelect
            className="w-48"
            data={['React', 'Vue', 'Angular', 'Svelte']}
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
