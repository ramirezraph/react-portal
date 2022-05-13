import { lazyLoad } from 'utils/loadable';

export const CreateUnitModal = lazyLoad(
  () => import('./index'),
  module => module.CreateUnitModal,
);
