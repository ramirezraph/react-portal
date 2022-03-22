/**
 * Asynchronously loads the component for HomePage
 */

import { lazyLoad } from 'utils/loadable';

export const Classes = lazyLoad(
  () => import('./index'),
  module => module.Classes,
);
