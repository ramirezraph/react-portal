/**
 * Asynchronously loads the component for HomePage
 */

import { lazyLoad } from 'utils/loadable';

export const Calendar = lazyLoad(
  () => import('./index'),
  module => module.Calendar,
);
