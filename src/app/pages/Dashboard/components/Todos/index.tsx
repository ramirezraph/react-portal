import * as React from 'react';
import {
  ActionIcon,
  Button,
  Chip,
  Chips,
  Group,
  Menu,
  Stack,
  Text,
} from '@mantine/core';
import { TodosItem } from '../TodosItem/Loadable';
import { ChevronDown, InfoCircle } from 'tabler-icons-react';

interface Props {}

export function Todos(props: Props) {
  return (
    <Stack spacing={'sm'}>
      <Group>
        <Text size="lg" className="-mr-2">
          Todo/s
        </Text>
        <ActionIcon>
          <InfoCircle size={16} />
        </ActionIcon>
      </Group>
      <Group spacing={'xs'} position="apart">
        <Chips
          multiple={false}
          color="primary"
          variant="filled"
          spacing={5}
          size="sm"
        >
          <Chip value="todo">Todo</Chip>
          <Chip value="done">Done</Chip>
          <Chip value="overdue">Overdue</Chip>
        </Chips>
        <Menu
          className="ml-auto"
          control={
            <Button
              variant="subtle"
              color="dark"
              rightIcon={<ChevronDown size={20} />}
            >
              <Text size="sm" weight={'normal'}>
                Filter by Class
              </Text>
            </Button>
          }
        >
          <Menu.Item>CPE 403</Menu.Item>
          <Menu.Item>CPE 401</Menu.Item>
        </Menu>
      </Group>
      <Stack className="w-full drop-shadow-md">
        <TodosItem
          title="Laboratory Activity 1"
          subtitle="Assignment - CPE 401 - Python Programming"
          date="Tomorrow, 11: 59 PM"
        />
        <TodosItem
          title="Laboratory Activity 2"
          subtitle="Assignment - CPE 401 - Python Programming"
          date="Tomorrow, 11: 59 PM"
        />
      </Stack>
    </Stack>
  );
}
