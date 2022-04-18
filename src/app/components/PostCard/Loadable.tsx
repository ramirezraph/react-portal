/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const PostCard = lazyLoad(
  () => import('./index'),
  module => module.PostCard,
);
