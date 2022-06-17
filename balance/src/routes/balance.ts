import express, { Request, Response } from 'express';
import { Account } from '../models/account';
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
    const account = await Account.findById(id);

    if (!account) {
      throw new NotFoundError();
    }

    if (account.userId !== userId) {
      throw new NotAuthorizedError();
    }

    return res.status(StatusCodes.OK).send({ account });
  }
);

export { router as balance };
