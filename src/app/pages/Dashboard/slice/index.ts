import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { dashboardSaga } from './saga';
import { DashboardState } from './types';

export const initialState: DashboardState = {
  numberOfTodaysMeetings: 0,
};

const slice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setNumberOfTodaysMeetings(state, action: PayloadAction<{ to: number }>) {
      state.numberOfTodaysMeetings = action.payload.to;
    },
  },
});

export const { actions: dashboardActions } = slice;

export const useDashboardSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: dashboardSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useDashboardSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
