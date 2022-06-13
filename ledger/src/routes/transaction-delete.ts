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
import { TransactionDeletedPublisher } from '../events/publishers/transaction-deleted-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const validators = [
  body('id').not().isEmpty().withMessage('Please provide transaction id'),
];

router.delete(
  '/api/transaction',
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.body;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      throw new NotFoundError();
    }

    if (transaction.userId != req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    await Transaction.deleteOne({ id });

    new TransactionDeletedPublisher(natsWrapper.client).publish({ id });

    return res.status(StatusCodes.OK).send();
  }
);

export { router as transactionDelete };
