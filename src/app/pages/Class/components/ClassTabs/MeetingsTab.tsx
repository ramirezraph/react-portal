import { Text, Button, Group, ActionIcon, Chips, Chip } from '@mantine/core';
import { Video, Settings } from 'tabler-icons-react';
import * as React from 'react';
import { MeetingItem } from './components/MeetingItem/Loadable';
import { useState } from 'react';
import { CreateMeetingModal } from 'app/components/CreateMeetingModal/Loadable';
import { useSelector } from 'react-redux';
import { selectClassroom } from '../../slice/selectors';
import { ClassRole } from '../../slice/types';
import {
  collection,
  DocumentData,
  DocumentReference,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from 'services/firebase';

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

  React.useEffect(() => {
    if (!activeClass?.id) return;

    console.log('onSnapshot: meetings');

    const q = query(
      collection(db, `classes/${activeClass.id}/meetings`),
      orderBy('date', 'desc'),
      orderBy('timeStart', 'desc'),
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
      console.log('meetings', meetings);

      setMeetings(meetings);
    });

    return () => {
      console.log('onSnapshot: meetings - unsubscribe');
      unsubscribe();
    };
  }, [activeClass?.id]);

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

        <Group
          className={activeClassRole === ClassRole.Teacher ? 'ml-auto' : ''}
        >
          <Chips color="violet" variant="filled" spacing={5} size="sm">
            <Chip value={'today'}>Today</Chip>
            <Chip value={'week'}>This Week</Chip>
            <Chip value={'all'}>All Meetings</Chip>
          </Chips>
        </Group>
      </Group>
      <Group className="py-6 px-2">
        <Text size="lg" weight={500}>
          Class meetings
        </Text>
        {activeClassRole === ClassRole.Teacher && (
          <Group className="ml-auto">
            <ActionIcon variant="hover">
              <Settings size={28} />
            </ActionIcon>
          </Group>
        )}
      </Group>
      <Group>
        {meetings.length > 0 &&
          meetings.map((meeting, index) => (
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
