import { Group, Text, Button, Box, Menu } from '@mantine/core';
import { deleteDoc } from 'firebase/firestore';
import * as React from 'react';
import { Check, Pencil, Trash, X } from 'tabler-icons-react';
import { v4 as uuidv4 } from 'uuid';
import { showNotification, updateNotification } from '@mantine/notifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getClassNameAndCode } from 'utils/classUtils';
import { useModals } from '@mantine/modals';
import { EditMeetingModal } from 'app/components/EditMeetingModal';
import { ClassMeeting } from '../../MeetingsTab';
dayjs.extend(relativeTime);

interface Props {
  shouldShowDescription: boolean;
  meeting: ClassMeeting;
  viewOnly?: boolean;
}

export function MeetingItem(props: Props) {
  const { meeting, viewOnly, shouldShowDescription = false } = props;
  const {
    title,
    classId,
    description,
    date,
    timeStart,
    timeEnd,
    meetingLink,
    docRef,
  } = meeting;

  const modals = useModals();

  const [subtitle, setSubtitle] = React.useState('');
  const [editModalVisible, setEditModalVisible] = React.useState(false);

  React.useEffect(() => {
    const getInfo = async () => {
      const info = await getClassNameAndCode(classId);
      if (info) {
        const { code, name } = info;
        setSubtitle(`${code} - ${name}`);
      }
    };

    getInfo();

    return () => {
      setSubtitle('');
    };
  }, [classId]);

  const openConfirmDeleteModal = () => {
    modals.openConfirmModal({
      title: `Delete ${title}?`,
      centered: true,
      confirmProps: { color: 'red' },
      zIndex: 999,
      trapFocus: true,
      closeOnClickOutside: false,
      children: (
        <div className="pb-3">
          <Text size="sm">Are you sure you want to delete this meeting?</Text>
        </div>
      ),
      labels: { confirm: 'Delete meeting', cancel: "No, don't delete" },
      onConfirm: () => onDelete(),
    });
  };

  const onDelete = () => {
    const notificationId = uuidv4();
    showNotification({
      id: notificationId,
      loading: true,
      title: 'In progress',
      message: `Deleting meeting: ${title} ...`,
      autoClose: false,
      disallowClose: true,
    });
    try {
      deleteDoc(docRef).then(() => {
        updateNotification({
          id: notificationId,
          title: 'Success',
          message: `Meeting: ${title} deleted successfully.`,
          color: 'green',
          icon: <Check />,
        });
      });
    } catch (e) {
      updateNotification({
        id: notificationId,
        title: 'Failed',
        message: `Meeting: ${title} delete failed.`,
        color: 'red',
        icon: <X />,
      });
      console.log(e);
    }
  };

  return (
    <Box
      className={`w-full rounded-md border-none bg-white p-7 drop-shadow-md `}
    >
      <EditMeetingModal
        visible={editModalVisible}
        meeting={meeting}
        onToggle={setEditModalVisible}
      />
      <Group position="apart" spacing="xs" className="mb-5 w-full">
        <Group direction="column">
          <Text weight="bold" color={'blue'}>
            {title}
          </Text>
          <Text size="sm" className="-mt-5">
            {subtitle}
          </Text>
        </Group>

        {!viewOnly && (
          <Menu position="right" className="mb-4">
            <Menu.Item
              onClick={() => setEditModalVisible(true)}
              icon={<Pencil size={16} />}
            >
              <Text size="sm">Edit</Text>
            </Menu.Item>

            <Menu.Item
              onClick={openConfirmDeleteModal}
              icon={<Trash size={16} color="red" />}
            >
              <Text size="sm" color="red">
                Delete
              </Text>
            </Menu.Item>
          </Menu>
        )}
      </Group>
      <Text size="sm" className="mb-5">
        {shouldShowDescription && description}
      </Text>
      <Group className="" position="apart">
        <Group spacing={'xs'}>
          <Box className="rounded-2xl bg-slate-700 px-6 py-1">
            <Text size="sm" color={'white'}>
              {dayjs(date).format('dddd, MMMM D, YYYY')}
            </Text>
          </Box>
          <Box className="rounded-2xl bg-blue-600 px-5 py-1">
            <Text color={'white'} size="sm">
              {dayjs(timeStart).format('h:mm A')}
            </Text>
          </Box>
          <Box className="rounded-2xl bg-amber-800 px-5 py-1">
            <Text color={'white'} size="sm">
              {dayjs(timeEnd).format('h:mm A')}
            </Text>
          </Box>
        </Group>
        <Group spacing={'xs'}>
          <Button
            size="sm"
            className="bg-blue-600 px-6"
            radius="md"
            component="a"
            href={meetingLink}
            target="_blank"
          >
            <Text size="xs">Go to meeting</Text>
          </Button>
        </Group>
      </Group>
    </Box>
  );
}
