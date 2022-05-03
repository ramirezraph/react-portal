import { lazyLoad } from 'utils/loadable';

export const ClassworkDetails = lazyLoad(
  () => import('./index'),
  module => module.ClassworkDetails,
);
