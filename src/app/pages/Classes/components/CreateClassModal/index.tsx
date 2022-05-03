import { Button, Group, Modal, Text, TextInput } from '@mantine/core';
import * as React from 'react';

interface Props {
  visible: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateClassModal(props: Props) {
  const { visible, onToggle } = props;

  const onCreate = () => {
    console.log('create');
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
        />
        <TextInput
          label={
            <Text size="xs" className="text-gray-500">
              Class code
            </Text>
          }
          className="w-full"
          size="md"
        />
        <TextInput
          label={
            <Text size="xs" className="text-gray-500">
              Short description
            </Text>
          }
          className="w-full"
          size="md"
        />
        <Group className="mt-6">
          <Button className="px-12" onClick={onCreate}>
            <Text size="sm" weight={400}>
              Create
            </Text>
          </Button>
          <Button
            variant="subtle"
            color="dark"
            className="px-12"
            onClick={() => onToggle(false)}
          >
            <Text size="sm" weight={400}>
              Cancel
            </Text>
          </Button>
        </Group>
      </Group>
    </Modal>
  );
}
