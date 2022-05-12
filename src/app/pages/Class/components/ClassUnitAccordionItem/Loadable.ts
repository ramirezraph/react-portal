import { lazyLoad } from 'utils/loadable';

export const ClassUnitAccordionItem = lazyLoad(
  () => import('./index'),
  module => module.ClassUnitAccordionItem,
);
