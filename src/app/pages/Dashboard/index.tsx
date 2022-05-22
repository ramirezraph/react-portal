import { Group, Text, Stack } from '@mantine/core';
import { PageContainer } from 'app/components/PageContainer/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { CalendarToday } from './components/CalendarToday/Loadable';
import { ClassMeetings } from './components/ClassMeetings';
import { Stats } from './components/Stats/Loadable';
import { Todos } from './components/Todos/Loadable';

export function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <PageContainer className="h-full p-0">
        <Group
          direction="row"
          align={'baseline'}
          noWrap
          className="h-full w-full"
        >
          <Stack spacing="lg" className="w-2/3 p-6">
            <Text size="lg" weight={'bold'}>
              Dashboard
            </Text>
            <Stats />
            <Todos />
            <ClassMeetings />
          </Stack>
          <div className="flex h-full w-1/3 flex-col bg-white p-6">
            <CalendarToday />
          </div>
        </Group>
      </PageContainer>
    </>
  );
}
