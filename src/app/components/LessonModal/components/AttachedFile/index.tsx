import { Grid, Group, ActionIcon, Text } from '@mantine/core';
import * as React from 'react';
import { Pencil, At, Download, Trash, File } from 'tabler-icons-react';

interface Prop {
  name: string;
  downloadUrl?: string;
}

export function AttachedFile(props: Prop) {
  const { name } = props;

  return (
    <Group position="apart" className="mt-3">
      <Group>
        <File size={18} />
        <Text size="sm">{name}</Text>
      </Group>
      <Group position="center">
        <ActionIcon size="sm">
          <Pencil />
        </ActionIcon>
        <ActionIcon size="sm">
          <At />
        </ActionIcon>
        <ActionIcon size="sm">
          <Download />
        </ActionIcon>
        <ActionIcon color="red" size="sm">
          <Trash />
        </ActionIcon>
      </Group>
    </Group>
  );
}
