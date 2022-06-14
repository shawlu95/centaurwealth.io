import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@bookkeeping/common';
import { Transaction } from '../model/transaction';
import { TransactionUpdatedPublisher } from '../events/publishers/transaction-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const validators = [
  body('id').not().isEmpty().withMessage('Please provide transaction id'),
  body('memo').not().isEmpty().withMessage('Please provide transaction memo'),
  body('entries').not().isEmpty().withMessage('Please provide entries'),
];

router.put(
  '/api/transaction',
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const { id, memo, date, entries } = req.body;
    const userId = req.currentUser!.id;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      throw new NotFoundError();
    }

    if (userId != transaction.userId) {
      throw new NotAuthorizedError();
    }

    transaction.set({
      userId,
      memo,
      date: new Date(date),
      entries,
    });
    await transaction.save();

    new TransactionUpdatedPublisher(natsWrapper.client).publish({
      id: transaction.id,
      userId: transaction.userId,
      memo: transaction.memo,
      date: transaction.date,
      entries: transaction.entries,
    });

    return res.status(StatusCodes.OK).send({ id: transaction.id });
  }
);

export { router as transactionUpdate };
