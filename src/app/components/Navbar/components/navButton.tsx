import * as React from 'react';
import { Group, Text, UnstyledButton } from '@mantine/core';
import { IconProps } from 'tabler-icons-react';
import { Link } from 'react-router-dom';

interface Props {
  to: string;
  icon: IconProps;
  text: string;
}

export function NavButton(props: Props) {
  const { icon, to, text } = props;

  return (
    <UnstyledButton className="w-full py-1">
      <Link className="text-black no-underline" to={to}>
        <Group>
          {icon}
          <Text>{text}</Text>
        </Group>
      </Link>
    </UnstyledButton>
  );
}
