import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialState = {
  isLoading: false,
  budget: {
    name: '',
    monthly: 0,
  },
  budgets: [],
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {},
  extraReducers: {},
});

export default budgetSlice.reducer;
