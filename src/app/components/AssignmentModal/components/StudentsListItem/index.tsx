import { Group, Avatar, Text } from '@mantine/core';
import { selectClassroom } from 'app/pages/Class/slice/selectors';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Location, useLocation, useSearchParams } from 'react-router-dom';

interface Props {
  id: string;
  gradeText: string;
  studentName: string;
  studentImageUrl: string;
  status: string;
}

export function StudentsListItem(props: Props) {
  const { id, gradeText, studentName, studentImageUrl, status } = props;

  let [searchParams, setSearchParams] = useSearchParams();

  const classroom = useSelector(selectClassroom);

  const onClick = () => {
    if (!classroom.classworkModalBackground) {
      console.log('Location is null');
      return;
    }
    let newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('view', id);
    setSearchParams(newSearchParams.toString(), {
      state: { backgroundLocation: classroom.classworkModalBackground },
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
