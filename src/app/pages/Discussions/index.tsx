import { Button, Center, Group, Menu, Text, TextInput } from '@mantine/core';
import { PageContainer } from 'app/components/PageContainer/Loadable';
import { Post } from 'app/components/PostCard';
import { PostCard } from 'app/components/PostCard/Loadable';
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
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { postsColRef } from 'services/firebase';
import { Adjustments, Search, Settings } from 'tabler-icons-react';
import { selectClasses } from '../Classes/slice/selectors';

export function Discussions() {
  const { classes } = useSelector(selectClasses);

  const [posts, setPosts] = React.useState<Post[]>([]);
  const [hasNoMorePosts, setHasNoMorePosts] = React.useState(false);

  let lastVisible = React.useRef<QueryDocumentSnapshot<DocumentData> | null>(
    null,
  );
  let postsDocSnapshot = React.useRef<QuerySnapshot<DocumentData> | null>(null);

  const getClassesIds = React.useMemo(() => {
    return classes.map(x => x.id);
  }, [classes]);

  const fetchPosts = React.useCallback(async () => {
    if (getClassesIds.length === 0) return;

    // fetch posts with pagination
    const first = query(
      postsColRef,
      where('classId', 'in', getClassesIds),
      orderBy('updatedAt', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(4),
    );
    postsDocSnapshot.current = await getDocs(first);
    populatePosts(postsDocSnapshot.current);
  }, [getClassesIds]);

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
  }, [fetchPosts, getClassesIds]);

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

  const onSeeMorePosts = async () => {
    if (!postsDocSnapshot.current) return;
    if (hasNoMorePosts) return;

    lastVisible.current =
      postsDocSnapshot.current.docs[postsDocSnapshot.current.docs.length - 1];

    if (!lastVisible.current) {
      setHasNoMorePosts(true);
      return;
    }

    const next = query(
      postsColRef,
      where('classId', 'in', getClassesIds),
      orderBy('updatedAt', 'desc'),
      orderBy('createdAt', 'desc'),
      startAfter(lastVisible.current),
      limit(3),
    );
    postsDocSnapshot.current = await getDocs(next);
    if (postsDocSnapshot.current.empty) {
      setHasNoMorePosts(true);
      return;
    }

    populatePosts(postsDocSnapshot.current);
  };

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
              showClassInfo
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
      </PageContainer>
    </>
  );
}
