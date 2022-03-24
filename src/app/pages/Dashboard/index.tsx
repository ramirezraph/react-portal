import { Button, Container, Group, Text } from '@mantine/core';
import { PageContainer } from 'app/components/PageContainer/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff } from 'tabler-icons-react';

import FullCalendar from '@fullcalendar/react'; // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid';

import '@fullcalendar/daygrid/main.css';

import './components/custom-fullcalendar.css';

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
            <Group noWrap position="apart">
              <Text size="xl" className="font-semibold">
                Calendar
              </Text>
              <Button
                size="sm"
                leftIcon={<EyeOff size={16} />}
                color={'gray'}
                variant="subtle"
              >
                Hide
              </Button>
            </Group>
            <div className="flex-1">
              <FullCalendar
                height={'100%'}
                plugins={[timeGridPlugin]}
                initialView="timeGridDay"
                allDaySlot={false}
                headerToolbar={false}
                dayHeaders={true}
              />
            </div>
          </div>
        </Group>
      </PageContainer>
    </>
  );
}
