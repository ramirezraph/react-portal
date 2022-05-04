import { lazyLoad } from 'utils/loadable';

export const PopoverNotification = lazyLoad(
  () => import('./index'),
  module => module.PopoverNotification,
);
