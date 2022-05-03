import { withAuthenticationRequired } from '@auth0/auth0-react';
import { LoadingOverlay } from '@mantine/core';
import React, { ComponentType } from 'react';

interface ProtectedRouteProps {
  component: ComponentType;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component,
}) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <LoadingOverlay visible />,
  });

  return <Component />;
};
