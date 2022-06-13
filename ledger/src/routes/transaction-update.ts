import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Account } from '../model/account';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@bookkeeping/common';
import { Transaction } from '../model/transaction';

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
    const { id, memo, entries } = req.body;
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
      entries,
    });
    await transaction.save();

    return res.status(StatusCodes.OK).send({ id: transaction.id });
  }
);

export { router as transactionUpdate };
