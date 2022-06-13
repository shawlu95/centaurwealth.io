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
    return res.status(StatusCodes.OK).send();
  }
);

export { router as transactionDelete };
