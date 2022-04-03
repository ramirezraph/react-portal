import { Group, ActionIcon, Switch, Button, Tooltip } from '@mantine/core';
import { useBooleanToggle, useToggle } from '@mantine/hooks';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { FileUpload, Pencil, SquarePlus, Trash } from 'tabler-icons-react';
import { useClassroomSlice } from '../../slice';
import { ClassAccordionType } from '../ClassUnitAccordion';

interface Props {
  unitId: string;
  lessonId?: string;
  type: ClassAccordionType;
  live: boolean;
}

export function ClassAccordionControl(props: Props) {
  const { unitId, lessonId, type, live } = props;

  const [switchLabel, toggleSwitchLabel] = useToggle(null, ['Live', 'Draft']);

  React.useEffect(() => {
    if (live) {
      toggleSwitchLabel('Live');
    } else {
      toggleSwitchLabel('Draft');
    }
  }, [live, toggleSwitchLabel]);

  const { actions } = useClassroomSlice();
  const dispatch = useDispatch();

  const toggleSwitch = () => {
    if (type === ClassAccordionType.Unit) {
      dispatch(actions.toggleUnitLive(unitId));
    } else if (type === ClassAccordionType.Lesson) {
      if (lessonId) {
        dispatch(
          actions.toggleLessonLive({ unitId: unitId, lessonId: lessonId }),
        );
      }
    }
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
          checked={live}
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
