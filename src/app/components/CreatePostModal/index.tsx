import {
  Button,
  Collapse,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
} from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import RichTextEditor from '@mantine/rte';
import { addDoc, Timestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as React from 'react';
import { postFilesColRef, storage } from 'services/firebase';
import { Photo, File, Check, X } from 'tabler-icons-react';
import { ImageDropzone } from '../ImageDropzone/Loadable';
import { ImagesGrid } from '../ImagesGrid/Loadable';
import { v4 as uuidv4 } from 'uuid';
import { IImage } from '../ImagesGrid';

interface Props {
  visible: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreatePostModal(props: Props) {
  const { visible, onToggle } = props;
  const [value, onChange] = React.useState('');

  const [imageDropzoneVisible, setImageDropzoneVisible] = React.useState(false);
  const [temporaryImages, setTemporaryImages] = React.useState<IImage[]>([]);
  const [images, setImages] = React.useState<{ id: string; file: File }[]>([]);

  const onImageDropReject = () => {};

  const onImageUpload = (files: File[]) => {
    // display image image grid
    const list: IImage[] = [];
    const temp: { id: string; file: File }[] = [];
    for (const image of files) {
      const uuid = uuidv4();
      list.push({
        id: uuid,
        name: image.name,
        url: URL.createObjectURL(image),
      });
      temp.push({
        id: uuid,
        file: image,
      });
    }
    setImages([...images, ...temp]);
    setTemporaryImages([...temporaryImages, ...list]);
  };

  const onImageRemove = (image: IImage) => {
    setTemporaryImages([...temporaryImages.filter(x => x.id !== image.id)]);
    setImages([...images.filter(x => x.id !== image.id)]);
  };

  const onSubmitPost = () => {
    // upload files
    // save on firestore
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
        <Button size="md" className="mt-3 w-full" onClick={onSubmitPost}>
          POST
        </Button>
      </Stack>
    </Modal>
  );
}
