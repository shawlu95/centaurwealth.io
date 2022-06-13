import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Account } from '../model/account';
import { Transaction } from '../model/transaction';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@bookkeeping/common';

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
    return res.status(StatusCodes.OK).send({ id: transaction.id });
  }
);

export { router as transactionCreate };
