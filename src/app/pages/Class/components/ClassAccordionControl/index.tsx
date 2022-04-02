import { Group, ActionIcon, Switch, Button, Tooltip } from '@mantine/core';
import { useBooleanToggle, useToggle } from '@mantine/hooks';
import * as React from 'react';
import { FileUpload, Pencil, SquarePlus, Trash } from 'tabler-icons-react';
import { ClassAccordionType } from '../ClassUnitAccordion';

interface Props {
  type: ClassAccordionType;
  live: boolean;
}

export function ClassAccordionControl(props: Props) {
  const { type, live } = props;

  const [isLive, toggleLive] = useBooleanToggle(live);
  const [switchLabel, toggleSwitchLabel] = useToggle(null, ['Live', 'Draft']);

  React.useEffect(() => {
    if (isLive) {
      toggleSwitchLabel('Live');
    } else {
      toggleSwitchLabel('Draft');
    }
  }, [isLive, toggleSwitchLabel]);

  const toggleSwitch = () => {
    toggleLive();
  };

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

        <Switch
          checked={isLive}
          size="sm"
          label={switchLabel}
          aria-label="Live or draft"
          onChange={toggleSwitch}
          color="green"
          classNames={{
            input: 'bg-orange-500',
          }}
        />
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
