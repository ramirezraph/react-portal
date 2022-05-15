import { Button, Divider, Group, Modal, Text } from '@mantine/core';
import RichTextEditor from '@mantine/rte';
import * as React from 'react';
import { Photo, File } from 'tabler-icons-react';

interface Props {
  visible: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreatePostModal(props: Props) {
  const { visible, onToggle } = props;
  const [value, onChange] = React.useState('');

  return (
    <Modal
      withCloseButton={false}
      opened={visible}
      onClose={() => onToggle(false)}
      centered
      size="lg"
    >
      <Group position="apart">
        <Text size="xl" weight={'bold'}>
          Create post
        </Text>
        <Button size="md" variant="default" onClick={() => onToggle(false)}>
          Close
        </Button>
      </Group>
      <Divider my="sm" />
      <RichTextEditor
        value={value}
        onChange={onChange}
        controls={[
          ['bold', 'italic', 'underline', 'strike'],
          ['h1', 'h2', 'h3', 'orderedList', 'unorderedList'],
          ['sup', 'sub'],
          ['alignLeft', 'alignCenter', 'alignRight'],
          ['blockquote', 'codeBlock'],
        ]}
        className="text-xl"
        sticky
        style={{
          minHeight: '200px',
          maxHeight: '300px',
          overflowY: 'scroll',
        }}
        placeholder="Write something for the class"
      />
      <Group className="mt-3">
        <Button variant="subtle" leftIcon={<Photo />}>
          Add a photo
        </Button>
        <Button variant="subtle" leftIcon={<File />}>
          Attach a file
        </Button>
      </Group>
      <Button size="md" className="mt-6 w-full">
        POST
      </Button>
    </Modal>
  );
}
