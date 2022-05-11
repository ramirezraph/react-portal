import { Accordion, Divider, Text } from '@mantine/core';
import { AttachedFile } from 'app/components/LessonModal/components/AttachedFile/Loadable';
import { query, where, onSnapshot, orderBy } from 'firebase/firestore';
import * as React from 'react';
import { lessonsColRef } from 'services/firebase';
import { Lesson } from '../../slice/types';
import { ClassAccordionControl } from '../ClassAccordionControl/Loadable';
import { ClassAccordionHeader } from '../ClassAccordionHeader/Loadable';
import { ClassAccordionType } from '../ClassUnitAccordion';

interface Props {
  unitId: string;
  unitNumber: string;
}

export function ClassLessonAccordion(props: Props) {
  const { unitId, unitNumber } = props;

  const [lessons, setLessons] = React.useState<Lesson[]>([]);

  React.useEffect(() => {
    console.log('onSnapshot: lessons');

    const q = query(
      lessonsColRef,
      where('unitId', '==', unitId),
      orderBy('number'),
    );
    const unsubscribe = onSnapshot(q, snapshot => {
      const list: Lesson[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();

        const lesson: Lesson = {
          id: doc.id,
          number: data.number,
          title: data.title,
          content: data.content,
          isLive: data.isLive,
          files: [],
        };
        list.push(lesson);
      });
      setLessons(list);
    });

    return () => {
      console.log('onSnapshot: lessons - unsubsribe');

      unsubscribe();
    };
  }, [unitId]);

  const renderLessonItems = lessons.map(lesson => (
    <Accordion.Item
      label={
        <ClassAccordionHeader
          type={ClassAccordionType.Lesson}
          number={lesson.number}
          title={lesson.title}
          live={lesson.isLive}
        />
      }
      key={lesson.id}
    >
      {/* Text Content */}
      {lesson.content && (
        <Text className="mt-3" size="sm" lineClamp={5}>
          {lesson.content}
        </Text>
      )}

      {/* Files */}
      {lesson.files && lesson.files.length > 0 && (
        <div className="mt-6">
          {lesson.files.map(item => (
            <AttachedFile
              key={item.id}
              name={item.name}
              downloadUrl={item.downloadUrl}
              compact
              className="mt-3"
            />
          ))}
        </div>
      )}

      <Divider className="mt-6" />

      {/* Controls */}
      <ClassAccordionControl
        unitId={unitId}
        lessonId={lesson.id}
        live={lesson.isLive}
        type={ClassAccordionType.Lesson}
        unitNumber={unitNumber}
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
      offsetIcon={true}
      transitionDuration={500}
    >
      {renderLessonItems}
    </Accordion>
  );
}
