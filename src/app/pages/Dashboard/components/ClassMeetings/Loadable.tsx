import { lazyLoad } from 'utils/loadable';

export const ClassMeetings = lazyLoad(
  () => import('./index'),
  module => module.ClassMeetings,
);
