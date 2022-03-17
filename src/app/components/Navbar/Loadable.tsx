import { lazyLoad } from 'utils/loadable';

export const AppNavbar = lazyLoad(
  () => import('./index'),
  module => module.AppNavbar,
);
