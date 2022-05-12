import { Stack } from '@mantine/core';
import * as React from 'react';
import { Lesson } from '../../slice/types';
import { ClassLessonAccordionItem } from '../ClassLessonAccordionItem/Loadable';

interface Props {
  unitId: string;
  unitNumber: string;
  lessons: Lesson[];
}

export function ClassLessonAccordion(props: Props) {
  const { unitId, unitNumber, lessons } = props;

  const [list, setList] = React.useState<Lesson[]>([]);

  React.useEffect(() => {
    setList(lessons);
  }, [lessons]);

  return (
    <Stack spacing={0} className="mt-3">
      {list.map(lesson => (
        <ClassLessonAccordionItem
          key={lesson.id}
          lesson={lesson}
          unitId={unitId}
          unitNumber={unitNumber}
        />
      ))}
    </Stack>
  );
}
