import { lazyLoad } from 'utils/loadable';

export const CalendarToday = lazyLoad(
  () => import('./index'),
  module => module.CalendarToday,
);
