import axios from '../../utils/axios';

export const getTransactionThunk = async (transactionId, thunkApi) => {
  console.log('transactionId', transactionId);
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
