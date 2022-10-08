import {
  ActionIcon,
  Card,
  Group,
  ScrollArea,
  Text,
  Button,
  Center,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { CreatePostModal } from 'app/components/CreatePostModal/Loadable';
import { Post } from 'app/components/PostCard';
import { PostCard } from 'app/components/PostCard/Loadable';
import { UserAvatar } from 'app/components/UserAvatar';
import {
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  startAfter,
  where,
} from 'firebase/firestore';
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
  const [hasNoMorePosts, setHasNoMorePosts] = React.useState(false);
  const [canPost, setCanPost] = React.useState(false);
  let lastVisible = React.useRef<QueryDocumentSnapshot<DocumentData> | null>(
    null,
  );
  let postsDocSnapshot = React.useRef<QuerySnapshot<DocumentData> | null>(null);

  const theme = useMantineTheme();
  const isTablet = useMediaQuery(`(min-width: ${theme.breakpoints.md}px)`);

  React.useEffect(() => {
    setCanPost(classroom.canPost);
  }, [classroom.canPost]);

  const fetchPosts = React.useCallback(async () => {
    if (!classroom.activeClass) return;

    // fetch posts with pagination
    const first = query(
      postsColRef,
      where('classId', '==', classroom.activeClass.id),
      orderBy('updatedAt', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(2),
    );
    postsDocSnapshot.current = await getDocs(first);
    populatePosts(postsDocSnapshot.current);
  }, [classroom.activeClass]);

  const populatePosts = (snapshot: QuerySnapshot<DocumentData>) => {
    const list: Post[] = [];
    snapshot.forEach(postDoc => {
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
    setPosts(prev => prev.concat(list));
  };

  React.useEffect(() => {
    fetchPosts();
  }, [classroom.activeClass, fetchPosts]);

  const onSeeMorePosts = async () => {
    if (!postsDocSnapshot.current) return;
    if (!classroom.activeClass) return;
    if (hasNoMorePosts) return;

    lastVisible.current =
      postsDocSnapshot.current.docs[postsDocSnapshot.current.docs.length - 1];

    if (!lastVisible.current) {
      setHasNoMorePosts(true);
      return;
    }

    const next = query(
      postsColRef,
      where('classId', '==', classroom.activeClass.id),
      orderBy('updatedAt', 'desc'),
      orderBy('createdAt', 'desc'),
      startAfter(lastVisible.current),
      limit(2),
    );
    postsDocSnapshot.current = await getDocs(next);
    if (postsDocSnapshot.current.empty) {
      setHasNoMorePosts(true);
      return;
    }

    populatePosts(postsDocSnapshot.current);
  };

  const onPostChanged = (postId: string, changes: {}) => {
    setPosts(current =>
      current.map(obj => {
        if (obj.id === postId) {
          return { ...obj, ...changes };
        }

        return obj;
      }),
    );
  };

  const onPostDeleted = (postId: string) => {
    setPosts(current => current.filter(obj => obj.id !== postId));
  };

  const onPostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <ScrollArea
      className="h-screen w-full bg-transparent py-3"
      scrollbarSize={5}
    >
      <CreatePostModal
        visible={postModalVisible}
        onToggle={setPostModalVisible}
        onPostCreate={onPostCreated}
      />
      {canPost && (
        <Card>
          <Group noWrap className="w-full rounded-md">
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
                className="text-left"
                lineClamp={1}
              >
                Write something for the class
              </Text>
            </Button>
            {isTablet && (
              <Group>
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
            )}
          </Group>
        </Card>
      )}
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
              onPostChange={onPostChanged}
              onPostDelete={onPostDeleted}
            />
          ))}
        {posts.length > 0 && (
          <Center className="mt-3">
            <Button
              color="dark"
              variant="subtle"
              onClick={() => onSeeMorePosts()}
              disabled={hasNoMorePosts}
            >
              {hasNoMorePosts ? 'No more posts to show' : 'See more'}
            </Button>
          </Center>
        )}
      </div>
    </ScrollArea>
  );
}
