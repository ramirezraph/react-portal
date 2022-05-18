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
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import * as React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from 'services/firebase';
import { ArrowsUpDown, Menu2, Search, UserPlus } from 'tabler-icons-react';
import { selectClassroom } from '../../slice/selectors';
import { PendingInvitesModal } from './components/PendingInvitesModal/Loadable';
import { PeopleItem } from './components/PeopleItem/Loadable';

interface Props {
  // someProps: string
}

export function PeopleTab(props: Props) {
  // const { someProps } = props;

  const { activeClass } = useSelector(selectClassroom);

  const [openedPendingInvite, setOpenedPendingInvite] = useState(false);
  const [openedSendInvite, setOpenedSendInvite] = useState(false);

  const [teachers, setTeachers] = useState<string[]>([]);
  const [students, setStudents] = useState<string[]>([]);

  React.useEffect(() => {
    if (!activeClass?.id) return;

    console.log('onSnapshot: Teachers');

    const q = query(
      collection(db, `classes/${activeClass.id}/people`),
      where('type', '==', 'teacher'),
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const list: string[] = [];
      querySnapshot.forEach(doc => {
        list.push(doc.id);
      });
      setTeachers(list);
    });

    return () => {
      console.log('onSnapshot: Teachers - unsubscribe');
      unsubscribe();
    };
  }, [activeClass?.id]);

  React.useEffect(() => {
    if (!activeClass?.id) return;

    console.log('onSnapshot: Students');

    const q = query(
      collection(db, `classes/${activeClass.id}/people`),
      where('type', '==', 'students'),
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const list: string[] = [];
      querySnapshot.forEach(doc => {
        list.push(doc.id);
      });
      setStudents(list);
    });

    return () => {
      console.log('onSnapshot: Students - unsubscribe');
      unsubscribe();
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
      <Text className="mt-6 text-2xl font-semibold">Teacher</Text>
      <Stack spacing="sm" className="w-full">
        {teachers.map((id, index) => (
          <PeopleItem key={index} userId={id} />
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
          {students.map((id, index) => (
            <PeopleItem key={index} userId={id} />
          ))}
        </Stack>
      </Group>
    </div>
  );
}
