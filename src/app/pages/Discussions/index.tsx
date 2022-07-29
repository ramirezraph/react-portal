import { Button, Group, Menu, Text, TextInput } from '@mantine/core';
import { PageContainer } from 'app/components/PageContainer/Loadable';
import { Post } from 'app/components/PostCard';
import { PostCard } from 'app/components/PostCard/Loadable';
import { getDocs, orderBy, query, where } from 'firebase/firestore';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { postsColRef } from 'services/firebase';
import { Adjustments, Search, Settings } from 'tabler-icons-react';
import { selectClasses } from '../Classes/slice/selectors';

export function Discussions() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [postsNeedsUpdate, setPostsNeedsUpdate] = React.useState(true);

  const { classes } = useSelector(selectClasses);

  const getClassesIds = React.useMemo(() => {
    return classes.map(x => x.id);
  }, [classes]);

  React.useEffect(() => {
    if (getClassesIds.length === 0) return;

    const fetchPosts = async () => {
      if (!postsNeedsUpdate) return;

      const first = query(
        postsColRef,
        where('classId', 'in', getClassesIds),
        orderBy('updatedAt', 'desc'),
        orderBy('createdAt', 'desc'),
        // limit(100),
      );
      const postsDocSnapshot = await getDocs(first);
      const list: Post[] = [];
      postsDocSnapshot.forEach(postDoc => {
        console.log('snapshot runs');

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
  }, [getClassesIds, postsNeedsUpdate]);

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
        {/* {posts.length > 0 &&
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
              // requestForUpdate={setPostsNeedsUpdate}
              showClassInfo
            />
          ))} */}
      </PageContainer>
    </>
  );
}
