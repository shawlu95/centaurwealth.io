import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTransactionsThunk, getTransactionThunk } from './transactionThunk';
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
  },
});

export const { changePage, setTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
