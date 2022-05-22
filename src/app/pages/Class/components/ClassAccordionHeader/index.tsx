import { Badge, Text, Tooltip } from '@mantine/core';
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
      className="w-full cursor-pointer select-none items-center justify-start border-none px-0 font-normal normal-case text-white outline-none"
      color={`${live ? 'green' : 'orange'}`}
    >
      {type === ClassAccordionType.Unit && (
        <Tooltip
          className="flex items-center"
          label={title}
          position="bottom"
          openDelay={400}
        >
          <Text size="md" className="ml-1 w-full" lineClamp={1}>
            {`Unit ${number}: ${title}`}
          </Text>
        </Tooltip>
      )}
      {type === ClassAccordionType.Lesson && (
        <Tooltip
          className="flex items-center"
          label={title}
          position="bottom"
          openDelay={400}
        >
          <Text size="sm" className="ml-1 w-full" lineClamp={1}>
            {`Lesson ${number}: ${title}`}
          </Text>
        </Tooltip>
      )}
    </Badge>
  );
}
