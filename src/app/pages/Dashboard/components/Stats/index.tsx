import * as React from 'react';
import { Group } from '@mantine/core';
import { StatsItem } from '../StatsItem/Loadable';
import { useSelector } from 'react-redux';
import { selectClasses } from 'app/pages/Classes/slice/selectors';

interface Props {}

export function Stats(props: Props) {
  const { classes } = useSelector(selectClasses);

  const numberOFClasses = React.useMemo(() => {
    console.log('memo runs');

    return classes.length;
  }, [classes.length]);

  return (
    <Group className="mt-6 drop-shadow-md">
      <StatsItem title="Class" value={numberOFClasses} color="bg-violet-500" />
      <StatsItem title="Todo" value={4} color="bg-pink-500" />
    </Group>
  );
}
