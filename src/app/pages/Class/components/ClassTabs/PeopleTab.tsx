import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  Menu,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
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
import {
  ArrowsUpDown,
  ChevronDown,
  Mail,
  Menu2,
  Search,
  UserPlus,
  X,
} from 'tabler-icons-react';
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

  const [invitePermValue, setInvitePermValue] = useState('Off');

  const theme = useMantineTheme();
  const isTablet = useMediaQuery(`(min-width: ${theme.breakpoints.md}px)`);

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

  React.useEffect(() => {
    if (activeClass?.permissions['classInvite']) {
      setInvitePermValue(activeClass.permissions['classInvite']);
    }
  }, [activeClass]);

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

      {activeClassRole === ClassRole.Teacher && !isTablet && (
        <Group position="apart">
          <ActionIcon
            onClick={() => setOpenedSendInvite(true)}
            variant="filled"
            size={'xl'}
            radius="xl"
            color="primary"
            disabled={invitePermValue === 'Off'}
          >
            <UserPlus size={19} />
          </ActionIcon>
          <Button
            compact
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
      )}

      {activeClassRole === ClassRole.Teacher && isTablet && (
        <Group position="apart">
          <Button
            onClick={() => setOpenedSendInvite(true)}
            color="primary"
            radius="xl"
            leftIcon={<UserPlus size={19} />}
            variant="filled"
            size="md"
            disabled={invitePermValue === 'Off'}
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
          <Menu
            control={
              <Button
                variant="outline"
                color="gray"
                rightIcon={<ChevronDown size={14} />}
              >
                Actions
              </Button>
            }
          >
            <Menu.Item color="gray" icon={<Mail size={20} />}>
              Send an email
            </Menu.Item>
            <Menu.Item color="red" icon={<X size={20} />}>
              Kick
            </Menu.Item>
          </Menu>
          <ActionIcon>
            <ArrowsUpDown size={20} />
          </ActionIcon>
        </Group>

        {isTablet ? (
          <TextInput placeholder="Search" rightSection={<Search size={15} />} />
        ) : (
          <ActionIcon>
            <Search size={20} />
          </ActionIcon>
        )}

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
