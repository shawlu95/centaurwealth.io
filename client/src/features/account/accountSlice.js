import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  getAccountsThunk,
  getAccountThunk,
  createAccountThunk,
  updateAccountThunk,
} from './accountThunk';

const defaultAccount = {
  name: '',
  mutable: true,
  balance: 0,
  type: 'asset',
};

const defaultSummary = [
  { type: 'asset', balance: 0, count: 0 },
  { type: 'liability', balance: 0, count: 0 },
  { type: 'equity', balance: 0, count: 0 },
  { type: 'temporary', balance: 0, count: 0 },
];

const initialState = {
  isLoading: false,
  account: { ...defaultAccount },
  accounts: [],
  summary: [...defaultSummary],
};

export const getAccounts = createAsyncThunk(
  'account/getAccounts',
  getAccountsThunk
);

export const getAccount = createAsyncThunk(
  'account/getAccount',
  getAccountThunk
);

export const createAccount = createAsyncThunk(
  'account/createAccount',
  createAccountThunk
);

export const updateAccount = createAsyncThunk(
  'account/updateAccount',
  updateAccountThunk
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    clearAccount: (state) => {
      state.account = { ...defaultAccount };
    },
    handleChange: (state, { payload }) => {
      const { name, value } = payload;
      state.account[name] = value;
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
      const { account } = payload;
      const balance = state.accounts.filter(
        (item) => item.id === account.id
      )[0];
      state.isLoading = false;
      state.account = { ...balance, ...account };
    },
    [getAccount.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [createAccount.pending]: (state) => {
      state.isLoading = true;
    },
    [createAccount.fulfilled]: (state, { payload }) => {
      const { name } = state.account;
      state.account = { ...state.account, id: payload.id };
      toast.success(`Created account: ${name}`);
    },
    [createAccount.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [updateAccount.pending]: (state) => {
      state.isLoading = true;
    },
    [updateAccount.fulfilled]: (state, { payload }) => {
      const { name } = state.account;
      toast.success(`Updated account: ${name}`);
    },
    [updateAccount.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
  },
});

export const { clearAccount, handleChange } = accountSlice.actions;
export default accountSlice.reducer;
