import { Group, Avatar, Text } from '@mantine/core';
import * as React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

interface Props {
  id: string;
  gradeText: string;
  studentName: string;
  studentImageUrl: string;
  status: string;
}

export function StudentsListItem(props: Props) {
  const { id, gradeText, studentName, studentImageUrl, status } = props;

  let location = useLocation();

  let [searchParams, setSearchParams] = useSearchParams();

  const onClick = () => {
    console.log('item clicked: ' + id);

    let newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('view', id);

    setSearchParams(newSearchParams.toString(), {
      state: { backgroundLocation: location },
      replace: true,
    });
  };

  return (
    <Group
      position="apart"
      className="w-full cursor-pointer select-none"
      noWrap
      onClick={onClick}
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
