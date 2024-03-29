import {
  Text,
  Button,
  Group,
  ActionIcon,
  Chips,
  Chip,
  Menu,
  Switch,
  useMantineTheme,
} from '@mantine/core';
import { Video, Settings } from 'tabler-icons-react';
import * as React from 'react';
import { MeetingItem } from './components/MeetingItem/Loadable';
import { useState } from 'react';
import { CreateMeetingModal } from 'app/components/CreateMeetingModal/Loadable';
import { useSelector } from 'react-redux';
import { selectClassroom } from '../../slice/selectors';
import { ClassRole } from '../../slice/types';
import {
  DocumentData,
  DocumentReference,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import { meetingsColRef } from 'services/firebase';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMediaQuery } from '@mantine/hooks';
dayjs.extend(relativeTime);

export interface ClassMeeting {
  id: string;
  classId: string;
  meetingLink: string;
  title: string;
  description: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  createdAt: string;
  updatedAt: string;
  docRef: DocumentReference<DocumentData>;
}

interface Props {
  // someProps: string
}

export function MeetingsTab(props: Props) {
  const [NewMeetingOpened, NewMeetingsetOpened] = useState(false);

  const { activeClassRole, activeClass } = useSelector(selectClassroom);
  const [meetings, setMeetings] = useState<ClassMeeting[]>([]);
  const [fileteredMeetings, setFileteredMeetings] = useState<ClassMeeting[]>(
    [],
  );
  const [filterValue, setFilterValue] = useState('today');
  const [isPastMeetingsVisible, setPastMeetingsVisible] = useState(false);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  React.useEffect(() => {
    if (!activeClass?.id) return;

    console.log('onSnapshot: meetings');

    let q = query(
      meetingsColRef,
      where('classId', '==', activeClass.id),
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
        where('classId', '==', activeClass.id),
        orderBy('date', 'asc'),
        orderBy('timeStart', 'asc'),
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay),
      );
    } else if (filterValue === 'week') {
      let start = dayjs().startOf('week').toDate();
      let end = dayjs().endOf('week').toDate();

      const startOfDay = Timestamp.fromDate(start);
      const endOfDay = Timestamp.fromDate(end);

      q = query(
        meetingsColRef,
        where('classId', '==', activeClass.id),
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

      setMeetings(meetings);
    });

    return () => {
      console.log('onSnapshot: meetings - unsubscribe');
      unsubscribe();
    };
  }, [activeClass?.id, filterValue]);

  React.useEffect(() => {
    if (!activeClass?.id) return;

    if (isPastMeetingsVisible) {
      setFileteredMeetings(meetings);
      return;
    }

    const filterPastMeetings = meetings.filter(
      item => new Date(item.timeEnd) >= new Date(),
    );
    setFileteredMeetings(filterPastMeetings);

    return () => {
      setFileteredMeetings([]);
    };
  }, [activeClass?.id, isPastMeetingsVisible, meetings]);

  return (
    <div className="bg-white p-6">
      <CreateMeetingModal
        visible={NewMeetingOpened}
        onToggle={NewMeetingsetOpened}
      />
      <Group>
        {activeClassRole === ClassRole.Teacher && (
          <Button
            onClick={() => NewMeetingsetOpened(true)}
            color="primary"
            radius="xl"
            size="md"
            leftIcon={<Video size={20} />}
          >
            <Text weight={400} size="sm">
              New Meeting
            </Text>
          </Button>
        )}

        {!isMobile && (
          <Group
            className={activeClassRole === ClassRole.Teacher ? 'ml-auto' : ''}
          >
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
              <Chip value="all">All Meetings</Chip>
            </Chips>
          </Group>
        )}
      </Group>
      <Group className="py-6 px-2">
        <Text size="lg" weight={500}>
          Class meetings
        </Text>
        {activeClassRole === ClassRole.Teacher && (
          <Group className="ml-auto">
            <Menu
              size={250}
              closeOnItemClick={false}
              closeOnScroll={false}
              control={
                <ActionIcon variant="hover">
                  <Settings size={28} />
                </ActionIcon>
              }
            >
              {isMobile && <Menu.Label>Filter</Menu.Label>}
              {isMobile && (
                <Menu.Item>
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
                    <Chip value="all">All Meetings</Chip>
                  </Chips>
                </Menu.Item>
              )}
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item>
                <Switch
                  checked={isPastMeetingsVisible}
                  onChange={event =>
                    setPastMeetingsVisible(event.currentTarget.checked)
                  }
                  label="Show past meetings"
                />
              </Menu.Item>
            </Menu>
          </Group>
        )}
      </Group>
      <Group>
        {fileteredMeetings.length === 0 && filterValue === 'all' && (
          <Text size="sm" className="p-2 italic">
            Wohoo! no meeting on this class.
          </Text>
        )}
        {fileteredMeetings.length === 0 && filterValue === 'today' && (
          <Text size="sm" className="p-2 italic">
            Wohoo! no meeting today.
          </Text>
        )}
        {fileteredMeetings.length === 0 && filterValue === 'week' && (
          <Text size="sm" className="p-2 italic">
            Wohoo! no meeting this week.
          </Text>
        )}
        {fileteredMeetings.length > 0 &&
          fileteredMeetings.map((meeting, index) => (
            <MeetingItem
              key={index}
              shouldShowDescription={true}
              meeting={meeting}
              viewOnly={activeClassRole === ClassRole.Student}
            />
          ))}
      </Group>
    </div>
  );
}
