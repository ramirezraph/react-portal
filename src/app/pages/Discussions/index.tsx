import { Button, Group, Menu, Text, TextInput } from '@mantine/core';
import { PageContainer } from 'app/components/PageContainer/Loadable';
import { Post } from 'app/components/PostCard';
import { PostCard } from 'app/components/PostCard/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Adjustments, Search, Settings } from 'tabler-icons-react';

export function Discussions() {
  const [posts] = React.useState<Post[]>([]);
  const [_, setPostsNeedsUpdate] = React.useState(true);

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
              classId={''}
              id={post.id}
              ownerId={post.ownerId}
              content={post.content}
              likes={0}
              numberOfComments={0}
              createdAt={''}
              updatedAt={''}
              images={post.images || []}
              files={post.files}
              requestForUpdate={setPostsNeedsUpdate}
            />
          ))}
        </div>
      </PageContainer>
    </>
  );
}
