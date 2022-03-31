import { Box, Group, Text } from '@mantine/core';
import { PageContainer } from 'app/components/PageContainer/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { CardColor } from '../Classes/components/ClassCard';
import { ClassCard } from '../Classes/components/ClassCard/Loadable';
import { ClassUnitAccordion } from './components/ClassUnitAccordion/Loadable';

export interface Unit {
  id: string;
  number: number;
  title: string;
  content: string;
  isLive: boolean;
  lessons: Lesson[];
}

export interface LessonFile {
  title: string;
  downloadUrl: string;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  content: string;
  isLive: boolean;
  files: LessonFile[];
}

export function Class() {
  const [units, setUnits] = React.useState<Unit[]>([
    {
      id: '1',
      number: 1,
      title: 'Getting Started',
      content: 'sed quia non numquam eius modi tempora.',
      isLive: true,
      lessons: [
        {
          id: '1',
          number: 1,
          title: 'Why we program?',
          content:
            'Enim sem egestas omare ac cursus non odio nibh gravidia. Pharetra, fringila amet, vel at a.',
          isLive: true,
          files: [],
        },
        {
          id: '2',
          number: 2,
          title: 'Installing and using Python',
          content:
            'Enim sem egestas omare ac cursus non odio nibh gravidia. Pharetra, fringila amet, vel at a.',
          isLive: true,
          files: [],
        },
        {
          id: '3',
          number: 3,
          title: 'Variables and Expressions',
          content:
            'Enim sem egestas omare ac cursus non odio nibh gravidia. Pharetra, fringila amet, vel at a.',
          isLive: false,
          files: [],
        },
      ],
    },
    {
      id: '2',
      number: 2,
      title: 'Data Structures',
      content: '',
      isLive: false,
      lessons: [
        {
          id: '1',
          number: 1,
          title: 'Arrays',
          content:
            'Enim sem egestas omare ac cursus non odio nibh gravidia. Pharetra, fringila amet, vel at a.',
          isLive: false,
          files: [],
        },
      ],
    },
  ]);

  return (
    <>
      <Helmet>
        <title>Class Code</title>
      </Helmet>
      <PageContainer>
        <Text size="lg" weight={'bold'}>
          Class
        </Text>
        <Group noWrap position="apart" className="mt-3 h-full items-start">
          <Group spacing={'md'} className="w-1/3" direction="column">
            <ClassCard
              classTitle="Python Programmins"
              classCode="CPE 401"
              teacherName="Guido van Rossum"
              color={CardColor.Sky}
            />
            <Box className="w-full rounded-md bg-white p-6">
              <Text size="sm" weight={'bold'}>
                Class materials
              </Text>
              <ClassUnitAccordion units={units} />
            </Box>
          </Group>
          <div className="h-full w-2/3 bg-green-500">C</div>
        </Group>
      </PageContainer>
    </>
  );
}
