import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { Account } from '../model/account';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

router.delete('/api/transaction', async (req: Request, res: Response) => {
  console.log('delete transaction');
  return res.status(StatusCodes.OK).send();
});

export { router as transactionDelete };
