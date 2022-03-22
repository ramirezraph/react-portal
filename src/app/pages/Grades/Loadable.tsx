/**
 * Asynchronously loads the component for HomePage
 */

import { lazyLoad } from 'utils/loadable';

export const Grades = lazyLoad(
  () => import('./index'),
  module => module.Grades,
);
