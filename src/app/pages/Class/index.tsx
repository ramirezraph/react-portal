import { Box, Group, Text } from '@mantine/core';
import { PageContainer } from 'app/components/PageContainer/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { CardColor } from '../Classes/components/ClassCard';
import { ClassCard } from '../Classes/components/ClassCard/Loadable';
import { ClassAccordion } from './components/ClassAccordion/Loadable';

export function Class() {
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
              <ClassAccordion />
            </Box>
          </Group>
          <div className="h-full w-2/3 bg-green-500">C</div>
        </Group>
      </PageContainer>
    </>
  );
}
