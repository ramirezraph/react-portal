import { Group, ActionIcon, Text, Button } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import axios from 'axios';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import * as React from 'react';
import { db, storage } from 'services/firebase';
import {
  Pencil,
  At,
  Download,
  Trash,
  File,
  Check,
  X,
} from 'tabler-icons-react';
import { v4 as uuidv4 } from 'uuid';

interface Prop {
  id: string;
  name: string;
  size: number;
  type: string;
  downloadUrl: string;
  lessonId: string;
  fullPath: string;
  createdAt: string;
  updatedAt: string;
  compact?: boolean;
  className?: string;
  textClassName?: string;
  viewOnly?: boolean;
}

export function AttachedFile(props: Prop) {
  const modals = useModals();

  const {
    id,
    name,
    compact,
    className,
    textClassName,
    viewOnly,
    downloadUrl,
    fullPath,
  } = props;

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
            Are you sure you want to delete this file? This action cannot be
            undone.
          </Text>
        </div>
      ),
      labels: { confirm: 'Delete file', cancel: "No, don't delete" },
      onConfirm: () => onDelete(),
    });
  };

  const onDelete = () => {
    const notificationId = uuidv4();
    showNotification({
      id: notificationId,
      loading: true,
      title: 'In progress',
      message: `Deleting File ${name} ...`,
      autoClose: false,
      disallowClose: true,
    });

    // delete from storage
    const fileStorageRef = ref(storage, fullPath);
    deleteObject(fileStorageRef)
      .then(() => {
        const fileFirestoreRef = doc(db, 'files', id);
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

  const renderButtons = () => {
    if (viewOnly) {
      return (
        <Group position="center" spacing={compact ? 'xs' : 'md'} noWrap>
          <ActionIcon size="sm">
            <At />
          </ActionIcon>
          <ActionIcon size="sm">
            <Download />
          </ActionIcon>
        </Group>
      );
    } else {
      if (compact) {
        return (
          <Group position="center" spacing={compact ? 'xs' : 'md'} noWrap>
            <ActionIcon size="sm" onClick={download}>
              <Download />
            </ActionIcon>
            <ActionIcon color="red" size="sm" onClick={openConfirmDeleteModal}>
              <Trash />
            </ActionIcon>
          </Group>
        );
      }

      return (
        <Group position="center" spacing={compact ? 'xs' : 'md'} noWrap>
          <ActionIcon size="sm">
            <Pencil />
          </ActionIcon>
          <ActionIcon size="sm">
            <At />
          </ActionIcon>
          <ActionIcon size="sm" onClick={download}>
            <Download />
          </ActionIcon>
          <ActionIcon color="red" size="sm" onClick={openConfirmDeleteModal}>
            <Trash />
          </ActionIcon>
        </Group>
      );
    }
  };

  return (
    <Group position="apart" className={`w-full ${className}`} noWrap>
      <Button
        className="px-0 text-blue-700"
        variant="subtle"
        compact
        leftIcon={<File size={18} />}
      >
        <Text
          weight={400}
          size="sm"
          className={`inline-block w-[20ch] overflow-hidden overflow-ellipsis whitespace-nowrap text-left 2xl:w-[30ch] ${textClassName}`}
        >
          {name}
        </Text>
      </Button>
      {renderButtons()}
    </Group>
  );
}
