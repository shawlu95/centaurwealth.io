import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/user/userSlice';
import accountSlice from './features/account/accountSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    account: accountSlice,
  },
});
