import * as React from 'react';
import { Helmet } from 'react-helmet-async';

export function Main() {
  return (
    <>
      <Helmet>
        <title>Main</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <span className="text-lg text-blue-300">Main Page</span>
    </>
  );
}
