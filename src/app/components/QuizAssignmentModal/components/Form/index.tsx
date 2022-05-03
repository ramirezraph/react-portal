import { ActionIcon, Button, Group, Text } from '@mantine/core';
import * as React from 'react';
import { ClipboardList, Trash } from 'tabler-icons-react';

interface Props {
  title: string;
  possibleScores: number;
  className?: string;
}

export function Form(props: Props) {
  const { className, title, possibleScores } = props;
  return (
    <Group className={`p-3 ring-1 ring-gray-300 ${className}`} position="apart">
      <Group>
        <ActionIcon size="xl" variant="filled" color="primary" radius={'sm'}>
          <ClipboardList />
        </ActionIcon>
        <Text>{title}</Text>
      </Group>
      <Group>
        <Text weight={400} size="sm" className="text-gray-600">
          {possibleScores} possible scores
        </Text>
        <Button radius="xl" size="md" color="dark" className="px-10">
          <Text weight={400} size="sm">
            View
          </Text>
        </Button>
        <ActionIcon color="red">
          <Trash />
        </ActionIcon>
      </Group>
    </Group>
  );
}
