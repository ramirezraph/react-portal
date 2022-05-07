import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { addDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { classesColRef, db } from 'services/firebase';
import { selectUser } from 'store/userSlice/selectors';
import { Check, Cross } from 'tabler-icons-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  visible: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateClassModal(props: Props) {
  const { visible, onToggle } = props;

  const userSlice = useSelector(selectUser);

  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      code: '',
      shortDescription: '',
      ownerId: userSlice.currentUser?.sub,
    },
    validate: {
      name: value => (value.length > 0 ? null : 'Class name is required.'),
    },
  });

  type FormValues = typeof form.values;

  const onCreate = async (values: FormValues) => {
    setIsLoading(true);
    const data = {
      code: values.code,
      name: values.name,
      ownerId: userSlice.currentUser?.sub,
      shortDescription: values.shortDescription,
      usersList: [userSlice.currentUser?.sub],
      inviteCode: uuidv4(),
      color: 'blue',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await addDoc(classesColRef, data)
      .then((newClassDoc: any) => {
        return setDoc(
          doc(db, `${newClassDoc.path}/people`, userSlice.currentUser?.sub!),
          {
            type: 'teacher',
          },
        );
      })
      .then(() => {
        showNotification({
          title: 'Sucess',
          message: 'Created class successfully.',
          color: 'green',
          icon: <Check />,
        });
      })
      .catch(e => {
        showNotification({
          title: 'Failed',
          message: 'Create class failed.\n' + e,
          color: 'red',
          icon: <Cross />,
        });
      })
      .finally(() => {
        form.reset();
        setIsLoading(false);
        onToggle(false);
      });
  };

  const onCancel = () => {
    form.reset();
    onToggle(false);
  };

  return (
    <Modal
      opened={visible}
      onClose={() => onToggle(false)}
      title={<Text className="font-semibold">Create a class</Text>}
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      radius="md"
      size={600}
    >
      <LoadingOverlay visible={isLoading} />
      <form onSubmit={form.onSubmit(values => onCreate(values))}>
        <Group direction="column" spacing="xs">
          <Text className="w-full" size="sm">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi
            repellat quae vel aliquid commodi rerum!
          </Text>
          <TextInput
            label={
              <Text size="xs" className="text-gray-500">
                Class name
              </Text>
            }
            className="w-full"
            size="md"
            {...form.getInputProps('name')}
          />
          <TextInput
            label={
              <Text size="xs" className="text-gray-500">
                Class code
              </Text>
            }
            className="w-full"
            size="md"
            {...form.getInputProps('code')}
          />
          <TextInput
            label={
              <Text size="xs" className="text-gray-500">
                Short description
              </Text>
            }
            className="w-full"
            size="md"
            {...form.getInputProps('shortDescription')}
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
