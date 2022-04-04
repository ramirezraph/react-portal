/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const Post = lazyLoad(
  () => import('./index'),
  module => module.Post,
);
