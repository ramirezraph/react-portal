import { Button, Group, Menu, Text, TextInput } from '@mantine/core';
import { PageContainer } from 'app/components/PageContainer/Loadable';
import { Post } from 'app/components/PostCard';
import { PostCard } from 'app/components/PostCard/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Adjustments, Search, Settings } from 'tabler-icons-react';

export function Discussions() {
  const [posts, setPosts] = React.useState<Post[]>([]);

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
    <>
      <Helmet>
        <title>Discussions</title>
      </Helmet>
      <PageContainer className="pr-48">
        <Text weight="bold" className="pt-6">
          Discussions
        </Text>
        <Group spacing={'xs'}>
          <Menu
            className="pt-6"
            control={
              <Button
                leftIcon={<Adjustments size={19} color="gray" />}
                color="gray"
                variant="default"
                size="md"
              >
                <Text size="sm" weight={400} color="black">
                  All Classes
                </Text>
              </Button>
            }
          >
            <Menu.Item icon={<Settings size={14} />}>Settings</Menu.Item>
          </Menu>
          <Menu
            className="pt-6"
            control={
              <Button
                leftIcon={<Adjustments size={19} color="gray" />}
                color="gray"
                variant="default"
                size="md"
              >
                <Text size="sm" weight={400} color="black">
                  Newest
                </Text>
              </Button>
            }
          >
            <Menu.Item icon={<Settings size={14} />}>Settings</Menu.Item>
          </Menu>
          <TextInput
            className="flex-grow pt-6"
            placeholder="Search"
            size="md"
            required
            icon={<Search size={20} />}
          />
        </Group>

        <div>
          {posts.map(post => (
            <PostCard
              key={post.id}
              id={post.id}
              ownerName={post.ownerName}
              content={post.content}
              date={post.date}
              images={post.images}
              files={post.files}
            />
          ))}
        </div>
      </PageContainer>
    </>
  );
}
