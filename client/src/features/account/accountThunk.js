import axios from '../../utils/axios';

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
    const { page, limit } = thunkApi.getState().account.transactions;
    const res = await axios.get(`/account/${accountId}`, {
      params: { page, limit },
    });
    return res.data;
  } catch (err) {
    return error.response.data.msg;
  }
};
