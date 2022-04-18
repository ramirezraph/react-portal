import { Group, ActionIcon, Text } from '@mantine/core';
import * as React from 'react';
import { Pencil, At, Download, Trash, File } from 'tabler-icons-react';

interface Prop {
  name: string;
  downloadUrl?: string;
  compact?: boolean;
}

export function AttachedFile(props: Prop) {
  const { name, compact } = props;

  return (
    <Group position="apart" className="mt-3" noWrap>
      <Group noWrap>
        <File size={18} />
        <Text size="sm" lineClamp={1}>
          {name}
        </Text>
      </Group>
      <Group position="center" spacing={compact ? 'xs' : 'md'} noWrap>
        {!compact && (
          <>
            <ActionIcon size="sm">
              <Pencil />
            </ActionIcon>
            <ActionIcon size="sm">
              <At />
            </ActionIcon>
          </>
        )}

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
