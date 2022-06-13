import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
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

router.get(
  '/api/transaction',
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const transactions = await Transaction.find({ userId });
    return res.status(StatusCodes.OK).send({ transactions });
  }
);

export { router as transactionRead };
