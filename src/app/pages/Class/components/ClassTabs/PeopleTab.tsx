import { Button, Group, Text } from '@mantine/core';
import * as React from 'react';
import { Menu2, UserPlus } from 'tabler-icons-react';

interface Props {
  // someProps: string
}

export function PeopleTab(props: Props) {
  // const { someProps } = props;

  return (
    <div className="bg-white p-6">
      <Group position="apart">
        <Button
          color="primary"
          radius="xl"
          leftIcon={<UserPlus size={19} />}
          variant="filled"
        >
          Send Invite
        </Button>
        <Button leftIcon={<Menu2 color="black" size={19} />} variant="subtle">
          <Text weight={400} color="black">
            Pending Invites
          </Text>
        </Button>
      </Group>
    </div>
  );
}
