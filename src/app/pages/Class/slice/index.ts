import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { classroomSaga } from './saga';
import { ClassroomState, Unit } from './types';

import { Location } from 'react-router-dom';
import { Class } from 'app/pages/Classes/slice/types';

export const initialState: ClassroomState = {
  activeClass: null,
  units: [],
  unitPath: '',
  classworkModalBackground: undefined,
};

const slice = createSlice({
  name: 'classroom',
  initialState,
  reducers: {
    updateUnitPath(state, action: PayloadAction<{ path: string }>) {
      state.unitPath = action.payload.path;
    },
    fetchUnits(state, action: PayloadAction<{ units: Unit[] }>) {
      state.units = action.payload.units;
    },
    setClassworkModalBackground(
      state,
      action: PayloadAction<{ backgroundLocation?: Location }>,
    ) {
      console.log(action.payload.backgroundLocation);
      state.classworkModalBackground = action.payload.backgroundLocation;
    },
    setActiveClass(state, action: PayloadAction<{ activeClass: Class }>) {
      state.activeClass = action.payload.activeClass;
    },
  },
});

export const { actions: classroomActions } = slice;

export const useClassroomSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: classroomSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useClassroomSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
