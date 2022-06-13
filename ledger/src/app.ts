import express from 'express';
require('express-async-errors');
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { accountCreate } from './routes/account-create';
import { accountUpdate } from './routes/account-update';
import { transactionCreate } from './routes/transaction-create';
import { transactionUpdate } from './routes/transaction-update';
import { transactionDelete } from './routes/transaction-delete';

import { errorHandler, NotFoundError } from '@bookkeeping/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(accountCreate);
app.use(accountUpdate);
app.use(transactionCreate);
app.use(transactionUpdate);
app.use(transactionDelete);

app.get('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
