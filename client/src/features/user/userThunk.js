import axios from '../../utils/axios';

export const signupUserThunk = async (user, thunkApi) => {
  try {
    const res = await axios.post('/auth/signup', user);
    return res.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data.msg);
  }
};

export const signinUserThunk = async (user, thunkApi) => {
  try {
    const res = await axios.post('/auth/signin', user);
    return res.data;
  } catch (err) {
    return error.response.data.msg;
  }
};
