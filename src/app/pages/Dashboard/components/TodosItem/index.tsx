import * as React from 'react';
import { Box, Group, Text, ActionIcon } from '@mantine/core';
import { InfoCircle } from 'tabler-icons-react';

interface Props {
  title: string;
  subtitle: string;
  date: string;
}

export function TodosItem(props: Props) {
  const { title, subtitle, date } = props;
  return (
    <Box
      className={`w-full rounded-md border-none bg-white p-2  drop-shadow-md `}
    >
      <Group position="apart" noWrap className="w-full">
        <Group direction="column" spacing="xs" className="py-4 px-5">
          <Text color="blue" weight={'bold'}>
            {title}
          </Text>
          <Text size="sm" className="-mt-3">
            {subtitle}
          </Text>
        </Group>
        <Group position="right" spacing="xs" className=" py-4 px-5">
          <ActionIcon
            variant="filled"
            size={'lg'}
            className="rounded-md bg-slate-700"
          >
            <InfoCircle size={16} />
          </ActionIcon>
          <Box className="items-center justify-center rounded-md bg-slate-700 px-6 py-2">
            <Text size="xs" color={'white'}>
              {date}
            </Text>
          </Box>
        </Group>
      </Group>
    </Box>
  );
}
