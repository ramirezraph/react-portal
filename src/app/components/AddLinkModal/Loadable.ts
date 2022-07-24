/**
 *
 * Asynchronously loads the component for AddLinkModal
 *
 */

import { lazyLoad } from 'utils/loadable';

export const AddLinkModal = lazyLoad(
  () => import('./index'),
  module => module.AddLinkModal,
);
