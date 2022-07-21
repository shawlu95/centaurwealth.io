import axios from 'axios';
import { getFromLocalStorage } from './localStorage';

const DEV_URL = 'https://centaurwealth.dev/api';
const PROD_URL = 'http://www.centaurwealth.io/api';

const global = axios.create({
  baseURL: PROD_URL,
});

export default global;
