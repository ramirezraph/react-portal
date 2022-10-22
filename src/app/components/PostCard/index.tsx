import {
  Card,
  Stack,
  Avatar,
  ActionIcon,
  Button,
  Text,
  Popover,
  Tooltip,
  Menu,
  Divider,
  Group,
  Textarea,
  Collapse,
} from '@mantine/core';
import * as React from 'react';
import {
  ThumbUp,
  Message,
  Download,
  Files,
  Pin,
  Trash,
  Pencil,
  Check,
  X,
  Send,
} from 'tabler-icons-react';
import { ImagesGrid } from '../ImagesGrid/Loadable';
import { PostFiles } from './PostFiles';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Unsubscribe,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, postFilesColRef, storage } from 'services/firebase';
import { useSelector } from 'react-redux';
import { selectUser } from 'store/userSlice/selectors';
import { deleteObject, ref } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useModals } from '@mantine/modals';
import { UserAvatar } from '../UserAvatar/Loadable';
import { Comment } from '../Comment';
import { getNameAndPicture } from 'utils/userUtils';
import parse from 'html-react-parser';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  canUserComment,
  getClassNameAndCode,
  getUserRole,
} from 'utils/classUtils';
import _ from 'underscore';
dayjs.extend(relativeTime);

export interface IFile {
  id: string;
  name: string;
  size: number;
  type: string;
  downloadUrl: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
  fullPath: string;
}

export interface Post {
  id: string;
  classId: string;
  ownerId: string;
  content: string;
  likes: number;
  numberOfComments: number;
  createdAt: string;
  updatedAt: string;
  images: IFile[];
  files: IFile[];
}

interface IComment {
  id: string;
  ownerId: string;
  postId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  docRef: DocumentReference<DocumentData>;
}

interface Prop {
  id: string;
  classId: string;
  ownerId: string;
  content: string;
  likes: number;
  numberOfComments: number;
  createdAt: string;
  updatedAt: string;
  images: IFile[];
  files: IFile[];
  showClassInfo?: boolean;
  onPostChange: (postId: string, updatedPost: {}) => void;
  onPostDelete: (postId: string) => void;
}

