import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getTransactionsThunk,
  getTransactionThunk,
  deleteTransactionThunk,
} from './transactionThunk';
import { toast } from 'react-toastify';

const defaultTransactions = {
  docs: [],
  hasMore: false,
  hasNextPage: false,
  hasPrevPage: false,
  limit: 25,
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

export const deleteTransaction = createAsyncThunk(
  'transaction/deleteTransaction',
  deleteTransactionThunk
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    changePage: (state, { payload }) => {
      state.transactions.page = payload;
    },
    setTransaction: (state, { payload }) => {
      state.transactions = payload;
    },
    addEntry: (state, { payload }) => {
      console.log(payload);
      state.transaction.entries.push(payload);
    },
  },
  extraReducers: {
    [getTransactions.pending]: (state) => {
      state.isLoading = true;
    },
    [getTransactions.fulfilled]: (state, { payload }) => {
      state.transactions = payload.transactions;
    },
    [getTransactions.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [getTransaction.pending]: (state) => {
      state.isLoading = true;
    },
    [getTransaction.fulfilled]: (state, { payload }) => {
      state.transaction = payload.transaction;
    },
    [getTransaction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [deleteTransaction.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteTransaction.fulfilled]: (state, { payload }) => {
      const deleted = state.transaction;
      state.transactions.docs = state.transactions.docs.filter(
        (item) => item.id !== deleted.id
      );
      toast.success(`Deleted transaction ${deleted.memo}`);
    },
    [deleteTransaction.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
  },
});

export const { changePage, setTransaction, addEntry } =
  transactionSlice.actions;
export default transactionSlice.reducer;
