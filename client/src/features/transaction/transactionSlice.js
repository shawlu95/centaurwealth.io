import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
};

const initialState = {
  isLoading: false,
  transaction: { ...defaultTransaction },
  transactions: { ...defaultTransactions },
};

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
});

export const { changePage, setTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
