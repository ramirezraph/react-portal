import { lazyLoad } from 'utils/loadable';

export const Comment = lazyLoad(
  () => import('./index'),
  module => module.Comment,
);
