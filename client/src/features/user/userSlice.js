import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  addToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
} from '../../utils/localStorage';
import {
  signinUserThunk,
  signupUserThunk,
  signoutUserThunk,
} from './userThunk';

const initialState = {
  isLoading: false,
  isSidebarOpen: false,
  user: getFromLocalStorage('user'),
};

export const signinUser = createAsyncThunk('user/signinUser', signinUserThunk);

export const signupUser = createAsyncThunk('user/signupUser', signupUserThunk);

export const signoutUser = createAsyncThunk(
  'user/signoutUser',
  signoutUserThunk
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
  extraReducers: {
    [signupUser.pending]: (state) => {
      state.isLoading = true;
    },
    [signupUser.fulfilled]: (state, { payload }) => {
      const { user } = payload;
      state.isLoading = false;
      state.user = user;
      addToLocalStorage('user', user);
      toast.success(`Hello, ${user.email}`);
    },
    [signupUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [signinUser.pending]: (state) => {
      state.isLoading = true;
    },
    [signinUser.fulfilled]: (state, { payload: user }) => {
      state.isLoading = false;
      state.user = user;
      addToLocalStorage('user', user);
      toast.success(`Welcome back, ${user.email}`);
    },
    [signinUser.rejected]: (state, { payload }) => {
      console.log(payload);
      state.isLoading = false;
      toast.error(payload);
    },
    [signoutUser.fulfilled]: (state, { payload }) => {
      state.user = null;
      state.isSidebarOpen = false;
      removeFromLocalStorage('user');
      removeFromLocalStorage('accounts');
      if (payload) {
        toast.success(payload);
      }
    },
  },
});

export const { toggleSidebar } = userSlice.actions;
export default userSlice.reducer;
