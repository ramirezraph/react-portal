import { lazyLoad } from 'utils/loadable';

export const ClassAccordionHeader = lazyLoad(
  () => import('./index'),
  module => module.ClassAccordionHeader,
);
