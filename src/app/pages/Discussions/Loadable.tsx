/**
 * Asynchronously loads the component for HomePage
 */

import { lazyLoad } from 'utils/loadable';

export const Discussions = lazyLoad(
  () => import('./index'),
  module => module.Discussions,
);
