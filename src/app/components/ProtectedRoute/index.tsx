import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Group, Text } from '@mantine/core';
import React, { ComponentType } from 'react';

interface ProtectedRouteProps {
  component: ComponentType;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component,
}) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="flex h-screen w-screen items-center justify-center bg-white ">
        <Group>
          <Text size="xl" weight="bolder" className="animate-loading-bounce-1">
            •
          </Text>
          <Text size="xl" weight="bolder" className="animate-loading-bounce-2">
            •
          </Text>
          <Text size="xl" weight="bolder" className="animate-loading-bounce-3">
            •
          </Text>
          <Text size="xl" weight="bolder" className="animate-loading-bounce-4">
            •
          </Text>
        </Group>
      </div>
    ),
  });

  return <Component />;
};
