import * as React from 'react';
import { Navbar, Text } from '@mantine/core';

interface Props {
  hidden: boolean;
}

export function AppNavbar(props: Props) {
  const { hidden } = props;

  return (
    <Navbar
      p="md"
      // Breakpoint at which navbar will be hidden if hidden prop is true
      hiddenBreakpoint="sm"
      // Hides navbar when viewport size is less than value specified in hiddenBreakpoint
      hidden={hidden}
      // when viewport size is less than theme.breakpoints.sm navbar width is 100%
      // viewport size > theme.breakpoints.sm – width is 300px
      // viewport size > theme.breakpoints.lg – width is 400px
      width={{ sm: 300, lg: 400 }}
    >
      <Text>Links</Text>
    </Navbar>
  );
}
