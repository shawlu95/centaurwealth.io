import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@bookkeeping/common';
import { Transaction } from '../model/transaction';
import { TransactionDeletedPublisher } from '../events/publishers/transaction-deleted-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/transaction',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.query;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      throw new NotFoundError();
    }

    if (transaction.userId != req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    await Transaction.findByIdAndDelete(id);

    new TransactionDeletedPublisher(natsWrapper.client).publish({
      id: transaction.id,
      userId: transaction.userId,
      memo: transaction.memo,
      date: transaction.date,
      entries: transaction.entries,
    });

    return res.status(StatusCodes.OK).send();
  }
);

export { router as transactionDelete };
