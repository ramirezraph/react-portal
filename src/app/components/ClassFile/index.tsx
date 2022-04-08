import { Group, ActionIcon, Text } from '@mantine/core';
import * as React from 'react';
import { FileDownload, File } from 'tabler-icons-react';

interface Props {
  downloadUrl?: string;
  name: string;
}

export function ClassFile(props: Props) {
  const { name } = props;

  const downloadFile = () => {
    console.log('Downloading ' + name);
  };

  return (
    <Group position="apart" noWrap className="py-1">
      <Group>
        <File size={18} />
        <Text size="sm">{name}</Text>
      </Group>
      <ActionIcon onClick={downloadFile}>
        <FileDownload size={21} />
      </ActionIcon>
    </Group>
  );
}
