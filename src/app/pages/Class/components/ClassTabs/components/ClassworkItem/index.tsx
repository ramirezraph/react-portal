import { Box, Group, Text } from '@mantine/core';
import * as React from 'react';
import { CircleCheck, Clock } from 'tabler-icons-react';

interface Prop {
  id: string;
  title: string;
  date: string;
  status: string;
  onClick?: (id: string) => void;
}

export function ClassworkItem(props: Prop) {
  const { id, title, date, status, onClick } = props;

  const onPressed = onClick ? onClick : () => {};

  return (
    <Box
      sx={theme => ({
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        textAlign: 'center',
        borderRadius: theme.radius.md,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[5]
              : theme.colors.gray[1],
        },
      })}
      onClick={() => onPressed(id)}
    >
      <Group
        direction="column"
        spacing={'sm'}
        className="after relative w-full flex-grow p-4 after:absolute after:top-0 after:right-0 after:h-full after:w-2 after:rounded-tr-lg after:rounded-br-lg after:bg-primary after:content-['']"
      >
        <Text weight="bold">{title}</Text>
        <Group>
          <Clock size={19} className="text-gray-700" />
          <Text size="xs">{date}</Text>
        </Group>
        <Group>
          <CircleCheck size={19} className="text-gray-700" />
          <Text size="sm">{status}</Text>
        </Group>
      </Group>
    </Box>
  );
}
