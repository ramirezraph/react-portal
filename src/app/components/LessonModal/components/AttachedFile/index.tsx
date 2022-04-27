import { Group, ActionIcon, Text, Button } from '@mantine/core';
import * as React from 'react';
import { Pencil, At, Download, Trash, File } from 'tabler-icons-react';

interface Prop {
  name: string;
  downloadUrl?: string;
  compact?: boolean;
  className?: string;
}

export function AttachedFile(props: Prop) {
  const { name, compact, className } = props;

  return (
    <Group position="apart" className={`w-full ${className}`} noWrap>
      <Button
        className="px-0 text-blue-700"
        variant="subtle"
        compact
        leftIcon={<File size={18} />}
      >
        <Text weight={400} size="sm" lineClamp={1}>
          {name}
        </Text>
      </Button>
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
