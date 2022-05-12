import { Group, ActionIcon, Text, Button } from '@mantine/core';
import * as React from 'react';
import { Pencil, At, Download, Trash, File } from 'tabler-icons-react';

interface Prop {
  id: string;
  name: string;
  size: number;
  type: string;
  downloadUrl: string;
  lessonId: string;
  fullPath: string;
  createdAt: string;
  updatedAt: string;
  compact?: boolean;
  className?: string;
  textClassName?: string;
  viewOnly?: boolean;
}

export function AttachedFile(props: Prop) {
  const { name, compact, className, textClassName, viewOnly } = props;

  const renderButtons = () => {
    if (viewOnly) {
      return (
        <Group position="center" spacing={compact ? 'xs' : 'md'} noWrap>
          <ActionIcon size="sm">
            <At />
          </ActionIcon>
          <ActionIcon size="sm">
            <Download />
          </ActionIcon>
        </Group>
      );
    } else {
      if (compact) {
        return (
          <Group position="center" spacing={compact ? 'xs' : 'md'} noWrap>
            <ActionIcon size="sm">
              <Download />
            </ActionIcon>
            <ActionIcon color="red" size="sm">
              <Trash />
            </ActionIcon>
          </Group>
        );
      }

      return (
        <Group position="center" spacing={compact ? 'xs' : 'md'} noWrap>
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
      );
    }
  };

  return (
    <Group position="apart" className={`w-full ${className}`} noWrap>
      <Button
        className="px-0 text-blue-700"
        variant="subtle"
        compact
        leftIcon={<File size={18} />}
      >
        <Text
          weight={400}
          size="sm"
          className={`inline-block w-[20ch] overflow-hidden overflow-ellipsis whitespace-nowrap text-left 2xl:w-[30ch] ${textClassName}`}
        >
          {name}
        </Text>
      </Button>
      {renderButtons()}
    </Group>
  );
}
