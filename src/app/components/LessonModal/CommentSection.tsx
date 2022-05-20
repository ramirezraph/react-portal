import {
  Group,
  ActionIcon,
  Text,
  ScrollArea,
  Textarea,
  Card,
  Divider,
  Stack,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { selectClassroom } from 'app/pages/Class/slice/selectors';
import { ClassRole } from 'app/pages/Class/slice/types';
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { db } from 'services/firebase';
import { selectUser } from 'store/userSlice/selectors';
import { Send, Settings, X } from 'tabler-icons-react';
import { UserAvatar } from '../UserAvatar/Loadable';
import { Comment } from '../Comment';

export interface IComment {
  id: string;
  ownerId: string;
  lessonId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  docRef: DocumentReference<DocumentData>;
}

interface Props {
  lessonId: string;
}

export function CommentSection(props: Props) {
  const { lessonId } = props;

  const { currentUser } = useSelector(selectUser);
  const { activeClassRole } = useSelector(selectClassroom);

  const [newComment, setNewComment] = React.useState('');
  const [sendCommentLoading, setSendCommentLoading] = React.useState(false);
  const [comments, setComments] = React.useState<IComment[]>([]);

  React.useEffect(() => {
    if (!currentUser) return;

    console.log('onSnapshot: lesson comments');

    const q = query(
      collection(db, `lessons/${lessonId}/comments`),
      orderBy('createdAt', 'asc'),
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const list: IComment[] = [];
      querySnapshot.forEach(commentDoc => {
        const data = commentDoc.data();
        const obj: IComment = {
          id: commentDoc.id,
          ownerId: data.ownerId,
          lessonId: data.lessonId,
          comment: data.comment,
          createdAt: data.createdAt && data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt && data.createdAt.toDate().toISOString(),
          docRef: commentDoc.ref,
        };
        list.push(obj);
      });
      setComments(list);
    });

    return () => {
      console.log('onSnapshot: lesson comments - unsubscribe');
      unsubscribe();
      setComments([]);
    };
  }, [currentUser, currentUser?.sub, lessonId]);

  const onCommentChange = (text: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(text.target.value);
  };

  const onComment = async () => {
    if (!currentUser) return;
    if (!newComment) return;
    if (!lessonId) return;

    setSendCommentLoading(true);

    const comment = {
      ownerId: currentUser.sub,
      lessonId: lessonId,
      comment: newComment,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, `lessons/${lessonId}/comments`), comment);
      const lessonDocRef = doc(db, 'lessons', lessonId);
      await updateDoc(lessonDocRef, {
        numberOfComments: increment(1),
      });

      // reset
      setNewComment('');
    } catch (e) {
      showNotification({
        title: 'Failed',
        message: `Failed to comment. \n${e}`,
        color: 'red',
        icon: <X />,
      });
    } finally {
      setSendCommentLoading(false);
    }
  };

  return (
    <Card className="flex-grow" radius={0}>
      <Card.Section className="p-4">
        <Group position="apart">
          <Text className="font-semibold">Comments</Text>
          {activeClassRole === ClassRole.Teacher && (
            <ActionIcon size="lg">
              <Settings />
            </ActionIcon>
          )}
        </Group>
      </Card.Section>
      <Card.Section>
        <Divider />
      </Card.Section>
      {lessonId && (
        <Card.Section>
          <ScrollArea
            style={{
              height: '70vh',
            }}
            className="relative bg-document"
          >
            <Stack className="p-4">
              {comments.map(comment => (
                <Card key={comment.id} className="bg-white" radius="md">
                  <Comment
                    id={comment.id}
                    comment={comment.comment}
                    ownerId={comment.ownerId}
                    createdAt={comment.createdAt}
                    docRef={comment.docRef}
                  />
                </Card>
              ))}
            </Stack>
            <Group
              spacing="xs"
              className="absolute bottom-0 w-full bg-white p-4"
              noWrap
            >
              <UserAvatar currentUser radius="xl" size="md" />
              <Textarea
                placeholder="Write a comment"
                radius="xl"
                className="flex-grow"
                autosize
                value={newComment}
                onChange={onCommentChange}
              />
              <ActionIcon onClick={onComment} loading={sendCommentLoading}>
                <Send />
              </ActionIcon>
            </Group>
          </ScrollArea>
        </Card.Section>
      )}
    </Card>
  );
}
