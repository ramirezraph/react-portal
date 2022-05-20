import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  NativeSelect,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { SendClassInviteModal } from 'app/components/SendClassInviteModal/Loadable';
import {
  collection,
  DocumentData,
  DocumentReference,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import * as React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from 'services/firebase';
import { ArrowsUpDown, Menu2, Search, UserPlus } from 'tabler-icons-react';
import { selectClassroom } from '../../slice/selectors';
import { ClassRole } from '../../slice/types';
import { PendingInvitesModal } from './components/PendingInvitesModal/Loadable';
import { PeopleItem } from './components/PeopleItem/Loadable';

interface Props {
  // someProps: string
}

interface People {
  userId: string;
  docRef: DocumentReference<DocumentData>;
}

export function PeopleTab(props: Props) {
  // const { someProps } = props;

  const { activeClass, activeClassRole } = useSelector(selectClassroom);

  const [openedPendingInvite, setOpenedPendingInvite] = useState(false);
  const [openedSendInvite, setOpenedSendInvite] = useState(false);

  const [teachers, setTeachers] = useState<People[]>([]);
  const [students, setStudents] = useState<People[]>([]);

  React.useEffect(() => {
    if (!activeClass?.id) return;

    console.log('onSnapshot: Teachers');

    const q = query(
      collection(db, `classes/${activeClass.id}/people`),
      where('type', '==', ClassRole.Teacher),
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const list: People[] = [];
      querySnapshot.forEach(doc => {
        list.push({
          userId: doc.id,
          docRef: doc.ref,
        });
      });
      setTeachers(list);
    });

    return () => {
      console.log('onSnapshot: Teachers - unsubscribe');
      unsubscribe();
      setTeachers([]);
    };
  }, [activeClass?.id]);

  React.useEffect(() => {
    if (!activeClass?.id) return;

    console.log('onSnapshot: Students');

    const q = query(
      collection(db, `classes/${activeClass.id}/people`),
      where('type', '==', ClassRole.Student),
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const list: People[] = [];
      querySnapshot.forEach(doc => {
        list.push({
          userId: doc.id,
          docRef: doc.ref,
        });
      });
      setStudents(list);
    });

    return () => {
      console.log('onSnapshot: Students - unsubscribe');
      unsubscribe();
      setStudents([]);
    };
  }, [activeClass?.id]);

  return (
    <div className="bg-white p-6">
      <PendingInvitesModal
        visible={openedPendingInvite}
        onToggle={setOpenedPendingInvite}
      />
      <SendClassInviteModal
        visible={openedSendInvite}
        onToggle={setOpenedSendInvite}
      />

      {activeClassRole === ClassRole.Teacher && (
        <Group position="apart">
          <Button
            onClick={() => setOpenedSendInvite(true)}
            color="primary"
            radius="xl"
            leftIcon={<UserPlus size={19} />}
            variant="filled"
            size="md"
          >
            <Text weight={400} size="sm">
              Send Invite
            </Text>
          </Button>

          <Group position="center">
            <Button
              size="sm"
              leftIcon={<Menu2 color="black" size={19} />}
              variant="subtle"
              onClick={() => setOpenedPendingInvite(true)}
            >
              <Text weight={400} color="black">
                Pending Invites
              </Text>
            </Button>
          </Group>
        </Group>
      )}
      <Text
        className={`${
          activeClassRole === ClassRole.Teacher ? 'mt-6' : 'mt-0'
        } text-2xl font-semibold`}
      >
        Teacher
      </Text>
      <Stack spacing="sm" className="w-full">
        {teachers.map((people, index) => (
          <PeopleItem
            key={index}
            userId={people.userId}
            docRef={people.docRef}
            viewOnly={activeClassRole === ClassRole.Student}
          />
        ))}
      </Stack>
      <Text className="mt-6 text-2xl font-semibold">Students</Text>
      <Group position="apart" className="mt-6">
        <Group>
          <Checkbox />
          <NativeSelect
            className="w-48"
            data={['Action', 'React', 'Vue', 'Angular', 'Svelte']}
          />
          <ActionIcon>
            <ArrowsUpDown size={20} />
          </ActionIcon>
        </Group>
        <TextInput placeholder="Search" rightSection={<Search size={15} />} />
        <Stack spacing="sm" className="w-full">
          {students.length === 0 && (
            <Text size="sm" color="gray" className="ml-9">
              No students yet.
            </Text>
          )}
          {students.map((people, index) => (
            <PeopleItem
              key={index}
              userId={people.userId}
              docRef={people.docRef}
              viewOnly={activeClassRole === ClassRole.Student}
            />
          ))}
        </Stack>
      </Group>
    </div>
  );
}
