import { Group, Avatar, Button, Text } from '@mantine/core';
import * as React from 'react';

interface Prop {
  imageUrl: string;
  name: string;
  subject: string;
  date: string;
}

export function NotificationItems(props: Prop) {
  const { imageUrl, name, subject, date } = props;
  return (
    <Group className="items-start py-3" noWrap>
      <Avatar size={48} src={imageUrl} radius="xl"></Avatar>
      <Group direction="column" spacing={0}>
        <Text size="md">{name}</Text>

        <Text size="sm">
          posted in <span className="font-semibold">{subject}</span>
        </Text>
        <Button compact className="my-2 px-0" variant="subtle">
          <Text size="xs">VIEW CLASS</Text>
        </Button>
        <Text className="text-gray-400" size="xs">
          {date}
        </Text>
      </Group>
    </Group>
  );
}
