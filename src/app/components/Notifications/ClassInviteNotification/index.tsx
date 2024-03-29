import { Button, Group, Stack, Text } from '@mantine/core';
import { UserAvatar } from 'app/components/UserAvatar/Loadable';
import * as React from 'react';
import { getNameAndPicture } from 'utils/userUtils';
import { getClassNameAndCode } from 'utils/classUtils';
import { ClassInviteResult } from 'store/userSlice/types';
import { useSelector } from 'react-redux';
import { selectUser } from 'store/userSlice/selectors';
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from 'services/firebase';
import { showNotification } from '@mantine/notifications';
import { Check, X } from 'tabler-icons-react';
import { ClassRole } from 'app/pages/Class/slice/types';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

interface Props {
  id: string;
  fromUserId: string;
  classId: string;
  createdAt: string;
  result?: ClassInviteResult;
}

export function ClassInviteNotification(props: Props) {
  const { id, fromUserId, classId, createdAt, result } = props;

  const { currentUser } = useSelector(selectUser);

  const [fullname, setFullname] = React.useState('');
  const [classInfo, setClassInfo] = React.useState('');

  const [loading, setLoading] = React.useState(false);

  const onAccept = async () => {
    if (!currentUser) return;
    if (!currentUser.sub) return;

    try {
      setLoading(true);
      const batch = writeBatch(db);
      // admit the user to class
      const classDocRef = doc(db, 'classes', classId);
      const classDoc = await getDoc(classDocRef);

      if (!classDoc.exists()) {
        showNotification({
          title: 'Failed',
          message: `Failed to join the class, please refer to your teacher.`,
          color: 'red',
          icon: <X />,
        });
        return;
      }

      batch.update(classDocRef, {
        usersList: arrayUnion(currentUser.sub),
      });
      batch.set(doc(db, `${classDocRef.path}/people`, currentUser.sub), {
        type: ClassRole.Student,
      });
      // remove the user from pending invites
      batch.update(classDocRef, {
        pendingInvites: arrayRemove(currentUser.sub),
      });

      const notificationDocRef = doc(
        db,
        `users/${currentUser.sub}/notifications`,
        id,
      );
      batch.delete(notificationDocRef);
      await batch.commit();

      showNotification({
        title: 'Success',
        message: `You have joined ${classDoc.data().code}`,
        color: 'green',
        icon: <Check />,
      });
    } catch (e) {
      showNotification({
        title: 'Failed',
        message: `Class invite accept failed.`,
        color: 'red',
        icon: <X />,
      });
    } finally {
      setLoading(false);
    }
  };

  const onReject = async () => {
    if (!currentUser) return;
    if (!currentUser.sub) return;

    try {
      setLoading(true);
      const batch = writeBatch(db);
      // remove the user from pending invites
      const classDocRef = doc(db, 'classes', classId);
      batch.update(classDocRef, {
        pendingInvites: arrayRemove(currentUser.sub),
      });
      // update notification
      const notificationDocRef = doc(
        db,
        `users/${currentUser.sub}/notifications`,
        id,
      );
      batch.delete(notificationDocRef);
      await batch.commit();
    } catch (e) {
      showNotification({
        title: 'Failed',
        message: `Class invite reject failed.`,
        color: 'red',
        icon: <X />,
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchInfo = async () => {
      const nameAndPicture = await getNameAndPicture(fromUserId);
      if (nameAndPicture) {
        const { fullname } = nameAndPicture;
        setFullname(fullname);
      }

      const nameAndCode = await getClassNameAndCode(classId);
      if (nameAndCode) {
        const { name, code } = nameAndCode;
        setClassInfo(`${code}: ${name}`);
      }
    };

    fetchInfo();

    return () => {
      setFullname('');
      setClassInfo('');
    };
  }, [classId, fromUserId]);

  return (
    <Group className="items-start py-3" noWrap>
      <UserAvatar userId={fromUserId} size="md" radius="xl" />
      <Stack spacing={5}>
        <Text size="md">{fullname}</Text>

        <Text size="sm">
          invited you to join the class:{' '}
          <span className="font-bold">{classInfo}</span>
        </Text>
        <Text className="text-gray-400" size="xs">
          {dayjs(createdAt).fromNow()}
        </Text>
        {!result && (
          <Group className="mt-3">
            <Button loading={loading} color="primary" onClick={onAccept}>
              <Text size="sm" weight={400}>
                Accept
              </Text>
            </Button>
            <Button loading={loading} color="gray" onClick={onReject}>
              <Text size="sm" weight={400}>
                Decline
              </Text>
            </Button>
          </Group>
        )}
        {result && (
          <Text size="sm" color="gray" className="italic">
            {result}
          </Text>
        )}
      </Stack>
    </Group>
  );
}
