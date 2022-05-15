import {
  ActionIcon,
  Avatar,
  Card,
  Group,
  ScrollArea,
  Text,
  Button,
} from '@mantine/core';
import { CreatePostModal } from 'app/components/CreatePostModal/Loadable';
import { Post } from 'app/components/PostCard';
import { PostCard } from 'app/components/PostCard/Loadable';
import * as React from 'react';
import { ArrowsSort, At, Clock, File, Photo } from 'tabler-icons-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  // someProps: string
}

export function DiscussionTab(props: Props) {
  // const { someProps } = props;

  const [posts, setPosts] = React.useState<Post[]>([]);
  const [postModalVisible, setPostModalVisible] = React.useState(false);

  React.useEffect(() => {
    setPosts([
      {
        id: '0',
        ownerName: 'John Doe',
        date: '2022-04-05T12:10',
        content: 'Post with no photos',
        images: [],
        files: [
          {
            id: 'asdsa',
            downloadUrl: '',
            name: 'Sample File 1',
            type: 'pdf',
          },
          {
            id: 'asdsadad',
            downloadUrl: '',
            name: 'Sample File 2',
            type: 'pdf',
          },
        ],
      },
      {
        id: '1',
        ownerName: 'John Doe',
        date: '2022-04-05T12:10',
        content: 'Post with 6 Photos',
        images: [
          {
            id: uuidv4(),
            name: 'testImage',
            url: 'https://picsum.photos/1100/1100',
          },
          {
            id: uuidv4(),
            name: 'testImage',
            url: 'https://picsum.photos/700/200',
          },
          {
            id: uuidv4(),
            name: 'testImage',
            url: 'https://picsum.photos/700/300',
          },
          {
            id: uuidv4(),
            name: 'testImage',
            url: 'https://picsum.photos/1200/700',
          },
          {
            id: uuidv4(),
            name: 'testImage',
            url: 'https://picsum.photos/1200/700',
          },
          {
            id: uuidv4(),
            name: 'testImage',
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
            id: uuidv4(),
            name: 'testImage',
            url: 'https://picsum.photos/1100/700',
          },
          {
            id: uuidv4(),
            name: 'testImage',
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
            id: uuidv4(),
            name: 'testImage',
            url: 'https://picsum.photos/700/600',
          },
          {
            id: uuidv4(),
            name: 'testImage',
            url: 'https://picsum.photos/700/200',
          },
          {
            id: uuidv4(),
            name: 'testImage',
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
            id: uuidv4(),
            name: 'testImage',
            url: 'https://picsum.photos/700/600',
          },
          {
            id: uuidv4(),
            name: 'testImage',
            url: 'https://picsum.photos/700/200',
          },
          {
            id: uuidv4(),
            name: 'testImage',
            url: 'https://picsum.photos/600/200',
          },
          {
            id: uuidv4(),
            name: 'testImage',
            url: 'https://picsum.photos/600/200',
          },
        ],
        files: [],
      },
    ]);
  }, []);

  return (
    <ScrollArea className="h-screen bg-transparent py-3" scrollbarSize={5}>
      <CreatePostModal
        visible={postModalVisible}
        onToggle={setPostModalVisible}
      />
      <Card>
        <Group noWrap className="rounded-md">
          <Avatar color={'primary'} radius="xl">
            JD
          </Avatar>
          <Button
            variant="filled"
            className="flex flex-grow items-start bg-gray-100 hover:bg-gray-200"
            radius="xl"
            onClick={() => setPostModalVisible(true)}
          >
            <Text
              weight={400}
              size="md"
              color="gray"
              className="w-full text-left"
            >
              Write something for the class
            </Text>
          </Button>
          <ActionIcon onClick={() => setPostModalVisible(true)}>
            <Photo />
          </ActionIcon>
          <ActionIcon onClick={() => setPostModalVisible(true)}>
            <File />
          </ActionIcon>
          <ActionIcon onClick={() => setPostModalVisible(true)}>
            <At />
          </ActionIcon>
        </Group>
      </Card>
      <div className="mt-4">
        <Group position="apart">
          <Group spacing="xs">
            <Clock size={14} color={'gray'} />
            <Text size="sm" color={'gray'}>
              Recent discussions
            </Text>
          </Group>
          <ActionIcon size={'sm'} className="mr-2">
            <ArrowsSort color={'gray'} />
          </ActionIcon>
        </Group>
      </div>
      <div>
        {posts.map(post => (
          <PostCard
            key={post.id}
            id={post.id}
            ownerName={post.ownerName}
            content={post.content}
            date={post.date}
            images={post.images || []}
            files={post.files}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
