import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getAccountsThunk } from './accountThunk';

const initialState = {
  isLoading: false,
  account: null,
  accounts: [],
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

const accountSlice = createSlice({
  name: 'account',
  initialState,

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
  },
});

export default accountSlice.reducer;
