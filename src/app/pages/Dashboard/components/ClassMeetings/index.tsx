import * as React from 'react';
import { Group } from '@mantine/core';
import { MeetingItem } from 'app/pages/Class/components/ClassTabs/components/MeetingItem/Loadable';

export function ClassMeetings() {
  return (
    <Group className="mt-3 w-full drop-shadow-md">
      <MeetingItem
        title="Class Introduction"
        subtitle="CPE 401 - Python Programming"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        date="Thu, Feb, 25, 2021"
        timeStart="1:30 PM"
        timeEnd="2:30 PM"
        shouldShowDescription={false}
      />
      <MeetingItem
        title="Class Introduction"
        subtitle="CPE 401 - Python Programming"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        date="Thu, Feb, 25, 2021"
        timeStart="1:30 PM"
        timeEnd="2:30 PM"
        shouldShowDescription={false}
      />
    </Group>
  );
}
