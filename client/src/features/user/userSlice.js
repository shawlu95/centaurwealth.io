import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  addUserToLocalStorage,
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
} from '../../utils/localStorage';
import { signinUserThunk, signupUserThunk } from './userThunk';

const initialState = {
  isLoading: false,
  isSidebarOpen: false,
  user: getUserFromLocalStorage(),
};

export const signinUser = createAsyncThunk('user/signinUser', signinUserThunk);

export const signupUser = createAsyncThunk('user/signupUser', signupUserThunk);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    logoutUser: (state, { payload }) => {
      state.user = null;
      state.isSidebarOpen = false;
      removeUserFromLocalStorage();
      if (payload) {
        toast.success(payload);
      }
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
      addUserToLocalStorage(user);
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
      addUserToLocalStorage(user);
      toast.success(`Welcome back, ${user.email}`);
    },
    [signinUser.rejected]: (state, { payload }) => {
      console.log(payload);
      state.isLoading = false;
      toast.error(payload);
    },
  },
});

export const { toggleSidebar, logoutUser } = userSlice.actions;
export default userSlice.reducer;