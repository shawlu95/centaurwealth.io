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

    const page = parseInt(req.body.page, 10) || 0;
    const limit = parseInt(req.body.limit, 10) || 10;

    const transactions = await Transaction.find({ userId })
      .sort({ date: 'descending' })
      .skip(page * limit)
      .limit(limit);
    return res.status(StatusCodes.OK).send({ transactions });
  }
);

router.get(
  '/api/transaction/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      throw new NotFoundError();
    }

    if (transaction.userId !== userId) {
      throw new NotAuthorizedError();
    }

    return res.status(StatusCodes.OK).send({ transaction });
  }
);

export { router as transactionRead };
