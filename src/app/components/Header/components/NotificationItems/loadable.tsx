import { lazyLoad } from 'utils/loadable';

export const NotificationItems = lazyLoad(
  () => import('./index'),
  module => module.NotificationItems,
);
