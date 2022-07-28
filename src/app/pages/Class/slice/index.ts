import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { classroomSaga } from './saga';
import { ClassRole, ClassroomState, Lesson, Unit } from './types';

import { Location } from 'react-router-dom';
import { Class } from 'app/pages/Classes/slice/types';

export const initialState: ClassroomState = {
  activeClass: null,
  units: [],
  lessons: [],
  unitPath: '',
  classworkModalBackground: undefined,
  lessonModalBackground: undefined,
  activeClassRole: undefined,
  canPost: false,
  canComment: false,
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
    fetchLessons(
      state,
      action: PayloadAction<{ unitId: string; lessons: Lesson[] }>,
    ) {
      const unit = state.units.find(x => x.id === action.payload.unitId);
      if (unit) {
        unit.lessons = action.payload.lessons;
      }
    },
    setClassworkModalBackground(
      state,
      action: PayloadAction<{ backgroundLocation?: Location }>,
    ) {
      state.classworkModalBackground = action.payload.backgroundLocation;
    },
    setLessonModalBackground(
      state,
      action: PayloadAction<{ backgroundLocation?: Location }>,
    ) {
      state.lessonModalBackground = action.payload.backgroundLocation;
    },
    setActiveClass(state, action: PayloadAction<{ activeClass: Class }>) {
      state.activeClass = action.payload.activeClass;
    },
    setActiveClassRole(state, action: PayloadAction<{ role: ClassRole }>) {
      state.activeClassRole = action.payload.role;
    },
    setCanPost(state, action: PayloadAction<{ value: boolean }>) {
      state.canPost = action.payload.value;
    },
    setCanComment(state, action: PayloadAction<{ value: boolean }>) {
      state.canComment = action.payload.value;
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
