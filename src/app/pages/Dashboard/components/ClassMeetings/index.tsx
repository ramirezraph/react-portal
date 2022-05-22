import * as React from 'react';
import { ClassMeeting } from 'app/pages/Class/components/ClassTabs/MeetingsTab';
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
import { MeetingItem } from 'app/pages/Class/components/ClassTabs/components/MeetingItem/Loadable';
import {
  ActionIcon,
  Button,
  Chip,
  Chips,
  Group,
  Menu,
  Stack,
  Text,
} from '@mantine/core';
import { ChevronDown, InfoCircle } from 'tabler-icons-react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export function ClassMeetings() {
  const [allMeetings, setAllMeetings] = React.useState<ClassMeeting[]>([]);
  const [filterValue, setFilterValue] = React.useState('today');

  const { classes } = useSelector(selectClasses);

  const getClassesIds = React.useMemo(() => {
    return classes.map(x => x.id);
  }, [classes]);

  React.useEffect(() => {
    if (getClassesIds.length <= 0) return;

    console.log('onSnapshot: all meetings');
    let q = query(
      meetingsColRef,
      where('classId', 'in', getClassesIds),
      orderBy('date', 'asc'),
      orderBy('timeStart', 'asc'),
    );

    if (filterValue === 'today') {
      let start = dayjs().startOf('day').toDate();
      let end = dayjs().endOf('day').toDate();

      const startOfDay = Timestamp.fromDate(start);
      const endOfDay = Timestamp.fromDate(end);

      q = query(
        meetingsColRef,
        where('classId', 'in', getClassesIds),
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay),
        orderBy('date', 'asc'),
        orderBy('timeStart', 'asc'),
      );
    } else if (filterValue === 'week') {
      let start = dayjs().startOf('week').toDate();
      let end = dayjs().endOf('week').toDate();

      const startOfDay = Timestamp.fromDate(start);
      const endOfDay = Timestamp.fromDate(end);

      q = query(
        meetingsColRef,
        where('classId', 'in', getClassesIds),
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay),
        orderBy('date', 'asc'),
        orderBy('timeStart', 'asc'),
      );
    }

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
      console.log('onSnapshot: all meetings - unsubscribe');
      unsubscribe();
    };
  }, [filterValue, getClassesIds]);

  return (
    <Stack spacing="sm">
      <Group>
        <Text size="lg" className="-mr-2">
          Class Meetings
        </Text>
        <ActionIcon>
          <InfoCircle size={16} />
        </ActionIcon>
      </Group>
      <Group position="apart">
        <Chips
          value={filterValue}
          onChange={setFilterValue}
          multiple={false}
          color="primary"
          variant="filled"
          spacing={5}
          size="sm"
        >
          <Chip value="today">Today</Chip>
          <Chip value="week">This Week</Chip>
        </Chips>
        <Menu
          className="ml-auto"
          control={
            <Button
              variant="subtle"
              color="dark"
              rightIcon={<ChevronDown size={20} />}
            >
              <Text size="sm" weight={'normal'}>
                Filter by Class
              </Text>
            </Button>
          }
        >
          <Menu.Item>CPE 403</Menu.Item>
          <Menu.Item>CPE 401</Menu.Item>
        </Menu>
      </Group>

      <Stack className="w-full drop-shadow-md">
        <Text size="sm" className="p-2 italic">
          No meeting found.
        </Text>
        {allMeetings.length > 0 &&
          allMeetings.map((meeting, index) => (
            <MeetingItem
              key={index}
              shouldShowDescription={true}
              meeting={meeting}
              viewOnly
            />
          ))}
      </Stack>
    </Stack>
  );
}
