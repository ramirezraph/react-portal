import { Group, Text, Button, Card, Collapse, TextInput } from '@mantine/core';
import * as React from 'react';

interface Props {
  visible: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export function JoinClassCollapseCard(props: Props) {
  const { visible, onToggle } = props;

  const onJoin = () => {
    console.log('join');
  };

  return (
    <Collapse
      in={visible}
      transitionDuration={150}
      transitionTimingFunction="linear"
    >
      <Card className="mt-6 p-8">
        <Group direction="column" spacing="sm">
          <Text size="xl" className="font-semibold">
            Join a class
          </Text>
          <Text>Ask your teacher for the class key, then enter it here:</Text>
          <TextInput
            radius="md"
            className="w-1/2"
            placeholder="Class code"
            size="lg"
          />
          <Group className="mt-6">
            <Button className="h-12 px-16" onClick={onJoin}>
              <Text size="md" weight={400}>
                Join
              </Text>
            </Button>
            <Button
              variant="subtle"
              color="dark"
              className="h-12 px-16"
              onClick={() => onToggle(false)}
            >
              <Text size="md" weight={400}>
                Cancel
              </Text>
            </Button>
          </Group>
        </Group>
      </Card>
    </Collapse>
  );
}
