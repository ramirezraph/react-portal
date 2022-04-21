import { lazyLoad } from 'utils/loadable';

export const PeopleItem = lazyLoad(
  () => import('./index'),
  module => module.PeopleItem,
);
