import { Group, ActionIcon, Button, Tooltip, Text } from '@mantine/core';
import { LiveSwitch } from 'app/components/LiveSwitch/Loadable';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from 'services/firebase';
import {
  FileUpload,
  Maximize,
  Message,
  Pencil,
  SquarePlus,
  Trash,
} from 'tabler-icons-react';
import { selectClassroom } from '../../slice/selectors';
import { ClassAccordionType } from '../ClassUnitAccordion';

interface Props {
  unitId: string;
  lessonId?: string;
  type: ClassAccordionType;
  live: boolean;
  openDeleteModal?: (id: string) => void;
  openEditModal?: (id: string) => void;
}

export function ClassAccordionControl(props: Props) {
  const { unitId, lessonId, type, live, openDeleteModal, openEditModal } =
    props;

  const navigate = useNavigate();
  let location = useLocation();
  const classroom = useSelector(selectClassroom);

  const toggleSwitch = async () => {
    if (type === ClassAccordionType.Unit) {
      const unitDocRef = doc(db, classroom.unitPath, unitId);
      await updateDoc(unitDocRef, {
        isLive: !live,
        updatedAt: Timestamp.now(),
      });
    } else if (type === ClassAccordionType.Lesson) {
      if (lessonId) {
        const lessonDocRef = doc(db, 'lessons', lessonId);
        await updateDoc(lessonDocRef, {
          isLive: !live,
          updatedAt: Timestamp.now(),
        });
      }
    }
  };

  const displayNewLessonModal = () => {
    const classId = location.pathname.split('/')[2];
    navigate(
      {
        pathname: `/lesson/new`,
      },
      {
        state: {
          backgroundLocation: location,
          unitId: unitId,
          classId: classId,
        },
      },
    );
  };

  const displayLessonModalOnEdit = () => {
    const classId = location.pathname.split('/')[2];
    navigate(
      {
        pathname: `/lesson/${lessonId}`,
      },
      {
        state: {
          backgroundLocation: location,
          unitId: unitId,
          classId: classId,
        },
      },
    );
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
            <ActionIcon
              variant="transparent"
              onClick={() => (openEditModal ? openEditModal(unitId) : null)}
            >
              <Pencil />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Delete" position="bottom" withArrow>
            <ActionIcon
              color={'red'}
              variant="transparent"
              onClick={() => (openDeleteModal ? openDeleteModal(unitId) : null)}
            >
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
