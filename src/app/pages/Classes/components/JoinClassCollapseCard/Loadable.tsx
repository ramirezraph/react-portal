import { lazyLoad } from 'utils/loadable';

export const JoinClassCollapseCard = lazyLoad(
  () => import('./index'),
  module => module.JoinClassCollapseCard,
);
