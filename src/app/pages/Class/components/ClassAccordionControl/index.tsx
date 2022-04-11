import { Group, ActionIcon, Button, Tooltip, Text } from '@mantine/core';
import { LiveSwitch } from 'app/components/LiveSwitch/Loadable';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FileUpload,
  Maximize,
  Message,
  Pencil,
  SquarePlus,
  ThumbUp,
  Trash,
} from 'tabler-icons-react';
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
          <Tooltip label="Attach a file" position="bottom" withArrow>
            <ActionIcon variant="transparent">
              <FileUpload />
            </ActionIcon>
          </Tooltip>
        )}

        <LiveSwitch live={live} onToggle={toggleSwitch} />
      </Group>
      {type === ClassAccordionType.Unit && (
        <Group className="gap-0" noWrap>
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
      )}
      {type === ClassAccordionType.Lesson && (
        <Group spacing={'xs'}>
          <Button
            variant="subtle"
            compact
            color={'dark'}
            className="px-0"
            onClick={displayLessonModalOnEdit}
          >
            <Message />
            <Text className="ml-2">1</Text>
          </Button>
          <Tooltip label="Lesson View" position="bottom" withArrow>
            <ActionIcon
              variant="transparent"
              onClick={displayLessonModalOnEdit}
            >
              <Maximize />
            </ActionIcon>
          </Tooltip>
        </Group>
      )}
    </Group>
  );
}
