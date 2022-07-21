import express from 'express';
require('express-async-errors');
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { authenticate } from '@bookkeeping/common';
import { errorHandler, NotFoundError } from '@bookkeeping/common';

import { balanceCurrent } from './routes/balance-current';
import { balance } from './routes/balance';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(authenticate);

app.use(balanceCurrent);
app.use(balance);

app.get('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
