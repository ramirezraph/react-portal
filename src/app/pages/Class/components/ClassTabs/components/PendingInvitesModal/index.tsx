import { Button, Divider, Group, Modal, Text } from '@mantine/core';
import { selectClassroom } from 'app/pages/Class/slice/selectors';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { PendingInviteItem } from './components/PendingInviteItem/Loadable';

interface Prop {
  visible: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export function PendingInvitesModal(props: Prop) {
  const { visible, onToggle } = props;

  const { activeClass } = useSelector(selectClassroom);

  return (
    <Modal
      withCloseButton={false}
      size="xl"
      centered
      opened={visible}
      onClose={() => onToggle(false)}
    >
      <Group position="apart">
        <Text size="xl" weight={600}>
          Pending Invites
        </Text>
        <Button variant="default" onClick={() => onToggle(false)}>
          Close
        </Button>
      </Group>
      <Divider my="sm" />
      <Text className="pt-4" size="xs">
        {activeClass && activeClass.pendingInvites.length} pending invites
      </Text>
      {activeClass &&
        activeClass.pendingInvites.map((id, index) => (
          <PendingInviteItem key={index} userId={id} />
        ))}
    </Modal>
  );
}
