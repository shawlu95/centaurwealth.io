import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import { Account } from '../model/account';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@bookkeeping/common';

const router = express.Router();

router.get('/api/account', requireAuth, async (req: Request, res: Response) => {
  const userId = req.currentUser!.id;
  const accounts = await Account.find({ userId });
  return res.status(StatusCodes.OK).send({ accounts });
});

export { router as accountRead };
