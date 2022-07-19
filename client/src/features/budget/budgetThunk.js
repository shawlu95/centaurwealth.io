import axios from '../../utils/axios';

export const getBudgetsThunk = async (_, thunkApi) => {
  try {
    const res = await axios.get('/budget', {
      params: { page: 1, limit: 100 },
    });
    return res.data;
  } catch (err) {
    return error.response.data.msg;
  }
};

export const createBudgetThunk = async (_, thunkApi) => {
  try {
    const { budget } = thunkApi.getState().budget;
    const res = await axios.post('/budget', budget);
    return res.data;
  } catch (err) {
    return error.response.data.msg;
  }
};
