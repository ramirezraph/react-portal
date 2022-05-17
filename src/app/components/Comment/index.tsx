import { Group, Text, Stack, Menu, Textarea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import {
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  increment,
  updateDoc,
} from 'firebase/firestore';
import moment from 'moment';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { db } from 'services/firebase';
import { selectUser } from 'store/userSlice/selectors';
import { X } from 'tabler-icons-react';
import { getFullname } from 'utils/fullname';
import { UserAvatar } from '../UserAvatar';

interface Props {
  id: string;
  comment: string;
  ownerId: string;
  createdAt: string;
  docRef: DocumentReference<DocumentData>;
}

export function Comment(props: Props) {
  const { comment, ownerId, createdAt, docRef } = props;

  const [name, setName] = React.useState('');

  const { currentUser } = useSelector(selectUser);

  React.useEffect(() => {
    const fullname = async () => {
      const fullName = await getFullname(ownerId);
      if (fullName) setName(fullName);
    };

    fullname();
  }, [ownerId]);

  const deleteComment = async () => {
    try {
      const postId = docRef.parent.path.split('/')[1];
      const postDocRef = doc(db, 'posts', postId);
      await updateDoc(postDocRef, {
        numberOfComments: increment(-1),
      });
      await deleteDoc(docRef);
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
      <UserAvatar radius="xl" size="md" />
      <Stack className="w-full" spacing={0}>
        <Group position="apart" className="items-start">
          <Text size="sm" className="font-semibold">
            {name}
          </Text>
          <Group>
            <Text size="xs" weight="normal">
              {moment(createdAt).fromNow()}
            </Text>
            {currentUser && currentUser.sub === ownerId && (
              <Menu size="sm">
                <Menu.Item color="red" onClick={deleteComment}>
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
