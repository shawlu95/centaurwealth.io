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
    const transactions = await Transaction.find({ userId })
      .sort({ date: 'descending' })
      .limit(25);
    return res.status(StatusCodes.OK).send({ transactions });
  }
);

router.get(
  '/api/transaction/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const { id } = req.params;
    const transaction = await Transaction.findOne({ id, userId });

    if (!transaction) {
      throw new NotFoundError();
    }

    return res.status(StatusCodes.OK).send({ transaction });
  }
);

export { router as transactionRead };
