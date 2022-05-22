import {
  Group,
  Text,
  Button,
  Card,
  Collapse,
  TextInput,
  Stack,
} from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import { ClassRole } from 'app/pages/Class/slice/types';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { classesColRef, db } from 'services/firebase';
import { selectUser } from 'store/userSlice/selectors';
import { Check, X } from 'tabler-icons-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  visible: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export function JoinClassCollapseCard(props: Props) {
  const { visible, onToggle } = props;

  const modals = useModals();

  const { currentUser } = useSelector(selectUser);

  const [classKeyValue, setClassKeyValue] = React.useState('');
  const [classKeyErrorMessage, setClassKeyErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onSubmitClassKey = async () => {
    if (!currentUser?.sub) return;

    if (!classKeyValue.trim()) {
      setClassKeyErrorMessage('Please enter a class key.');
      return;
    }

    setLoading(true);
    setClassKeyErrorMessage('');

    try {
      const q = query(classesColRef, where('inviteCode', '==', classKeyValue));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length <= 0) {
        const failedModal = modals.openModal({
          title: 'No class found.',
          centered: true,
          zIndex: 999,
          closeOnClickOutside: false,
          children: (
            <Stack>
              <Text>
                {' '}
                The class does not exists or class key is no longer active.
              </Text>
              <Button fullWidth onClick={() => modals.closeModal(failedModal)}>
                Ok
              </Button>
            </Stack>
          ),
        });
        return;
      }
      for (const classDoc of querySnapshot.docs) {
        const data = classDoc.data();
        const listOfUsers: string[] = data.usersList;
        if (listOfUsers.includes(currentUser.sub)) {
          const failedModal = modals.openModal({
            title: 'Join failed',
            centered: true,
            zIndex: 999,
            closeOnClickOutside: false,
            children: (
              <Stack>
                <Text>
                  Class:{' '}
                  <span className="font-semibold text-primary">
                    {data.code} - {data.name}
                  </span>
                </Text>
                <Text>You are already in this class.</Text>
                <Button
                  fullWidth
                  onClick={() => modals.closeModal(failedModal)}
                >
                  Ok
                </Button>
              </Stack>
            ),
          });
          return;
        }

        openConfirmJoinModal(
          classDoc.id,
          data.code,
          data.name,
          data.ownerId,
          data.pendingInvites,
          classDoc.ref,
        );
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const openConfirmJoinModal = (
    classId: string,
    classCode: string,
    className: string,
    ownerId: string,
    pendingInvites: string[],
    classDocRef: DocumentReference<DocumentData>,
  ) =>
    modals.openConfirmModal({
      title: `Confirm join`,
      centered: true,
      closeOnClickOutside: false,
      children: (
        <Stack>
          <Text>
            Class:{' '}
            <span className="font-semibold text-primary">
              {classCode} - {className}
            </span>
          </Text>
          <Text size="sm">Click confirm to join this class.</Text>
        </Stack>
      ),
      labels: { confirm: 'Yes, confirm', cancel: 'Cancel' },
      onConfirm: () => confirmJoin(classCode, pendingInvites, classDocRef),
    });

  const confirmJoin = async (
    classCode: string,
    pendingInvites: string[],
    classDocRef: DocumentReference<DocumentData>,
  ) => {
    if (!currentUser?.sub) return;
    const notificationId = uuidv4();
    try {
      showNotification({
        id: notificationId,
        loading: true,
        title: 'In progress',
        message: `Joining a class: ${classCode} ...`,
        autoClose: false,
        disallowClose: true,
      });
      const batches = writeBatch(db);
      batches.set(doc(db, `${classDocRef.path}/people`, currentUser.sub), {
        type: ClassRole.Student,
      });
      batches.update(classDocRef, {
        usersList: arrayUnion(currentUser.sub),
      });

      if (pendingInvites.includes(currentUser.sub)) {
        // delete notifications
        const q = query(
          collection(db, `users/${currentUser.sub}/notifications`),
          where('type', '==', 'ClassInvite'),
          where('classId', '==', classDocRef.id),
        );
        const docSnapshot = await getDocs(q);
        docSnapshot.forEach(doc => {
          console.log('batches delete runs');
          batches.delete(doc.ref);
        });
        batches.update(classDocRef, {
          pendingInvites: arrayRemove(currentUser.sub),
        });
      }

      await batches.commit();

      setClassKeyErrorMessage('');
      setClassKeyValue('');
      onToggle(false);

      updateNotification({
        id: notificationId,
        title: 'Success',
        message: `You have joined ${classCode}.`,
        color: 'green',
        icon: <Check />,
      });
    } catch (e) {
      updateNotification({
        id: notificationId,
        title: 'Failed',
        message: `Failed to join class: ${classCode}`,
        color: 'red',
        icon: <X />,
      });
    }
  };

  return (
    <Collapse
      in={visible}
      transitionDuration={150}
      transitionTimingFunction="linear"
    >
      <Card className="mt-6 p-8">
        <Group direction="column" spacing="sm">
          <Text size="md" className="font-semibold">
            Join a class
          </Text>
          <Text size="sm">
            Ask your teacher for the class key, then enter it here:
          </Text>
          <TextInput
            value={classKeyValue}
            onChange={event => setClassKeyValue(event.currentTarget.value)}
            radius="md"
            className="w-1/2"
            placeholder="Class key"
            error={classKeyErrorMessage}
            size="lg"
          />
          <Group className="mt-6">
            <Button
              loading={loading}
              className="px-12"
              onClick={onSubmitClassKey}
            >
              <Text size="sm" weight={400}>
                Join
              </Text>
            </Button>
            <Button
              variant="subtle"
              color="dark"
              className="h-8 px-12"
              onClick={() => {
                setClassKeyErrorMessage('');
                setClassKeyValue('');
                onToggle(false);
              }}
            >
              <Text size="sm" weight={400}>
                Cancel
              </Text>
            </Button>
          </Group>
        </Group>
      </Card>
    </Collapse>
  );
}
