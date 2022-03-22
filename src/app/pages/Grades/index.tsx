import { Container } from '@mantine/core';
import { PageContainer } from 'app/components/PageContainer/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';

export function Grades() {
  return (
    <>
      <Helmet>
        <title>Grades</title>
      </Helmet>
      <PageContainer>
        <span className="text-lg">Grades</span>
      </PageContainer>
    </>
  );
}
