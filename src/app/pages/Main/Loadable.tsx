import { lazyLoad } from 'utils/loadable';

export const Main = lazyLoad(
  () => import('./index'),
  module => module.Main,
);
