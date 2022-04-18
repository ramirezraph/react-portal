import * as React from 'react';
import { Group, Text, UnstyledButton } from '@mantine/core';
import { IconProps } from 'tabler-icons-react';
import { NavLink } from 'react-router-dom';

interface Props {
  to: string;
  icon: IconProps;
  text: string;
  className?: string;
  centered?: boolean;
  smallText?: boolean;
}

export function NavButton(props: Props) {
  const { icon, to, text, className, centered, smallText } = props;

  return (
    <UnstyledButton className="w-full py-1">
      <NavLink
        className={({ isActive }) =>
          ` no-underline ${
            isActive ? ' text-primary' : 'text-black'
          } ${className}`
        }
        to={to}
      >
        <Group className={`${centered && 'justify-center'}`}>
          {icon}
          <Text className={`${smallText && 'text-sm'}`}>{text}</Text>
        </Group>
      </NavLink>
    </UnstyledButton>
  );
}
