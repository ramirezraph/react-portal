import { Button, Group, Text } from '@mantine/core';
import * as React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Circle, InfoCircle, Pencil, Plus, Settings } from 'tabler-icons-react';

import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

interface Props {
  // someProps: string
}

export function ClassworkTab(props: Props) {
  // const { someProps } = props;

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

  return (
    <div className="bg-transparent p-6">
      <Group position="apart">
        <Group direction="column">
          <Text size="lg">
            Classwork - <span className="font-semibold">CPE 401</span>
          </Text>
          <Group spacing={'xs'}>
            <Button radius="xl" leftIcon={<Plus size={21} />}>
              Create
            </Button>
            <Button radius="xl">
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
      <Group>
        <Text>Hello, World!</Text>
      </Group>
    </div>
  );
}
