import axios from 'axios';
import { getFromLocalStorage } from './localStorage';

const DEV_URL = 'https://centaurwealth.dev/api';

const customFetch = axios.create({
  baseURL: DEV_URL,
});

customFetch.interceptors.request.use(
  (config) => {
    const user = getFromLocalStorage('user');
    if (user) {
      config.headers.common['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default customFetch;
