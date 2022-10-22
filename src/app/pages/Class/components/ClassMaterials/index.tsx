import { Box, Button, Group, Skeleton, Text } from '@mantine/core';
import { CreateUnitModal } from 'app/components/CreateUnitModal/Loadable';
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  Query,
  where,
} from 'firebase/firestore';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from 'services/firebase';
import { useClassroomSlice } from '../../slice';
import { selectClassroom } from '../../slice/selectors';
import { ClassRole, Lesson, Unit } from '../../slice/types';
import { ClassUnitAccordion } from '../ClassUnitAccordion/Loadable';

interface Props {}

export function ClassMaterials(props: Props) {
  const dispatch = useDispatch();
  const classroom = useSelector(selectClassroom);
  const { actions: classroomActions } = useClassroomSlice();

  const [loading, setLoading] = React.useState(true);
  const [unitsList, setUnitsList] = React.useState<Unit[]>([]);
  const [createUnitModalVisible, setCreateUnitModalVisible] =
    React.useState(false);

  React.useEffect(() => {
    if (!classroom.unitPath) return;
    setLoading(true);
    console.log('onSnapshot: units');

    let unitsQuery: Query<DocumentData> | undefined = undefined;
    unitsQuery = query(collection(db, classroom.unitPath), orderBy('number'));
    if (classroom.activeClassRole === ClassRole.Student) {
      unitsQuery = query(
        collection(db, classroom.unitPath),
        orderBy('number'),
        where('isLive', '==', true),
      );
    }
    const unsubscribe = onSnapshot(unitsQuery, querySnapshot => {
      const units: Unit[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const unit: Unit = {
          id: doc.id,
          isLive: data.isLive,
          number: data.number,
          title: data.title,
          content: data.textContent,
          lessons: [] as Lesson[],
        };
        units.push(unit);
      });
      dispatch(classroomActions.fetchUnits({ units: units }));
      setLoading(false);
    });

    return () => {
      console.log('onSnapshot: units - unsubsribe');
      unsubscribe();
    };
  }, [
    classroom.activeClassRole,
    classroom.unitPath,
    classroomActions,
    dispatch,
  ]);

  React.useEffect(() => {
    setUnitsList(classroom.units);
  }, [classroom]);

  return (
    <Skeleton visible={loading} className="w-full">
      <Box className="w-full rounded-md bg-white p-4 md:p-6">
        <Text size="sm" weight={'bold'}>
          Class materials
        </Text>
        {unitsList.length > 0 && <ClassUnitAccordion units={unitsList} />}
        {classroom.activeClassRole === ClassRole.Teacher &&
          unitsList.length > 0 && (
            <Button
              className="mt-2"
              color="primary"
              onClick={() => {
                setCreateUnitModalVisible(true);
              }}
            >
              <Text size="sm" weight={400}>
                Add new unit
              </Text>
            </Button>
          )}
        {unitsList.length === 0 && (
          <Group className="mt-3 py-2">
            <Text size="sm" color="gray">
              No unit for this class yet.
            </Text>
            {classroom.activeClassRole === ClassRole.Teacher && (
              <Button
                compact
                variant="subtle"
                size="sm"
                className="px-0"
                onClick={() => {
                  setCreateUnitModalVisible(true);
                }}
              >
                <Text size="sm" color="primary">
                  Create
                </Text>
              </Button>
            )}
          </Group>
        )}

        <CreateUnitModal
          visible={createUnitModalVisible}
          onToggle={setCreateUnitModalVisible}
        />
      </Box>
    </Skeleton>
  );
}
