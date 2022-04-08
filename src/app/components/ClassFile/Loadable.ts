/**
 *
 * Asynchronously loads the component for ClassFile
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ClassFile = lazyLoad(
  () => import('./index'),
  module => module.ClassFile,
);
