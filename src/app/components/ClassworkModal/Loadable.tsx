import { lazyLoad } from 'utils/loadable';

export const ClassworkModal = lazyLoad(
  () => import('./index'),
  module => module.ClassworkModal,
);
