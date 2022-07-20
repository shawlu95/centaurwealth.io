import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTimelineThunk } from './chartThunk';
import { displayErrors } from '../../utils/toast';

const initialState = {
  isLoading: false,
  range: 'ytd',
  points: [],
};

export const getTimeline = createAsyncThunk('chart/timeline', getTimelineThunk);

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setRange: (state, { payload }) => {
      const { range } = payload;
      state.range = range;
    },
  },
  extraReducers: {
    [getTimeline.pending]: (state) => {
      state.isLoading = true;
    },
    [getTimeline.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.points = payload.points;
    },
    [getTimeline.rejected]: (state, { payload }) => {
      state.isLoading = false;
      displayErrors(payload.errors);
    },
  },
});

export const { setRange } = chartSlice.actions;
export default chartSlice.reducer;
