import { Group, Avatar, Text } from '@mantine/core';
import * as React from 'react';

interface Props {
  id: string;
  gradeText: string;
  studentName: string;
  studentImageUrl: string;
  status: string;
}

export function StudentWorkListItem(props: Props) {
  const { id, gradeText, studentName, studentImageUrl, status } = props;

  const onClick = (id: string) => {
    console.log('item clicked: ' + id);
  };

  return (
    <Group
      position="apart"
      className="w-full cursor-pointer select-none"
      noWrap
      onClick={() => onClick(id)}
    >
      <Group noWrap className="w-full">
        <Text weight={600} size="sm" className="w-16">
          {gradeText}
        </Text>
        <Group className="w-full">
          <Avatar radius="xl" src={studentImageUrl} size={32} />
          <Text size="sm">{studentName}</Text>
        </Group>
      </Group>
      <Text className="w-20 text-right text-black" size="sm">
        {status}
      </Text>
    </Group>
  );
}
