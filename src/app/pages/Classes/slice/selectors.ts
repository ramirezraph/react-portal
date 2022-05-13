import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.classes || initialState;

export const selectClasses = createSelector([selectSlice], state => state);
