import * as React from 'react';
import { Group } from '@mantine/core';
import { TodosItem } from '../TodosItem/Loadable';

interface Props {}

export function Todos(props: Props) {
  return (
    <Group className="mt-3 w-full drop-shadow-md">
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
    </Group>
  );
}
