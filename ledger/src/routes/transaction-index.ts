import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { requireAuth } from '@bookkeeping/common';
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
