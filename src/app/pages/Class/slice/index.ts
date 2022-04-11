import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { classroomSaga } from './saga';
import { ClassroomState } from './types';

export const initialState: ClassroomState = {
  units: [],
};

const slice = createSlice({
  name: 'classroom',
  initialState,
  reducers: {
    fetchUnits(state) {
      state.units = [
        {
          id: '1',
          number: 1,
          title: 'Getting Started',
          content: 'sed quia non numquam eius modi tempora.',
          isLive: true,
          lessons: [
            {
              id: '1',
              number: 1,
              title: 'Why we program?',
              content:
                'Enim sem egestas omare ac cursus non odio nibh gravidia. Pharetra, fringila amet, vel at a.',
              isLive: true,
              files: [
                {
                  id: '123fsadfadse2',
                  title: 'Why we program.pdf',
                  downloadUrl: '',
                },
                {
                  id: '123fsgijgh',
                  title: 'Introduction.mp4',
                  downloadUrl: '',
                },
              ],
            },
            {
              id: '2',
              number: 2,
              title: 'Installing and using Python',
              content:
                'Enim sem egestas omare ac cursus non odio nibh gravidia. Pharetra, fringila amet, vel at a.',
              isLive: true,
              files: [],
            },
            {
              id: '3',
              number: 3,
              title: 'Variables and Expressions',
              content:
                'Enim sem egestas omare ac cursus non odio nibh gravidia. Pharetra, fringila amet, vel at a.',
              isLive: false,
              files: [],
            },
          ],
        },
        {
          id: '2',
          number: 2,
          title: 'Data Structures',
          content: '',
          isLive: false,
          lessons: [
            {
              id: '1',
              number: 1,
              title: 'Objects',
              content:
                'Enim sem egestas omare ac cursus non odio nibh gravidia. Pharetra, fringila amet, vel at a.',
              isLive: false,
              files: [],
            },
            {
              id: '2',
              number: 2,
              title: 'Arrays',
              content:
                'Enim sem egestas omare ac cursus non odio nibh gravidia. Pharetra, fringila amet, vel at a.',
              isLive: false,
              files: [],
            },
          ],
        },
      ];
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

      const lesson = unit.lessons.find(x => x.id === action.payload.lessonId);
      if (!lesson) {
        // not found, do something
        return;
      }

      lesson.isLive = !lesson.isLive;
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
