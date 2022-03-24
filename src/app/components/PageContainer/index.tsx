import * as React from 'react';

interface Prop {
  children?: React.ReactNode;
  className?: string;
}

export function PageContainer(props: Prop) {
  return <div className={`p-6 ${props.className}`}>{props.children}</div>;
}
