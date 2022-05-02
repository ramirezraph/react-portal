import { lazyLoad } from 'utils/loadable';

export const StudentWorkListItem = lazyLoad(
  () => import('./index'),
  module => module.StudentWorkListItem,
);
