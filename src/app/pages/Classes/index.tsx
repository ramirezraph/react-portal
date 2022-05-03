import { PageContainer } from 'app/components/PageContainer/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Button,
  Card,
  Collapse,
  Group,
  SimpleGrid,
  Text,
  TextInput,
} from '@mantine/core';
import { Calendar, Link, Plus } from 'tabler-icons-react';
import { ClassCard } from './components/ClassCard/Loadable';
import { CardColor } from './components/ClassCard';
import { useNavigate } from 'react-router-dom';
import { JoinClassCollapseCard } from './components/JoinClassCollapseCard';
import { CreateClassModal } from './components/CreateClassModal/Loadable';

export function Classes() {
  const navigate = useNavigate();

  const [joinClassVisible, setJoinClassVisible] = React.useState(false);
  const [createClassVisible, setCreateClassVisible] = React.useState(false);

  return (
    <>
      <Helmet>
        <title>Classes</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <CreateClassModal
        visible={createClassVisible}
        onToggle={setCreateClassVisible}
      />
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
            onClick={() => navigate('/calendar')}
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
            onClick={() => setJoinClassVisible(o => !o)}
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
            onClick={() => setCreateClassVisible(true)}
          >
            <Text size="sm" weight={400} color="black">
              Create class
            </Text>
          </Button>
        </Group>
        <JoinClassCollapseCard
          visible={joinClassVisible}
          onToggle={setJoinClassVisible}
        />
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
