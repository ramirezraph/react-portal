import {
  Card,
  Group,
  Avatar,
  ActionIcon,
  Button,
  Text,
  Popover,
  Tooltip,
  Menu,
  Divider,
} from '@mantine/core';
import moment from 'moment';
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
} from 'tabler-icons-react';
import { ImagesGrid } from '../ImagesGrid/Loadable';
import { PostFiles } from './PostFiles';
import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db, postFilesColRef, storage } from 'services/firebase';
import RichTextEditor from '@mantine/rte';
import { useSelector } from 'react-redux';
import { selectUser } from 'store/userSlice/selectors';
import { deleteObject, ref } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useModals } from '@mantine/modals';

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
  requestForUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

export function PostCard(props: Prop) {
  const {
    id,
    ownerId,
    createdAt,
    content,
    files,
    likes,
    numberOfComments,
    requestForUpdate,
  } = props;

  const modals = useModals();
  const { currentUser } = useSelector(selectUser);

  const [opened, setOpened] = React.useState(false);
  const [value, onChange] = React.useState(content);
  const [imageList, setImageList] = React.useState<IFile[]>([]);
  const [ownerFullname, setOwnerFullname] = React.useState(content);
  const [isEditable, setIsEditable] = React.useState(false);

  React.useEffect(() => {
    const getOwnerInfo = async () => {
      // get post owner info
      const userDocRef = doc(db, 'users', ownerId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const firstName = userDocSnap.data().firstName;
        const lastName = userDocSnap.data().lastName;
        setOwnerFullname(`${firstName} ${lastName}`);
      }
    };

    getOwnerInfo();
  }, [ownerId]);

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
  }, [id]);

  React.useEffect(() => {
    if (currentUser?.sub === ownerId) {
      setIsEditable(true);
    }
  }, [currentUser?.sub, ownerId, setIsEditable]);

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
        requestForUpdate(true);
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
        requestForUpdate(true);
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

  return (
    <Card className="mt-3 rounded-md">
      <Group direction="row" noWrap>
        <Avatar color={'primary'} radius="xl" className="self-start" />
        <Group direction="column" className="flex-grow" noWrap>
          <Group direction="row" position="apart" className="w-full" noWrap>
            <div className="flex-grow">
              <Text className="font-semibold">{ownerFullname}</Text>
              <Text color={'gray'} size="xs">
                {moment(createdAt).fromNow()}
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
          {content.length > 0 && content !== '<p><br></p>' && (
            <RichTextEditor
              value={value}
              readOnly
              onChange={onChange}
              className="w-full border-none text-xl"
            />
          )}
          <ImagesGrid images={imageList} />
          <Group className="w-full" position="apart" noWrap>
            <Group>
              <Button variant="subtle" compact color={'dark'} className="px-0">
                <ThumbUp />
                {likes > 0 && <Text className="ml-2">{likes}</Text>}
              </Button>
              <Button variant="subtle" compact color={'dark'} className="px-0">
                <Message />
                {numberOfComments > 0 && (
                  <Text className="ml-2">{numberOfComments}</Text>
                )}
              </Button>
            </Group>
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
        </Group>
      </Group>
    </Card>
  );
}
