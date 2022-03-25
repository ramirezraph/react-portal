import { lazyLoad } from 'utils/loadable';

export const ClassCard = lazyLoad(
  () => import('./index'),
  module => module.ClassCard,
);
