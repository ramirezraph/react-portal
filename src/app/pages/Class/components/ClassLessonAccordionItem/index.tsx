import { Collapse, Divider, Group, Stack, Text } from '@mantine/core';
import * as React from 'react';
import { ChevronDown, ChevronUp } from 'tabler-icons-react';
import { Lesson } from '../../slice/types';
import { ClassAccordionControl } from '../ClassAccordionControl/Loadable';
import { ClassAccordionHeader } from '../ClassAccordionHeader';

export enum ClassAccordionType {
  Unit,
  Lesson,
}

interface Props {
  unitId: string;
  unitNumber: string;
  lesson: Lesson;
}

export function ClassLessonAccordionItem(props: Props) {
  const { lesson, unitId, unitNumber } = props;

  const [isOpened, setIsOpened] = React.useState(false);

  return (
    <Stack className="outline outline-1 outline-stone-200" spacing={0}>
      <Group
        onClick={() => setIsOpened(x => !x)}
        className="cursor-pointer bg-slate-800 p-4"
        noWrap
      >
        <ClassAccordionHeader
          live={lesson.isLive}
          title={lesson.title}
          number={lesson.number}
          type={ClassAccordionType.Lesson}
        />
        {isOpened ? (
          <ChevronUp size={20} color="white" />
        ) : (
          <ChevronDown size={20} color="white" />
        )}
      </Group>
      <Collapse
        in={isOpened}
        transitionTimingFunction="linear"
        transitionDuration={150}
      >
        <div className="p-4">
          {lesson.content && (
            <Text className="mt-3 w-full" size="sm">
              {lesson.content}
            </Text>
          )}
          <Divider className="mt-6" />
          <ClassAccordionControl
            unitId={unitId}
            lessonId={lesson.id}
            live={lesson.isLive}
            type={ClassAccordionType.Lesson}
            unitNumber={unitNumber}
          />
        </div>
      </Collapse>
    </Stack>
  );
}
