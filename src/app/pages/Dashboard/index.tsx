import { Group, Text, ActionIcon, Menu, Button } from '@mantine/core';
import { PageContainer } from 'app/components/PageContainer/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { InfoCircle, ChevronDown } from 'tabler-icons-react';
import { CalendarToday } from './components/CalendarToday/Loadable';
import { ClassMeetings } from './components/ClassMeetings';
import { Stats } from './components/Stats/Loadable';
import { Todos } from './components/Todos/Loadable';

export function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <PageContainer className="h-full p-0">
        <Group
          direction="row"
          align={'baseline'}
          noWrap
          className="h-full w-full"
        >
          <div className="w-2/3 p-6">
            <Text size="lg" weight={'bold'}>
              Dashboard
            </Text>
            <Stats />
            <Group className="mt-7 mb-3">
              <Text size="lg" className="-mr-2">
                Todo/s (2)
              </Text>
              <ActionIcon>
                <InfoCircle size={16} />
              </ActionIcon>
            </Group>
            <Group className="mt-3" spacing={'xs'}>
              <Button variant="subtle" size="xs" color="dark">
                Todo
              </Button>
              <Button variant="subtle" size="xs" color="dark">
                Done
              </Button>
              <Button variant="subtle" size="xs" color="dark">
                Overdue
              </Button>
              <Menu
                className="ml-auto"
                control={
                  <Button
                    variant="subtle"
                    color="dark"
                    rightIcon={<ChevronDown size={20} />}
                  >
                    <Text size="sm" weight={'normal'}>
                      No due date
                    </Text>
                  </Button>
                }
              >
                Menu items
              </Menu>
            </Group>
            <Todos />
            <Group className="mt-6 mb-3">
              <Text size="lg" className="-mr-2">
                Class Meetings (2)
              </Text>
              <ActionIcon>
                <InfoCircle size={16} />
              </ActionIcon>
            </Group>
            <Group className="mt-3" spacing={'xs'}>
              <Button variant="subtle" size="xs" color="dark">
                Today
              </Button>
              <Button variant="subtle" size="xs" color="dark">
                This Week
              </Button>
            </Group>
            <ClassMeetings />
          </div>

          <div className="flex h-full w-1/3 flex-col bg-white p-6">
            <CalendarToday />
          </div>
        </Group>
      </PageContainer>
    </>
  );
}
