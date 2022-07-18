import axios from '../../utils/axios';

export const getAccountsThunk = async (user, thunkApi) => {
  try {
    const res = await axios.get('/balance/current', user);
    return res.data.accounts;
  } catch (err) {
    return error.response.data.msg;
  }
};
