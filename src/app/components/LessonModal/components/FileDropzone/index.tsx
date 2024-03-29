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
  FullScreenDropzone,
  PDF_MIME_TYPE,
  MS_WORD_MIME_TYPE,
  MS_EXCEL_MIME_TYPE,
  MS_POWERPOINT_MIME_TYPE,
  MIME_TYPES,
  Dropzone,
} from '@mantine/dropzone';
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
    style={{ minHeight: 150, pointerEvents: 'none' }}
  >
    <ImageUploadIcon
      status={status}
      style={{ color: getIconColor(status, theme) }}
      size={80}
    />

    <div>
      <Text size="xl" inline>
        Drag files here or click to select
      </Text>
      <Text size="sm" color="dimmed" inline mt={7}>
        Attach as many files as you like, each file should not exceed 5mb
      </Text>
    </div>
  </Group>
);

interface Prop {
  fullscreen?: boolean;
  visible?: boolean;
  className?: string;
  onFileUpload: (files: File[]) => void;
  onClose: () => void;
}

export function FileDropzone(props: Prop) {
  const { fullscreen, visible, className, onClose, onFileUpload } = props;

  // const {} = props;
  const theme = useMantineTheme();

  if (fullscreen) {
    return (
      <FullScreenDropzone
        accept={[
          ...IMAGE_MIME_TYPE,
          ...PDF_MIME_TYPE,
          ...MS_WORD_MIME_TYPE,
          ...MS_EXCEL_MIME_TYPE,
          ...MS_POWERPOINT_MIME_TYPE,
          MIME_TYPES.mp4,
          MIME_TYPES.zip,
        ]}
        onDrop={onFileUpload}
        disabled={false}
        className={className}
      >
        {status => dropzoneChildren(status, theme)}
      </FullScreenDropzone>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <ActionIcon
        variant="light"
        radius="xl"
        size="lg"
        className="absolute right-3 top-3 z-10"
        onClick={() => onClose()}
      >
        <X />
      </ActionIcon>
      <Dropzone
        onDrop={onFileUpload}
        disabled={false}
        className={`${!visible ? 'hidden' : ''}`}
      >
        {status => dropzoneChildren(status, theme)}
      </Dropzone>
    </div>
  );
}
