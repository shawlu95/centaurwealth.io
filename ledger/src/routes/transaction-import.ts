import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Transaction } from '../model/transaction';
import { StatusCodes } from 'http-status-codes';
import { requireAuth, validateRequest } from '@bookkeeping/common';
import { TransactionCreatedPublisher } from '../events/publishers/transaction-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const validators = [
  body('transactions')
    .not()
    .isEmpty()
    .withMessage('Please provide transactions'),
];

router.post(
  '/api/transaction/import',
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const { transactions } = req.body;
    const userId = req.currentUser!.id;
    const publisher = new TransactionCreatedPublisher(natsWrapper.client);
    const ids = [];

    for (var i in transactions) {
      const { memo, date, entries } = transactions[i];

      // @ts-ignore
      const transaction = Transaction.build({
        userId,
        memo,
        date: new Date(date),
        entries,
      });
      await transaction.save();
      ids.push(transaction.id);

      publisher.publish({
        id: transaction.id,
        userId: transaction.userId,
        memo: transaction.memo,
        date: transaction.date,
        entries: transaction.entries,
      });
    }

    return res.status(StatusCodes.OK).send({ ids });
  }
);

export { router as transactionImport };
