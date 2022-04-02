import { lazyLoad } from 'utils/loadable';

export const Todos = lazyLoad(
  () => import('./index'),
  module => module.Todos,
);
