import { Box, Button, Group, Skeleton, Text } from '@mantine/core';
import { PageContainer } from 'app/components/PageContainer/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { CardColor } from '../Classes/components/ClassCard';
import { ClassCard } from '../Classes/components/ClassCard/Loadable';
import { selectClasses } from '../Classes/slice/selectors';
import { Class as IClass } from '../Classes/slice/types';
import { ClassTabs } from './components/ClassTabs/Loadable';
import { ClassUnitAccordion } from './components/ClassUnitAccordion/Loadable';
import { useClassroomSlice } from './slice';
import { selectClassroom } from './slice/selectors';
import { Unit } from './slice/types';

export function Class() {
  let { id } = useParams();

  const { actions } = useClassroomSlice();
  const dispatch = useDispatch();
  const classroom = useSelector(selectClassroom);
  const classes = useSelector(selectClasses);

  const [openedClass, setOpenedClass] = React.useState<IClass | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);

    const fetchClassData = () => {
      if (!id) return;
      const search = classes.classes.find(c => c.id === id);
      if (!search) return;

      setOpenedClass(search);
    };

    fetchClassData();
    setLoading(false);
  }, [classes.classes, id]);

  const [unitsList, setUnitsList] = React.useState<Unit[]>([]);

  React.useEffect(() => {
    dispatch(actions.fetchUnits());
  }, [actions, dispatch]);

  React.useEffect(() => {
    setUnitsList(classroom.units);
  }, [classroom]);

  return (
    <>
      <Helmet>
        <title>Class Code</title>
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
                    <ClassUnitAccordion units={unitsList} />
                    <Button className="mt-2" color="primary">
                      <Text size="sm" weight={400}>
                        Add new unit
                      </Text>
                    </Button>
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
