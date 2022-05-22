import { lazyLoad } from 'utils/loadable';

export const CreateMeetingModal = lazyLoad(
  () => import('./index'),
  module => module.EditMeetingModal,
);
