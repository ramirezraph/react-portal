import { Group, ActionIcon, Text } from '@mantine/core';
import { UserAvatar } from 'app/components/UserAvatar/Loadable';
import * as React from 'react';
import { X } from 'tabler-icons-react';
import { SearchResult } from '..';

interface Props {
  user: SearchResult;
  onRemove: (user: SearchResult) => void;
}

export function SelectedUserItem(props: Props) {
  const { user, onRemove } = props;

  return (
    <Group className="rounded-xl bg-primary">
      <UserAvatar userId={user.userId} size="sm" radius="lg" />
      <Group className="p-1">
        <Text color="white" size="xs">
          {user.email}
        </Text>
        <ActionIcon
          size="sm"
          radius="xl"
          className="bg-white"
          onClick={() => onRemove(user)}
        >
          <X size={14} />
        </ActionIcon>
      </Group>
    </Group>
  );
}
