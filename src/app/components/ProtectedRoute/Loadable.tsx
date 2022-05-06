import { lazyLoad } from 'utils/loadable';

export const ProtectedRoute = lazyLoad(
  () => import('./index'),
  module => module.ProtectedRoute,
);
