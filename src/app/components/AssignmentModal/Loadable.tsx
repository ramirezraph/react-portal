import { lazyLoad } from 'utils/loadable';

export const AssignmentModal = lazyLoad(
  () => import('./index'),
  module => module.AssignmentModal,
);
