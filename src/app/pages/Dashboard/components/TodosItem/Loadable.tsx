import { lazyLoad } from 'utils/loadable';

export const TodosItem = lazyLoad(
  () => import('./index'),
  module => module.TodosItem,
);
