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
import { displayErrors } from '../../utils/toast';

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
    resetUserState: (state) => {
      removeFromLocalStorage('user');
      return initialState;
    },
  },
  extraReducers: {
    [signupUser.pending]: (state) => {
      state.isLoading = true;
    },
    [signupUser.fulfilled]: (state, { payload: user }) => {
      state.isLoading = false;
      state.user = user;
      addToLocalStorage('user', user);

      const name = user.email.split('@')[0];
      toast.success(`Hello, ${name}`);
    },
    [signupUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      displayErrors(payload.errors);
    },
    [signinUser.pending]: (state) => {
      state.isLoading = true;
    },
    [signinUser.fulfilled]: (state, { payload: user }) => {
      state.isLoading = false;
      state.user = user;
      addToLocalStorage('user', user);

      const name = state.user.email.split('@')[0];
      toast.success(`Welcome back, ${name}`);
    },
    [signinUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      displayErrors(payload.errors);
    },
    [signoutUser.pending]: (state) => {
      state.isLoading = true;
    },
    [signoutUser.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [signoutUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      displayErrors(payload.errors);
    },
  },
});

export const { toggleSidebar, resetUserState } = userSlice.actions;
export default userSlice.reducer;
