import { lazyLoad } from 'utils/loadable';

export const ClassAccordionControl = lazyLoad(
  () => import('./index'),
  module => module.ClassAccordionControl,
);
