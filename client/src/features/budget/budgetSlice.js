import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  addToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
} from '../../utils/localStorage';
import {
  classifyTransactionThunk,
  createBudgetThunk,
  getBudgetHistoryThunk,
  getBudgetsThunk,
  updateBudgetThunk,
} from './budgetThunk';
import { displayErrors } from '../../utils/toast';

const defaultExpenses = {
  docs: [],
  hasMore: false,
  hasNextPage: false,
  hasPrevPage: false,
  limit: 15,
  page: 1,
  pagingCounter: 1,
  totalDocs: 1,
  totalPages: 1,
};

const defaultBudget = {
  name: '',
  monthly: 0,
  quarterly: 0,
  annual: 0,
  mutable: true,
  summary: {},
};

const initialState = {
  isLoading: false,
  budget: { ...defaultBudget },
  budgets: getFromLocalStorage('budgets') || [],
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
      state.expenses.page = payload.page;
    },
    editBudget: (state, { payload }) => {
      const { name, value } = payload;
      state.budget[name] = value;
    },
    setBudget: (state, { payload }) => {
      const { budgetId } = payload;
      state.budget = state.budgets.filter((item) => item.id === budgetId)[0];
    },
    resetBudget: (state) => {
      // called when creating new budget
      state.budget = { ...defaultBudget };
    },
    resetBudgetState: (state) => {
      // called when user signs out
      removeFromLocalStorage('budgets');
      return initialState;
    },
  },
  extraReducers: {
    [getBudgets.pending]: (state) => {
      state.isLoading = true;
    },
    [getBudgets.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.budgets = payload.budgets;
      if (state.budget.id) {
        state.budget = payload.budgets.filter(
          (item) => item.id === state.budget.id
        )[0];
      }
      addToLocalStorage('budgets', payload.budgets);
    },
    [getBudgets.rejected]: (state, { payload }) => {
      state.isLoading = false;
      displayErrors(payload.errors);
    },
    [getBudgetHistory.pending]: (state) => {
      state.isLoading = true;
    },
    [getBudgetHistory.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.expenses = payload.expenses;
    },
    [getBudgetHistory.rejected]: (state, { payload }) => {
      state.isLoading = false;
      displayErrors(payload.errors);
    },
    [createBudget.pending]: (state) => {
      state.isLoading = true;
    },
    [createBudget.fulfilled]: (state) => {
      state.isLoading = false;
      const budget = state.budget;
      toast.success(`Created budeget: ${budget.name}`);
    },
    [createBudget.rejected]: (state, { payload }) => {
      state.isLoading = false;
      displayErrors(payload.errors);
    },
    [updateBudget.pending]: (state) => {
      state.isLoading = true;
    },
    [updateBudget.fulfilled]: (state) => {
      state.isLoading = false;
      const budget = state.budget;
      toast.success(`Updated budeget: ${budget.name}`);
    },
    [updateBudget.rejected]: (state, { payload }) => {
      state.isLoading = false;
      displayErrors(payload.errors);
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
      displayErrors(payload.errors);
    },
  },
});

export const { setPage, editBudget, setBudget, resetBudget, resetBudgetState } =
  budgetSlice.actions;
export default budgetSlice.reducer;
