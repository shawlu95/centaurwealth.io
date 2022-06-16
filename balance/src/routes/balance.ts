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
    const account = await Account.findOne({ id, userId });

    if (!account) {
      throw new NotFoundError();
    }

    return res.status(StatusCodes.OK).send({ account });
  }
);

export { router as balance };
