import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Transaction } from '../../model/transaction';
import { StatusCodes } from 'http-status-codes';
import {
  AccountType,
  validateRequest,
  Entry,
  NotFoundError,
} from '@bookkeeping/common';
import { TransactionCreatedPublisher } from '../../events/publishers/transaction-created-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { Account } from '../../model/account';

const router = express.Router();

const validators = [
  body('memo').not().isEmpty().withMessage('Please provide transaction memo'),
  body('date').not().isEmpty().withMessage('Please provide transaction date'),
  body('entries').not().isEmpty().withMessage('Please provide entries'),
];

router.post(
  '/api/transaction',
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const { memo, date, entries, closing } = req.body;
    const userId = req.user!.id;

    // @ts-ignore
    const transaction = Transaction.build({
      userId,
      memo,
      date: new Date(date),
      entries,
    });
    await transaction.save();

    if (closing) {
      for (var i in entries) {
        const entry: Entry = entries[i];
        if (entry.accountType === AccountType.Temporary) {
          const account = await Account.findById(entry.accountId);
          if (!account) {
            throw new NotFoundError();
          }
          account.set({ close: date });
          await account.save();
        }
      }
    }

    new TransactionCreatedPublisher(natsWrapper.client).publish({
      id: transaction.id,
      userId: transaction.userId,
      memo: transaction.memo,
      date: transaction.date,
      entries: transaction.entries,
    });
    return res.status(StatusCodes.OK).send({ id: transaction.id });
  }
);

export { router as transactionCreate };
