import { lazyLoad } from 'utils/loadable';

export const CreatePostModal = lazyLoad(
  () => import('./index'),
  module => module.CreatePostModal,
);
