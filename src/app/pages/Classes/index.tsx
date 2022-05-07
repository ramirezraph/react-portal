import { PageContainer } from 'app/components/PageContainer/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button, Group, SimpleGrid, Text } from '@mantine/core';
import { Calendar, Link, Plus } from 'tabler-icons-react';
import { ClassCard } from './components/ClassCard/Loadable';
import { CardColor } from './components/ClassCard';
import { useNavigate } from 'react-router-dom';
import { JoinClassCollapseCard } from './components/JoinClassCollapseCard';
import { CreateClassModal } from './components/CreateClassModal/Loadable';
import { useSelector } from 'react-redux';
import { selectClasses } from './slice/selectors';
import { Class } from './slice/types';

export function Classes() {
  const navigate = useNavigate();

  const [joinClassVisible, setJoinClassVisible] = React.useState(false);
  const [createClassVisible, setCreateClassVisible] = React.useState(false);

  const classesSlice = useSelector(selectClasses);

  const [classes, setClasses] = React.useState<Class[]>([]);

  React.useEffect(() => {
    setClasses(classesSlice.classes);
  }, [classesSlice]);

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
          {classes.map(c => (
            <ClassCard
              key={c.id}
              id={c.id}
              classTitle={c.name}
              classCode={c.code}
              teacherId={c.ownerId}
              color={CardColor.Sky}
            />
          ))}
        </SimpleGrid>
      </PageContainer>
    </>
  );
}
