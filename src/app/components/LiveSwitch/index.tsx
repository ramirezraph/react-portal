import { Switch } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import * as React from 'react';

interface Props {
  live: boolean;
  onToggle: () => void;
}

export function LiveSwitch(props: Props) {
  const { live, onToggle } = props;

  const [switchLabel, toggleSwitchLabel] = useToggle(null, ['Live', 'Draft']);

  React.useEffect(() => {
    if (live) {
      toggleSwitchLabel('Live');
    } else {
      toggleSwitchLabel('Draft');
    }
  }, [live, toggleSwitchLabel]);

  return (
    <Switch
      checked={live}
      size="sm"
      label={switchLabel}
      aria-label="Live or draft"
      onChange={onToggle}
      color="green"
      classNames={{
        input: 'bg-orange-500',
      }}
    />
  );
}
