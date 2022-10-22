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
import { useDispatch, useSelector } from 'react-redux';
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
import { Book, Books, ChevronDown, InfoCircle } from 'tabler-icons-react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useDashboardSlice } from '../../slice';
dayjs.extend(relativeTime);

export function ClassMeetings() {
  const [allMeetings, setAllMeetings] = React.useState<ClassMeeting[]>([]);
  const [filterValue, setFilterValue] = React.useState('day');
  const [classFilterValue, setClassFilterValue] = React.useState<{
    classCode: string;
    classId: string;
  } | null>(null);

  const { classes } = useSelector(selectClasses);
  const { actions } = useDashboardSlice();
  const dispatch = useDispatch();

  const getClassesIds = React.useMemo(() => {
    return classes.map(x => x.id);
  }, [classes]);

  const getClassCodes = React.useMemo(() => {
    return classes.map(x => {
      return {
        classCode: x.code,
        classId: x.id,
      };
    });
  }, [classes]);

  React.useEffect(() => {
    if (getClassesIds.length <= 0) return;

    console.log('onSnapshot: all meetings');

    const dayOrWeek = filterValue === 'day' ? 'day' : 'week';
    let start = dayjs().startOf(dayOrWeek).toDate();
    let end = dayjs().endOf(dayOrWeek).toDate();
    const startOfDay = Timestamp.fromDate(start);
    const endOfDay = Timestamp.fromDate(end);

    const orderByParam = [orderBy('date', 'asc'), orderBy('timeStart', 'asc')];
    const whereStartEndParam = [
      where('date', '>=', startOfDay),
      where('date', '<=', endOfDay),
    ];

    let q = query(
      meetingsColRef,
      where('classId', 'in', getClassesIds),
      ...whereStartEndParam,
      ...orderByParam,
    );

    if (classFilterValue) {
      q = query(
        meetingsColRef,
        where('classId', '==', classFilterValue.classId),
        ...whereStartEndParam,
        ...orderByParam,
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

      if (filterValue === 'day' && !classFilterValue) {
        dispatch(actions.setNumberOfTodaysMeetings({ to: meetings.length }));
      }
    });

    return () => {
      console.log('onSnapshot: all meetings - unsubscribe');
      unsubscribe();
    };
  }, [getClassesIds, filterValue, classFilterValue, actions, dispatch]);

  return (
    <Stack spacing="sm" className="w-full">
      <Group>
        <Group>
          <Text size="lg" className="-mr-2">
            Class Meetings
          </Text>
          <ActionIcon>
            <InfoCircle size={16} />
          </ActionIcon>
        </Group>
        <Menu
          className="ml-auto md:hidden"
          control={
            <Button
              variant="subtle"
              color="dark"
              rightIcon={<ChevronDown size={20} />}
            >
              <Text size="sm" weight={'normal'}>
                {classFilterValue ? classFilterValue.classCode : 'All classes'}
              </Text>
            </Button>
          }
        >
          <Menu.Label>Filter</Menu.Label>
          <Menu.Item
            onClick={() => setClassFilterValue(null)}
            icon={<Books size={19} color="gray" />}
          >
            All classes
          </Menu.Item>
          {getClassCodes.map(item => {
            return (
              <Menu.Item
                key={item.classId}
                icon={<Book size={19} color="gray" />}
                onClick={() => setClassFilterValue(item)}
              >
                {item.classCode}
              </Menu.Item>
            );
          })}
        </Menu>
      </Group>
      <Group position="apart" noWrap>
        <Chips
          value={filterValue}
          onChange={setFilterValue}
          multiple={false}
          color="primary"
          variant="filled"
          spacing={5}
          size="sm"
        >
          <Chip value="day">Today</Chip>
          <Chip value="week">This Week</Chip>
        </Chips>
        <Menu
          className="ml-auto hidden md:block"
          control={
            <Button
              variant="subtle"
              color="dark"
              rightIcon={<ChevronDown size={20} />}
            >
              <Text size="sm" weight={'normal'}>
                {classFilterValue ? classFilterValue.classCode : 'All classes'}
              </Text>
            </Button>
          }
        >
          <Menu.Label>Filter</Menu.Label>
          <Menu.Item
            onClick={() => setClassFilterValue(null)}
            icon={<Books size={19} color="gray" />}
          >
            All classes
          </Menu.Item>
          {getClassCodes.map(item => {
            return (
              <Menu.Item
                key={item.classId}
                icon={<Book size={19} color="gray" />}
                onClick={() => setClassFilterValue(item)}
              >
                {item.classCode}
              </Menu.Item>
            );
          })}
        </Menu>
      </Group>

      <Stack className="w-full drop-shadow-md">
        {allMeetings.length === 0 && filterValue === 'day' && (
          <Text size="sm" className="p-2 italic">
            You have no meeting for today!
          </Text>
        )}
        {allMeetings.length === 0 && filterValue === 'week' && (
          <Text size="sm" className="p-2 italic">
            You have no meeting for this week!
          </Text>
        )}

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
