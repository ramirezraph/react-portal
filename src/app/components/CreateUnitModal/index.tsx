import { Text, Modal, Group, Button, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification, updateNotification } from '@mantine/notifications';
import { selectClassroom } from 'app/pages/Class/slice/selectors';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { db } from 'services/firebase';
import { Check, X } from 'tabler-icons-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  visible: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateUnitModal(props: Props) {
  const { visible, onToggle } = props;

  // const userSlice = useSelector(selectUser);
  const classroomSlice = useSelector(selectClassroom);

  const form = useForm({
    initialValues: {
      unitNumber: '',
      unitTitle: '',
      unitTextContent: '',
    },
    validate: {
      unitNumber: value => {
        if (value.length > 0) {
          if (parseInt(value) > 0) {
            return null;
          } else {
            return 'Unit number must be greater than zero.';
          }
        } else {
          return 'Unit number is required';
        }
      },
      unitTitle: value => (value.length > 0 ? null : 'Unit title is required'),
    },
  });
  type FormValues = typeof form.values;

  const onCreate = async (values: FormValues) => {
    if (!classroomSlice.activeClass?.id) return;

    // check if unit number is already in used.
    const parseUnitNumber = parseInt(values.unitNumber);
    const searchQuery = query(
      collection(db, classroomSlice.unitPath),
      where('number', '==', parseUnitNumber),
    );
    const searchQueryResult = await getDocs(searchQuery);
    if (!searchQueryResult.empty) {
      // duplicated unit number
      showNotification({
        title: 'Failed',
        message: 'Unit number already in used.',
        color: 'red',
        icon: <X />,
      });
      return;
    }

    const createIdNotification = uuidv4();
    showNotification({
      id: createIdNotification,
      loading: true,
      title: 'In progress',
      message: `Creating Unit ${parseUnitNumber}: ${values.unitTitle} ...`,
      autoClose: false,
      disallowClose: true,
    });

    const unitSubcolRef = collection(db, classroomSlice.unitPath);
    addDoc(unitSubcolRef, {
      number: parseUnitNumber,
      title: values.unitTitle,
      textContent: values.unitTextContent,
      isLive: false,
    })
      .then(() => {
        updateNotification({
          id: createIdNotification,
          title: 'Success',
          message: `Unit ${parseUnitNumber}: ${values.unitTitle} created successfully.`,
          color: 'green',
          icon: <Check />,
        });
      })
      .catch(e => {
        updateNotification({
          id: createIdNotification,
          title: 'Failed',
          message: `Unit ${parseUnitNumber}: ${values.unitTitle} create failed. \n${e}`,
          color: 'red',
          icon: <X />,
        });
      });

    form.reset();
    onToggle(false);
  };

  const onCancel = () => {
    form.reset();
    onToggle(false);
  };

  return (
    <Modal
      opened={visible}
      onClose={() => onToggle(false)}
      title={<Text className="font-semibold">Create new unit</Text>}
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      radius="md"
      size={500}
    >
      <form onSubmit={form.onSubmit(values => onCreate(values))}>
        <Group direction="column" spacing="xs">
          <Text className="w-full" size="sm">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          </Text>
          <TextInput
            label={
              <Text size="xs" className="w-full text-gray-500">
                Unit number
              </Text>
            }
            className="w-full"
            size="md"
            type="number"
            {...form.getInputProps('unitNumber')}
          />

          <TextInput
            label={
              <Text size="xs" className="text-gray-500">
                Title
              </Text>
            }
            className="w-full"
            size="md"
            {...form.getInputProps('unitTitle')}
          />
          <Textarea
            label={
              <Text size="xs" className="text-gray-500">
                Content (optional)
              </Text>
            }
            className="w-full"
            size="md"
            minRows={4}
            {...form.getInputProps('unitTextContent')}
          />
          <Group className="mt-6">
            <Button type="submit" className="px-12">
              <Text size="sm" weight={400}>
                Create
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
        </Group>
      </form>
    </Modal>
  );
}
