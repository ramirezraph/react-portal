import { PageContainer } from 'app/components/PageContainer/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';

export function Class() {
  return (
    <>
      <Helmet>
        <title>Class Code</title>
      </Helmet>
      <PageContainer>
        <span className="text-lg">Class</span>
      </PageContainer>
    </>
  );
}
