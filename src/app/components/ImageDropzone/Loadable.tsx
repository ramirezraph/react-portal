/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const ImageDropzone = lazyLoad(
  () => import('./index'),
  module => module.ImageDropzone,
);
