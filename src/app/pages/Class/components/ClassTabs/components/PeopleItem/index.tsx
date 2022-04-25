import { Group, Avatar, ActionIcon, Text, Checkbox } from '@mantine/core';
import * as React from 'react';
import { Mail, UserCircle, UserX } from 'tabler-icons-react';

interface Prop {
  name: string;
}

export function PeopleItem(props: Prop) {
  const { name } = props;

  return (
    <Group position="apart" className="mt-4 w-full">
      <Group>
        <Checkbox />
        <Avatar
          radius="xl"
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
          size="md"
        />
        <Text size="md">{name}</Text>
      </Group>
      <Group>
        <ActionIcon>
          <Mail />
        </ActionIcon>
        <ActionIcon>
          <UserCircle />
        </ActionIcon>
        <ActionIcon>
          <UserX />
        </ActionIcon>
      </Group>
    </Group>
  );
}
