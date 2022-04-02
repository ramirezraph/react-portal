import { lazyLoad } from 'utils/loadable';

export const StatsItem = lazyLoad(
  () => import('./index'),
  module => module.StatsItem,
);
