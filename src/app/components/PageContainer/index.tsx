import * as React from 'react';

interface Prop {
  children?: React.ReactNode;
}

export function PageContainer(props: Prop) {
  return <div className="p-6">{props.children}</div>;
}
