import { lazyLoad } from 'utils/loadable';

export const ClassMeetingsItem = lazyLoad(
  () => import('./index'),
  module => module.ClassMeetingsItem,
);
