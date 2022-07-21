import express from 'express';
require('express-async-errors');
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { authenticate } from '@bookkeeping/common';
import { errorHandler, NotFoundError } from '@bookkeeping/common';

import { timelineRouter } from './routes/timeline-index';
import { timelineUpdateRouter } from './routes/timeline-update';

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

app.use(timelineRouter);
app.use(timelineUpdateRouter);

app.get('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
