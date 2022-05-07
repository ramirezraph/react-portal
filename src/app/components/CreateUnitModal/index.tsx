/**
 *
 * CreateUnitModal
 *
 */
import {
  Text,
  Modal,
  LoadingOverlay,
  Group,
  Button,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'store/userSlice/selectors';

interface Props {
  visible: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateUnitModal(props: Props) {
  const { visible, onToggle } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const userSlice = useSelector(selectUser);

  const form = useForm({
    initialValues: {
      unitNumber: '',
      unitTitle: '',
      unitTextContent: '',
    },
    validate: {},
  });
  type FormValues = typeof form.values;
  const onCreate = async (values: FormValues) => {};
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
      <LoadingOverlay visible={isLoading} />
      <form onSubmit={form.onSubmit(values => onCreate(values))}>
        <Group direction="column" spacing="xs">
          <Text className="w-full" size="sm">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          </Text>
          <TextInput
            label={
              <Text size="xs" className="text-gray-500">
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
