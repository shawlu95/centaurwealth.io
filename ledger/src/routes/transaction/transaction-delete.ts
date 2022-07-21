import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import {
  NotAuthorizedError,
  NotFoundError,
  validateRequest,
} from '@bookkeeping/common';
import { Transaction } from '../../model/transaction';
import { TransactionDeletedPublisher } from '../../events/publishers/transaction-deleted-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

const validators = [
  param('id').not().isEmpty().withMessage('Please provide transaction id'),
  param('id').isMongoId().withMessage('Please provide valid transaction id'),
];

router.delete(
  '/api/transaction/:id',
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      throw new NotFoundError();
    }

    if (transaction.userId != req.user!.id) {
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
