import * as React from 'react';
import { Box, Group, Text } from '@mantine/core';
import { Users } from 'tabler-icons-react';

interface Props {
  title: string;
  value: number;
  color: string;
}

export function StatsItem(props: Props) {
  const { title, value, color } = props;
  return (
    <Box className={`w-72 rounded-md border-none bg-white p-2 px-6 py-6`}>
      <Group>
        <Box
          className={`absolute mb-6 flex h-12 w-12 items-center justify-center rounded-md ${color}`}
        >
          <Users size={20} color="white" />
        </Box>
      </Group>
      <Group direction="column" position="right" spacing="xs">
        <Text size="md">{title}</Text>
        <Text weight="bold" size="xl" className="-mt-2">
          {value}
        </Text>
      </Group>
    </Box>
  );
}
