import { Accordion, Divider, Text } from '@mantine/core';
import * as React from 'react';
import { Unit } from '../../slice/types';
import { ClassAccordionControl } from '../ClassAccordionControl/Loadable';
import { ClassAccordionHeader } from '../ClassAccordionHeader/Loadable';
import { ClassLessonAccordion } from '../ClassLessonAccordion/Loadable';

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

  const toggleLive = (id: string) => {
    console.log('toggle: ' + id);
  };

  const renderUnitItems = unitsList.map(unit => (
    <Accordion.Item
      label={
        <ClassAccordionHeader
          type={ClassAccordionType.Unit}
          number={unit.number}
          title={unit.title}
          live={unit.isLive}
        />
      }
      key={unit.id}
    >
      {/* Text Content */}
      {unit.content && (
        <Text className="mt-3" size="sm">
          {unit.content}
        </Text>
      )}

      {/* Lessons Accordon */}
      <ClassLessonAccordion unitId={unit.id} lessons={unit.lessons} />

      <Divider className="mt-6" />

      {/* Controls */}
      <ClassAccordionControl
        unitId={unit.id}
        live={unit.isLive}
        type={ClassAccordionType.Unit}
      />
    </Accordion.Item>
  ));

  return (
    <Accordion
      className="mt-3"
      classNames={{
        label: 'text-white text-md py-0',
        content: 'outline outline-1 outline-stone-100',
        icon: 'text-white',
        control: 'bg-stone-800 hover:bg-stone-700',
      }}
      iconPosition="right"
      iconSize={24}
      multiple
    >
      {renderUnitItems}
    </Accordion>
  );
}
