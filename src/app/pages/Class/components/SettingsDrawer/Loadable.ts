import { lazyLoad } from 'utils/loadable';

export const SettingsDrawer = lazyLoad(
  () => import('./index'),
  module => module.SettingsDrawer,
);
