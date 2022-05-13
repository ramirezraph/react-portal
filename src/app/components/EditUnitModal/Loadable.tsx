import { lazyLoad } from 'utils/loadable';

export const EditUnitModal = lazyLoad(
  () => import('./index'),
  module => module.EditUnitModal,
);
