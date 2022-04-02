import * as React from 'react';
import { Group } from '@mantine/core';
import { ClassMeetingsItem } from '../ClassMeetingsItem/Loadable';

interface Props {}

export function ClassMeetings(props: Props) {
  return (
    <Group className="mt-3 drop-shadow-md">
      <ClassMeetingsItem
        title="Class Introduction"
        subtitle="CPE 401 - Python Programming"
        date="Thu, Feb, 25, 2021"
        timeStart="1:30 PM"
        timeEnd="2:30 PM"
      />
      <ClassMeetingsItem
        title="Class Introduction"
        subtitle="CPE 401 - Python Programming"
        date="Thu, Feb, 25, 2021"
        timeStart="1:30 PM"
        timeEnd="2:30 PM"
      />
    </Group>
  );
}
