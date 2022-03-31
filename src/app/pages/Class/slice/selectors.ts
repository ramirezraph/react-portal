import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.classroom || initialState;

export const selectClassroom = createSelector([selectSlice], state => state);
