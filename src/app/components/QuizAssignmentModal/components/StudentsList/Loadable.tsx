import { lazyLoad } from 'utils/loadable';

export const StudentsList = lazyLoad(
  () => import('./index'),
  module => module.StudentsList,
);
