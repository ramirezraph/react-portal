import { Box, Button, Group, Text } from '@mantine/core';
import { PageContainer } from 'app/components/PageContainer/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

import { CardColor } from '../Classes/components/ClassCard';
import { ClassCard } from '../Classes/components/ClassCard/Loadable';
import { ClassTabs } from './components/ClassTabs/Loadable';
import { ClassUnitAccordion } from './components/ClassUnitAccordion/Loadable';
import { useClassroomSlice } from './slice';
import { selectClassroom } from './slice/selectors';
import { Unit } from './slice/types';

export function Class() {
  const { actions } = useClassroomSlice();

  const dispatch = useDispatch();

  const classroom = useSelector(selectClassroom);

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
        <Text size="lg" weight={'bold'}>
          Class
        </Text>
        <Group noWrap position="apart" className="mt-3 h-full items-start">
          <Group spacing={'md'} className="w-1/3" direction="column">
            <ClassCard
              classTitle="Python Programmins"
              classCode="CPE 401"
              teacherName="Guido van Rossum"
              color={CardColor.Sky}
            />
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
          </Group>
          <ClassTabs />
        </Group>
      </PageContainer>
    </>
  );
}
