import * as React from 'react';
import { Helmet } from 'react-helmet-async';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>HomePage</title>
      </Helmet>
      <span className="text-lg text-blue-300">My HomePage</span>
    </>
  );
}
