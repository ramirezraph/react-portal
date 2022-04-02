import { lazyLoad } from 'utils/loadable';

export const ClassLessonAccordion = lazyLoad(
  () => import('./index'),
  module => module.ClassLessonAccordion,
);
