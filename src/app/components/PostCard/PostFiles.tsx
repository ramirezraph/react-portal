import { Text, ActionIcon, Divider, Group } from '@mantine/core';
import * as React from 'react';
import { Download } from 'tabler-icons-react';
import { IFile } from '.';
import { ClassFile } from '../ClassFile';

interface Prop {
  files?: IFile[];
}

export function PostFiles(props: Prop) {
  const { files } = props;

  const downloadAll = () => {
    console.log('Download All');
  };

  return (
    <div>
      <Group position="apart" className="mb-1">
        <Text size="sm" weight={'bold'}>
          Attachments
        </Text>
        <ActionIcon color={'primary'} onClick={downloadAll}>
          <Download size={21} />
        </ActionIcon>
      </Group>
      <Divider />
      <div className="mt-2">
        {files?.map(file => (
          <ClassFile key={file.id} name={`${file.name}.${file.type}`} />
        ))}
      </div>
    </div>
  );
}
