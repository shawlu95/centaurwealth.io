import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@bookkeeping/common';
import { Transaction } from '../model/transaction';

const router = express.Router();

router.get(
  '/api/transaction',
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const transactions = await Transaction.find({ userId });
    return res.status(StatusCodes.OK).send({ transactions });
  }
);

router.get(
  '/api/transaction/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const { id } = req.params;
    const transactions = await Transaction.find({ id });

    if (transactions.length == 0) {
      throw new NotFoundError();
    }

    const transaction = transactions[0];

    if (transaction.userId !== userId) {
      throw new NotAuthorizedError();
    }

    return res.status(StatusCodes.OK).send({ transaction });
  }
);

export { router as transactionRead };
