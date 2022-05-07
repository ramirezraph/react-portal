import { Badge, Text } from '@mantine/core';
import * as React from 'react';
import { ClassAccordionType } from '../ClassUnitAccordion';

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
      className="w-full items-center justify-start border-none px-0 font-normal normal-case text-white outline-none"
      color={`${live ? 'green' : 'orange'}`}
    >
      {type === ClassAccordionType.Unit && (
        <Text size="md" className="ml-1 w-44 2xl:w-full" lineClamp={1}>
          {`Unit ${number}: ${title}`}
        </Text>
      )}
      {type === ClassAccordionType.Lesson && (
        <Text size="sm" className="ml-1 w-48 2xl:w-full" lineClamp={1}>
          {`Lesson ${number}: ${title}`}
        </Text>
      )}
    </Badge>
  );
}
