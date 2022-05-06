import { Avatar, Button, Group, Text } from '@mantine/core';
import * as React from 'react';

interface Prop {
  name: string;
  imageUrl: string;
}

export function PendingInviteItem(props: Prop) {
  const { name, imageUrl } = props;
  return (
    <Group position="apart">
      <Group className="pt-6">
        <Avatar radius="xl" src={imageUrl} />
        <Text>{name}</Text>
      </Group>
      <Button color="gray" variant="filled">
        <Text size="sm" weight={400}>
          Cancel Invite
        </Text>
      </Button>
    </Group>
  );
}
