import { ActionIcon, Avatar, Card, Group, TextInput } from '@mantine/core';
import { Post } from 'app/components/PostCard';
import { PostCard } from 'app/components/PostCard/Loadable';
import * as React from 'react';
import { At, File, Photo } from 'tabler-icons-react';

interface Props {
  // someProps: string
}

export function DiscussionTab(props: Props) {
  // const { someProps } = props;

  const [posts, setPosts] = React.useState<Post[]>([]);

  React.useEffect(() => {
    setPosts([
      {
        id: '1',
        ownerName: 'John Doe',
        date: '2022-04-05T12:10',
        content: 'Post with 6 Photos',
        images: [
          {
            url: 'https://picsum.photos/1100/1100',
          },
          {
            url: 'https://picsum.photos/700/200',
          },
          {
            url: 'https://picsum.photos/700/300',
          },
          {
            url: 'https://picsum.photos/1200/700',
          },
          {
            url: 'https://picsum.photos/1200/700',
          },
          {
            url: 'https://picsum.photos/1200/700',
          },
        ],
        files: [],
      },
      {
        id: '2',
        ownerName: 'John Doe',
        date: '2022-04-05T07:10',
        content: 'Post with 2 Photos',
        images: [
          {
            url: 'https://picsum.photos/1100/700',
          },
          {
            url: 'https://picsum.photos/1280/768',
          },
        ],
        files: [],
      },
      {
        id: '3',
        ownerName: 'John Doe',
        date: '2022-04-05T06:10',
        content: 'Post with 3 Photos',
        images: [
          {
            url: 'https://picsum.photos/700/600',
          },
          {
            url: 'https://picsum.photos/700/200',
          },
          {
            url: 'https://picsum.photos/600/200',
          },
        ],
        files: [],
      },
      {
        id: '4',
        ownerName: 'John Doe',
        date: '2022-04-04T12:10',
        content: 'Post with 4 Photos',
        images: [
          {
            url: 'https://picsum.photos/700/600',
          },
          {
            url: 'https://picsum.photos/700/200',
          },
          {
            url: 'https://picsum.photos/600/200',
          },
          {
            url: 'https://picsum.photos/600/200',
          },
        ],
        files: [],
      },
    ]);
  }, []);

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
        {posts.map(post => (
          <PostCard
            key={post.id}
            id={post.id}
            ownerName={post.ownerName}
            content={post.content}
            date={post.date}
            images={post.images}
          />
        ))}
      </div>
    </div>
  );
}
