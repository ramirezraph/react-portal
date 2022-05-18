import { lazyLoad } from 'utils/loadable';

export const SelectedUserItem = lazyLoad(
  () => import('./index'),
  module => module.SelectedUserItem,
);
