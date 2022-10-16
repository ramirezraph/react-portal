import { lazyLoad } from 'utils/loadable';

export const ClassMaterials = lazyLoad(
  () => import('./index'),
  module => module.ClassMaterials,
);
