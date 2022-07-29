import {
  Group,
  Text,
  Tabs,
  Stack,
  Button,
  Divider,
  Drawer,
  NativeSelect,
  TextInput,
  ActionIcon,
  Image,
  ScrollArea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import { ClassCard, CardColor } from 'app/components/ClassCard';
import {
  arrayRemove,
  doc,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { db } from 'services/firebase';
import { selectUser } from 'store/userSlice/selectors';
import {
  Check,
  Copy,
  Download,
  Messages,
  Pencil,
  Qrcode,
  Settings,
  Users,
  X,
} from 'tabler-icons-react';
import { v4 as uuidv4 } from 'uuid';
import { selectClassroom } from '../../slice/selectors';
import { ClassRole } from '../../slice/types';
import QRCode from 'qrcode';
import { saveAs } from 'file-saver';

interface Props {
  visible: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
  // class
  id: string;
  classTitle: string;
  classCode: string;
  classShortDescription: string;
  ownerId: string;
  inviteCode: string;
  permissions: Map<String, String>;
}

export function SettingsDrawer(props: Props) {
  const {
    visible,
    onToggle,
    id,
    classTitle,
    classCode,
    classShortDescription,
    ownerId,
    inviteCode,
    permissions,
  } = props;

  const modals = useModals();
  const navigate = useNavigate();

  const { currentUser } = useSelector(selectUser);
  const { activeClassRole } = useSelector(selectClassroom);
  const [classInviteCode, setClassInviteCode] = React.useState('');
  const [generateCodeLoading, setGenerateCodeLoading] = React.useState(false);
  const [qrCodeImageUrl, setQrCodeImageUrl] = React.useState('');
  const [postAndCommentsPermValue, setPostAndCommentsPermValue] =
    React.useState('');
  const [classInvitePermValue, setClassInvitePermValue] = React.useState('');

  React.useEffect(() => {
    setClassInviteCode(inviteCode);
  }, [inviteCode]);

  React.useEffect(() => {
    if (permissions['postAndComment']) {
      setPostAndCommentsPermValue(permissions['postAndComment']);
    }

    if (permissions['classInvite']) {
      setClassInvitePermValue(permissions['classInvite']);
    }
  }, [permissions]);

  const isClassOwner = React.useMemo(() => {
    if (currentUser?.sub) {
      return currentUser.sub === ownerId;
    } else {
      return false;
    }
  }, [currentUser?.sub, ownerId]);

  const classGeneralForm = useForm({
    initialValues: {
      className: '',
      classCode: '',
      shortDescription: '',
    },

    validate: {
      className: value => (value.length > 0 ? null : 'Class name is required'),
      classCode: value => (value.length > 0 ? null : 'Class code is required'),
    },
  });
  type ClassGeneralFormValuesType = typeof classGeneralForm.values;

  const openConfirmUpdateModal = (values: ClassGeneralFormValuesType) =>
    modals.openConfirmModal({
      title: 'Submit changes?',
      centered: true,
      zIndex: 999,
      children: (
        <Text size="sm">
          Are you sure you want to update the class information?
        </Text>
      ),
      labels: { confirm: 'Yes', cancel: 'No' },
      onConfirm: () => onSubmitUpdate(values),
    });

  const onSubmitUpdate = (values: ClassGeneralFormValuesType) => {
    const notificationId = uuidv4();
    showNotification({
      id: notificationId,
      loading: true,
      title: 'In progress',
      message: `Updating class information ...`,
      autoClose: false,
      disallowClose: true,
    });

    const classDocRef = doc(db, 'classes', id);
    updateDoc(classDocRef, {
      name: values.className,
      code: values.classCode,
      shortDescription: values.shortDescription,
      updatedAt: serverTimestamp(),
    })
      .then(() => {
        updateNotification({
          id: notificationId,
          title: 'Success',
          message: `Class information updated successfully.`,
          color: 'green',
          icon: <Check />,
        });
      })
      .catch(e => {
        updateNotification({
          id: notificationId,
          title: 'Failed',
          message: `Class information update  failed.`,
          color: 'red',
          icon: <X />,
        });
      });
    onToggle(false);
  };

  React.useEffect(() => {
    classGeneralForm.setValues({
      className: classTitle,
      classCode: classCode,
      shortDescription: classShortDescription,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classCode, classShortDescription, classTitle]);

  const openConfirmLeaveModal = () =>
    modals.openConfirmModal({
      title: `Leave the class?`,
      centered: true,
      confirmProps: { color: 'red' },
      zIndex: 999,
      trapFocus: true,
      closeOnClickOutside: false,
      children: (
        <div className="pb-3">
          <Text size="sm">
            Are you sure you want to leave{' '}
            <span className="font-semibold">
              {classCode}: {classTitle}
            </span>
            ? This action cannot be undone and data may be lost.
          </Text>
        </div>
      ),
      labels: { confirm: 'Leave class', cancel: 'No, cancel' },
      onConfirm: () => leaveClass(),
    });

  const leaveClass = async () => {
    if (!currentUser?.sub) return;

    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, `classes/${id}/people`, currentUser.sub));
      batch.update(doc(db, 'classes', id), {
        usersList: arrayRemove(currentUser.sub),
      });
      classGeneralForm.reset();
      onToggle(false);
      navigate('/');
      await batch.commit();
    } catch (e) {
      console.log('error', e);
    }
  };

  const onGenerateNewCode = async () => {
    setGenerateCodeLoading(true);
    const newInviteCode = uuidv4();
    await updateDoc(doc(db, 'classes', id), {
      inviteCode: newInviteCode,
    });
    setGenerateCodeLoading(false);
  };

  React.useEffect(() => {
    if (!classInviteCode) return;

    const generateQrCode = async () => {
      try {
        const response = await QRCode.toDataURL(classInviteCode);
        setQrCodeImageUrl(response);
      } catch (error) {
        console.log(error);
      }
    };

    generateQrCode();
  }, [classInviteCode]);

  const postAndCommentPermChanged = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPostAndCommentsPermValue(event.currentTarget.value);

    const classDocRef = doc(db, 'classes', id);
    updateDoc(classDocRef, {
      'permissions.postAndComment': event.currentTarget.value,
    });
  };
  const classInvitePermChanged = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setClassInvitePermValue(event.currentTarget.value);

    const classDocRef = doc(db, 'classes', id);
    updateDoc(classDocRef, {
      'permissions.classInvite': event.currentTarget.value,
    });
  };

  return (
    <Drawer
      opened={visible}
      onClose={() => onToggle(false)}
      title={
        activeClassRole === ClassRole.Student
          ? 'Class Information'
          : 'Class settings'
      }
      padding="xl"
      size="xl"
      lockScroll={true}
    >
      <Tabs>
        <Tabs.Tab label="General" icon={<Settings size={14} />}>
          <ScrollArea className="h-screen" scrollbarSize={4} offsetScrollbars>
            <div className="mt-3"></div>
            <ClassCard
              id={id}
              classTitle={classGeneralForm.values.className}
              classCode={classGeneralForm.values.classCode}
              teacherId={ownerId}
              color={CardColor.Sky}
              inClass
            />
            <form
              onSubmit={classGeneralForm.onSubmit(values =>
                openConfirmUpdateModal(values),
              )}
            >
              <Stack className="mt-3 pb-48">
                <Text size="sm" color="gray" className="font-semibold">
                  Class details
                </Text>
                <TextInput
                  readOnly={activeClassRole === ClassRole.Student}
                  label={
                    <Group spacing="sm">
                      <Pencil color="gray" size={18} />
                      <Text size="sm" weight={400}>
                        Class name <span className="text-red-500">*</span>
                      </Text>
                    </Group>
                  }
                  {...classGeneralForm.getInputProps('className')}
                />
                <TextInput
                  readOnly={activeClassRole === ClassRole.Student}
                  label={
                    <Group spacing="sm">
                      <Pencil color="gray" size={18} />
                      <Text size="sm" weight={400}>
                        Class code <span className="text-red-500">*</span>
                      </Text>
                    </Group>
                  }
                  {...classGeneralForm.getInputProps('classCode')}
                />
                <TextInput
                  readOnly={activeClassRole === ClassRole.Student}
                  label={
                    <Group spacing="sm">
                      <Pencil color="gray" size={18} />
                      <Text size="sm" weight={400}>
                        Short description{' '}
                        <span className="text-red-500">*</span>
                      </Text>
                    </Group>
                  }
                  {...classGeneralForm.getInputProps('shortDescription')}
                />
                {activeClassRole === ClassRole.Teacher && (
                  <Button className="mt-3" type="submit">
                    Submit changes
                  </Button>
                )}

                <Divider
                  variant="solid"
                  size="sm"
                  color={'dark'}
                  className="my-2 w-8"
                />
                <Group>
                  {isClassOwner && <Button color="red">Archive</Button>}
                  {activeClassRole === ClassRole.Student && (
                    <Button color="red" onClick={openConfirmLeaveModal}>
                      Leave this class
                    </Button>
                  )}
                  {isClassOwner && (
                    <Button color="cyan">Pass Class Ownership</Button>
                  )}
                </Group>
              </Stack>
            </form>
          </ScrollArea>
        </Tabs.Tab>
        {activeClassRole === ClassRole.Teacher && (
          <Tabs.Tab label="Additional settings" icon={<Settings size={14} />}>
            <ScrollArea className="h-screen" scrollbarSize={4} offsetScrollbars>
              <Stack className="pt-3 pb-48">
                <Text size="sm" className="font-semibold" color="gray">
                  Permissions
                </Text>
                <NativeSelect
                  value={postAndCommentsPermValue}
                  onChange={postAndCommentPermChanged}
                  data={[
                    'Students can post and comment',
                    'Students can only comment',
                    'Only teachers can post or comment',
                  ]}
                  placeholder="Pick one"
                  label={
                    <Group spacing="sm">
                      <Messages color="gray" size={18} />
                      <Text size="sm" weight={400}>
                        Post and comment permission
                      </Text>
                    </Group>
                  }
                  description="Set who can post and comment"
                />
                <NativeSelect
                  value={classInvitePermValue}
                  onChange={classInvitePermChanged}
                  data={['On', 'Off']}
                  placeholder="Pick one"
                  label={
                    <Group spacing="sm">
                      <Users color="gray" size={18} />
                      <Text size="sm" weight={400}>
                        Manage class invites
                      </Text>
                    </Group>
                  }
                />
                <TextInput
                  value={classInviteCode}
                  label={
                    <Group spacing="sm">
                      <Pencil color="gray" size={18} />
                      <Text size="sm" weight={400}>
                        Class invite code
                      </Text>
                    </Group>
                  }
                  rightSection={
                    <ActionIcon
                      onClick={() =>
                        navigator.clipboard.writeText(classInviteCode)
                      }
                    >
                      <Copy
                        color={'gray'}
                        size={24}
                        className="cursor-pointer"
                      />
                    </ActionIcon>
                  }
                  readOnly
                />
                <Button
                  loading={generateCodeLoading}
                  className="w-fit"
                  onClick={onGenerateNewCode}
                >
                  Generate new code
                </Button>
                <Group spacing="sm">
                  <Qrcode color="gray" size={18} />
                  <Text size="sm" weight={400}>
                    QR Code
                  </Text>
                </Group>
                <div className="w-fit border border-solid border-gray-200 p-6">
                  <Image
                    height={300}
                    fit="contain"
                    src={qrCodeImageUrl}
                    alt="QR code for class invite."
                  />
                </div>
                <Button
                  leftIcon={<Download size={18} />}
                  loading={generateCodeLoading}
                  className="w-fit"
                  onClick={() => {
                    saveAs(qrCodeImageUrl, `${classTitle}.png`);
                  }}
                >
                  Download QR Code
                </Button>
              </Stack>
            </ScrollArea>
          </Tabs.Tab>
        )}
      </Tabs>
    </Drawer>
  );
}
