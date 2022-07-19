import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getBudgetsThunk } from './budgetThunk';
const defaultExpenses = {
  docs: [],
  hasMore: false,
  hasNextPage: false,
  hasPrevPage: false,
  limit: 25,
  page: 1,
  pagingCounter: 1,
  totalDocs: 1,
  totalPages: 1,
};

const initialState = {
  isLoading: false,
  budget: {
    name: '',
    monthly: 0,
  },
  budgets: [],
  expenses: { ...defaultExpenses },
};

export const getBudgets = createAsyncThunk(
  'budget/getBudgets',
  getBudgetsThunk
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {},
  extraReducers: {
    [getBudgets.pending]: (state) => {
      state.isLoading = true;
    },
    [getBudgets.fulfilled]: (state, { payload }) => {
      state.budgets = payload.budgets;
    },
    [getBudgets.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
  },
});

export default budgetSlice.reducer;
