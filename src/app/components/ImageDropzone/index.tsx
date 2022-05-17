import { Upload, Photo, X, Icon as TablerIcon } from 'tabler-icons-react';
import {
  Group,
  Text,
  useMantineTheme,
  MantineTheme,
  ActionIcon,
} from '@mantine/core';
import {
  DropzoneStatus,
  IMAGE_MIME_TYPE,
  MIME_TYPES,
  Dropzone,
} from '@mantine/dropzone';
import { FileRejection } from 'react-dropzone';
import * as React from 'react';

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
    : theme.colorScheme === 'dark'
    ? theme.colors.dark[0]
    : theme.colors.gray[7];
}

function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <Upload {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <Photo {...props} />;
}

export const dropzoneChildren = (
  status: DropzoneStatus,
  theme: MantineTheme,
) => (
  <Group
    position="center"
    spacing="xl"
    style={{ minHeight: 70, pointerEvents: 'none' }}
  >
    <ImageUploadIcon
      status={status}
      style={{ color: getIconColor(status, theme) }}
      size={80}
    />
    <div>
      <Text size="xl" inline>
        Drag images here or click to select
      </Text>
    </div>
  </Group>
);

interface Prop {
  visible?: boolean;
  className?: string;
  onClose?: () => void;
  onReject?: (fileRejections: FileRejection[]) => void;
  onFileUpload: (files: File[]) => void;
}

export function ImageDropzone(props: Prop) {
  const { visible, className, onFileUpload, onClose, onReject } = props;

  // const {} = props;
  const theme = useMantineTheme();

  return (
    <div className="relative">
      <ActionIcon
        variant="light"
        radius="xl"
        size="lg"
        className="absolute right-3 top-3 z-10"
        onClick={onClose}
      >
        <X />
      </ActionIcon>
      <Dropzone
        accept={[...IMAGE_MIME_TYPE, MIME_TYPES.mp4]}
        onDrop={onFileUpload}
        onReject={onReject}
        disabled={false}
        className={`${!visible ? 'hidden' : ''} ${className}`}
      >
        {status => dropzoneChildren(status, theme)}
      </Dropzone>
    </div>
  );
}
