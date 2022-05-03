import { Button, Divider, Group, Modal, Text } from '@mantine/core';
import * as React from 'react';

import { PendingInviteItem } from './components/PendingInviteItem';

interface Prop {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export function PendingInvitesModal(props: Prop) {
  const { opened, setOpened } = props;

  return (
    <Modal
      withCloseButton={false}
      size="xl"
      centered
      opened={opened}
      onClose={() => setOpened(false)}
    >
      <Group position="apart">
        <Text size="xl" weight={600}>
          Pending Invites
        </Text>
        <Button variant="default" onClick={() => setOpened(false)}>
          Close
        </Button>
      </Group>
      <Divider my="sm" />
      <Text className="pt-4" size="xs">
        2 pending invites
      </Text>
      <PendingInviteItem
        name="Hirold Bartolay"
        imageUrl="https://i.pravatar.cc/150"
      />
      <PendingInviteItem
        name="Baby boy #1 Hanz Cruz"
        imageUrl="https://i.pravatar.cc/150"
      />
    </Modal>
  );
}
