import { lazyLoad } from 'utils/loadable';

export const ImagesGrid = lazyLoad(
  () => import('./index'),
  module => module.ImagesGrid,
);
