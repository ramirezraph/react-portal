import { lazyLoad } from 'utils/loadable';

export const MeetingItem = lazyLoad(
  () => import('./index'),
  module => module.MeetingItem,
);
