import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on server
    return axios.create({
      baseURL: 'http://microservice-ticketing-app.xyz',
      headers: req.headers,
    });
  } else {
    // We are on browser
    return axios.create({
      baseURL: '/',
    });
  }
};
