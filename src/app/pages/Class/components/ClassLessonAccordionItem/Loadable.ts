import { lazyLoad } from 'utils/loadable';

export const ClassLessonAccordionItem = lazyLoad(
  () => import('./index'),
  module => module.ClassLessonAccordionItem,
);
