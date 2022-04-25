import { lazyLoad } from 'utils/loadable';

export const ClassworkItem = lazyLoad(
  () => import('./index'),
  module => module.ClassworkItem,
);
