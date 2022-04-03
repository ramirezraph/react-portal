import { lazyLoad } from 'utils/loadable';

export const ClassTabs = lazyLoad(
  () => import('./index'),
  module => module.ClassTabs,
);

export const DiscussionTab = lazyLoad(
  () => import('./DiscussionTab'),
  module => module.DiscussionTab,
);

export const ClassworkTab = lazyLoad(
  () => import('./ClassworkTab'),
  module => module.ClassworkTab,
);

export const PeopleTab = lazyLoad(
  () => import('./PeopleTab'),
  module => module.PeopleTab,
);

export const MeetingsTab = lazyLoad(
  () => import('./MeetingsTab'),
  module => module.MeetingsTab,
);
