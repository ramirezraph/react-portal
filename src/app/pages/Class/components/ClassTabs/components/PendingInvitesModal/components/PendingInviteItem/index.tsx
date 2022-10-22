import { Avatar, Button, Group, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { selectClassroom } from 'app/pages/Class/slice/selectors';
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { db } from 'services/firebase';
import { NotificationType } from 'store/userSlice/types';
import { X } from 'tabler-icons-react';
import { getNameAndPicture } from 'utils/userUtils';

interface Prop {
  userId: string;
}

export function PendingInviteItem(props: Prop) {
  const { userId } = props;

  const modals = useModals();
  const { activeClass } = useSelector(selectClassroom);

  const [fullname, setFullname] = React.useState('');
  const [picture, setPicture] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchInfo = async () => {
      const result = await getNameAndPicture(userId);
      if (result) {
        const { fullname, picture } = result;
        setFullname(fullname);
        setPicture(picture);
      }
    };

    fetchInfo();
  }, [userId]);

  const openConfirmCancelModal = () => {
    modals.openConfirmModal({
      title: `Cancel invite?`,
      centered: true,
      confirmProps: { color: 'red' },
      zIndex: 999,
      trapFocus: true,
      closeOnClickOutside: false,
      children: (
        <div className="pb-3">
          <Text size="sm">Are you sure you want to cancel this invite?</Text>
        </div>
      ),
      labels: { confirm: 'Cancel invite', cancel: "No, don't cancel" },
      onConfirm: () => cancelInvite(),
    });
  };

  const cancelInvite = async () => {
    if (!activeClass?.id) return;

    try {
      setLoading(true);

      const q = query(
        collection(db, `users/${userId}/notifications`),
        where('type', '==', NotificationType.ClassInvite),
        where('classId', '==', activeClass.id),
      );
      const notifsSnapshot = await getDocs(q);
      for (const notification of notifsSnapshot.docs) {
        const classDocRef = doc(db, 'classes', activeClass.id);
        updateDoc(classDocRef, {
          pendingInvites: arrayRemove(userId),
        });
        deleteDoc(doc(db, `users/${userId}/notifications`, notification.id));
      }
    } catch (e) {
      showNotification({
        title: 'Failed',
        message: `Cancel invite failed.`,
        color: 'red',
        icon: <X />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Group position="apart" className="mt-3 md:mt-6" noWrap>
      <Group>
        <Avatar radius="xl" src={picture} />
        <Text>{fullname}</Text>
      </Group>
      <Button
        loading={loading}
        color="gray"
        variant="filled"
        onClick={openConfirmCancelModal}
      >
        <Text size="sm" weight={400}>
          Cancel Invite
        </Text>
      </Button>
    </Group>
  );
}
