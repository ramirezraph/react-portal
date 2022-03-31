import { lazyLoad } from 'utils/loadable';

export const Stats = lazyLoad(
  () => import('./index'),
  module => module.Stats,
);
