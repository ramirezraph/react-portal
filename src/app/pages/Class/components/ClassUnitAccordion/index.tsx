import { Stack } from '@mantine/core';
import * as React from 'react';
import { Unit } from '../../slice/types';
import { ClassUnitAccordionItem } from '../ClassUnitAccordionItem';

export enum ClassAccordionType {
  Unit,
  Lesson,
}

interface Props {
  // someProps: string
  units: Unit[];
}

export function ClassUnitAccordion(props: Props) {
  const { units } = props;

  const [unitsList, setUnitsList] = React.useState<Unit[]>([]);

  React.useEffect(() => {
    if (units) {
      setUnitsList(units);
    }
  }, [units]);

  return (
    <Stack spacing={0} className="mt-3">
      {unitsList.map(unit => (
        <ClassUnitAccordionItem key={unit.id} unit={unit} />
      ))}
    </Stack>
  );
}
