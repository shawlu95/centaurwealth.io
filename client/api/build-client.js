import axios from 'axios';

const DEV_URL =
  'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
const PROD_URL = 'http://microservice-ticketing-app.xyz';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on server
    return axios.create({
      baseURL: PROD_URL,
      headers: req.headers,
    });
  } else {
    // We are on browser
    return axios.create({
      baseURL: '/',
    });
  }
};
