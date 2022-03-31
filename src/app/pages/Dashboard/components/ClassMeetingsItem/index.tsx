import * as React from 'react';
import { Button, Box, Group, Text, ActionIcon } from '@mantine/core';
import { EyeOff, Users, DotsVertical } from 'tabler-icons-react';

interface Props {
  title: string;
  subtitle: string;
  date: string;
  timeStart: string;
  timeEnd: string;
}

export function ClassMeetingsItem(props: Props) {
  const { title, subtitle, date, timeStart, timeEnd } = props;
  return (
    <Box
      className={`w-full rounded-md border-none bg-white p-7 drop-shadow-md `}
    >
      <Group position="apart" spacing="xs" className="mb-5 w-full">
        <Group direction="column">
          <Text weight="bold" color={'blue'}>
            {title}
          </Text>
          <Text size="sm" className="-mt-5">
            {subtitle}
          </Text>
        </Group>
        <ActionIcon className="mb-4">
          <DotsVertical size={48} strokeWidth={2} color={'black'} />
        </ActionIcon>
      </Group>
      <Group className="" position="apart">
        <Group spacing={'xs'}>
          <Box className="rounded-2xl bg-slate-700 px-6 py-1">
            <Text size="sm" color={'white'}>
              {date}
            </Text>
          </Box>
          <Box className="rounded-2xl bg-blue-600 px-5 py-1">
            <Text color={'white'} size="sm">
              {timeStart}
            </Text>
          </Box>
          <Box className="rounded-2xl bg-amber-800 px-5 py-1">
            <Text color={'white'} size="sm">
              {timeEnd}
            </Text>
          </Box>
        </Group>
        <Group spacing={'xs'}>
          <Button size="sm" className="bg-blue-600 px-6" radius="md">
            <Text size="xs">Join Meeting</Text>
          </Button>
          <Button
            className="px-6 "
            size="sm"
            color={'dark'}
            variant="outline"
            radius="md"
          >
            <Text color={'black'} size="xs">
              I'll be absent
            </Text>
          </Button>
        </Group>
      </Group>
    </Box>
  );
}
