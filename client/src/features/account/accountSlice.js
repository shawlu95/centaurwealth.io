import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getAccountsThunk } from './accountThunk';

const initialState = {
  isLoading: false,
  account: null,
  accounts: [],
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
      state.isLoading = false;
      state.accounts = payload;
    },
    [getAccounts.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
  },
});

export default accountSlice.reducer;
