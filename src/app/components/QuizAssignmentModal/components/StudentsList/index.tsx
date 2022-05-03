import { Group, ActionIcon, ScrollArea, Text } from '@mantine/core';
import * as React from 'react';
import { SortAscending } from 'tabler-icons-react';
import { StudentsListItem } from '../StudentsListItem/Loadable';

interface Props {}

export function StudentsList(props: Props) {
  // const {  } = props;

  return (
    <Group
      className="my-3 w-2/5 bg-document p-4"
      direction="column"
      position="apart"
    >
      <Group direction="column" className="w-full flex-grow" spacing={0}>
        <Group className="w-full" position="apart">
          <Text weight="bold">Grades</Text>
          <ActionIcon>
            <SortAscending />
          </ActionIcon>
        </Group>
        <ScrollArea
          style={{
            height: '55vh',
          }}
          scrollbarSize={7}
          offsetScrollbars
          className="mt-6 w-full"
        >
          <Group>
            <StudentsListItem
              id="123"
              studentImageUrl="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
              studentName="John D. Doe"
              gradeText="89/100"
              status="Finished"
              readonly
            />
            <StudentsListItem
              id="456"
              studentImageUrl="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
              studentName="Jose P. Rizal"
              gradeText="98/100"
              status="Assigned"
              readonly
            />
          </Group>
        </ScrollArea>
      </Group>
      <Group spacing={0}>
        <Text className="w-16">89.00</Text>
        <Text size="sm">Class Average</Text>
      </Group>
    </Group>
  );
}
