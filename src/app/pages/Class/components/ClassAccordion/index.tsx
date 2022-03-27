import { Accordion, Divider, Text } from '@mantine/core';
import * as React from 'react';
import { ClassAccordionControl } from '../ClassAccordionControl/Loadable';
import { ClassAccordionHeader } from '../ClassAccordionHeader/Loadable';

export enum ClassAccordionType {
  Unit,
  Lesson,
}

interface Props {
  // someProps: string
}

export function ClassAccordion(props: Props) {
  // const { someProps } = props;

  const [units, setUnits] = React.useState([
    {
      number: 1,
      title: 'Getting Started',
      content: 'This is a sample content.',
      isLive: true,
      lessons: [
        {
          number: 1,
          title: 'Why we program?',
          content:
            'Enim sem egestas omare ac cursus non odio nibh gravidia. Pharetra, fringila amet, vel at a.',
          isLive: true,
        },
        {
          number: 2,
          title: 'Installing and using Python',
          content:
            'Enim sem egestas omare ac cursus non odio nibh gravidia. Pharetra, fringila amet, vel at a.',
          isLive: true,
        },
        {
          number: 3,
          title: 'Variables and Expressions',
          content:
            'Enim sem egestas omare ac cursus non odio nibh gravidia. Pharetra, fringila amet, vel at a.',
          isLive: false,
        },
      ],
    },
    {
      number: 2,
      title: 'Data Structures',
      content: 'This is a sample content.',
      isLive: false,
    },
  ]);

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
      {units.map(unit => (
        <Accordion.Item
          label={
            <ClassAccordionHeader
              type={ClassAccordionType.Unit}
              number={unit.number}
              title={unit.title}
              live={unit.isLive}
            />
          }
        >
          {/* Text Content */}
          <Text className="mt-3" size="sm">
            {unit.content}
          </Text>

          {/* Lessons Accordon */}
          {/* @Todo */}

          <Divider className="mt-6" />

          {/* Controls */}
          <ClassAccordionControl
            live={unit.isLive}
            type={ClassAccordionType.Unit}
          />
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
