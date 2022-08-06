import * as React from 'react';
import { Group, Text } from '@mantine/core';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import '@fullcalendar/daygrid/main.css';
import './custom-fullcalendar.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import { meetingsColRef } from 'services/firebase';
import { useSelector } from 'react-redux';
import { selectClasses } from 'app/pages/Classes/slice/selectors';
import { ClassMeeting } from 'app/pages/Class/components/ClassTabs/MeetingsTab';
import { useEffect } from 'react';
dayjs.extend(relativeTime);

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}

interface Props {}

export function CalendarToday(props: Props) {
  const { classes } = useSelector(selectClasses);

  const [allMeetings, setAllMeetings] = React.useState<ClassMeeting[]>([]);
  const [events, setEvents] = React.useState<CalendarEvent[]>([]);

  const getClassesIds = React.useMemo(() => {
    return classes.map(x => x.id);
  }, [classes]);

  React.useEffect(() => {
    if (getClassesIds.length <= 0) return;

    let start = dayjs().startOf('day').toDate();
    let end = dayjs().endOf('day').toDate();

    const startOfDay = Timestamp.fromDate(start);
    const endOfDay = Timestamp.fromDate(end);

    const q = query(
      meetingsColRef,
      where('classId', 'in', getClassesIds),
      where('date', '>=', startOfDay),
      where('date', '<=', endOfDay),
      orderBy('date', 'asc'),
      orderBy('timeStart', 'asc'),
    );

    const unsubscribe = onSnapshot(q, querySnapshot => {
      const meetings: ClassMeeting[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const meeting = {
          id: doc.id,
          classId: data.classId,
          meetingLink: data.meetingLink,
          title: data.title,
          description: data.description,
          date: data.date && data.date.toDate().toISOString(),
          timeStart: data.timeStart && data.timeStart.toDate().toISOString(),
          timeEnd: data.timeEnd && data.timeEnd.toDate().toISOString(),
          createdAt: data.createdAt && data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt && data.updatedAt.toDate().toISOString(),
          docRef: doc.ref,
        };
        meetings.push(meeting);
      });
      setAllMeetings(meetings);
    });

    return () => {
      unsubscribe();
    };
  }, [getClassesIds]);

  useEffect(() => {
    const list: CalendarEvent[] = [];
    allMeetings.forEach(meeting => {
      const e: CalendarEvent = {
        id: meeting.id,
        title: meeting.title,
        start: meeting.timeStart,
        end: meeting.timeEnd,
      };
      list.push(e);
    });

    setEvents(list);
  }, [allMeetings]);

  return (
    <>
      <Group noWrap position="apart">
        <Text size="xl" className="font-semibold">
          Calendar
        </Text>
        {/* <Button
          size="sm"
          leftIcon={<EyeOff size={16} />}
          color={'gray'}
          variant="subtle"
        >
          Hide
        </Button> */}
      </Group>
      <div className="flex-1">
        <FullCalendar
          height={'100%'}
          plugins={[timeGridPlugin]}
          initialView="timeGridDay"
          allDaySlot={false}
          headerToolbar={false}
          dayHeaders={true}
          events={events}
        />
      </div>
    </>
  );
}
