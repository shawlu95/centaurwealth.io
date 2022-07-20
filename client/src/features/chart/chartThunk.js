import axios from '../../utils/axios';

const getDate = (value) => {
  const format = (date) => date.toISOString().split('T')[0];
  const yearFirstDay = new Date(new Date().getFullYear(), 0, 1);
  var date = new Date();
  switch (value) {
    case 'ytd':
      date = yearFirstDay;
      break;
    case '1m':
      date.setMonth(date.getMonth() - 1);
      break;
    case '3m':
      date.setMonth(date.getMonth() - 3);
      break;
    case '6m':
      date.setMonth(date.getMonth() - 6);
      break;
    case '1y':
      date.setFullYear(date.getFullYear() - 1);
      break;
    case 'all':
      date.setFullYear(1970);
      break;
  }
  return format(date);
};

export const getTimelineThunk = async (user, thunkApi) => {
  try {
    const { range } = thunkApi.getState().chart;
    const start = getDate(range);
    const res = await axios.get('/timeline', { params: { start } });
    return res.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response.data);
  }
};
