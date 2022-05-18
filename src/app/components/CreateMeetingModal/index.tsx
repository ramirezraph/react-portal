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
import { DatePicker, TimeInput } from '@mantine/dates';
import * as React from 'react';

import { Pencil, CalendarEvent, Clock, Link } from 'tabler-icons-react';

interface Prop {
  visible: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateMeetingModal(props: Prop) {
  const { visible, onToggle } = props;
  return (
    <Modal
      centered
      size="lg"
      opened={visible}
      onClose={() => onToggle(false)}
      withCloseButton={false}
    >
      <Group position="apart">
        <Text size="xl" weight={600}>
          Create Meeting
        </Text>
        <Button onClick={() => onToggle(false)} variant="default">
          <Text>Cancel</Text>
        </Button>
      </Group>
      <Divider className="mt-6" />

      <Stack className="mt-6">
        <TextInput size="md" placeholder="Link" icon={<Link color="gray" />} />
        <TextInput
          size="md"
          icon={<Pencil color="gray" />}
          placeholder="Title"
        />
        <Textarea
          size="md"
          icon={<Pencil color="gray" className="mt-2.5 self-start" />}
          placeholder="Description"
          required
        />

        <DatePicker
          className="mt-6"
          size="md"
          icon={<CalendarEvent color="gray" />}
          placeholder="Date"
          required
        />
        <TimeInput
          icon={<Clock color="gray" />}
          size="md"
          label="Time start"
          format="12"
          defaultValue={new Date()}
          required
        />
        <TimeInput
          icon={<Clock color="gray" />}
          size="md"
          label="Time end"
          format="12"
          defaultValue={new Date()}
          required
        />
        <Button className="mt-6">
          <Text>Create</Text>
        </Button>
      </Stack>
    </Modal>
  );
}
