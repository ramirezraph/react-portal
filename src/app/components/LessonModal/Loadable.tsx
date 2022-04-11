/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const LessonModal = lazyLoad(
  () => import('./index'),
  module => module.LessonModal,
);
