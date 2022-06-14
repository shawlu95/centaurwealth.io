import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Transaction } from '../model/transaction';
import { StatusCodes } from 'http-status-codes';
import { requireAuth, validateRequest } from '@bookkeeping/common';
import { TransactionCreatedPublisher } from '../events/publishers/transaction-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const validators = [
  body('memo').not().isEmpty().withMessage('Please provide transaction memo'),
];

router.post(
  '/api/transaction',
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const { memo, entries } = req.body;
    const userId = req.currentUser!.id;

    const transaction = Transaction.build({
      userId,
      memo,
      entries,
    });
    await transaction.save();

    new TransactionCreatedPublisher(natsWrapper.client).publish({
      id: transaction.id,
      userId: transaction.userId,
      memo: transaction.memo,
      entries: transaction.entries,
    });
    return res.status(StatusCodes.OK).send({ id: transaction.id });
  }
);

export { router as transactionCreate };
