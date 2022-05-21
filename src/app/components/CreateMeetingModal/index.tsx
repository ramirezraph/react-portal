import {
  Modal,
  Group,
  Button,
  Divider,
  TextInput,
  Textarea,
  Text,
  Stack,
} from '@mantine/core';
import { DatePicker, TimeRangeInput } from '@mantine/dates';
import * as React from 'react';
import { useForm } from '@mantine/form';
import {
  Pencil,
  Clock,
  Link,
  CalendarEvent,
  Check,
  X,
} from 'tabler-icons-react';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useSelector } from 'react-redux';
import { selectUser } from 'store/userSlice/selectors';
import { selectClassroom } from 'app/pages/Class/slice/selectors';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from 'services/firebase';
import { showNotification, updateNotification } from '@mantine/notifications';
dayjs.extend(relativeTime);

interface Prop {
  visible: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateMeetingModal(props: Prop) {
  const { visible, onToggle } = props;

  const { currentUser } = useSelector(selectUser);
  const { activeClass } = useSelector(selectClassroom);

  const [loading, setLoading] = React.useState(false);

  const now = new Date();
  const then = dayjs(now).add(1, 'hour').toDate();
  const form = useForm({
    initialValues: {
      meetingLink: '',
      title: '',
      description: '',
      date: now,
      time: [now, then],
    },

    validate: {
      meetingLink: value => (value ? null : 'Meeting link is required.'),
      title: value => (value ? null : 'Title is required.'),
      date: value => (value ? null : 'Date is required.'),
      time: value => (value ? null : 'Time start is required.'),
    },
  });
  type FormValues = typeof form.values;

  const onCreateMeeting = (values: FormValues) => {
    if (!activeClass?.id) return;
    if (!currentUser?.sub) return;

    const timeStartTime = values.time[0];
    const timeEndTime = values.time[1];
    const startTime = new Date(
      values.date.getFullYear(),
      values.date.getMonth(),
      values.date.getDate(),
      timeStartTime.getHours(),
      timeStartTime.getMinutes(),
    );

    const endTime = new Date(
      values.date.getFullYear(),
      values.date.getMonth(),
      values.date.getDate(),
      timeEndTime.getHours(),
      timeEndTime.getMinutes(),
    );

    const newMeeting = {
      meetingLink: values.meetingLink,
      title: values.title,
      description: values.description,
      date: values.date,
      timeStart: startTime,
      timeEnd: endTime,
      classId: activeClass.id,
      createdBy: currentUser.sub,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const createIdNotification = uuidv4();
    try {
      setLoading(true);

      showNotification({
        id: createIdNotification,
        loading: true,
        title: 'In progress',
        message: `Creating meeting: ${newMeeting.title} ...`,
        autoClose: false,
        disallowClose: true,
      });

      addDoc(
        collection(db, `classes/${activeClass.id}/meetings`),
        newMeeting,
      ).then(() => {
        updateNotification({
          id: createIdNotification,
          title: 'Success',
          message: `Meeting: ${newMeeting.title} created successfully.`,
          color: 'green',
          icon: <Check />,
        });
      });

      form.reset();
      onToggle(false);
    } catch (e) {
      updateNotification({
        id: createIdNotification,
        title: 'Failed',
        message: `Meeting: ${newMeeting.title} create failed.`,
        color: 'red',
        icon: <X />,
      });
      console.log(e);
    } finally {
      setLoading(false);
    }

    console.log(newMeeting);
  };

  return (
    <Modal
      centered
      size="lg"
      opened={visible}
      onClose={() => onToggle(false)}
      withCloseButton={false}
    >
      <form onSubmit={form.onSubmit(values => onCreateMeeting(values))}>
        <Stack>
          <Group position="apart">
            <Text size="xl" weight={600}>
              Create new meeting
            </Text>
            <Button size="md" onClick={() => onToggle(false)} variant="default">
              <Text>Cancel</Text>
            </Button>
          </Group>
          <Divider />
          <TextInput
            label={
              <Group spacing="sm">
                <Link size={18} />
                <Text>
                  Meeting Link <span className="text-red-500">*</span>
                </Text>
              </Group>
            }
            type="url"
            description="Link to your meeting. (Google Meet, Zoom, Teams, etc.)"
            {...form.getInputProps('meetingLink')}
          />
          <TextInput
            label={
              <Group spacing="sm">
                <Pencil size={18} />
                <Text>
                  Title <span className="text-red-500">*</span>
                </Text>
              </Group>
            }
            {...form.getInputProps('title')}
          />
          <Textarea
            label={
              <Group spacing="sm">
                <Pencil size={18} />
                <Text>Description</Text>
                <Text size="sm" color="gray">
                  (optional)
                </Text>
              </Group>
            }
            {...form.getInputProps('description')}
          />
          <DatePicker
            placeholder="Select a date"
            label={
              <Group spacing="sm">
                <CalendarEvent size={18} />
                <Text>
                  Date <span className="text-red-500">*</span>
                </Text>
              </Group>
            }
            {...form.getInputProps('date')}
          />
          <TimeRangeInput
            label={
              <Group spacing="sm">
                <Clock size={18} />
                <Text>
                  Time <span className="text-red-500">*</span>
                </Text>
              </Group>
            }
            format="12"
            {...form.getInputProps('time')}
          />
          <Button loading={loading} type="submit" size="md" className="mt-3">
            <Text>Create</Text>
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
