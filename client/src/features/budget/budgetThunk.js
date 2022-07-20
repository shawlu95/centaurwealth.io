import axios from '../../utils/axios';

export const getBudgetsThunk = async (_, thunkApi) => {
  try {
    const res = await axios.get('/budget', {
      params: { page: 1, limit: 100 },
    });
    return res.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data);
  }
};

export const getBudgetHistoryThunk = async (_, thunkApi) => {
  const state = thunkApi.getState().budget;
  const { page, limit } = state.expenses;
  const budgetId = state.budget.id;
  try {
    const res = await axios.get('/budget', {
      params: { page, limit, budgetId },
    });
    return res.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data);
  }
};

export const createBudgetThunk = async (_, thunkApi) => {
  try {
    const { budget } = thunkApi.getState().budget;
    const res = await axios.post('/budget', budget);
    return res.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data);
  }
};

export const updateBudgetThunk = async (_, thunkApi) => {
  try {
    const { budget } = thunkApi.getState().budget;
    const res = await axios.patch(`/budget/${budget.id}`, budget);
    return res.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data);
  }
};

export const classifyTransactionThunk = async (payload, thunkApi) => {
  try {
    const { expenseId, budgetId } = payload;
    const res = await axios.post(`/budget/classify`, { expenseId, budgetId });
    return res.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data);
  }
};
