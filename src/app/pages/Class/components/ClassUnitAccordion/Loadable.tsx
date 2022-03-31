import { lazyLoad } from 'utils/loadable';

export const ClassUnitAccordion = lazyLoad(
  () => import('./index'),
  module => module.ClassUnitAccordion,
);
