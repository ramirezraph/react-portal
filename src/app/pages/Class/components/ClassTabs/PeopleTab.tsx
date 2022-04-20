import { Text } from '@mantine/core';
import * as React from 'react';

interface Props {
  // someProps: string
}

export function PeopleTab(props: Props) {
  // const { someProps } = props;

  return (
    <div className="bg-white p-6">
      <Text>People Tab</Text>
      <Text>Hello, Jeff!</Text>
    </div>
  );
}
