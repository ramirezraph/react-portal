import { Group, ActionIcon, ScrollArea, Text } from '@mantine/core';
import { StudentWorkListItem } from 'app/components/ClassworkModal/components/StudentWorkListItem/Loadable';
import * as React from 'react';
import { SortAscending } from 'tabler-icons-react';

interface Props {}

export function StudentWork(props: Props) {
  // const {  } = props;

  return (
    <Group className="my-3 w-2/5 bg-document p-4" direction="column">
      <Text>Test</Text>
    </Group>
  );
}
