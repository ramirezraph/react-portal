import { Group, Text, Stack, Menu, Textarea } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import {
  doc,
  DocumentData,
  DocumentReference,
  increment,
  writeBatch,
} from 'firebase/firestore';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { db } from 'services/firebase';
import { selectUser } from 'store/userSlice/selectors';
import { X } from 'tabler-icons-react';
import { getFullname } from 'utils/userUtils';
import { UserAvatar } from '../UserAvatar';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

interface Props {
  id: string;
  comment: string;
  ownerId: string;
  createdAt: string;
  docRef: DocumentReference<DocumentData>;
}

export function Comment(props: Props) {
  const { comment, ownerId, createdAt, docRef } = props;

  const modals = useModals();
  const { currentUser } = useSelector(selectUser);

  const [name, setName] = React.useState('');

  React.useEffect(() => {
    const fullname = async () => {
      const fullName = await getFullname(ownerId);
      if (fullName) setName(fullName);
    };

    fullname();
  }, [ownerId]);

  const openConfirmDeleteModal = () => {
    modals.openConfirmModal({
      title: `Delete comment?`,
      centered: true,
      confirmProps: { color: 'red' },
      zIndex: 999,
      trapFocus: true,
      closeOnClickOutside: false,
      children: (
        <div className="pb-3">
          <Text size="sm">Are you sure you want to delete this comment?</Text>
        </div>
      ),
      labels: { confirm: 'Delete', cancel: 'No' },
      onConfirm: () => deleteComment(),
    });
  };

  const deleteComment = async () => {
    try {
      const batch = writeBatch(db);

      const docCollection = docRef.parent.path.split('/')[0];
      const docId = docRef.parent.path.split('/')[1];

      const postDocRef = doc(db, docCollection, docId);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });
      batch.delete(docRef);

      await batch.commit();
    } catch (e) {
      showNotification({
        title: 'Failed',
        message: `Failed to delete comment. \n${e}`,
        color: 'red',
        icon: <X />,
      });
    }
  };

  return (
    <Group className="w-full items-start" noWrap>
      <UserAvatar userId={ownerId} radius="xl" size="md" />
      <Stack className="w-full" spacing={0}>
        <Group position="apart" className="items-start">
          <Text size="sm" className="font-semibold">
            {name}
          </Text>
          <Group>
            <Text size="xs" weight="normal">
              {dayjs(createdAt).fromNow()}
            </Text>
            {currentUser && currentUser.sub === ownerId && (
              <Menu size="sm">
                <Menu.Item color="red" onClick={openConfirmDeleteModal}>
                  Delete
                </Menu.Item>
              </Menu>
            )}
          </Group>
        </Group>
        <Textarea
          value={comment}
          variant="unstyled"
          readOnly
          autosize
          classNames={{
            input: 'py-0',
          }}
        />
      </Stack>
    </Group>
  );
}
