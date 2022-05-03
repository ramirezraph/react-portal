import { PageContainer } from 'app/components/PageContainer/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button, Group, SimpleGrid, Text } from '@mantine/core';
import { Calendar, Link, Plus } from 'tabler-icons-react';
import { ClassCard } from './components/ClassCard/Loadable';
import { CardColor } from './components/ClassCard';

export function Classes() {
  return (
    <>
      <Helmet>
        <title>Classes</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <PageContainer>
        <Text className="text-lg" weight={'bold'}>
          Classes
        </Text>
        <Group spacing={'xs'} className="mt-3">
          <Button
            leftIcon={<Calendar size={19} color="gray" />}
            color="gray"
            variant="default"
            size="md"
          >
            <Text size="sm" weight={400} color="black">
              Calendar
            </Text>
          </Button>
          <Button
            leftIcon={<Link size={19} color="gray" />}
            color="gray"
            variant="default"
            size="md"
          >
            <Text size="sm" weight={400} color="black">
              Join class
            </Text>
          </Button>
          <Button
            leftIcon={<Plus size={19} color="gray" />}
            color="gray"
            variant="default"
            size="md"
          >
            <Text size="sm" weight={400} color="black">
              Create class
            </Text>
          </Button>
        </Group>
        <SimpleGrid
          cols={3}
          breakpoints={[
            { maxWidth: 1300, cols: 2 },
            { maxWidth: 820, cols: 1 },
          ]}
          className="mt-6"
        >
          {/* @Todo: Use map*/}
          <ClassCard
            classTitle="Python Programming"
            classCode="CPE 401"
            teacherName="Guido van Rossum"
            color={CardColor.Sky}
          />
          <ClassCard
            classTitle="Rizal Life and Works"
            classCode="RLW 101"
            teacherName="Jose P. Rizal"
            color={CardColor.Orange}
          />
          <ClassCard
            classTitle="Physical Education 4"
            classCode="PE 4"
            teacherName="Friedrich Jahn"
            color={CardColor.Stone}
          />
        </SimpleGrid>
      </PageContainer>
    </>
  );
}
