/**
 *
 * Asynchronously loads the component for ClassFile
 *
 */

import { lazyLoad } from 'utils/loadable';

export const LiveSwitch = lazyLoad(
  () => import('./index'),
  module => module.LiveSwitch,
);
