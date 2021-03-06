import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getTransactionsThunk,
  getTransactionThunk,
  getClosingTransactionForAccountThunk,
  createTransactionThunk,
  updateTransactionThunk,
  deleteTransactionThunk,
} from './transactionThunk';
import { toast } from 'react-toastify';
import { displayErrors } from '../../utils/toast';

const defaultTransactions = {
  docs: [],
  hasMore: false,
  hasNextPage: false,
  hasPrevPage: false,
  limit: 15,
  page: 1,
  pagingCounter: 1,
  totalDocs: 3,
  totalPages: 1,
};

const defaultTransaction = {
  memo: '',
  date: new Date().toISOString(),
  entries: [],
};

const initialState = {
  isLoading: false,
  transaction: { ...defaultTransaction },
  transactions: { ...defaultTransactions },
};

export const getTransaction = createAsyncThunk(
  'transaction/getTransaction',
  getTransactionThunk
);

export const getTransactions = createAsyncThunk(
  'transaction/getTransactions',
  getTransactionsThunk
);

export const getClosingTransactionForAccount = createAsyncThunk(
  'account/getClosingTransaction',
  getClosingTransactionForAccountThunk
);

export const createTransaction = createAsyncThunk(
  'transaction/createTransaction',
  createTransactionThunk
);

export const updateTransaction = createAsyncThunk(
  'transaction/updateTransaction',
  updateTransactionThunk
);

export const deleteTransaction = createAsyncThunk(
  'transaction/deleteTransaction',
  deleteTransactionThunk
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setPage: (state, { payload }) => {
      state.transactions.page = payload.page;
    },
    setTransactions: (state, { payload }) => {
      state.transactions = payload.transactions;
    },
    resetTransaction: (state) => {
      state.transaction = { ...defaultTransaction };
    },
    editTransaction: (state, { payload }) => {
      const { name, value } = payload;
      state.transaction[name] = value;
    },
    addEntry: (state, { payload }) => {
      state.transaction.entries.push(payload.entry);
    },
    updateEntry: (state, { payload }) => {
      const { name, value, index } = payload;
      state.transaction.entries[index][name] = value;
    },
    deleteEntry: (state, { payload }) => {
      const { index } = payload;
      state.transaction.entries = state.transaction.entries.filter(
        (_, _index) => index !== _index
      );
    },
  },
  extraReducers: {
    [getTransactions.pending]: (state) => {
      state.isLoading = true;
    },
    [getTransactions.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.transactions = payload.transactions;
    },
    [getTransactions.rejected]: (state, { payload }) => {
      state.isLoading = false;
      displayErrors(payload.errors);
    },
    [getTransaction.pending]: (state) => {
      state.isLoading = true;
    },
    [getTransaction.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.transaction = payload.transaction;
    },
    [getTransaction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      displayErrors(payload.errors);
    },
    [getClosingTransactionForAccount.pending]: (state, { payload }) => {
      state.isLoading = true;
    },
    [getClosingTransactionForAccount.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      const { transaction } = payload;
      state.transaction = transaction;
    },
    [getClosingTransactionForAccount.rejected]: (state, { payload }) => {
      state.isLoading = false;
      displayErrors(payload.errors);
    },
    [createTransaction.pending]: (state) => {
      state.isLoading = true;
    },
    [createTransaction.fulfilled]: (state) => {
      state.isLoading = false;
      const transaction = state.transaction;
      toast.success(`Created transaction ${transaction.memo}`);
    },
    [createTransaction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      displayErrors(payload.errors);
    },
    [updateTransaction.pending]: (state) => {
      state.isLoading = true;
    },
    [updateTransaction.fulfilled]: (state) => {
      state.isLoading = false;
      const transaction = state.transaction;
      toast.success(`Updated transaction ${transaction.memo}`);
    },
    [updateTransaction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      displayErrors(payload.errors);
    },
    [deleteTransaction.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteTransaction.fulfilled]: (state) => {
      state.isLoading = false;
      const deleted = state.transaction;
      state.transactions.docs = state.transactions.docs.filter(
        (item) => item.id !== deleted.id
      );
      toast.success(`Deleted transaction ${deleted.memo}`);
    },
    [deleteTransaction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      displayErrors(payload.errors);
    },
  },
});

export const {
  setPage,
  setTransactions,
  resetTransaction,
  editTransaction,
  addEntry,
  updateEntry,
  deleteEntry,
} = transactionSlice.actions;
export default transactionSlice.reducer;
