import axios from '../../utils/axios';
import { resetAccountState } from '../account/accountSlice';
import { resetBudgetState } from '../budget/budgetSlice';
import { resetChartState } from '../chart/chartSlice';
import { resetUserState } from './userSlice';

export const getCurrentUserThunk = async (user, thunkApi) => {
  try {
    const res = await axios.get('/auth/currentUser', user);
    return res.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data);
  }
};

export const signupUserThunk = async (user, thunkApi) => {
  try {
    const res = await axios.post('/auth/signup', user);
    return res.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data);
  }
};

export const signinUserThunk = async (user, thunkApi) => {
  try {
    const res = await axios.post('/auth/signin', user);
    return res.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data);
  }
};

export const signoutUserThunk = async (user, thunkApi) => {
  try {
    const res = await axios.post('/auth/signout', user);

    thunkApi.dispatch(resetAccountState());
    thunkApi.dispatch(resetBudgetState());
    thunkApi.dispatch(resetChartState());
    thunkApi.dispatch(resetUserState());

    return res.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data);
  }
};
