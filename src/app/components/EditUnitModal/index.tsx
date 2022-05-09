import { Text, Modal, Group, Button, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification, updateNotification } from '@mantine/notifications';
import { selectClassroom } from 'app/pages/Class/slice/selectors';
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { db } from 'services/firebase';
import { Check, X } from 'tabler-icons-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  unitId: string;
  unitNumber: number;
  unitTitle: string;
  unitContent: string;
  visible: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EditUnitModal(props: Props) {
  const { visible, onToggle, unitId, unitNumber, unitTitle, unitContent } =
    props;

  // const userSlice = useSelector(selectUser);
  const classroom = useSelector(selectClassroom);

  const [editButtonLoading, setEditButtonLoading] = React.useState(false);

  const form = useForm({
    initialValues: {
      unitNumber: unitNumber.toString(),
      unitTitle: unitTitle,
      unitTextContent: unitContent,
    },
    validate: {
      unitNumber: value => {
        if (value.length > 0) {
          if (parseInt(value) >= 0) {
            return null;
          } else {
            return 'Unit number must be a positive number.';
          }
        } else {
          return 'Unit number is required';
        }
      },
      unitTitle: value => (value.length > 0 ? null : 'Unit title is required'),
    },
  });
  type FormValues = typeof form.values;

  React.useEffect(() => {
    form.setValues({
      unitNumber: unitNumber.toString(),
      unitTitle: unitTitle,
      unitTextContent: unitContent,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitNumber, unitTitle, unitContent]);

  const onSubmitEdit = async (values: FormValues) => {
    if (!classroom.activeClass?.id) return;
    setEditButtonLoading(true);

    // check if unit number is already in used.
    const parseUnitNumber = parseInt(values.unitNumber);
    const searchQuery = query(
      collection(db, classroom.unitPath),
      where('number', '==', parseUnitNumber),
    );
    const searchQueryResult = await getDocs(searchQuery);
    let hasDuplicate = false;
    searchQueryResult.forEach(doc => {
      if (doc.id !== unitId) hasDuplicate = true;
    });
    if (hasDuplicate) {
      // duplicated unit number
      setEditButtonLoading(false);

      showNotification({
        title: 'Failed',
        message: 'Unit number already in used.',
        color: 'red',
        icon: <X />,
      });
      return;
    }

    const notificationId = uuidv4();
    showNotification({
      id: notificationId,
      loading: true,
      title: 'In progress',
      message: `Updating Unit ${unitNumber}: ${unitTitle} ...`,
      autoClose: false,
      disallowClose: true,
    });

    updateDoc(doc(db, classroom.unitPath, unitId), {
      number: parseUnitNumber,
      title: values.unitTitle,
      textContent: values.unitTextContent,
    })
      .then(() => {
        updateNotification({
          id: notificationId,
          title: 'Success',
          message: `Unit ${unitNumber}: ${unitTitle} updated successfully.`,
          color: 'green',
          icon: <Check />,
        });
      })
      .catch(e => {
        updateNotification({
          id: notificationId,
          title: 'Failed',
          message: `Unit ${unitNumber}: ${unitTitle} update failed. \n${e}`,
          color: 'red',
          icon: <X />,
        });
      })
      .finally(() => {
        setEditButtonLoading(false);
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
      title={<Text className="font-semibold">Edit unit</Text>}
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      radius="md"
      size={500}
    >
      <form onSubmit={form.onSubmit(values => onSubmitEdit(values))}>
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
            <Button type="submit" className="px-12" loading={editButtonLoading}>
              <Text size="sm" weight={400}>
                Submit changes
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
