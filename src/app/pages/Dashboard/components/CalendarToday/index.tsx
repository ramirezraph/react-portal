import * as React from 'react';
import { Button, Group, Text } from '@mantine/core';
import { EyeOff } from 'tabler-icons-react';
import FullCalendar from '@fullcalendar/react';

import timeGridPlugin from '@fullcalendar/timegrid';

import '@fullcalendar/daygrid/main.css';

import './custom-fullcalendar.css';

interface Props {}

export function CalendarToday(props: Props) {
  return (
    <>
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
    </>
  );
}
