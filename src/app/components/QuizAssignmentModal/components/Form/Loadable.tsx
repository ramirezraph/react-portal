import { lazyLoad } from 'utils/loadable';

export const Form = lazyLoad(
  () => import('./index'),
  module => module.Form,
);
