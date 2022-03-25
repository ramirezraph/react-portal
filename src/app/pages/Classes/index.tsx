import { PageContainer } from 'app/components/PageContainer/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';

export function Classes() {
  return (
    <>
      <Helmet>
        <title>Classes</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <PageContainer>
        <span className="text-lg">Classes</span>
      </PageContainer>
    </>
  );
}
