import express from 'express';
require('express-async-errors');
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUser } from '@bookkeeping/common';
import { errorHandler, NotFoundError } from '@bookkeeping/common';

import {
  budgetIndex,
  budgetRead,
  budegetCreate,
  budgetUpdate,
} from './routes/budget';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(currentUser);
app.use(budegetCreate);
app.use(budgetRead);
app.use(budgetIndex);
app.use(budgetUpdate);

app.get('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
