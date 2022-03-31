import * as React from 'react';
import { Button, Box, Group, Text } from '@mantine/core';
import { EyeOff, Users } from 'tabler-icons-react';
import { StatsItem } from '../StatsItem/Loadable';

interface Props {}

export function Stats(props: Props) {
  return (
    <Group className="mt-7 drop-shadow-md">
      <StatsItem title="Class" value={12} color="bg-violet-500" />
      <StatsItem title="Todo" value={4} color="bg-pink-500" />
    </Group>
  );
}
