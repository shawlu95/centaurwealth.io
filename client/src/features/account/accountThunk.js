import axios from '../../utils/axios';
import { setTransaction } from '../transaction/transactionSlice';

export const getAccountsThunk = async (user, thunkApi) => {
  try {
    const res = await axios.get('/balance/current');
    return res.data;
  } catch (err) {
    return error.response.data.msg;
  }
};

export const getAccountThunk = async (accountId, thunkApi) => {
  try {
    const { page, limit } = thunkApi.getState().transaction.transactions;
    const res = await axios.get(`/account/${accountId}`, {
      params: { page, limit },
    });
    thunkApi.dispatch(setTransaction(res.data.transactions));
    return res.data;
  } catch (err) {
    return error.response.data.msg;
  }
};

export const createAccountThunk = async (_, thunkApi) => {
  try {
    const { account } = thunkApi.getState().account;
    const res = await axios.post(`/account`, account);
    return res.data;
  } catch (err) {
    return error.response.data.msg;
  }
};

export const updateAccountThunk = async (_, thunkApi) => {
  try {
    const { account } = thunkApi.getState().account;
    const res = await axios.patch(`/account/${account.id}`, account);
    return res.data;
  } catch (err) {
    return error.response.data.msg;
  }
};
