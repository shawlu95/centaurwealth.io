import axios from '../../utils/axios';

export const getTransactionsThunk = async (user, thunkApi) => {
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
