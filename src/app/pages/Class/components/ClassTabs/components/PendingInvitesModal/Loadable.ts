import { lazyLoad } from 'utils/loadable';

export const PendingInvitesModal = lazyLoad(
  () => import('./index'),
  module => module.PendingInvitesModal,
);
