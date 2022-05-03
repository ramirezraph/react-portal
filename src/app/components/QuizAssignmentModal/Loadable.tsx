import { lazyLoad } from 'utils/loadable';

export const QuizAssignmentModal = lazyLoad(
  () => import('./index'),
  module => module.QuizAssignmentModal,
);
