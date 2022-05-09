import { Accordion, AccordionState, Divider, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import {
  deleteDoc,
  doc,
  onSnapshot,
  query,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db, lessonsColRef } from 'services/firebase';
import { Check, X } from 'tabler-icons-react';
import { selectClassroom } from '../../slice/selectors';
import { Lesson, Unit } from '../../slice/types';
import { ClassAccordionControl } from '../ClassAccordionControl/Loadable';
import { ClassAccordionHeader } from '../ClassAccordionHeader/Loadable';
import { ClassLessonAccordion } from '../ClassLessonAccordion/Loadable';
import { v4 as uuidv4 } from 'uuid';
import { EditUnitModal } from 'app/components/EditUnitModal/Loadable';
import { useClassroomSlice } from '../../slice';

export enum ClassAccordionType {
  Unit,
  Lesson,
}

interface Props {
  // someProps: string
  units: Unit[];
}

let LESSONS_LISTENER_UNSUBSCROBE: Unsubscribe | null = null;

export function ClassUnitAccordion(props: Props) {
  const { units } = props;
  const modals = useModals();
  const classroom = useSelector(selectClassroom);
  const dispatch = useDispatch();
  const { actions: classroomActions } = useClassroomSlice();

  const [unitsList, setUnitsList] = React.useState<Unit[]>([]);
  const [editUnitModalVisible, setEditUnitModalVisible] = React.useState(false);
  const [unitToEdit, setUnitToEdit] = React.useState<Unit | null>(null);

  React.useEffect(() => {
    if (units) {
      console.log('setunit called');

      setUnitsList(units);
    }
  }, [units]);

  const displayDeleteUnitModal = (id: string) => {
    const unitToBeDeleted = unitsList.find(x => x.id === id);
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
      onConfirm: () => deleteUnit(id),
    });
  };
  const deleteUnit = async (unitId: string) => {
    const path = classroom.unitPath;
    if (!path) return;

    const unitToBeDeleted = unitsList.find(x => x.id === unitId);
    if (!unitToBeDeleted) return;

    const notificationId = uuidv4();
    showNotification({
      id: notificationId,
      loading: true,
      title: 'In progress',
      message: `Deleting Unit ${unitToBeDeleted.number}: ${unitToBeDeleted.title} ...`,
      autoClose: false,
      disallowClose: true,
    });

    await deleteDoc(doc(db, path, unitId))
      .then(() => {
        updateNotification({
          id: notificationId,
          title: 'Success',
          message: `Unit ${unitToBeDeleted.number}: ${unitToBeDeleted.title} deleted successfully.`,
          color: 'green',
          icon: <Check />,
        });
      })
      .catch(e => {
        updateNotification({
          id: notificationId,
          title: 'Failed',
          message: `Unit ${unitToBeDeleted.number}: ${unitToBeDeleted.title} delete failed. ${e}`,
          color: 'red',
          icon: <X />,
        });
      });
  };

  const prepareEditUnitModal = (id: string) => {
    const found = classroom.units.find(x => x.id === id);
    if (found) {
      setUnitToEdit(found);
      setEditUnitModalVisible(true);
    }
  };

  const renderUnitItems = unitsList.map(unit => (
    <Accordion.Item
      label={
        <ClassAccordionHeader
          type={ClassAccordionType.Unit}
          number={unit.number}
          title={unit.title}
          live={unit.isLive}
        />
      }
      key={unit.id}
    >
      {/* Text Content */}
      {unit.content && (
        <Text className="mt-3 w-full" size="sm">
          {unit.content}
        </Text>
      )}

      {/* Lessons Accordon */}
      <ClassLessonAccordion
        unitId={unit.id}
        list={unit.lessons ? unit.lessons : []}
      />

      <Divider className="mt-6" />

      {/* Controls */}
      <ClassAccordionControl
        unitId={unit.id}
        live={unit.isLive}
        type={ClassAccordionType.Unit}
        openDeleteModal={displayDeleteUnitModal}
        openEditModal={prepareEditUnitModal}
      />
    </Accordion.Item>
  ));

  const onAccordionChange = (state: AccordionState) => {
    let activeUnitIndex = Object.keys(state).find(key => state[key] === true);
    if (activeUnitIndex) {
      if (LESSONS_LISTENER_UNSUBSCROBE) {
        console.log('onSnapshot: lessons - unsubscribe');
        LESSONS_LISTENER_UNSUBSCROBE();
      }

      console.log('onSnapshot: lessons');
      const unit: Unit = unitsList[activeUnitIndex];
      const q = query(lessonsColRef, where('unitId', '==', unit.id));
      LESSONS_LISTENER_UNSUBSCROBE = onSnapshot(q, snapshot => {
        const list: Lesson[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          const lesson = {
            id: doc.id,
            number: data.number,
            title: data.title,
            content: data.content,
            isLive: data.isLive,
            files: [],
          };
          list.push(lesson);
        });

        dispatch(
          classroomActions.fetchLessons({ unitId: unit.id, lessons: list }),
        );
      });
    }
  };

  return (
    <>
      {unitToEdit && (
        <EditUnitModal
          visible={editUnitModalVisible}
          onToggle={setEditUnitModalVisible}
          unitId={unitToEdit.id}
          unitNumber={unitToEdit.number}
          unitTitle={unitToEdit.title}
          unitContent={unitToEdit.content}
        />
      )}
      <Accordion
        className="mt-3 w-full"
        classNames={{
          label: 'text-white text-md py-0',
          content: 'outline outline-1 outline-stone-100',
          icon: 'text-white',
          control: 'bg-stone-800 hover:bg-stone-700',
        }}
        iconPosition="right"
        iconSize={24}
        offsetIcon={true}
        transitionDuration={500}
        onChange={onAccordionChange}
      >
        {renderUnitItems}
      </Accordion>
    </>
  );
}
