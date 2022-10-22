import { Group, Text, Stack, createStyles } from '@mantine/core';
import { PageContainer } from 'app/components/PageContainer/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { CalendarToday } from './components/CalendarToday/Loadable';
import { ClassMeetings } from './components/ClassMeetings';
import { Stats } from './components/Stats/Loadable';

const useStyles = createStyles(theme => ({
  groupDashboard: {
    flexDirection: 'row',

    [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
      flexDirection: 'column',
    },
  },
}));

export function Dashboard() {
  const { classes } = useStyles();
  const { groupDashboard } = classes;

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <PageContainer className="h-full p-0">
        <Group
          align={'baseline'}
          noWrap
          className={`h-full w-full ${groupDashboard}`}
        >
          <Stack
            spacing="lg"
            className="w-full space-y-6 p-6 lg:w-2/3 xl:space-y-0"
          >
            <Text size="lg" weight={'bold'}>
              Dashboard
            </Text>
            <Stats />
            {/* <Todos /> */}
            <ClassMeetings />
          </Stack>
          <div className="flex h-full w-full flex-col bg-white p-6 lg:w-1/3">
            <CalendarToday />
          </div>
        </Group>
      </PageContainer>
    </>
  );
}
