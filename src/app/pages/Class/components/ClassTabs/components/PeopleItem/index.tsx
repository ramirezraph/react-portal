import { Group, Avatar, ActionIcon, Text, Checkbox } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import {
  arrayRemove,
  doc,
  DocumentData,
  DocumentReference,
  writeBatch,
} from 'firebase/firestore';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { db } from 'services/firebase';
import { selectUser } from 'store/userSlice/selectors';
import { Check, Mail, UserCircle, UserX, X } from 'tabler-icons-react';
import { getNameAndPicture } from 'utils/userUtils';
import { v4 as uuidv4 } from 'uuid';

interface Prop {
  userId: string;
  docRef: DocumentReference<DocumentData>;
  viewOnly?: boolean;
}

export function PeopleItem(props: Prop) {
  const { userId, docRef, viewOnly } = props;
  const modals = useModals();

  const { currentUser } = useSelector(selectUser);

  const [fullname, setFullname] = React.useState('');
  const [picture, setPicture] = React.useState('');

  const [isCurrentUser, setIsCurrentUser] = React.useState(false);

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

    if (userId === currentUser?.sub) {
      setIsCurrentUser(true);
    }

    return () => {
      setFullname('');
      setPicture('');
    };
  }, [currentUser?.sub, userId]);

  const openConfirmRemoveUserModal = () => {
    modals.openConfirmModal({
      title: `Kick ${fullname}?`,
      centered: true,
      confirmProps: { color: 'red' },
      zIndex: 999,
      trapFocus: true,
      closeOnClickOutside: false,
      children: (
        <div className="pb-3">
          <Text size="sm">
            Are you sure you want to remove this user from the class?
          </Text>
        </div>
      ),
      labels: { confirm: 'Remove user', cancel: "No, don't remove" },
      onConfirm: () => onRemoveUser(),
    });
  };

  const onRemoveUser = async () => {
    const notificationId = uuidv4();

    try {
      showNotification({
        id: notificationId,
        loading: true,
        title: 'In progress',
        message: `Removing ${fullname} ...`,
        autoClose: false,
        disallowClose: true,
      });

      const batch = writeBatch(db);
      // delete the user from usersList
      const classId = docRef.parent.path.split('/')[1];
      const classDocRef = doc(db, 'classes', classId);
      batch.update(classDocRef, {
        usersList: arrayRemove(userId),
      });
      // remove the user from people collection
      batch.delete(docRef);
      await batch.commit();

      updateNotification({
        id: notificationId,
        title: 'Success',
        message: `${fullname} has been removed.`,
        color: 'green',
        icon: <Check />,
      });
    } catch (e) {
      updateNotification({
        id: notificationId,
        title: 'Failed',
        message: `Failed to remove ${fullname}.`,
        color: 'red',
        icon: <X />,
      });
    }
  };

  return (
    <Group position="apart" className="mt-4 w-full">
      <Group>
        {!viewOnly && <Checkbox />}
        <Avatar radius="xl" src={picture} size="md" />
        <Text size="md">{fullname}</Text>
      </Group>
      {isCurrentUser && (
        <Text size="sm" color="gray" className="w-12 italic">
          you
        </Text>
      )}
      {!isCurrentUser && (
        <Group>
          <ActionIcon>
            <Mail />
          </ActionIcon>
          <ActionIcon>
            <UserCircle />
          </ActionIcon>
          {!viewOnly && (
            <ActionIcon onClick={openConfirmRemoveUserModal}>
              <UserX />
            </ActionIcon>
          )}
        </Group>
      )}
    </Group>
  );
}
