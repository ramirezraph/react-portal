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
    toggleUnitLive(state, action: PayloadAction<string>) {
      const unit = state.units.find(x => x.id === action.payload);

      if (!unit) {
        // not found, do something
        return;
      }

      unit.isLive = !unit.isLive;
    },
    toggleLessonLive(
      state,
      action: PayloadAction<{ unitId: string; lessonId: string }>,
    ) {
      const unit = state.units.find(x => x.id === action.payload.unitId);
      if (!unit) {
        // not found, do something
        return;
      }

      const lesson = unit.lessons?.find(x => x.id === action.payload.lessonId);
      if (!lesson) {
        // not found, do something
        return;
      }

      lesson.isLive = !lesson.isLive;
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
