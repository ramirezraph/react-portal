import { lazyLoad } from 'utils/loadable';

export const CreateClassModal = lazyLoad(
  () => import('./index'),
  module => module.CreateClassModal,
);
