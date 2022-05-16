import {
  Button,
  Collapse,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
} from '@mantine/core';
import RichTextEditor from '@mantine/rte';
import * as React from 'react';
import { Photo, File, Check, X } from 'tabler-icons-react';
import { ImageDropzone } from '../ImageDropzone/Loadable';
import { ImagesGrid } from '../ImagesGrid/Loadable';
import { v4 as uuidv4 } from 'uuid';
import { addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { postFilesColRef, postsColRef, storage } from 'services/firebase';
import { useAuth0 } from '@auth0/auth0-react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useSelector } from 'react-redux';
import { selectClassroom } from 'app/pages/Class/slice/selectors';
import { IFile } from '../PostCard';

interface Props {
  visible: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
  requestForUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreatePostModal(props: Props) {
  const { visible, onToggle, requestForUpdate } = props;

  const classroom = useSelector(selectClassroom);

  const { user } = useAuth0();
  const [value, onChange] = React.useState('');
  const [imageDropzoneVisible, setImageDropzoneVisible] = React.useState(false);
  const [temporaryImages, setTemporaryImages] = React.useState<IFile[]>([]);
  const [images, setImages] = React.useState<{ id: string; file: File }[]>([]);
  const [loading, setLoading] = React.useState(false);

  const onImageDropReject = () => {};

  const onImageUpload = (files: File[]) => {
    // display image image grid
    const list: IFile[] = [];
    const temp: { id: string; file: File }[] = [];
    for (const image of files) {
      const uuid = uuidv4();
      list.push({
        id: uuid,
        name: image.name,
        size: image.size,
        type: image.type,
        downloadUrl: URL.createObjectURL(image),
        postId: '',
        createdAt: '',
        updatedAt: '',
        fullPath: '',
      });
      temp.push({
        id: uuid,
        file: image,
      });
    }
    setImages([...images, ...temp]);
    setTemporaryImages([...temporaryImages, ...list]);
  };

  const onImageRemove = (image: IFile) => {
    setTemporaryImages([...temporaryImages.filter(x => x.id !== image.id)]);
    setImages([...images.filter(x => x.id !== image.id)]);
  };

  const onSubmitPost = async () => {
    if (!user) return;
    if (!classroom.activeClass) return;

    setLoading(true);

    const notificationId = uuidv4();
    showNotification({
      id: notificationId,
      loading: true,
      title: 'In progress',
      message: `Creating the post ...`,
      autoClose: false,
      disallowClose: true,
    });

    try {
      const newPost = {
        classId: classroom.activeClass.id,
        ownerId: user.sub,
        content: value,
        likes: 0,
        numberOfComments: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const newPostDoc = await addDoc(postsColRef, newPost);
      onToggle(false);

      if (images.length === 0) {
        requestForUpdate(true);
        onToggle(false);

        updateNotification({
          id: notificationId,
          title: 'Success',
          message: `Your post is now live!`,
          color: 'green',
          icon: <Check />,
        });
        resetForm();

        return;
      }

      for (const image of images) {
        const storageRef = ref(
          storage,
          `posts/${newPostDoc.id}/${image.file.name}`,
        );

        const fileStorageSnapshot = await uploadBytes(storageRef, image.file);
        const fileData = fileStorageSnapshot.ref;
        const downloadUrl = await getDownloadURL(
          ref(storage, fileData.fullPath),
        );

        await addDoc(postFilesColRef, {
          name: image.file.name,
          type: image.file.type,
          size: image.file.size,
          postId: newPostDoc.id,
          fullPath: fileData.fullPath,
          downloadUrl: downloadUrl,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          deletedAt: null,
        });
      }

      requestForUpdate(true);

      updateNotification({
        id: notificationId,
        title: 'Success',
        message: `Your post is now live!`,
        color: 'green',
        icon: <Check />,
      });

      resetForm();
    } catch (e) {
      console.log(e);

      updateNotification({
        id: notificationId,
        title: 'Failed',
        message: `Post create failed.`,
        color: 'red',
        icon: <X />,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    onChange('');
    setImageDropzoneVisible(false);
    setTemporaryImages([]);
    setImages([]);
  };

  return (
    <Modal
      withCloseButton={false}
      opened={visible}
      onClose={() => onToggle(false)}
      centered
      size={700}
    >
      <Group position="apart">
        <Text size="xl" weight={'bold'}>
          Create post
        </Text>
        <Button size="md" variant="default" onClick={() => onToggle(false)}>
          Close
        </Button>
      </Group>
      <Divider my="sm" />
      <Stack>
        <Stack
          style={{
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          <RichTextEditor
            value={value}
            onChange={onChange}
            controls={[
              ['bold', 'italic', 'underline', 'strike'],
              ['h1', 'h2', 'h3', 'orderedList', 'unorderedList'],
              ['sup', 'sub'],
              ['alignLeft', 'alignCenter', 'alignRight'],
              ['blockquote', 'codeBlock'],
            ]}
            className="text-xl"
            sticky
            placeholder="Write something for the class"
          />
          <ImagesGrid
            images={temporaryImages}
            isOnEdit={true}
            onImageRemove={onImageRemove}
          />
          <Collapse in={imageDropzoneVisible}>
            <ImageDropzone
              visible={true}
              onFileUpload={onImageUpload}
              onReject={onImageDropReject}
              onClose={() => setImageDropzoneVisible(false)}
            />
          </Collapse>
        </Stack>
        <Group>
          <Button
            variant="subtle"
            leftIcon={<Photo />}
            onClick={() => setImageDropzoneVisible(x => !x)}
          >
            Add a photo
          </Button>
          <Button variant="subtle" leftIcon={<File />}>
            Attach a file
          </Button>
        </Group>
        <Button
          loading={loading}
          size="md"
          className="mt-3 w-full"
          onClick={() => onSubmitPost()}
        >
          POST
        </Button>
      </Stack>
    </Modal>
  );
}
