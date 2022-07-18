import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getAccountsThunk, getAccountThunk } from './accountThunk';

const initialState = {
  isLoading: false,
  account: {
    name: '',
    balance: 0,
    type: 'asset',
  },
  accounts: [],
  transactions: {
    docs: [],
    hasMore: false,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 25,
    page: 1,
    pagingCounter: 1,
    totalDocs: 3,
    totalPages: 1,
  },
  summary: [
    { type: 'asset', balance: 0, count: 0 },
    { type: 'liability', balance: 0, count: 0 },
    { type: 'equity', balance: 0, count: 0 },
    { type: 'temporary', balance: 0, count: 0 },
  ],
};

export const getAccounts = createAsyncThunk(
  'account/getAccounts',
  getAccountsThunk
);

export const getAccount = createAsyncThunk(
  'account/getAccount',
  getAccountThunk
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    changePage: (state, { payload }) => {
      state.transactions.page = payload;
    },
  },
  extraReducers: {
    [getAccounts.pending]: (state) => {
      state.isLoading = true;
    },
    [getAccounts.fulfilled]: (state, { payload }) => {
      const { accounts, summary } = payload;
      state.isLoading = false;
      state.accounts = accounts;
      state.summary = summary;
    },
    [getAccounts.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [getAccount.pending]: (state) => {
      state.isLoading = true;
    },
    [getAccount.fulfilled]: (state, { payload }) => {
      const { transactions, account } = payload;
      const balance = state.accounts.filter(
        (item) => item.id === account.id
      )[0];
      state.isLoading = false;
      state.account = { ...balance, ...account };
      state.transactions = transactions;
    },
    [getAccount.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
  },
});

export const { changePage } = accountSlice.actions;
export default accountSlice.reducer;
