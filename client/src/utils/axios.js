import axios from 'axios';
import { getFromLocalStorage } from './localStorage';

const DEV_URL = 'https://centaurwealth.dev/api';
const PROD_URL = 'http://www.centaurwealth.io/api';

const global = axios.create({
  baseURL: PROD_URL,
});

global.interceptors.request.use(
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

export default global;
