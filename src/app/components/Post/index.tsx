import { Card, Group, Avatar, ActionIcon, Button, Text } from '@mantine/core';
import * as React from 'react';
import { Dots, ThumbUp, Message, Download } from 'tabler-icons-react';

interface Prop {}

export function Post(props: Prop) {
  return (
    <Card className="mt-3 rounded-md">
      <Group direction="row" noWrap>
        <Avatar color={'primary'} radius="xl" className="self-start">
          JD
        </Avatar>
        <Group direction="column" className="flex-grow" noWrap>
          <Group direction="row" position="apart" className="w-full" noWrap>
            <div className="flex-grow">
              <Text className="font-semibold">John Doe</Text>
              <Text color={'gray'} size="xs">
                4 hours ago
              </Text>
            </div>
            <ActionIcon className="self-start">
              <Dots />
            </ActionIcon>
          </Group>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus quisquam explicabo deleniti fuga accusantium dolore
            fugit autem molestias repellendus harum.
          </Text>
          <Group className="mt-3 w-full" position="apart" noWrap>
            <Group>
              <Button variant="subtle" compact color={'dark'} className="px-0">
                <ThumbUp />
                <Text className="ml-2">11</Text>
              </Button>
              <Button variant="subtle" compact color={'dark'} className="px-0">
                <Message />
                <Text className="ml-2">5</Text>
              </Button>
            </Group>
            <Group>
              <ActionIcon>
                <Download />
              </ActionIcon>
            </Group>
          </Group>
        </Group>
      </Group>
    </Card>
  );
}
