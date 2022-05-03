import { lazyLoad } from 'utils/loadable';

export const StudentWork = lazyLoad(
  () => import('./index'),
  module => module.StudentWork,
);
