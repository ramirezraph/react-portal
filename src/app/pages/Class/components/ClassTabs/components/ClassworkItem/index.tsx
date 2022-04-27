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
      <Group spacing={0} noWrap>
        <Group direction="column" spacing={'sm'} className="w-96 flex-grow p-6">
          <Text weight="bold">{title}</Text>
          <Group>
            <Clock size={19}></Clock>
            <Text size="xs">{date}</Text>
          </Group>
          <Group>
            <CircleCheck size={19} />
            <Text size="sm">{status}</Text>
          </Group>
        </Group>
        <div className="h-full w-6 bg-red-500">x</div>
      </Group>
    </Box>
  );
}
