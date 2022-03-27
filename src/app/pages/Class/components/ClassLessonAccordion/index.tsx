import { Accordion, Divider, Text } from '@mantine/core';
import * as React from 'react';
import { Lesson } from '../..';
import { ClassAccordionControl } from '../ClassAccordionControl/Loadable';
import { ClassAccordionHeader } from '../ClassAccordionHeader/Loadable';
import { ClassAccordionType } from '../ClassUnitAccordion';

interface Props {
  lessons: Lesson[];
}

export function ClassLessonAccordion(props: Props) {
  const { lessons } = props;

  const [lessonList, setLessonList] = React.useState<Lesson[]>([]);

  React.useEffect(() => {
    if (lessons) {
      setLessonList(lessons);
    }
  }, [lessons]);

  const renderLessonItems = lessonList.map(Lesson => (
    <Accordion.Item
      label={
        <ClassAccordionHeader
          type={ClassAccordionType.Lesson}
          number={Lesson.number}
          title={Lesson.title}
          live={Lesson.isLive}
        />
      }
    >
      {/* Text Content */}
      <Text className="mt-3" size="sm">
        {Lesson.content}
      </Text>

      {/* Files */}
      {/* @Todo */}

      <Divider className="mt-6" />

      {/* Controls */}
      <ClassAccordionControl
        live={Lesson.isLive}
        type={ClassAccordionType.Lesson}
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
        control: 'bg-stone-700 hover:bg-stone-600',
      }}
      iconPosition="right"
      iconSize={24}
    >
      {renderLessonItems}
    </Accordion>
  );
}
