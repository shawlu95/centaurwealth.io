import axios from '../../utils/axios';

export const getTransactionThunk = async (transactionId, thunkApi) => {
  try {
    const res = await axios.get(`/transaction/${transactionId}`);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getTransactionsThunk = async (_, thunkApi) => {
  try {
    const { page, limit } = thunkApi.getState().transaction.transactions;
    const res = await axios.get('/transaction', {
      params: { page, limit },
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getClosingTransactionForAccountThunk = async (
  { accountId, lte },
  thunkApi
) => {
  try {
    const res = await axios.get(`/account/close/${accountId}?lte=${lte}`);
    return res.data;
  } catch (err) {
    return err;
  }
};

export const createTransactionThunk = async (_, thunkApi) => {
  try {
    const { transaction } = thunkApi.getState().transaction;
    const res = await axios.post(`/transaction`, transaction);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const updateTransactionThunk = async (_, thunkApi) => {
  try {
    const { transaction } = thunkApi.getState().transaction;
    const res = await axios.put(`/transaction/${transaction.id}`, transaction);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const deleteTransactionThunk = async (transactionId, thunkApi) => {
  try {
    const res = await axios.delete(`/transaction/${transactionId}`);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};
