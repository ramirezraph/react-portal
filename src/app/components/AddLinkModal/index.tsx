/**
 *
 * AddLinkModal
 *
 */
import {
  Button,
  Group,
  Modal,
  Portal,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification, updateNotification } from '@mantine/notifications';
import { addDoc, Timestamp } from 'firebase/firestore';
import * as React from 'react';
import { lessonFilesColRef } from 'services/firebase';
import { Check, X } from 'tabler-icons-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  lessonId: string;
  visible: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AddLinkModal(props: Props) {
  const { lessonId, visible, onToggle } = props;

  const [loading, setLoading] = React.useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      url: '',
    },
    validate: {
      name: v => (v.length <= 0 ? 'Name is required' : null),
      url: v => (v.length <= 0 ? 'Link is required' : null),
    },
  });
  type FormValues = typeof form.values;

  const onCreate = (values: FormValues) => {
    console.log(values);

    setLoading(true);

    const notificationId = uuidv4();
    showNotification({
      id: notificationId,
      loading: true,
      title: 'In progress',
      message: `Adding a link ...`,
      autoClose: false,
      disallowClose: true,
    });
    // add data to firestore
    addDoc(lessonFilesColRef, {
      name: values.name,
      type: 'link',
      url: values.url,
      lessonId: lessonId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      deletedAt: null,
    })
      .then(() => {
        updateNotification({
          id: notificationId,
          title: 'Success',
          message: `Link added successfully.`,
          color: 'green',
          icon: <Check />,
        });
      })
      .catch(e => {
        updateNotification({
          id: notificationId,
          title: 'Failed',
          message: `Link add failed.`,
          color: 'red',
          icon: <X />,
        });
      })
      .finally(() => {
        setLoading(false);
      });

    form.reset();
    onToggle(false);
  };

  const onCancel = () => {
    form.reset();
    onToggle(false);
  };

  return (
    <Portal>
      <Modal
        opened={visible}
        onClose={() => onToggle(false)}
        title={<Text className="font-semibold">Add a Link</Text>}
        centered
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
        <form onSubmit={form.onSubmit(values => onCreate(values))}>
          <Stack>
            <TextInput
              label={
                <Text size="xs" className="w-full text-gray-500">
                  Name
                </Text>
              }
              className="w-full"
              size="md"
              type="text"
              classNames={{
                error: 'text-sm',
              }}
              {...form.getInputProps('name')}
            />
            <TextInput
              label={
                <Text size="xs" className="w-full text-gray-500">
                  Link
                </Text>
              }
              className="w-full"
              size="md"
              type="url"
              {...form.getInputProps('url')}
            />
            <Group className="mt-6">
              <Button type="submit" className="px-12" loading={loading}>
                <Text size="sm" weight={400}>
                  Add
                </Text>
              </Button>
              <Button
                variant="subtle"
                color="dark"
                className="px-12"
                onClick={onCancel}
              >
                <Text size="sm" weight={400}>
                  Cancel
                </Text>
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Portal>
  );
}
