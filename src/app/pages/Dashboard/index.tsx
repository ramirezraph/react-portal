import { Group, Text } from '@mantine/core';
import { PageContainer } from 'app/components/PageContainer/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { CalendarToday } from './components/CalendarToday/Loadable';

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
          <div className="w-2/3 p-6">
            <Text size="lg" weight={'bold'}>
              Dashboard
            </Text>
          </div>
          <div className="flex h-full w-1/3 flex-col bg-white p-6">
            <CalendarToday />
          </div>
        </Group>
      </PageContainer>
    </>
  );
}
