import { ActionIcon, Group, Text, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
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

  const theme = useMantineTheme();
  const isTablet = useMediaQuery(`(min-width: ${theme.breakpoints.md}px)`);

  return (
    <Group key={user.userId} position="apart" noWrap>
      <Group noWrap>
        <UserAvatar userId={user.userId} size="sm" radius="xl" />
        <Group
          direction={isTablet ? 'row' : 'column'}
          spacing={isTablet ? 'md' : 0}
          noWrap
        >
          <Text size="sm">{user.fullname}</Text>
          <Text size="xs" color="gray" weight="lighter">
            ({user.email})
          </Text>
        </Group>
      </Group>
      <Group noWrap>
        {selected && <Check color="green" />}
        <ActionIcon size="lg" color="green" onClick={() => onSelectUser(user)}>
          <SquarePlus />
        </ActionIcon>
      </Group>
    </Group>
  );
}
