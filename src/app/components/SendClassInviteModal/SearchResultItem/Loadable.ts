import { lazyLoad } from 'utils/loadable';

export const SearchResultItem = lazyLoad(
  () => import('./index'),
  module => module.SearchResultItem,
);
