import { lazyLoad } from 'utils/loadable';

export const ClassAccordion = lazyLoad(
  () => import('./index'),
  module => module.ClassAccordion,
);
