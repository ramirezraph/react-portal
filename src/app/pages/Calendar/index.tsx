import { Container } from '@mantine/core';
import { PageContainer } from 'app/components/PageContainer/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';

export function Calendar() {
  return (
    <>
      <Helmet>
        <title>Calendar</title>
      </Helmet>
      <PageContainer>
        <span className="text-lg">Calendar</span>
      </PageContainer>
    </>
  );
}
