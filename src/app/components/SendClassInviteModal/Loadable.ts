import { lazyLoad } from 'utils/loadable';

export const SendClassInviteModal = lazyLoad(
  () => import('./index'),
  module => module.SendClassInviteModal,
);
