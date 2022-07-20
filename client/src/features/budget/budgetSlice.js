import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  classifyTransactionThunk,
  createBudgetThunk,
  getBudgetHistoryThunk,
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
    quarterly: 0,
    annual: 0,
    mutable: true,
    summary: {},
  },
  budgets: [],
  expenses: { ...defaultExpenses },
};

export const getBudgets = createAsyncThunk(
  'budget/getBudgets',
  getBudgetsThunk
);

export const getBudgetHistory = createAsyncThunk(
  'budget/getHistory',
  getBudgetHistoryThunk
);

export const createBudget = createAsyncThunk(
  'budget/createBudget',
  createBudgetThunk
);

export const updateBudget = createAsyncThunk(
  'budget/updateBudget',
  updateBudgetThunk
);

export const classifyTransaction = createAsyncThunk(
  'budget/classify',
  classifyTransactionThunk
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    setPage: (state, { payload }) => {
      const { page } = payload;
      state.expenses.page = page;
    },
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
    [getBudgetHistory.pending]: (state) => {
      state.isLoading = true;
    },
    [getBudgetHistory.fulfilled]: (state, { payload }) => {
      state.expenses = payload.expenses;
    },
    [getBudgetHistory.rejected]: (state, { payload }) => {
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
    [classifyTransaction.pending]: (state) => {
      state.isLoading = true;
    },
    [classifyTransaction.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      const { id, memo, budgetId } = payload.expense;
      const budget = state.budgets.filter((item) => item.id === budgetId)[0];
      state.expenses.docs = state.expenses.docs.filter(
        (item) => item.id !== id
      );
      toast.success(`Put '${memo}' into budget '${budget.name}'`);
    },
    [classifyTransaction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
  },
});

export const { setPage, editBudget, setBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
