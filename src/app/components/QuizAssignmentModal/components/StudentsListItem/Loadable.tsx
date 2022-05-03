import { lazyLoad } from 'utils/loadable';

export const StudentsListItem = lazyLoad(
  () => import('./index'),
  module => module.StudentsListItem,
);
