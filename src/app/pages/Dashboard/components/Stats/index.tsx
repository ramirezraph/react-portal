import * as React from 'react';
import { Group } from '@mantine/core';
import { StatsItem } from '../StatsItem/Loadable';
import { useSelector } from 'react-redux';
import { selectClasses } from 'app/pages/Classes/slice/selectors';
import { selectDashboard } from '../../slice/selectors';

interface Props {}

export function Stats(props: Props) {
  const { classes } = useSelector(selectClasses);
  const { numberOfTodaysMeetings } = useSelector(selectDashboard);

  const numberOFClasses = React.useMemo(() => {
    return classes.length;
  }, [classes.length]);

  return (
    <Group className="mt-6 drop-shadow-md">
      <StatsItem title="Class" value={numberOFClasses} color="bg-violet-500" />
      <StatsItem
        title="Meetings today"
        value={numberOfTodaysMeetings}
        color="bg-pink-500"
      />
    </Group>
  );
}
