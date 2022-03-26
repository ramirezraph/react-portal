import { lazyLoad } from 'utils/loadable';

export const Class = lazyLoad(
  () => import('./index'),
  module => module.Class,
);
