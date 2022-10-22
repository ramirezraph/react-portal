import React from 'react';
import { ClassMaterials } from '../ClassMaterials/Loadable';

interface Props {}

export function ClassMaterialsTab(props: Props) {
  return (
    <div
      className="w-full bg-transparent py-3"
      style={{
        minHeight: 500,
      }}
    >
      <ClassMaterials />
    </div>
  );
}
