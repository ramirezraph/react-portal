import { Group, ActionIcon, Switch, Button, Tooltip } from '@mantine/core';
import * as React from 'react';
import { FileUpload, Pencil, SquarePlus, Trash } from 'tabler-icons-react';
import { ClassAccordionType } from '../ClassUnitAccordion';

interface Props {
  type: ClassAccordionType;
  live: boolean;
}

export function ClassAccordionControl(props: Props) {
  const { type, live } = props;

  return (
    <Group position="apart" className="mt-3">
      <Group spacing={'sm'}>
        {type === ClassAccordionType.Unit && (
          <Button leftIcon={<SquarePlus size={21} />}>Add Lesson</Button>
        )}
        {type === ClassAccordionType.Lesson && (
          <ActionIcon variant="transparent">
            <FileUpload />
          </ActionIcon>
        )}

        <Switch size="sm" label="Live" aria-label="Is unit live" />
      </Group>
      <Group spacing={'sm'}>
        <Tooltip label="Edit" position="bottom" withArrow>
          <ActionIcon variant="transparent">
            <Pencil />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Delete" position="bottom" withArrow>
          <ActionIcon color={'red'} variant="transparent">
            <Trash />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
}
