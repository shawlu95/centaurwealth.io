import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  addToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
} from '../../utils/localStorage';
import {
  getAccountsThunk,
  getAccountThunk,
  createAccountThunk,
  updateAccountThunk,
} from './accountThunk';
import { displayErrors } from '../../utils/toast';

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
  accounts: getFromLocalStorage('accounts') || [],
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
    resetAccount: (state) => {
      // called when creating new account
      state.account = { ...defaultAccount };
    },
    handleChange: (state, { payload }) => {
      const { name, value } = payload;
      state.account[name] = value;
    },
    resetAccountState: (state) => {
      // called when user signs out
      removeFromLocalStorage('accounts');
      return initialState;
    },
  },
  extraReducers: {
    [getAccounts.pending]: (state) => {
      state.isLoading = true;
    },
    [getAccounts.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      const { accounts, summary } = payload;
      state.accounts = accounts;
      state.summary = summary;
      addToLocalStorage('accounts', accounts);
    },
    [getAccounts.rejected]: (state, { payload }) => {
      state.isLoading = false;
      displayErrors(payload.errors);
    },
    [getAccount.pending]: (state) => {
      state.isLoading = true;
    },
    [getAccount.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      const { account } = payload;
      const balance = state.accounts.filter(
        (item) => item.id === account.id
      )[0];
      state.account = { ...balance, ...account };
    },
    [getAccount.rejected]: (state, { payload }) => {
      state.isLoading = false;
      displayErrors(payload.errors);
    },
    [createAccount.pending]: (state) => {
      state.isLoading = true;
    },
    [createAccount.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      const { name } = state.account;
      state.account = { ...state.account, id: payload.id };
      toast.success(`Created account: ${name}`);
    },
    [createAccount.rejected]: (state, { payload }) => {
      state.isLoading = false;
      displayErrors(payload.errors);
    },
    [updateAccount.pending]: (state) => {
      state.isLoading = true;
    },
    [updateAccount.fulfilled]: (state) => {
      state.isLoading = false;
      const { name } = state.account;
      toast.success(`Updated account: ${name}`);
    },
    [updateAccount.rejected]: (state, { payload }) => {
      state.isLoading = false;
      displayErrors(payload.errors);
    },
  },
});

export const { resetAccount, handleChange, resetAccountState } =
  accountSlice.actions;
export default accountSlice.reducer;
