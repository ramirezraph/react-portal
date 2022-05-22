import { ActionIcon, Group, Text } from '@mantine/core';
import { UserAvatar } from 'app/components/UserAvatar';
import * as React from 'react';
import { Check, SquarePlus } from 'tabler-icons-react';
import { SearchResult } from '..';

interface Props {
  user: SearchResult;
  selected: boolean;
  onSelectUser: (user: SearchResult) => void;
}

export function SearchResultItem(props: Props) {
  const { user, onSelectUser, selected } = props;

  return (
    <Group key={user.userId} position="apart">
      <Group>
        <UserAvatar userId={user.userId} size="sm" radius="xl" />
        <Text size="sm">{user.fullname}</Text>
        <Text size="xs" color="gray" weight="lighter">
          ({user.email})
        </Text>
      </Group>
      <Group>
        {selected && <Check color="green" />}
        <ActionIcon size="lg" color="green" onClick={() => onSelectUser(user)}>
          <SquarePlus />
        </ActionIcon>
      </Group>
    </Group>
  );
}
