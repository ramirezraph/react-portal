import * as React from 'react';
import { Group, Text, UnstyledButton } from '@mantine/core';
import { IconProps } from 'tabler-icons-react';
import { NavLink } from 'react-router-dom';

interface Props {
  to: string;
  icon: IconProps;
  text: string;
}

export function NavButton(props: Props) {
  const { icon, to, text } = props;

  return (
    <UnstyledButton className="w-full py-1">
      <NavLink
        className={({ isActive }) =>
          `no-underline ${isActive ? 'text-primary' : 'text-black'}`
        }
        to={to}
      >
        <Group>
          {icon}
          <Text>{text}</Text>
        </Group>
      </NavLink>
    </UnstyledButton>
  );
}
