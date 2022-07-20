import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/user/userSlice';
import accountSlice from './features/account/accountSlice';
import transactionSlice from './features/transaction/transactionSlice';
import budgetSlice from './features/budget/budgetSlice';
import chartSlice from './features/chart/chartSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    account: accountSlice,
    transaction: transactionSlice,
    budget: budgetSlice,
    chart: chartSlice,
  },
});
