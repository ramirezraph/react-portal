import { lazyLoad } from 'utils/loadable';

export const ClassInviteNotification = lazyLoad(
  () => import('./index'),
  module => module.ClassInviteNotification,
);
