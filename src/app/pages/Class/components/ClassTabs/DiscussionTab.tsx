import {
  ActionIcon,
  Card,
  Group,
  ScrollArea,
  Text,
  Button,
  Center,
} from '@mantine/core';
import { CreatePostModal } from 'app/components/CreatePostModal/Loadable';
import { Post } from 'app/components/PostCard';
import { PostCard } from 'app/components/PostCard/Loadable';
import { UserAvatar } from 'app/components/UserAvatar';
import { getDocs, orderBy, query, where } from 'firebase/firestore';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { postsColRef } from 'services/firebase';
import { ArrowsSort, At, Clock, File, Photo } from 'tabler-icons-react';
import { selectClassroom } from '../../slice/selectors';

interface Props {
  // someProps: string
}

export function DiscussionTab(props: Props) {
  // const { someProps } = props;

  const classroom = useSelector(selectClassroom);

  const [posts, setPosts] = React.useState<Post[]>([]);
  const [postModalVisible, setPostModalVisible] = React.useState(false);
  const [postsNeedsUpdate, setPostsNeedsUpdate] = React.useState(true);

  React.useEffect(() => {
    const fetchPosts = async () => {
      if (!classroom.activeClass) return;
      if (!postsNeedsUpdate) return;

      // fetch posts with pagination
      const first = query(
        postsColRef,
        where('classId', '==', classroom.activeClass.id),
        orderBy('updatedAt', 'desc'),
        orderBy('createdAt', 'desc'),
        // limit(100),
      );
      const postsDocSnapshot = await getDocs(first);
      const list: Post[] = [];
      postsDocSnapshot.forEach(postDoc => {
        const data = postDoc.data();
        const post = {
          id: postDoc.id,
          classId: data.classId,
          ownerId: data.ownerId,
          content: data.content,
          likes: data.likes,
          numberOfComments: data.numberOfComments,
          createdAt: data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt.toDate().toISOString(),
          images: [],
          files: [],
        };
        list.push(post);
      });
      setPosts(list);
      setPostsNeedsUpdate(false);
    };

    fetchPosts();
  }, [postsNeedsUpdate, classroom.activeClass]);

  const onSeeMorePosts = () => {};

  return (
    <ScrollArea className="h-screen bg-transparent py-3" scrollbarSize={5}>
      <CreatePostModal
        visible={postModalVisible}
        onToggle={setPostModalVisible}
        requestForUpdate={setPostsNeedsUpdate}
      />
      <Card>
        <Group noWrap className="rounded-md">
          <UserAvatar currentUser radius="xl" size="md" />
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
        {posts.length === 0 && (
          <div className="p-6">
            <Text size="sm" color="gray">
              No discussions yet.
            </Text>
          </div>
        )}
        {posts.length > 0 &&
          posts.map(post => (
            <PostCard
              key={post.id}
              classId={post.classId}
              id={post.id}
              ownerId={post.ownerId}
              content={post.content}
              numberOfComments={post.numberOfComments}
              likes={post.likes}
              createdAt={post.createdAt}
              updatedAt={post.updatedAt}
              images={post.images || []}
              files={post.files || []}
              requestForUpdate={setPostsNeedsUpdate}
            />
          ))}
        {posts.length > 0 && (
          <Center className="mt-3">
            <Button color="dark" variant="subtle" onClick={onSeeMorePosts}>
              See more
            </Button>
          </Center>
        )}
      </div>
    </ScrollArea>
  );
}
