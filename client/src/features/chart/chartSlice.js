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
    resetChartState: (state) => {
      // called when user signs out
      return initialState;
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

export const { setRange, resetChartState } = chartSlice.actions;
export default chartSlice.reducer;
