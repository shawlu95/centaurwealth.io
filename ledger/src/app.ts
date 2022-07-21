import express from 'express';
require('express-async-errors');
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import {
  accountCreate,
  accountRead,
  accountUpdate,
  accountClose,
} from './routes/account';

import {
  transactionCreate,
  transactionRead,
  transactionUpdate,
  transactionDelete,
  transactionImport,
} from './routes/transaction';

import { authenticate } from '@bookkeeping/common';
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
app.use(authenticate);

app.use(accountCreate);
app.use(accountRead);
app.use(accountUpdate);
app.use(accountClose);
app.use(transactionCreate);
app.use(transactionRead);
app.use(transactionUpdate);
app.use(transactionDelete);
app.use(transactionImport);

app.get('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
