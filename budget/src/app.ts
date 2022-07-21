import express from 'express';
require('express-async-errors');
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { authenticate } from '@bookkeeping/common';
import { errorHandler, NotFoundError } from '@bookkeeping/common';

import {
  budgetIndex,
  budegetCreate,
  budgetGet,
  budgetUpdate,
  budgetClassify,
} from './routes';

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

app.use(budegetCreate);
app.use(budgetIndex);
app.use(budgetGet);
app.use(budgetUpdate);
app.use(budgetClassify);

app.get('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
