import { Group, Text, Button, Box, Menu } from '@mantine/core';
import * as React from 'react';
import { Pencil, Trash } from 'tabler-icons-react';

interface Props {
  title: string;
  subtitle: string;
  description: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  shouldShowDescription: boolean;
}

export function MeetingItem(props: Props) {
  const {
    title,
    subtitle,
    description,
    date,
    timeStart,
    timeEnd,
    shouldShowDescription = false,
  } = props;

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

        <Menu position="right" className="mb-4">
          <Menu.Item icon={<Pencil size={16} />}>Edit</Menu.Item>

          <Menu.Item icon={<Trash size={16} color="red" />}>
            <Text color="red">Delete</Text>
          </Menu.Item>
        </Menu>
      </Group>
      <Text size="xs" className="mb-5">
        {shouldShowDescription && description}
      </Text>
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
        </Group>
      </Group>
    </Box>
  );
}
