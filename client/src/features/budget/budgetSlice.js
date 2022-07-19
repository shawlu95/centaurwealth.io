import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  createBudgetThunk,
  getBudgetsThunk,
  updateBudgetThunk,
} from './budgetThunk';
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
    mutable: true,
  },
  budgets: [],
  expenses: { ...defaultExpenses },
};

export const getBudgets = createAsyncThunk(
  'budget/getBudgets',
  getBudgetsThunk
);

export const createBudget = createAsyncThunk(
  'budget/createBudget',
  createBudgetThunk
);

export const updateBudget = createAsyncThunk(
  'budget/updateBudget',
  updateBudgetThunk
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    editBudget: (state, { payload }) => {
      const { name, value } = payload;
      state.budget[name] = value;
    },
    setBudget: (state, { payload }) => {
      const { budgetId } = payload;
      state.budget = state.budgets.filter((item) => item.id === budgetId)[0];
    },
  },
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
    [createBudget.pending]: (state) => {
      state.isLoading = true;
    },
    [createBudget.fulfilled]: (state, { payload }) => {
      const budget = state.budget;
      toast.success(`Created budeget: ${budget.name}`);
    },
    [createBudget.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [updateBudget.pending]: (state) => {
      state.isLoading = true;
    },
    [updateBudget.fulfilled]: (state, { payload }) => {
      const budget = state.budget;
      toast.success(`Updated budeget: ${budget.name}`);
    },
    [updateBudget.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
  },
});

export const { editBudget, setBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
