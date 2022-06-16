import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Account, AccountType } from '../models/account';
import { StatusCodes } from 'http-status-codes';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@bookkeeping/common';

const router = express.Router();

router.get(
  '/api/balance/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const { id } = req.params;
    const account = await Account.find({ id });
    if (account.length == 0) throw new NotFoundError();
    if (account[0].userId !== userId) throw new NotAuthorizedError();
    return res.status(StatusCodes.OK).send({ account: account[0] });
  }
);

export { router as balance };
