import { Collapse, Divider, Group, Skeleton, Stack, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import { EditUnitModal } from 'app/components/EditUnitModal/Loadable';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Check, ChevronDown, ChevronUp, X } from 'tabler-icons-react';
import { selectClassroom } from '../../slice/selectors';
import { ClassRole, Lesson, Unit } from '../../slice/types';
import { ClassAccordionControl } from '../ClassAccordionControl/Loadable';
import { ClassAccordionHeader } from '../ClassAccordionHeader';
import { v4 as uuidv4 } from 'uuid';
import { ClassLessonAccordion } from '../ClassLessonAccordion/Loadable';
import { db, lessonsColRef } from 'services/firebase';
import {
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  orderBy,
  Query,
  query,
  where,
} from 'firebase/firestore';

export enum ClassAccordionType {
  Unit,
  Lesson,
}

interface Props {
  unit: Unit;
}

export function ClassUnitAccordionItem(props: Props) {
  const { unit } = props;

  const modals = useModals();
  const classroom = useSelector(selectClassroom);

  const [isOpened, setIsOpened] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [lessons, setLessons] = React.useState<Lesson[]>([]);
  const [editUnitModalVisible, setEditUnitModalVisible] = React.useState(false);

  const displayDeleteUnitModal = () => {
    const unitToBeDeleted = unit;
    if (!unitToBeDeleted) return;

    return modals.openConfirmModal({
      title: <Text weight="bold">Are you absolutely sure?</Text>,
      centered: true,
      closeOnClickOutside: false,
      trapFocus: true,
      children: (
        <Text size="sm">
          This action cannot be undone. This will permanently delete{' '}
          <span className="font-bold">
            Unit {unitToBeDeleted.number}: {unitToBeDeleted.title}
          </span>
          , along with other data associated with it.
        </Text>
      ),
      labels: { confirm: 'Delete unit', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteUnit(),
    });
  };

  const deleteUnit = async () => {
    const path = classroom.unitPath;
    if (!path) return;

    const notificationId = uuidv4();
    showNotification({
      id: notificationId,
      loading: true,
      title: 'In progress',
      message: `Deleting Unit ${unit.number}: ${unit.title} ...`,
      autoClose: false,
      disallowClose: true,
    });

    deleteDoc(doc(db, path, unit.id))
      .then(() => {
        updateNotification({
          id: notificationId,
          title: 'Success',
          message: `Unit ${unit.number}: ${unit.title} deleted successfully.`,
          color: 'green',
          icon: <Check />,
        });
      })
      .catch(e => {
        updateNotification({
          id: notificationId,
          title: 'Failed',
          message: `Unit ${unit.number}: ${unit.title} delete failed. ${e}`,
          color: 'red',
          icon: <X />,
        });
      });
  };

  const prepareEditUnitModal = () => {
    setEditUnitModalVisible(true);
  };

  React.useEffect(() => {
    if (!isOpened) {
      return;
    }

    console.log('onSnapshot: lessons');
    setLoading(true);

    let lessonQuery: Query<DocumentData> | undefined = undefined;
    lessonQuery = query(
      lessonsColRef,
      where('unitId', '==', unit.id),
      orderBy('number'),
    );
    if (classroom.activeClassRole === ClassRole.Student) {
      lessonQuery = query(
        lessonsColRef,
        where('unitId', '==', unit.id),
        orderBy('number'),
        where('isLive', '==', true),
      );
    }
    const unsubscribe = onSnapshot(lessonQuery, snapshot => {
      const list: Lesson[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();

        const lesson: Lesson = {
          id: doc.id,
          number: data.number,
          title: data.title,
          content: data.content,
          isLive: data.isLive,
          numberOfComments: data.numberOfComments,
          files: [],
        };
        list.push(lesson);
      });
      setLessons(list);
      setLoading(false);
    });

    return () => {
      console.log('onSnapshot: lessons - unsubsribe');

      unsubscribe();
    };
  }, [classroom.activeClassRole, isOpened, unit.id]);

  return (
    <>
      <EditUnitModal
        visible={editUnitModalVisible}
        onToggle={setEditUnitModalVisible}
        unitId={unit.id}
        unitNumber={unit.number}
        unitTitle={unit.title}
        unitContent={unit.content}
      />
      <Stack className="outline outline-1 outline-stone-200" spacing={0}>
        <Group
          onClick={() => setIsOpened(x => !x)}
          className="cursor-pointer bg-slate-800 p-4"
          noWrap
        >
          <ClassAccordionHeader
            live={unit.isLive}
            title={unit.title}
            number={unit.number}
            type={ClassAccordionType.Unit}
          />
          {isOpened ? (
            <ChevronUp size={20} color="white" />
          ) : (
            <ChevronDown size={20} color="white" />
          )}
        </Group>
        <Collapse in={isOpened} transitionDuration={500}>
          <div className="p-4">
            {/* Text Content */}
            <Skeleton visible={loading}>
              {unit.content && (
                <Text className="mt-3 w-full" size="sm">
                  {unit.content}
                </Text>
              )}
              {lessons.length === 0 ? (
                <Text className="mt-3" color="gray" size="sm">
                  No lessons yet.
                </Text>
              ) : (
                <ClassLessonAccordion
                  unitId={unit.id}
                  unitNumber={`Unit ${unit.number}`}
                  lessons={lessons}
                />
              )}
            </Skeleton>

            {classroom.activeClassRole === ClassRole.Teacher && (
              <Divider className="mt-6" />
            )}

            {classroom.activeClassRole === ClassRole.Teacher && (
              <ClassAccordionControl
                unitId={unit.id}
                unitNumber={`Unit ${unit.number}`}
                live={unit.isLive}
                type={ClassAccordionType.Unit}
                openDeleteModal={displayDeleteUnitModal}
                openEditModal={prepareEditUnitModal}
              />
            )}
          </div>
        </Collapse>
      </Stack>
    </>
  );
}
