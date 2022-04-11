import { Group, ActionIcon, Switch, Button, Tooltip } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { LiveSwitch } from 'app/components/LiveSwitch/Loadable';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();
  let location = useLocation();

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

  const displayNewLessonModal = () => {
    navigate('/lesson/new', { state: { backgroundLocation: location } });
  };
  const displayLessonModalOnEdit = () => {
    navigate('/lesson/123', { state: { backgroundLocation: location } });
  };

  return (
    <Group position="apart" className="mt-3" noWrap>
      <Group spacing="sm" noWrap>
        {type === ClassAccordionType.Unit && (
          <Button
            size="xs"
            onClick={displayNewLessonModal}
            leftIcon={<SquarePlus size={19} />}
          >
            Add Lesson
          </Button>
        )}
        {type === ClassAccordionType.Lesson && (
          <ActionIcon variant="transparent">
            <FileUpload />
          </ActionIcon>
        )}

        <LiveSwitch live={live} onToggle={toggleSwitch} />
      </Group>
      <Group className="gap-0" noWrap>
        <Tooltip label="Edit" position="bottom" withArrow>
          <ActionIcon
            variant="transparent"
            onClick={
              type === ClassAccordionType.Lesson
                ? displayLessonModalOnEdit
                : undefined
            }
          >
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
