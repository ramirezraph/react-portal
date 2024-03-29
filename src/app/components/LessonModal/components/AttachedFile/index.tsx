import {
  Group,
  ActionIcon,
  Text,
  Button,
  Tooltip,
  Stack,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import axios from 'axios';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import * as React from 'react';
import { db, storage } from 'services/firebase';
import FsLightbox from 'fslightbox-react';

import {
  Pencil,
  At,
  Download,
  Trash,
  File,
  Check,
  X,
  Photo,
  Video,
  Link,
  ExternalLink,
} from 'tabler-icons-react';
import { v4 as uuidv4 } from 'uuid';
import { IMAGE_MIME_TYPE, MIME_TYPES } from '@mantine/dropzone';
import { useMediaQuery } from '@mantine/hooks';

interface Prop {
  id: string;
  name: string;
  type: string;
  lessonId: string;
  createdAt: string;
  updatedAt: string;
  kind: 'link' | 'file';
  url?: string;
  fullPath?: string;
  size?: number;
  downloadUrl?: string;
  compact?: boolean;
  className?: string;
  textClassName?: string;
  viewOnly?: boolean;
  onTitleClicked?: () => void;
}

export function AttachedFile(props: Prop) {
  const modals = useModals();

  const {
    kind,
    id,
    name,
    compact,
    className,
    textClassName,
    viewOnly,
    downloadUrl,
    url,
    fullPath,
    type,
  } = props;

  const [ligthBoxToggler, setLigthBoxToggler] = React.useState(false);
  const [isOnEditMode, setIsOnEditMode] = React.useState(false);
  const [fileNameOnEdit, setFileNameOnEdit] = React.useState(name);
  let editFileNameTemp = React.useRef('');
  let editFileExtTemp = React.useRef('');

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  React.useEffect(() => {
    if (!name) return;

    const nameOnEdit = name.replace(/\.[^/.]+$/, '');
    editFileNameTemp.current = nameOnEdit;
    // gets the file extension
    const ext = name.slice(((name.lastIndexOf('.') - 1) >>> 0) + 2);
    if (ext) editFileExtTemp.current = ext;
    setFileNameOnEdit(nameOnEdit);
  }, [name]);

  const openConfirmDeleteModal = () => {
    modals.openConfirmModal({
      title: `Delete ${name}?`,
      centered: true,
      confirmProps: { color: 'red' },
      zIndex: 999,
      trapFocus: true,
      closeOnClickOutside: false,
      children: (
        <div className="pb-3">
          <Text size="sm">
            Are you sure you want to delete this{' '}
            {kind === 'file' ? 'file' : 'link'}? This action cannot be undone.
          </Text>
        </div>
      ),
      labels: {
        confirm: `Delete ${kind === 'file' ? 'file' : 'link'}`,
        cancel: "No, don't delete",
      },
      onConfirm: () => onDelete(),
    });
  };

  const onDelete = () => {
    const notificationId = uuidv4();

    if (kind === 'link') {
      showNotification({
        id: notificationId,
        loading: true,
        title: 'In progress',
        message: `Deleting link ${name} ...`,
        autoClose: false,
        disallowClose: true,
      });

      const fileFirestoreRef = doc(db, 'lesson-files', id);
      deleteDoc(fileFirestoreRef)
        .then(() => {
          updateNotification({
            id: notificationId,
            title: 'Success',
            message: `Link ${name} deleted successfully.`,
            color: 'green',
            icon: <Check />,
          });
        })
        .catch(e => {
          updateNotification({
            id: notificationId,
            title: 'Failed',
            message: `Link ${name} delete failed.`,
            color: 'red',
            icon: <X />,
          });
        });

      return;
    }

    showNotification({
      id: notificationId,
      loading: true,
      title: 'In progress',
      message: `Deleting file ${name} ...`,
      autoClose: false,
      disallowClose: true,
    });

    // delete from storage
    const fileStorageRef = ref(storage, fullPath);
    deleteObject(fileStorageRef)
      .then(() => {
        const fileFirestoreRef = doc(db, 'lesson-files', id);
        return deleteDoc(fileFirestoreRef);
      })
      .then(() => {
        updateNotification({
          id: notificationId,
          title: 'Success',
          message: `File ${name} deleted successfully.`,
          color: 'green',
          icon: <Check />,
        });
      })
      .catch(e => {
        updateNotification({
          id: notificationId,
          title: 'Failed',
          message: `File ${name} delete failed.`,
          color: 'red',
          icon: <X />,
        });
      });
  };
  const forceFileDownload = (response: any) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name); // or any other extension
    document.body.appendChild(link);
    link.click();
  };

  const download = () => {
    axios({
      method: 'get',
      url: downloadUrl,
      responseType: 'arraybuffer',
    })
      .then(response => {
        forceFileDownload(response);
      })
      .catch(() => console.log('error occured'));
  };

  const onTitleClicked = () => {
    if (kind === 'file') {
      setLigthBoxToggler(x => !x);
      return;
    }

    if (kind === 'link') {
      goToExternalLink();
      return;
    }
  };

  const goToExternalLink = () => {
    if (!url) return;

    window.open(url, '_blank');
  };

  const renderButtons = () => {
    if (viewOnly) {
      return (
        <Group position="center" spacing={compact ? 'xs' : 'md'} noWrap>
          <Tooltip position="bottom" label="Mention" withArrow>
            <ActionIcon size="sm">
              <At />
            </ActionIcon>
          </Tooltip>
          {kind === 'file' ? (
            <Tooltip position="bottom" label="Download" withArrow>
              <ActionIcon size="sm" onClick={download}>
                <Download />
              </ActionIcon>
            </Tooltip>
          ) : (
            <Tooltip position="bottom" label="Visit Link" withArrow>
              <ActionIcon onClick={goToExternalLink} size="sm">
                <ExternalLink />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      );
    } else {
      if (compact) {
        return (
          <Group position="center" spacing={compact ? 'xs' : 'md'} noWrap>
            {kind === 'file' ? (
              <Tooltip position="bottom" label="Download" withArrow>
                <ActionIcon size="sm" onClick={download}>
                  <Download />
                </ActionIcon>
              </Tooltip>
            ) : (
              <Tooltip position="bottom" label="Visit Link" withArrow>
                <ActionIcon onClick={goToExternalLink} size="sm">
                  <ExternalLink />
                </ActionIcon>
              </Tooltip>
            )}
            <Tooltip position="bottom" label="Delete" withArrow>
              <ActionIcon
                color="red"
                size="sm"
                onClick={openConfirmDeleteModal}
              >
                <Trash />
              </ActionIcon>
            </Tooltip>
          </Group>
        );
      }

      return (
        <Group position="center" spacing={compact ? 'xs' : 'md'} noWrap>
          <Tooltip position="bottom" label="Mention" withArrow>
            <ActionIcon size="sm">
              <At />
            </ActionIcon>
          </Tooltip>
          <Tooltip position="bottom" label="Edit" withArrow>
            <ActionIcon
              size="sm"
              onClick={() => {
                setFileNameOnEdit(editFileNameTemp.current);
                setIsOnEditMode(o => !o);
              }}
            >
              <Pencil />
            </ActionIcon>
          </Tooltip>
          {kind === 'file' ? (
            <Tooltip position="bottom" label="Download" withArrow>
              <ActionIcon size="sm" onClick={download}>
                <Download />
              </ActionIcon>
            </Tooltip>
          ) : (
            <Tooltip position="bottom" label="Visit Link" withArrow>
              <ActionIcon onClick={goToExternalLink} size="sm">
                <ExternalLink />
              </ActionIcon>
            </Tooltip>
          )}
          <Tooltip position="bottom" label="Delete" withArrow>
            <ActionIcon color="red" size="sm" onClick={openConfirmDeleteModal}>
              <Trash />
            </ActionIcon>
          </Tooltip>
        </Group>
      );
    }
  };

  const getCorrectSource = () => {
    const isImage = IMAGE_MIME_TYPE.some(x => x === type);
    if (isImage) {
      return [downloadUrl];
    }

    const isVideo = type === MIME_TYPES.mp4;
    if (isVideo) {
      return [downloadUrl];
    }

    const isPdf = type === MIME_TYPES.pdf;
    if (isPdf) {
      return [
        <Group position="center" className="overflow-y-scroll">
          <object data={downloadUrl} className="h-screen w-screen">
            Preview not supported.
          </object>
        </Group>,
      ];
    }

    return [
      <Stack className="items-center">
        <Text className="text-center text-white">
          Cannot view the file. File type is not supported yet.
        </Text>
        <Button size="md" color="primary" className="py-3">
          <Text weight={400} size="sm" onClick={download}>
            Download instead
          </Text>
        </Button>
      </Stack>,
    ];
  };

  const renderIcon = () => {
    const isImage = IMAGE_MIME_TYPE.some(x => x === type);
    if (isImage) {
      return <Photo size={18} />;
    }

    const isVideo = type === MIME_TYPES.mp4;
    if (isVideo) {
      return <Video size={18} />;
    }

    return <File size={18} />;
  };

  const editFileName = async () => {
    const fileRef = doc(db, 'lesson-files', id);

    if (kind === 'link') {
      await updateDoc(fileRef, {
        name: `${fileNameOnEdit}`,
      });
      setIsOnEditMode(false);

      return;
    }

    await updateDoc(fileRef, {
      name: `${fileNameOnEdit}.${editFileExtTemp.current}`,
    });
    setIsOnEditMode(false);
  };

  return (
    <Group position="apart" className={`w-full ${className}`} noWrap>
      {kind === 'file' && (
        <FsLightbox toggler={ligthBoxToggler} sources={getCorrectSource()} />
      )}

      {isOnEditMode ? (
        <Group spacing="sm">
          <TextInput
            icon={kind === 'file' ? renderIcon() : <Link size={18} />}
            value={fileNameOnEdit}
            rightSection={kind === 'file' && <Text size="sm">.jpg</Text>}
            onChange={evt => setFileNameOnEdit(evt.currentTarget.value)}
          />
          <Group spacing={5}>
            <ActionIcon onClick={editFileName} variant="filled" color="green">
              <Check size={18} />
            </ActionIcon>
            <ActionIcon
              onClick={() => setIsOnEditMode(false)}
              variant="filled"
              color="gray"
            >
              <X size={18} />
            </ActionIcon>
          </Group>
        </Group>
      ) : (
        <Button
          className="px-0 text-blue-700"
          variant="subtle"
          compact
          leftIcon={kind === 'file' ? renderIcon() : <Link size={18} />}
        >
          <Tooltip
            position="bottom"
            placement="start"
            label={name}
            openDelay={500}
            withArrow
          >
            <Text
              weight={400}
              size="sm"
              className={`inline-block w-[20ch] overflow-hidden overflow-ellipsis whitespace-nowrap text-left 2xl:w-[30ch] ${textClassName}`}
              onClick={onTitleClicked}
            >
              {name}
            </Text>
          </Tooltip>
        </Button>
      )}

      {(!isOnEditMode || !isMobile) && renderButtons()}
    </Group>
  );
}
