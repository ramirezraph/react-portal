import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { classesSaga } from './saga';
import { Class, ClassesState } from './types';

export const initialState: ClassesState = {
  classes: [],
};

const slice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    fetchClasses(state, action: PayloadAction<{ classes: Class[] }>) {
      state.classes = action.payload.classes;
    },
  },
});

export const { actions: classesActions } = slice;

export const useClassesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: classesSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useClassesSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