export function PostCard(props: Prop) {
  const {
    id,
    classId,
    ownerId,
    createdAt,
    content,
    files,
    likes,
    numberOfComments,
    showClassInfo,
    onPostChange,
    onPostDelete,
  } = props;

  const modals = useModals();
  const { currentUser } = useSelector(selectUser);

  const [opened, setOpened] = React.useState(false);
  const [imageList, setImageList] = React.useState<IFile[]>([]);
  const [ownerFullname, setOwnerFullname] = React.useState('');
  const [ownerPicture, setOwnerPicture] = React.useState('');
  const [isEditable, setIsEditable] = React.useState(false);
  const [isCommentsVisible, setCommentsVisible] = React.useState(false);
  const [newComment, setNewComment] = React.useState('');
  const [comments, setComments] = React.useState<IComment[]>([]);
  const [classTitle, setClassTitle] = React.useState('');
  const [classCode, setClassCode] = React.useState('');
  const [isLiked, setIsLiked] = React.useState(false);
  const [canComment, setCanComment] = React.useState(true);
  const [hasMoreComments, setHasMoreComments] = React.useState(false);
  let page_limit = React.useRef(2);
  let commentsUnsubscribe = React.useRef<Unsubscribe | null>(null);

  React.useEffect(() => {
    const getOwnerInfo = async () => {
      const nameAndPicture = await getNameAndPicture(ownerId);
      if (nameAndPicture) {
        const { fullname, picture } = nameAndPicture;

        setOwnerFullname(fullname);
        setOwnerPicture(picture);
      }
    };

    getOwnerInfo();

    return () => {
      setOwnerFullname('');
      setOwnerPicture('');
    };
  }, [ownerId]);

  React.useEffect(() => {
    if (!showClassInfo) return;

    const getClassInfo = async () => {
      const nameAndCode = await getClassNameAndCode(classId);
      if (nameAndCode) {
        const { name, code } = nameAndCode;

        setClassTitle(name);
        setClassCode(code);
      }
    };

    getClassInfo();

    return () => {
      setClassTitle('');
      setClassCode('');
    };
  }, [classId, showClassInfo]);

  React.useEffect(() => {
    const fetchImages = async () => {
      // get images
      const q = query(postFilesColRef, where('postId', '==', id));
      const imagesDocSnapshot = await getDocs(q);
      if (imagesDocSnapshot.empty) return;

      const list: IFile[] = [];
      imagesDocSnapshot.forEach(imageDoc => {
        const data = imageDoc.data();
        const image = {
          id: imageDoc.id,
          name: data.name,
          size: data.size,
          type: data.type,
          downloadUrl: data.downloadUrl,
          postId: data.postId,
          fullPath: data.fullPath,
          createdAt: data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt.toDate().toISOString(),
        };
        list.push(image);
      });
      setImageList(list);
    };

    fetchImages();

    return () => {
      setImageList([]);
    };
  }, [id, numberOfComments]);

  React.useEffect(() => {
    if (currentUser?.sub === ownerId) {
      setIsEditable(true);
    }
  }, [currentUser?.sub, ownerId, setIsEditable]);

  const fetchComments = React.useCallback(async () => {
    if (!currentUser) return;
    if (!isCommentsVisible) return;
    if (commentsUnsubscribe.current) {
      // unsubscribe
      commentsUnsubscribe.current();
    }

    console.log('onSnapshot: comments');

    const q = query(
      collection(db, `posts/${id}/comments`),
      orderBy('createdAt', 'desc'),
      limit(page_limit.current),
    );

    if (page_limit.current < numberOfComments) {
      setHasMoreComments(true);
    } else {
      setHasMoreComments(false);
    }

    commentsUnsubscribe.current = onSnapshot(q, querySnapshot => {
      const list: IComment[] = [];
      querySnapshot.forEach(commentDoc => {
        const data = commentDoc.data();
        const obj: IComment = {
          id: commentDoc.id,
          ownerId: data.ownerId,
          postId: data.postId,
          comment: data.comment,
          createdAt: data.createdAt && data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt && data.createdAt.toDate().toISOString(),
          docRef: commentDoc.ref,
        };
        list.push(obj);
      });
      setComments(list.reverse());
    });
  }, [currentUser, id, isCommentsVisible, numberOfComments]);

  React.useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const viewMoreComments = () => {
    page_limit.current = page_limit.current + 4;
    fetchComments();
  };

  const onEdit = () => {};

  const openConfirmDeleteModal = () => {
    modals.openConfirmModal({
      title: `Delete post?`,
      centered: true,
      confirmProps: { color: 'red' },
      zIndex: 999,
      trapFocus: true,
      closeOnClickOutside: false,
      children: (
        <div className="pb-3">
          <Text size="sm">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </Text>
        </div>
      ),
      labels: { confirm: 'Delete post', cancel: "No, don't delete" },
      onConfirm: () => onDelete(),
    });
  };

  const onDelete = async () => {
    const notificationId = uuidv4();
    try {
      showNotification({
        id: notificationId,
        loading: true,
        title: 'In progress',
        message: `Deleting post ...`,
        autoClose: false,
        disallowClose: true,
      });
      await deleteDoc(doc(db, 'posts', id));
      if (imageList.length === 0) {
        onPostDelete(id);
        updateNotification({
          id: notificationId,
          title: 'Success',
          message: `Post deleted successfully.`,
          color: 'green',
          icon: <Check />,
        });
        return;
      }
      for (const item of imageList) {
        const fileStorageRef = ref(storage, item.fullPath);
        await deleteObject(fileStorageRef);
        await deleteDoc(doc(db, 'post-files', item.id));
        onPostDelete(id);
        updateNotification({
          id: notificationId,
          title: 'Success',
          message: `Post deleted successfully.`,
          color: 'green',
          icon: <Check />,
        });
      }
    } catch (e) {
      updateNotification({
        id: notificationId,
        title: 'Failed',
        message: `Post delete failed.\n${e}`,
        color: 'red',
        icon: <X />,
      });
    }
  };

  const onCommentChange = (text: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(text.target.value);
  };

  const onComment = async () => {
    if (!currentUser) return;
    if (!newComment) return;

    const comment = {
      ownerId: currentUser.sub,
      postId: id,
      comment: newComment,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, `posts/${id}/comments`), comment);
      const postDocRef = doc(db, 'posts', id);
      await updateDoc(postDocRef, {
        numberOfComments: increment(1),
      });
      onPostChange(id, { numberOfComments: numberOfComments + 1 });
      // reset
      setNewComment('');
    } catch (e) {
      showNotification({
        title: 'Failed',
        message: `Failed to comment. \n${e}`,
        color: 'red',
        icon: <X />,
      });
    }
  };

  const onLikePost = async () => {
    if (!currentUser?.sub) return;

    const newLike = {
      createdAt: serverTimestamp(),
    };

    const batches = writeBatch(db);
    const likesRef = doc(db, `posts/${id}/likes`, currentUser.sub);
    batches.set(likesRef, newLike);
    const postDocRef = doc(db, 'posts', id);
    batches.update(postDocRef, {
      likes: increment(1),
    });
    await batches.commit();

    onPostChange(id, { likes: likes + 1 });
    setIsLiked(true);
  };
  const like = _.debounce(onLikePost, 500, true);

  const onUnlikePost = async () => {
    if (!currentUser?.sub) return;

    const batches = writeBatch(db);
    const likesRef = doc(db, `posts/${id}/likes`, currentUser.sub);
    batches.delete(likesRef);
    const postDocRef = doc(db, 'posts', id);
    batches.update(postDocRef, {
      likes: increment(-1),
    });
    await batches.commit();
    setIsLiked(false);
    onPostChange(id, { likes: likes - 1 });
  };
  const unlike = _.debounce(onUnlikePost, 500, true);

  React.useEffect(() => {
    const checkIfLiked = async () => {
      if (!currentUser?.sub) return;

      const likesRef = doc(db, `posts/${id}/likes`, currentUser.sub);
      const docRef = await getDoc(likesRef);
      if (docRef.exists()) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    };

    checkIfLiked();
  }, [currentUser?.sub, id]);

  React.useEffect(() => {
    const getClassPermissions = async () => {
      if (!currentUser?.sub) return;

      const docRef = doc(db, 'classes', classId);
      const classDocSnap = await getDoc(docRef);
      if (!classDocSnap.exists()) {
        return;
      }

      const data = classDocSnap.data();
      const permissions: Map<String, String> = data.permissions;
      const role = await getUserRole(currentUser.sub, classId);
      if (!role) return;
      const canCommentResult = canUserComment(role, permissions);
      setCanComment(canCommentResult);
    };

    getClassPermissions();
  }, [classId, currentUser?.sub]);

  return (
    <Card className="mt-3 rounded-md">
      <Group direction="row" noWrap>
        <Avatar
          src={ownerPicture}
          color={'primary'}
          radius="xl"
          className="hidden self-start md:inline"
        />
        <Group direction="column" className="flex-grow" noWrap>
          <Group direction="row" position="apart" className="w-full" noWrap>
            <Avatar
              src={ownerPicture}
              color={'primary'}
              radius="xl"
              className="self-center md:hidden"
            />
            <div className="flex-grow">
              <Text className="font-semibold">{ownerFullname}</Text>
              <Text color={'gray'} size="xs">
                {dayjs(createdAt).fromNow()}
              </Text>
            </div>
            {isEditable && (
              <Menu position="right" className="self-start">
                <Menu.Item icon={<Pin size={16} />}>Pin on top</Menu.Item>
                <Menu.Item icon={<Pencil size={16} />} onClick={onEdit}>
                  Edit
                </Menu.Item>
                <Divider />
                <Menu.Item
                  icon={<Trash size={16} color="red" />}
                  onClick={() => openConfirmDeleteModal()}
                >
                  <Text size="sm" color="red">
                    Delete
                  </Text>
                </Menu.Item>
              </Menu>
            )}
          </Group>
          {content !== '<p><br></p>' && content !== '<p></p>' && (
            <div>{parse(content)}</div>
          )}
          <ImagesGrid images={imageList} />
          <Group className="w-full" position="apart" noWrap>
            <Group>
              <Button
                variant="subtle"
                compact
                color={isLiked ? 'primary' : 'dark'}
                className="px-0"
                onClick={isLiked ? unlike : like}
              >
                <ThumbUp />
                {likes > 0 && <Text className="ml-2">{likes}</Text>}
              </Button>
              <Button
                variant="subtle"
                compact
                color={isCommentsVisible ? 'primary' : 'dark'}
                className="px-0"
                onClick={() => setCommentsVisible(x => !x)}
              >
                <Message />
                {numberOfComments > 0 && (
                  <Text className="ml-2">{numberOfComments}</Text>
                )}
              </Button>
            </Group>
            <Text size="sm" color="gray">
              {classCode} - {classTitle}
            </Text>
            {files && files?.length > 0 && (
              <Group>
                <Tooltip label="Attached files" position="bottom" withArrow>
                  <Popover
                    opened={opened}
                    onClose={() => setOpened(false)}
                    target={
                      <Button
                        variant="subtle"
                        color={'dark'}
                        className="px-1"
                        onClick={() => setOpened(o => !o)}
                      >
                        <Files />
                        <Text className="ml-2">{files.length}</Text>
                      </Button>
                    }
                    width={300}
                    position="left"
                  >
                    <PostFiles files={files} />
                  </Popover>
                </Tooltip>

                <Tooltip
                  label="Download All"
                  position="bottom"
                  withArrow
                  className="m-0 p-0"
                >
                  <ActionIcon>
                    <Download />
                  </ActionIcon>
                </Tooltip>
              </Group>
            )}
          </Group>
          <Collapse in={isCommentsVisible} className="w-full">
            <Stack className="w-full">
              {hasMoreComments && (
                <Button
                  variant="subtle"
                  color="dark"
                  size="xs"
                  compact
                  className="w-fit"
                  onClick={viewMoreComments}
                >
                  <Text size="sm" weight="bold">
                    View more comments
                  </Text>
                </Button>
              )}
              <Stack spacing="xs">
                {comments.map(comment => (
                  <Comment
                    key={comment.id}
                    id={comment.id}
                    comment={comment.comment}
                    ownerId={comment.ownerId}
                    createdAt={comment.createdAt}
                    docRef={comment.docRef}
                  />
                ))}
              </Stack>
              {canComment && <Divider />}
              {canComment && (
                <Group spacing="xs" className="w-full" noWrap>
                  <UserAvatar currentUser radius="xl" size="md" />
                  <Textarea
                    placeholder="Write a comment"
                    radius="xl"
                    className="flex-grow"
                    autosize
                    value={newComment}
                    onChange={onCommentChange}
                  />
                  <ActionIcon onClick={onComment}>
                    <Send />
                  </ActionIcon>
                </Group>
              )}
            </Stack>
          </Collapse>
        </Group>
      </Group>
    </Card>
  );
}
