import { lazyLoad } from 'utils/loadable';

export const AppHeader = lazyLoad(
  () => import('./index'),
  module => module.AppHeader,
);
