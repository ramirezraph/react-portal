import { Box, Button, Group, Skeleton, Text } from '@mantine/core';
import { CreateUnitModal } from 'app/components/CreateUnitModal/Loadable';
import { PageContainer } from 'app/components/PageContainer/Loadable';
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  orderBy,
  Query,
  query,
  where,
} from 'firebase/firestore';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { db } from 'services/firebase';
import { selectUser } from 'store/userSlice/selectors';

import { CardColor, ClassCard } from '../../components/ClassCard';
import { selectClasses } from '../Classes/slice/selectors';
import { Class as IClass } from '../Classes/slice/types';
import { ClassTabs } from './components/ClassTabs/Loadable';
import { ClassUnitAccordion } from './components/ClassUnitAccordion/Loadable';
import { useClassroomSlice } from './slice';
import { selectClassroom } from './slice/selectors';
import { ClassRole, Lesson, Unit } from './slice/types';

export function Class() {
  let { id } = useParams();

  const dispatch = useDispatch();
  const classroom = useSelector(selectClassroom);
  const classes = useSelector(selectClasses);
  const { currentUser } = useSelector(selectUser);
  const { actions } = useClassroomSlice();
  const { actions: classroomActions } = useClassroomSlice();

  const [openedClass, setOpenedClass] = React.useState<IClass | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [unitsList, setUnitsList] = React.useState<Unit[]>([]);
  const [createUnitModalVisible, setCreateUnitModalVisible] =
    React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const fetchClassData = () => {
      if (!id) return;
      const search = classes.classes.find(c => c.id === id);
      if (!search) return;

      dispatch(classroomActions.setActiveClass({ activeClass: search }));

      const unitsSubColPath = `classes/${search.id}/units`;
      dispatch(classroomActions.updateUnitPath({ path: unitsSubColPath }));
      setOpenedClass(search);
    };

    fetchClassData();
    setLoading(false);
  }, [classes.classes, classroomActions, dispatch, id]);

  React.useEffect(() => {
    const getUserRole = async () => {
      if (!openedClass?.id) return;
      if (!currentUser?.sub) return;

      const peopleColPath = `classes/${openedClass.id}/people`;
      const docRef = doc(db, peopleColPath, currentUser.sub);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        dispatch(classroomActions.setActiveClassRole({ role: data.type }));
      }
    };

    getUserRole();
  }, [classroomActions, currentUser?.sub, dispatch, openedClass?.id]);

  React.useEffect(() => {
    if (!classroom.unitPath) return;
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
    });

    return () => {
      console.log('onSnapshot: units - unsubsribe');

      unsubscribe();
    };
  }, [
    actions,
    classroom.activeClassRole,
    classroom.unitPath,
    classroomActions,
    dispatch,
  ]);

  React.useEffect(() => {
    setUnitsList(classroom.units);
  }, [classroom]);

  return (
    <>
      <Helmet>
        <title>{openedClass?.code}</title>
      </Helmet>
      <PageContainer>
        {openedClass && (
          <>
            <Text size="lg" weight={'bold'}>
              Class
            </Text>
            <Group noWrap position="apart" className="mt-3 h-full items-start">
              <Group spacing={'md'} className="w-1/3" direction="column">
                <Skeleton visible={loading} className="w-full">
                  <ClassCard
                    id={openedClass.id}
                    classTitle={openedClass.name}
                    classCode={openedClass.code}
                    teacherId={openedClass.ownerId}
                    color={CardColor.Sky}
                  />
                </Skeleton>
                <Skeleton visible={loading} className="w-full">
                  <Box className="w-full rounded-md bg-white p-6">
                    <Text size="sm" weight={'bold'}>
                      Class materials
                    </Text>
                    {unitsList.length > 0 && (
                      <ClassUnitAccordion units={unitsList} />
                    )}
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
              </Group>
              <Skeleton visible={loading} className="w-2/3">
                <ClassTabs />
              </Skeleton>
            </Group>
          </>
        )}
      </PageContainer>
    </>
  );
}
