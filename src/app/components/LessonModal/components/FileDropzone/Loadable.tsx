/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const FileDropzone = lazyLoad(
  () => import('./index'),
  module => module.FileDropzone,
);
