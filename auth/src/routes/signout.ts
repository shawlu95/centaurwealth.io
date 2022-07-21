import { BadRequestError } from '@bookkeeping/common';
import express from 'express';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

router.post('/api/auth/signout', (req, res) => {
  res.clearCookie('session');
  return res.status(StatusCodes.OK).send();
});

export { router as signoutRouter };
