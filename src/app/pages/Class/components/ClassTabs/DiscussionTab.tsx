import { ActionIcon, Avatar, Card, Group, TextInput } from '@mantine/core';
import { Post } from 'app/components/Post/Loadable';
import * as React from 'react';
import { At, File, Photo } from 'tabler-icons-react';

interface Props {
  // someProps: string
}

export function DiscussionTab(props: Props) {
  // const { someProps } = props;

  return (
    <div className="bg-transparent py-3">
      <Card>
        <Group noWrap className="rounded-md">
          <Avatar color={'primary'} radius="xl">
            JD
          </Avatar>
          <TextInput
            placeholder="Write something for the class"
            variant="filled"
            radius="xl"
            required
            className="flex-grow"
          />
          <ActionIcon>
            <Photo />
          </ActionIcon>
          <ActionIcon>
            <File />
          </ActionIcon>
          <ActionIcon>
            <At />
          </ActionIcon>
        </Group>
      </Card>
      <div>
        <Post />
      </div>
    </div>
  );
}
