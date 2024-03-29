import { DashboardState } from 'app/pages/Dashboard/slice/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

import { ClassroomState } from 'app/pages/Class/slice/types';
import { ClassesState } from 'app/pages/Classes/slice/types';
import { UserState } from 'store/userSlice/types';

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  dashboard?: DashboardState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
  classroom: ClassroomState;
  user: UserState;
  classes: ClassesState;
}
