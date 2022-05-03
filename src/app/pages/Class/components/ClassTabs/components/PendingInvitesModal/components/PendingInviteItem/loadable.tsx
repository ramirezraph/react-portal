import { lazyLoad } from 'utils/loadable';

export const PendingInviteItem = lazyLoad(
  () => import('./index'),
  module => module.PendingInviteItem,
);
