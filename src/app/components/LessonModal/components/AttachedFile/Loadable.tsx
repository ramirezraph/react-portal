/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const AttachedFile = lazyLoad(
  () => import('./index'),
  module => module.AttachedFile,
);
