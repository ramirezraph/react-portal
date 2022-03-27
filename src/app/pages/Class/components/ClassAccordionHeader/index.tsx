import { Badge, Text } from '@mantine/core';
import * as React from 'react';
import { ClassAccordionType } from '../ClassAccordion';

interface Props {
  live: boolean;
  number: number;
  title: string;
  type: ClassAccordionType;
}

export function ClassAccordionHeader(props: Props) {
  const { live, number, title, type } = props;

  return (
    <Badge
      variant="dot"
      component={Text}
      className="border-none px-0 font-normal normal-case text-white outline-none"
      color={`${live ? 'green' : 'orange'}`}
    >
      {type === ClassAccordionType.Unit && (
        <Text size="md" className="ml-1">
          {`Unit ${number}: ${title}`}
        </Text>
      )}
      {type === ClassAccordionType.Lesson && (
        <Text size="md" className="ml-1">
          {`Lesson ${number}: ${title}`}
        </Text>
      )}
    </Badge>
  );
}
