import express from 'express';
require('express-async-errors');
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError } from '@bookkeeping/common';

const app = express();
app.set('trust proxy', true); // trust nginx
app.use(json());
app.use(
  cookieSession({
    signed: false, // no need to encrypt because jwt is already encrypted
    secure: false, // not require https connection
  })
);

app.get('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
