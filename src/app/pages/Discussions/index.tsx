import { Container } from '@mantine/core';
import { PageContainer } from 'app/components/PageContainer/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';

export function Discussions() {
  return (
    <>
      <Helmet>
        <title>Discussions</title>
      </Helmet>
      <PageContainer>
        <span className="text-lg">Discussions</span>
      </PageContainer>
    </>
  );
}
