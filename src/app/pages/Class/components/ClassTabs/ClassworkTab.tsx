import {
  Button,
  Group,
  Menu,
  SimpleGrid,
  Text,
  TextInput,
} from '@mantine/core';
import * as React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Adjustments,
  Circle,
  InfoCircle,
  Pencil,
  Plus,
  Search,
  Settings,
} from 'tabler-icons-react';
import { ClassworkItem } from './components/ClassworkItem/Loadable';

import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useClassroomSlice } from '../../slice';

ChartJS.register(ArcElement, Tooltip);

interface Props {}

export function ClassworkTab(props: Props) {
  const { actions } = useClassroomSlice();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  let location: Location = useLocation();

  const [doughnutData] = React.useState({
    labels: ['Draft', 'Assigned', 'To review', 'Graded'],
    datasets: [
      {
        label: '# of Votes',
        data: [3, 1, 2, 3],
        backgroundColor: [
          'rgba(218, 218, 218, 1)',
          'rgba(115, 115, 115, 1)',
          'rgba(255, 193, 99, 1)',
          'rgba(108, 99, 255, 1)',
        ],
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  });

  const onClassworkClicked = (id: string, type: string) => {
    dispatch(
      actions.setClassworkModalBackground({
        backgroundLocation: location,
      }),
    );

    navigate(
      {
        pathname: `/classwork/${id}`,
        search: `type=${type}&view=list`,
      },
      {
        state: { backgroundLocation: location },
      },
    );
  };

  return (
    <div className="bg-transparent p-6">
      <Group position="apart">
        <Group direction="column">
          <Text size="lg">
            Classwork - <span className="font-semibold">CPE 401</span>
          </Text>
          <Group spacing={'xs'}>
            <Menu
              control={
                <Button size="md" radius="xl" leftIcon={<Plus size={21} />}>
                  <Text weight={400} size="sm">
                    Create new
                  </Text>
                </Button>
              }
            >
              <Menu.Item icon={<Pencil size={16} />}>option 1</Menu.Item>
              <Menu.Item icon={<Pencil size={16} />}>option 2</Menu.Item>
              <Menu.Item icon={<Pencil size={16} />}>option 3</Menu.Item>
            </Menu>
            <Button size="md" radius="xl">
              <Settings size={21} />
            </Button>
          </Group>
        </Group>
        <Group spacing="xl">
          <div className="w-32">
            <Doughnut data={doughnutData} />
          </div>
          <Group spacing="xl">
            <Group direction="column" spacing={5}>
              <Group>
                <Pencil size={18} />
                <Text size="sm">Draft</Text>
              </Group>
              <Group>
                <Circle size={18} />
                <Text size="sm">Assigned</Text>
              </Group>
              <Group className="text-yellow-600">
                <InfoCircle size={18} />
                <Text size="sm">To review</Text>
              </Group>
              <Group className="text-primary">
                <Circle size={18} />
                <Text size="sm">Graded</Text>
              </Group>
            </Group>
            <Group direction="column" spacing={5}>
              <Text size="sm" weight="bold">
                3
              </Text>
              <Text size="sm" weight="bold">
                1
              </Text>
              <Text size="sm" weight="bold">
                2
              </Text>
              <Text size="sm" weight="bold">
                3
              </Text>
            </Group>
          </Group>
        </Group>
      </Group>
      <Group className="mt-6" noWrap>
        <Menu
          control={
            <Button
              leftIcon={<Adjustments color="gray" />}
              color="gray"
              variant="outline"
              size="md"
            >
              <Text size="sm" weight={400} color="black">
                Filter by status
              </Text>
            </Button>
          }
        >
          <Menu.Item icon={<Settings size={14} />}>Settings</Menu.Item>
        </Menu>
        <TextInput
          className="w-full"
          placeholder="Search"
          size="md"
          required
          icon={<Search size={20} />}
        />
      </Group>
      <SimpleGrid cols={2} className="mt-5">
        <ClassworkItem
          id="123"
          title="Laboratory Activity 1"
          date="12/1/2022"
          status="Graded"
          onClick={() => {
            onClassworkClicked('123', 'assignment');
          }}
        />
        <ClassworkItem
          id="456"
          title="Quiz #2"
          date="12/2/2022"
          status="Assigned"
          onClick={() => {
            onClassworkClicked('123', 'quiz');
          }}
        />
      </SimpleGrid>
    </div>
  );
}
