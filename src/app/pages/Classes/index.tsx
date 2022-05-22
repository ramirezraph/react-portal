import { PageContainer } from 'app/components/PageContainer/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Button,
  Group,
  LoadingOverlay,
  Menu,
  Modal,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import {
  Calendar,
  Check,
  Link,
  Plus,
  Qrcode,
  ShieldLock,
  X,
} from 'tabler-icons-react';
import { CardColor, ClassCard } from '../../components/ClassCard';
import { useNavigate } from 'react-router-dom';
import { JoinClassCollapseCard } from './components/JoinClassCollapseCard';
import { CreateClassModal } from '../../components/CreateClassModal/Loadable';
import { useSelector } from 'react-redux';
import { selectClasses } from './slice/selectors';
import { Class } from './slice/types';
import { QrReader } from 'react-qr-reader';
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
import { classesColRef, db } from 'services/firebase';
import { selectUser } from 'store/userSlice/selectors';
import { ClassRole } from '../Class/slice/types';
import { useModals } from '@mantine/modals';
import { v4 as uuidv4 } from 'uuid';
import { showNotification, updateNotification } from '@mantine/notifications';

export function Classes() {
  const navigate = useNavigate();
  const modals = useModals();

  const { currentUser } = useSelector(selectUser);

  const [joinClassVisible, setJoinClassVisible] = React.useState(false);
  const [createClassVisible, setCreateClassVisible] = React.useState(false);
  const [modalScanQrCodeVisible, setModalScanQrCodeVisible] =
    React.useState(false);
  const [qrCodeLoading, setQrCodeLoading] = React.useState(false);
  const [classes, setClasses] = React.useState<Class[]>([]);

  const classesSlice = useSelector(selectClasses);

  React.useEffect(() => {
    setClasses(classesSlice.classes);
  }, [classesSlice]);

  const onCaptureResult = async (classKey: string) => {
    if (!currentUser?.sub) return;

    try {
      setQrCodeLoading(true);
      const q = query(classesColRef, where('inviteCode', '==', classKey));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length <= 0) {
        const failedModal = modals.openModal({
          title: 'Join failed',
          centered: true,
          zIndex: 999,
          closeOnClickOutside: false,
          children: (
            <Stack>
              <Text>
                The class either does not exists or the QR code is no longer
                active.
              </Text>
              <Button fullWidth onClick={() => modals.closeModal(failedModal)}>
                Ok
              </Button>
            </Stack>
          ),
        });
        setQrCodeLoading(false);
        return;
      }
      for (const classDoc of querySnapshot.docs) {
        // check if user already in usersList
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
          setQrCodeLoading(false);
          return;
        }

        setQrCodeLoading(false);
        setModalScanQrCodeVisible(false);
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
      setQrCodeLoading(false);
      console.error('Scan QR failed', e);
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

      updateNotification({
        id: notificationId,
        title: 'Success',
        message: `You have joined ${classCode}.`,
        color: 'green',
        icon: <Check />,
      });

      setQrCodeLoading(false);
      setModalScanQrCodeVisible(false);
    } catch (e) {
      setQrCodeLoading(false);
      console.error('Scan QR failed', e);
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
    <>
      <Helmet>
        <title>Classes</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <Modal
        opened={modalScanQrCodeVisible}
        onClose={() => setModalScanQrCodeVisible(false)}
        title="Scan a QR Code"
        centered
        closeOnClickOutside={false}
        closeOnEscape={false}
        trapFocus={true}
        size={700}
      >
        <LoadingOverlay visible={qrCodeLoading} />
        <QrReader
          onResult={result => {
            if (result) {
              onCaptureResult(result.getText());
            }
          }}
          constraints={{ facingMode: 'user' }}
          className="my-0 py-0"
        />
      </Modal>
      <CreateClassModal
        visible={createClassVisible}
        onToggle={setCreateClassVisible}
      />
      <PageContainer>
        <Text className="text-lg" weight={'bold'}>
          Classes
        </Text>
        <Group spacing={'xs'} className="mt-3">
          <Button
            leftIcon={<Calendar size={19} color="gray" />}
            color="gray"
            variant="default"
            size="md"
            onClick={() => navigate('/calendar')}
          >
            <Text size="sm" weight={400} color="black">
              Calendar
            </Text>
          </Button>
          <Menu
            size="lg"
            control={
              <Button
                leftIcon={<Link size={19} color="gray" />}
                color="gray"
                variant="default"
                size="md"
              >
                <Text size="sm" weight={400} color="black">
                  Join class
                </Text>
              </Button>
            }
          >
            <Menu.Label>How would you like to join?</Menu.Label>
            <Menu.Item
              icon={<ShieldLock size={18} />}
              onClick={() => setJoinClassVisible(o => !o)}
            >
              Enter a class key
            </Menu.Item>
            <Menu.Item
              icon={<Qrcode size={18} />}
              onClick={() => setModalScanQrCodeVisible(o => !o)}
            >
              Scan a QR Code
            </Menu.Item>
          </Menu>
          <Button
            leftIcon={<Plus size={19} color="gray" />}
            color="gray"
            variant="default"
            size="md"
            onClick={() => setCreateClassVisible(true)}
          >
            <Text size="sm" weight={400} color="black">
              Create class
            </Text>
          </Button>
        </Group>
        <JoinClassCollapseCard
          visible={joinClassVisible}
          onToggle={setJoinClassVisible}
        />
        <SimpleGrid
          cols={3}
          breakpoints={[
            { maxWidth: 1300, cols: 2 },
            { maxWidth: 820, cols: 1 },
          ]}
          className="mt-6"
        >
          {/* @Todo: Use map*/}
          {classes.map(c => (
            <ClassCard
              key={c.id}
              id={c.id}
              classTitle={c.name}
              classCode={c.code}
              teacherId={c.ownerId}
              color={CardColor.Sky}
            />
          ))}
        </SimpleGrid>
      </PageContainer>
    </>
  );
}
